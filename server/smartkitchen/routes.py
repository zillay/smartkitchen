from flask import (
    request, 
    url_for, 
    jsonify, 
    render_template,
)
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from validate_email import validate_email
# from email_validator import validate_email, EmailNotValidError

from passlib.hash import sha256_crypt
import uuid
import datetime
import os
import sys
import json

from . import app, db, mailer
from .models import *
from .globals import ERROR, SUCCESS
from .utils import *

URL_TOKENIZER = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# app.static_folder = 'static/*'

@app.route('/')
def index():
    return render_template('index.html')
    # return 'Smart Kitchen App [root route] Use the service via App. Thank you.'


@app.route('/user/new', methods=['POST'])
def user_new():
    # check if all args are provided
    if 'name' not in request.args or \
            'email' not in request.args or \
            'password' not in request.args or \
            'device_puid' not in request.args:
        return jsonify({
            'status': ERROR['missing_args']
        })

    # only required length of args no extra. prevents bulky reqs
    if len(request.args) > 4:
        return jsonify({
            'status': ERROR['too_many_args']
        })

    # check none of the args are empty
    if check_is_args_empty(request):
        return jsonify({
            'status': ERROR['empty_args']
        })

    # store args in vars for later use
    name = request.args['name']
    email = request.args['email']
    password = request.args['password']
    device_puid = request.args['device_puid']

    # check if email is not blocked i.e. someone else's blocked due to spam
    err, is_email_blocked = check_is_email_blocked(email, Blockedemail)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })

    # is email valid?
    if not validate_email(email):
        return jsonify({
            'status': ERROR['invalid_email']
        })
    # try:
    #     v = validate_email(email) # validate and get info
    #     print(v)
    #     email = v["email"] # replace with normalized form
    # except EmailNotValidError as e:
    #     # email is not valid, exception message is human-readable
    #     print(str(e))
    #     return jsonify({
    #         'status': ERROR['invalid_email']
    #     })

    # check if device_puid is genuine
    err, is_device_genuine = check_is_device_genuine(device_puid, Device)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })

    # check if device is not registered to another user
    err, is_device_available = check_is_device_available(device_puid, 
                                                         Device, User)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })

    # fetch user to see if user exists and is verified or not
    err, is_new_user = check_is_new_user(email, User)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })
        # run scheduler so that non verified users get cleared after time

    # generate verification token
    email_verification_token = \
        URL_TOKENIZER.dumps(email, salt=app.config['SECRET_KEY'])

    # add user to db
    try:    
        new_user = User(name=name, email=email, 
                        password=sha256_crypt.hash(password),
                        verification_token=email_verification_token,
                        is_verified=False,
                        registered_on=datetime.datetime.utcnow(),
                        device_uid=Device.query \
                            .filter_by(physical_uid=device_puid) \
                            .first().uid)
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({
            'status': ERROR['database_error']
        })
    
    # send verification email
    try:
        mailer.send_message(
            subject='From SmartKitchen - Please Verify Your Email',
            html="""
                <h3>SmartKitchen - Signup</h3>
                <br/>
                <p>
                    Please click the following link to verify your email.
                    <br/>
                    <a href="{}" target="_blank">{}</a>
                </p>
                <br/>
                <p>
                    If this was not you then 
                    <a href="{}" target="_blank">{}</a>
                    to block any future emails.
                </p>
            """.format(url_for('confirm_email', 
                            token=email_verification_token, _external=True),
                    url_for('confirm_email', 
                            token=email_verification_token, _external=True),
                    url_for('block_email', 
                            token=email_verification_token, _external=True),
                    'Click Here'),
            sender=app.config['MAIL_USERNAME'],
            recipients=[email])
    except:
        return jsonify({
            'status': ERROR['mailing_error']
        })

    # notify user to verify email
    return jsonify({
        'status': SUCCESS['verification_email_sent'],
        'data': {
            'name': new_user.name,
            'email': new_user.email,
        }
    })


@app.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        email = URL_TOKENIZER.loads(token, 
                                    salt=app.config['SECRET_KEY'], 
                                    max_age=(60))
        try:
            user = User.query.filter_by(email=email).first()
            if user is not None and user.is_verified:
                return 'Email has been verified previously.'
            if user is not None and user.verification_token == token:
                user.is_verified = True
                db.session.commit()
                return ('Thank you for verifying your email.' +
                        ' You can begin to use the service now.')
            else:
                return '500-1 - Token Error'
        except:
            return '500-2 - Database Error'
    except SignatureExpired:
        try:
            user = User.query.filter_by(verification_token=token).first()
            if user is not None:
                db.session.delete(user)
                db.session.commit()
                return ('This token has been expired.' +
                        ' Please signup again to receive another token.')
            else:
                return '500-3 - Token Error'
        except:
            return '500-4 - Database Error'    
    except:
        return '500-5 - Token Error'
    

