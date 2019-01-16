
def check_is_args_empty(request):
    for key in request.args:
        if request.args[key] == '':
            return True
    return False


def check_is_email_blocked(email, Blockedemail_model):
    try:
        blocked_email = Blockedemail_model.query.filter_by(email=email).first()
        if blocked_email is not None:
            return {'key': 'blocked_email'}, True
    except Exception as e:
        print(e)
        return {'key': 'database_error'}, True
    
    return None, False


def check_is_device_genuine(device_puid, Device_model):
    try:
        asked_device = \
            Device_model.query.filter_by(physical_uid=device_puid).first()
        if asked_device is None:
            return {'key': 'invalid_device_puid'}, False
    except Exception as e:
        print(e)
        return {'key': 'database_error'}, False
    
    return None, True


def check_is_device_available(device_puid, Device_model, User_model):
    try:
        asked_device = Device_model.query.filter_by(physical_uid=device_puid) \
                                         .first()
        if asked_device is None:
            return {'key': 'invalid_device_puid'}, False
        
        if asked_device is not None and \
                User_model.query.filter_by(device_uid=asked_device.uid) \
                                .first() is not None:
            return {'key': 'device_taken'}, False
    except Exception as e:
        print(e)
        return {'key': 'database_error'}, False

    return None, True

def check_is_new_user(email, User_model):
    try:
        prev_user = User_model.query.filter_by(email=email).first()
        if prev_user is not None and \
                prev_user.is_verified is True:
            return {'key': 'user_exists'}, False
        if prev_user is not None and \
                prev_user.is_verified is False:
            return {'key': 'user_not_verified'}, False
    except Exception as e:
        print(e)
        return {'key': 'database_error'}, False
    
    return None, True

def check_is_email_password_correct(email, password, User_model, sha256_crypt):
    try:
        user = User_model.query.filter_by(email=email).first()
        if user is not None and not user.is_verified:
            return {'key': 'user_not_verified'}, False
        if user is None or not sha256_crypt.verify(password, user.password):
            return {'key': 'invalid_email_password'}, False
    except Exception as e:
        print(e)
        return {'key': 'database_error'}, False

    return None, True

def make_populate_devices(device_puids, Device_model, db):
    def populate_devices():
        for device_puid in device_puids:
            try:
                device = Device_model.query \
                         .filter_by(physical_uid=device_puid).first()
                if device is None and device_puid != '':
                    device = Device_model(physical_uid=device_puid)
                    db.session.add(device)
                    db.session.commit()
            except Exception as e:
                print(e)
    return populate_devices
