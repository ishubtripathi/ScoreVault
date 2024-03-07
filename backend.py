from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import fitz  # PyMuPDF
import os
import re

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

def calculate_total_score(text):
    total_score_regex = r'Total Score: (\d+)'
    match = re.search(total_score_regex, text)
    if match:
        return int(match.group(1))
    else:
        return 0

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

def calculate_sgpa(subject_wise_score):
    total_credit_points = sum(score / 10 for score in subject_wise_score.values())
    total_credits = len(subject_wise_score)
    sgpa = total_credit_points / total_credits if total_credits > 0 else 0
    return sgpa

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
    result_data = {
        'totalScore': 100,
        'subjectWiseScore': {
            'Math': 90,
            'Science': 95,
            'English': 85
        },
        'sgpa': 9.5
    }
    return jsonify(result_data), 200

if __name__ == '__main__':
    app.run(debug=True)
