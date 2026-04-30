from app import create_app, db

# 👇 IMPORT YOUR MODEL HERE
from app.models.user import User

app = create_app()

with app.app_context():
    print("Tables detected:", db.metadata.tables.keys())  # 👈 ADD THIS
    db.create_all()
    print('table created successfully')