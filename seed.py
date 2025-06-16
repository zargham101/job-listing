from app import create_app
from app.model import Job
from app.extensions import db
from datetime import datetime

app = create_app()

with app.app_context():
    db.create_all()

    sample_job = Job(
        title="Actuarial Analyst",
        company="Acme Corp",
        location="New York, USA",
        posting_date=datetime.today(),
        job_type="Full-time",
        tags="Life,Health,Pricing",
        link="https://www.actuarylist.com/jobs/sample"
    )
    db.session.add(sample_job)
    db.session.commit()

    print("✅ Seeded sample job.")
