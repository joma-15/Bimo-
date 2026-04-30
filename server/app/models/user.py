from app import db

class User(db.Model): 
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    date = db.Column(db.Date, nullable=False)
    password = db.Column(db.String(80), nullable=False)