@app.route('/block_email/<token>')
def block_email(token):
    try:
        user = User.query.filter_by(verification_token=token).first()
        if user is not None and user.is_verified:
            return ('Email has been verified previously. Please delete' +
                    ' your account via service.')
        if user is not None and not user.is_verified:
            blockedemail = Blockedemail(email=user.email)
            db.session.add(blockedemail)
            db.session.commit()
            db.session.delete(user)
            db.session.commit()
            return ('Thank you. You will not receive further emails.')
        else:
            return '500-1 - Token Error'
    except Exception as e:
        print(e)
        return '500-2 - Database Error'


@app.route('/user/delete', methods=['POST'])
def user_delete():
    # check if all args are provided
    if 'email' not in request.args or \
            'password' not in request.args:
        return jsonify({
            'status': ERROR['missing_args']
        })

    # only required length of args no extra. prevents bulky reqs
    if len(request.args) > 2:
        return jsonify({
            'status': ERROR['too_many_args']
        })

    # check none of the args are empty
    if check_is_args_empty(request):
        return jsonify({
            'status': ERROR['empty_args']
        })

    # store args in vars for later use
    email = request.args['email']
    password = request.args['password']

    # check if email password match
    err, is_email_password_correct = \
        check_is_email_password_correct(email, password, User, sha256_crypt)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })
    
    # if email password match then delete user
    try:
        user = User.query.filter_by(email=email).first()
        db.session.delete(user)
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({
            'status': ERROR['database_error']
        })
        
    return jsonify({
        'status': SUCCESS['user_deleted'],
        'data': {
            'email': email,
        }
    })


@app.route('/user/info', methods=['POST'])
def user_info():
    # check if all args are provided
    if 'email' not in request.args or \
            'password' not in request.args:
        return jsonify({
            'status': ERROR['missing_args']
        })

    # only required length of args no extra. prevents bulky reqs
    if len(request.args) > 2:
        return jsonify({
            'status': ERROR['too_many_args']
        })

    # check none of the args are empty
    if check_is_args_empty(request):
        return jsonify({
            'status': ERROR['empty_args']
        })

    # store args in vars for later use
    email = request.args['email']
    password = request.args['password']

    # check if email password match
    err, is_email_password_correct = \
        check_is_email_password_correct(email, password, User, sha256_crypt)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })

    try:
        user = User.query.filter_by(email=email).first()
        device = Device.query.filter_by(uid=user.device_uid).first()
        items = Item.query.filter_by(device_uid=device.uid).all()
        
        if user is None or device is None or items is None:
            return jsonify({
                'status': ERROR['general_error']
            })

        ressponse_data = {
            'name': user.name,
            'email': user.email,
            'device_puid': device.physical_uid,
            'items': {}
        }
        for item in items:
            ressponse_data['items'][item.slot_number] = {
                'slot_number': item.slot_number,
                'name': item.name,
                'current_weight': item.current_weight,
                'max_weight': item.max_weight,
                'min_weight': item.min_weight,
                'last_updated': item.last_updated
            }

    except Exception as e:
        print(e)
        return jsonify({
            'status': ERROR['database_error']
        })
    
    return jsonify({
        'status': SUCCESS['info_provided'],
        'data': ressponse_data
    })
    

@app.route('/user/edit/name', methods=['POST'])
def user_edit_name():
    # check if all args are provided
    if 'email' not in request.args or \
            'password' not in request.args or \
            'user_new_name' not in request.args:
        return jsonify({
            'status': ERROR['missing_args']
        })

    # only required length of args no extra. prevents bulky reqs
    if len(request.args) > 3:
        return jsonify({
            'status': ERROR['too_many_args']
        })

    # check none of the args are empty
    if check_is_args_empty(request):
        return jsonify({
            'status': ERROR['empty_args']
        })

    # store args in vars for later use
    email = request.args['email']
    password = request.args['password']
    user_new_name = request.args['user_new_name']

    # check if email password match
    err, is_email_password_correct = \
        check_is_email_password_correct(email, password, User, sha256_crypt)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })

    try:
        user = User.query.filter_by(email=email).first()
        user.name = user_new_name
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({
            'status': ERROR['database_error']
        })

    return jsonify({
        'status': SUCCESS['user_name_updated'],
        'data': {
            'name': user.name,
            'email': user.email
        }
    })
    

