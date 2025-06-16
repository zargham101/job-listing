from .extensions import db
from datetime import datetime

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    posting_date = db.Column(db.Date, )
    job_type = db.Column(db.String(100))
    tags = db.Column(db.String(255))
    link = db.Column(db.String(500))
