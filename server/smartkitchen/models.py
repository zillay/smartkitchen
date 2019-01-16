from . import db

class User(db.Model):
    uid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(2048), unique=True, nullable=False)
    verification_token = db.Column(db.String(2048), unique=True, nullable=True)
    is_verified = db.Column(db.Boolean, unique=False, nullable=False)
    registered_on = db.Column(db.DateTime, unique=False, nullable=True)
    device_uid = db.Column(db.Integer, db.ForeignKey('device.uid'), 
                           unique=True, nullable=True)

    def __repr__(self):
        return '<User "{}">'.format(self.email)


class Blockedemail(db.Model):
    uid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(128), unique=True, nullable=False)

    def __repr__(self):
        return '<Blockedemail "{}">'.format(self.email)


class Device(db.Model):
    uid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    physical_uid = db.Column(db.String(1024), unique=True, nullable=False)

    def __repr__(self):
        return '<Device "{}">'.format(self.physical_uid)


class Item(db.Model):
    uid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    slot_number = db.Column(db.Integer, unique=False)
    name = db.Column(db.String(80), unique=False, nullable=True)
    current_weight = db.Column(db.Float, unique=False, nullable=True)
    max_weight = db.Column(db.Float, unique=False, nullable=True)
    min_weight = db.Column(db.Float, unique=False, nullable=True)
    last_updated = db.Column(db.DateTime, unique=False, nullable=True)
    device_uid = db.Column(db.Integer, db.ForeignKey('device.uid'),
                           unique=False, nullable=True)

    def __repr__(self):
        return '<Item "{}" : "{}">'.format(self.device_uid, self.slot_number)