@app.route('/user/edit/password', methods=['POST'])
def user_edit_password():
    # check if all args are provided
    if 'email' not in request.args or \
            'password' not in request.args or \
            'new_password' not in request.args:
        return jsonify({
            'status': ERROR['missing_args']
        })

    # only required length of args no extra. prevents bulky reqs
    if len(request.args) > 3:
        return jsonify({
            'status': ERROR['too_many_args']
        })

    # check none of the args are empty
    if check_is_args_empty(request):
        return jsonify({
            'status': ERROR['empty_args']
        })

    # store args in vars for later use
    email = request.args['email']
    password = request.args['password']
    new_password = request.args['new_password']

    # check if email password match
    err, is_email_password_correct = \
        check_is_email_password_correct(email, password, User, sha256_crypt)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })

    try:
        user = User.query.filter_by(email=email).first()
        user.password = sha256_crypt.hash(new_password)
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({
            'status': ERROR['database_error']
        })

    return jsonify({
        'status': SUCCESS['user_password_updated'],
        'data': {
            'name': user.name,
            'email': user.email
        }
    })
    


@app.route('/item/edit/name', methods=['POST'])
def item_edit_name():
    # check if all args are provided
    if 'email' not in request.args or \
            'password' not in request.args or \
            'slot_number' not in request.args or \
            'item_new_name' not in request.args: ####
        return jsonify({
            'status': ERROR['missing_args']
        })

    # only required length of args no extra. prevents bulky reqs
    if len(request.args) > 4:
        return jsonify({
            'status': ERROR['too_many_args']
        })

    # check none of the args are empty
    if check_is_args_empty(request):
        return jsonify({
            'status': ERROR['empty_args']
        })

    # store args in vars for later use
    email = request.args['email']
    password = request.args['password']
    slot_number = request.args['slot_number']
    item_new_name = request.args['item_new_name'] ####

    # check if email password match
    err, is_email_password_correct = \
        check_is_email_password_correct(email, password, User, sha256_crypt)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })
        
    # check if item exists
    try:
        user = User.query.filter_by(email=email).first()
        device = Device.query.filter_by(uid=user.device_uid).first()
        item = Item.query.filter_by(device_uid=user.device_uid) \
                         .filter_by(slot_number=slot_number).first()
        if item is None:
            return jsonify({
                'status': ERROR['item_does_not_exist']
            })
    except Exception as e:
        print(e)
        return jsonify({
            'status': ERROR['database_error']
        })

    item.name = item_new_name ###
    db.session.commit()

    return jsonify({
        'status': SUCCESS['item_name_updated'],
        'data': {
            'name': item.name,
            'slot_number': item.slot_number,
            'device_puid': device.physical_uid
        }
    })


@app.route('/item/edit/maxweight', methods=['POST'])
def item_edit_maxweight():
    # check if all args are provided
    if 'email' not in request.args or \
            'password' not in request.args or \
            'slot_number' not in request.args:
        return jsonify({
            'status': ERROR['missing_args']
        })

    # only required length of args no extra. prevents bulky reqs
    if len(request.args) > 4:
        return jsonify({
            'status': ERROR['too_many_args']
        })

    # check none of the args are empty
    if check_is_args_empty(request):
        return jsonify({
            'status': ERROR['empty_args']
        })

    # store args in vars for later use
    email = request.args['email']
    password = request.args['password']
    slot_number = request.args['slot_number']

    # check if email password match
    err, is_email_password_correct = \
        check_is_email_password_correct(email, password, User, sha256_crypt)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })
        
    # check if item exists
    try:
        user = User.query.filter_by(email=email).first()
        device = Device.query.filter_by(uid=user.device_uid).first()
        item = Item.query.filter_by(device_uid=user.device_uid) \
                         .filter_by(slot_number=slot_number).first()
        if item is None:
            return jsonify({
                'status': ERROR['item_does_not_exist']
            })
    except Exception as e:
        print(e)
        return jsonify({
            'status': ERROR['database_error']
        })

    if item.current_weight is None:
        return jsonify({
            'status': ERROR['current_weight_does_not_exist']
        })

    if item.max_weight >= 1.0:
        min_percentage = (item.min_weight / item.max_weight) * 100.0
        new_min_weight = (item.current_weight / 100.0) * min_percentage
        item.min_weight = new_min_weight
    else:
        item.min_weight = 0.0

    item.max_weight = item.current_weight
    if item.current_weight < 1.0:
        item.max_weight = 1.0
    db.session.commit()

    return jsonify({
        'status': SUCCESS['max_weight_updated'],
        'data': {
            'max_weight': item.max_weight,
            'slot_number': item.slot_number,
            'device_puid': device.physical_uid
        }
    })


