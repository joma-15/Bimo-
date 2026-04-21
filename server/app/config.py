class Config:
    SECRET_KEY = "dev-secret-key"
    
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:password@localhost/bimo_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False