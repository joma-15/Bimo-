from flask import jsonify
from app.models.user import User
from datetime import datetime
from app import db

def register_user(data):
    name = data.get("name")
    email = data.get("email")
    date_str = data.get("date")
    password = data.get("password")

     # ✅ convert string → date object
    date_obj = None
    if date_str:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()

    user_data = User(
        name=name, 
        email=email, 
        date=date_obj, 
        password=password
    )

    #save to database
    db.session.add(user_data)
    db.session.commit()

    return jsonify({
        "message" : "registration successfully"
    })


def login_user(data): 
    name = data.get(name)
    password = data.get(password)

    return jsonify({
        "message" : "login successfully"
    })
