from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "auth route working"})

@auth_bp.route("/register", methods=["GET"])
def register(): 
    return "register is working"

@auth_bp.route("login", methods=["GET"])
def login(): 
    return "login is working"