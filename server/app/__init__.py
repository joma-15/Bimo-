from flask import Flask

def create_app(): 
    #instatiate the flask app 
    app = Flask(__name__)

     # basic config (you'll expand later)
    app.config["SECRET_KEY"] = "dev-secret-key"

    #register routes 
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix = '/auth')


    return app