from flask import jsonify
from models import user
from app import db

def register_user(data):
    name = data.get(name)
    email = data.get(email)
    date = data.get(date)
    password = data.get(password)

    user_data = user(
        name=name, 
        email=email, 
        date=date, 
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
