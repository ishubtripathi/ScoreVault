from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import fitz  # PyMuPDF
import os
import re
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Define the path to the instance folder
INSTANCE_FOLDER_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
app.config['INSTANCE_FOLDER_PATH'] = INSTANCE_FOLDER_PATH

# Ensure the instance folder exists
if not os.path.exists(INSTANCE_FOLDER_PATH):
    os.makedirs(INSTANCE_FOLDER_PATH)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(INSTANCE_FOLDER_PATH, 'scores.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

ALLOWED_EXTENSIONS = {'pdf'}

# Define the Score model
class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total_score = db.Column(db.Integer)
    subject_scores = db.Column(db.JSON)  # Store subject-wise scores as JSON
    sgpa = db.Column(db.Float)

    def __repr__(self):
        return f"<Score(id={self.id}, total_score={self.total_score}, sgpa={self.sgpa})>"

# Check if file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Extract text from PDF
def extract_text_from_pdf(file_path):
    try:
        text = ''
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
        return text
    except Exception as e:
        print(e)
        return None

# Calculate total score from extracted text
def calculate_total_score(text):
    total_score_regex = r'Total Score: (\d+)'
    match = re.search(total_score_regex, text)
    if match:
        return int(match.group(1))
    else:
        return 0

# Calculate subject-wise scores from extracted text
def calculate_subject_wise_score(text):
    subject_wise_score = {}
    lines = text.split('\n')
    for line in lines:
        if 'Subject:' in line and 'Score:' in line:
            subject_score = line.split(',')
            if len(subject_score) == 2:
                subject = subject_score[0].split(': ')[1].strip()
                score = int(subject_score[1].split(': ')[1].strip())
                subject_wise_score[subject] = score
    return subject_wise_score

# Calculate SGPA from subject-wise scores
def calculate_sgpa(subject_wise_score):
    total_credit_points = sum(score / 10 for score in subject_wise_score.values())
    total_credits = len(subject_wise_score)
    sgpa = total_credit_points / total_credits if total_credits > 0 else 0
    return sgpa

# Store extracted data in the database
def store_data_in_database(total_score, subject_wise_score, sgpa):
    new_score = Score(total_score=total_score, subject_scores=subject_wise_score, sgpa=sgpa)
    db.session.add(new_score)
    db.session.commit()

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/uploads', methods=['POST'])
@cross_origin()
def upload_file():
    try:
        if 'pdfFile' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['pdfFile']
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            pdf_text = extract_text_from_pdf(file_path)
            
            if pdf_text is not None:
                total_score = calculate_total_score(pdf_text)
                subject_wise_score = calculate_subject_wise_score(pdf_text)
                sgpa = calculate_sgpa(subject_wise_score)
                
                store_data_in_database(total_score, subject_wise_score, sgpa)
                
                return jsonify({'totalScore': total_score, 'subjectWiseScore': subject_wise_score, 'sgpa': sgpa}), 200
            else:
                return jsonify({'error': 'Error extracting text from PDF file'}), 500
            
        else:
            return jsonify({'error': 'Invalid file type'}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/result', methods=['GET'])
@cross_origin()
def get_result():
    # Fetch the most recent score from the database
    latest_score = Score.query.order_by(Score.id.desc()).first()
    if latest_score:
        return jsonify({
            'totalScore': latest_score.total_score,
            'subjectWiseScore': latest_score.subject_scores,
            'sgpa': latest_score.sgpa
        }), 200
    else:
        return jsonify({'error': 'No data available'}), 404

if __name__ == '__main__':
    app.run(debug=True)
