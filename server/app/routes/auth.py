from flask import Blueprint, request, jsonify
from controllers import auth_controllers

auth_bp = Blueprint("auth", __name__)
controller = auth_controllers

@auth_bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "auth route working"})

@auth_bp.route("/register", methods=["POST"])
def register():
    #get the request data 
    data = request.get_json()
    reg_user = controller.register_user(data)

    return reg_user

@auth_bp.route("login", methods=["POST"])
def login(): 
    data = request.get_json()
    log_user = controller.register_user(data)

    return log_user
