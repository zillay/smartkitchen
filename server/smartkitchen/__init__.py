from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
try:
    from flask_cors import CORS  # The typical way to import flask-cors
except ImportError:
    # Path hack allows examples to be run without installation.
    import os
    parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.sys.path.insert(0, parentdir)

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