@app.route('/item/edit/minweight', methods=['POST'])
def item_edit_minweight():
    # check if all args are provided
    if 'email' not in request.args or \
            'password' not in request.args or \
            'slot_number' not in request.args or \
            'min_weight_percent' not in request.args:
        return jsonify({
            'status': ERROR['missing_args']
        })

    # only required length of args no extra. prevents bulky reqs
    if len(request.args) > 5:
        return jsonify({
            'status': ERROR['too_many_args']
        })

    # check none of the args are empty
    if check_is_args_empty(request):
        return jsonify({
            'status': ERROR['empty_args']
        })

    # store args in vars for later use
    email = request.args['email']
    password = request.args['password']
    slot_number = request.args['slot_number']
    min_weight_percent = request.args['min_weight_percent']

    # check if min weight percentage is int and in bounds of 1 to 99
    try:
        min_weight_percent = int(min_weight_percent)
        if min_weight_percent < 0 or min_weight_percent > 99:
            return jsonify({
                'status': ERROR['bad_args']
            })
    except Exception as e:
        print(e)
        return jsonify({
            'status': ERROR['bad_args']
        })

    # check if email password match
    err, is_email_password_correct = \
        check_is_email_password_correct(email, password, User, sha256_crypt)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })
        
    # check if item exists
    try:
        user = User.query.filter_by(email=email).first()
        device = Device.query.filter_by(uid=user.device_uid).first()
        item = Item.query.filter_by(device_uid=user.device_uid) \
                         .filter_by(slot_number=slot_number).first()
        if item is None:
            return jsonify({
                'status': ERROR['item_does_not_exist']
            })
    except Exception as e:
        print(e)
        return jsonify({
            'status': ERROR['database_error']
        })

    if item.current_weight is None:
        return jsonify({
            'status': ERROR['current_weight_does_not_exist']
        })
    if item.max_weight is None:
        return jsonify({
            'status': ERROR['max_weight_does_not_exist']
        })
        
    item.min_weight = (item.max_weight / 100) * min_weight_percent
    db.session.commit()

    return jsonify({
        'status': SUCCESS['min_weight_updated'],
        'data': {
            'min_weight': item.min_weight,
            'min_weight_percent': (item.min_weight / item.max_weight) * 100,
            'slot_number': item.slot_number,
            'device_puid': device.physical_uid
        }
    })


@app.route('/item/update', methods=['POST'])
def item_update():
    # check if all args are provided
    if 'device_puid' not in request.args or \
            'slots_data' not in request.args:
        return jsonify({
            'status': ERROR['missing_args']
        })

    # only required length of args no extra. prevents bulky reqs
    if len(request.args) > 2:
        return jsonify({
            'status': ERROR['too_many_args']
        })

    # check none of the args are empty
    if check_is_args_empty(request):
        return jsonify({
            'status': ERROR['empty_args']
        })

    # store args in vars for later use
    try:
        device_puid = request.args['device_puid']
        slots_data = json.loads(request.args['slots_data'])
    except Exception as e:
        print(e)
        return jsonify({
            'status': ERROR['bad_args']
        })

    # check if device_puid is genuine
    err, is_device_genuine = check_is_device_genuine(device_puid, Device)
    if err is not None:
        return jsonify({
            'status': ERROR[err['key']]
        })

    # fetch uid of device to update items accordingly
    try:
        device = Device.query.filter_by(physical_uid=device_puid).first()
    except Exception as e:
        print(e)
        return jsonify({
            'status': ERROR['database_error']
        })

    # update items based on slot_number and device_uid
    for slot in slots_data:
        try:
            item = Item.query.filter_by(device_uid=device.uid) \
                             .filter_by(slot_number=int(slot)).first()
            if item is not None:
                item.current_weight = float(slots_data[slot]['cw'])
                item.last_updated = datetime.datetime.utcnow()
                # if item.current_weight > item.max_weight:
                #     item.max_weight = item.current_weight
                db.session.commit()
            else:
                item = Item(name='Slot#' + slot,
                    device_uid=device.uid, slot_number=int(slot),
                    current_weight=float(slots_data[slot]['cw']),
                    max_weight=1.0,
                    min_weight=0.0,
                    last_updated=datetime.datetime.utcnow())
                db.session.add(item)
                db.session.commit()
        except Exception as e:
            print(e)

    # notify client of updation
    return jsonify({
        'status': SUCCESS['current_weight_updated'],
        'data': {
            'device_puid': device.physical_uid
        }
    })
