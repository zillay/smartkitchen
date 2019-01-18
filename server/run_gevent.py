from gevent.pywsgi import WSGIServer
from smartkitchen import app, db, populate_devices

if __name__ == '__main__':
    db.create_all()
    populate_devices()
    http_server = WSGIServer(('0.0.0.0', 5000), app)
    http_server.serve_forever()