#this is the power button of the backend run flask from here 
from app import create_app

app = create_app()

if __name__ == '__main__': 
    app.run(debug=True)