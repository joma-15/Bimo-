from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "auth route working"})

@auth_bp.route("/register", methods=["POST"])
def register():
    #get the request data 
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
     
    return jsonify({
        "message" : "register successfully"
    })

@auth_bp.route("login", methods=["POST"])
def login(): 
    return "login is working"