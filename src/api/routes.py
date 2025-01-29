from flask import request, jsonify, Blueprint
from flask_cors import CORS
from api.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime
import os
from functools import wraps

api = Blueprint('api', __name__)
CORS(api)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split()[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, os.getenv('FLASK_APP_KEY'), algorithms=["HS256"])
            current_user = User.query.filter_by(email=data['email']).first()
            if not current_user:
                return jsonify({'message': 'Invalid token'}), 401
        except:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400
    
    user = User(
        email=email,
        password=generate_password_hash(password),
        is_active=True
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    if not user.is_active:
        return jsonify({'message': 'User is not active'}), 401
    
    token = jwt.encode({
        'email': user.email,
        'exp': datetime.utcnow().timestamp() + 24 * 3600  # 24 hour expiration
    }, os.getenv('FLASK_APP_KEY'))
    
    return jsonify({
        'token': token,
        'email': user.email
    })

@api.route('/validate', methods=['GET'])
@token_required
def validate(current_user):
    return jsonify({
        'message': 'Valid token',
        'email': current_user.email
    })

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }
    return jsonify(response_body), 200