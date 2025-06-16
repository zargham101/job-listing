
from .extensions import db
from .model import Job
from .routes import routes  
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:zargham123@localhost/joblistings'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app)
    app.register_blueprint(routes)  

    return app
