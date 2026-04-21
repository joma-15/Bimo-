from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import Config

#instantiate 
db = SQLAlchemy()

def create_app(): 
    #instatiate the flask app 
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    #register routes 
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix = '/auth')


    return app