DEBUG = True # False it in prod
SECRET_KEY = "456sad46f4-4fs9d5f-r78a-b78e6f4585"
CORS_HEADERS = 'Content-Type'

SQLALCHEMY_DATABASE_URI = 'sqlite:///./test.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False

MAIL_SERVER ='smtp.gmail.com'
MAIL_PORT = 465
MAIL_USERNAME = 'hello.smartkitchen@gmail.com'
MAIL_PASSWORD = '<passwordhere>'
MAIL_USE_TLS = False
MAIL_USE_SSL = True
