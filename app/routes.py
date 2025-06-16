from flask import Blueprint, request, jsonify
from .model import Job
from .extensions import db
from datetime import datetime

routes = Blueprint('routes', __name__)

@routes.route('/jobs', methods=['POST'])
def create_job():
    data = request.get_json()
    required_fields = ['title', 'company', 'location']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    job = Job(
        title=data['title'],
        company=data['company'],
        location=data['location'],
        posting_date=datetime.strptime(data.get('posting_date'), '%Y-%m-%d') if data.get('posting_date') else datetime.utcnow(),
        job_type=data.get('job_type', 'Full-time'),
        tags=data.get('tags', ''),
        link=data.get('link', '')
    )
    db.session.add(job)
    db.session.commit()
    return jsonify({'message': 'Job created', 'id': job.id}), 201


@routes.route('/jobs', methods=['GET'])
def get_jobs():
    query = Job.query

    job_type = request.args.get('job_type')
    location = request.args.get('location')
    tag = request.args.get('tag')
    sort = request.args.get('sort')

    if job_type:
        query = query.filter(Job.job_type.ilike(f'%{job_type}%'))
    if location:
        query = query.filter(Job.location.ilike(f'%{location}%'))
    if tag:
        query = query.filter(Job.tags.ilike(f'%{tag}%'))
    if sort == 'posting_date_desc':
        query = query.order_by(Job.posting_date.desc())
    else:
        query = query.order_by(Job.posting_date.asc())

    jobs = query.all()
    return jsonify([
        {
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'location': job.location,
            'posting_date': job.posting_date.strftime('%Y-%m-%d'),
            'job_type': job.job_type,
            'tags': job.tags,
            'link': job.link
        }
        for job in jobs
    ])


@routes.route('/jobs/<int:id>', methods=['GET'])
def get_job(id):
    job = Job.query.get_or_404(id)
    return jsonify({
        'id': job.id,
        'title': job.title,
        'company': job.company,
        'location': job.location,
        'posting_date': job.posting_date.strftime('%Y-%m-%d'),
        'job_type': job.job_type,
        'tags': job.tags,
        'link': job.link
    })


@routes.route('/jobs/<int:id>', methods=['PUT', 'PATCH'])
def update_job(id):
    job = Job.query.get_or_404(id)
    data = request.get_json()

    job.title = data.get('title', job.title)
    job.company = data.get('company', job.company)
    job.location = data.get('location', job.location)
    if data.get('posting_date'):
        job.posting_date = datetime.strptime(data['posting_date'], '%Y-%m-%d')
    job.job_type = data.get('job_type', job.job_type)
    job.tags = data.get('tags', job.tags)
    job.link = data.get('link', job.link)

    db.session.commit()
    return jsonify({'message': 'Job updated'})


@routes.route('/jobs/<int:id>', methods=['DELETE'])
def delete_job(id):
    job = Job.query.get_or_404(id)
    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job deleted'})
