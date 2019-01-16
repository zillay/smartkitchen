from smartkitchen import app, db, populate_devices

if __name__ == '__main__':
    db.create_all()
    populate_devices()
    app.run('0.0.0.0', port='80')
