from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from flask_cors import CORS

app = Flask(__name__)
app.config.from_pyfile('config.py')

cors = CORS(app)
db = SQLAlchemy(app)
mailer = Mail(app)

from . import routes
from .utils import make_populate_devices
from .models import Device
from .globals import DEVICE_PUIDS

populate_devices = make_populate_devices(DEVICE_PUIDS, Device, db)
