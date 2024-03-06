from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def parse_pdf(file_path):
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PdfReader(file)
            text = ''
            for page_num in range(len(pdf_reader.pages)):
                text += pdf_reader.pages[page_num].extract_text()
            return text
    except Exception as e:
        print(e)
        return None

def calculate_total_score(text):
    # Implement your logic to calculate total score
    # Example: Assuming the total score is mentioned at a specific position in the text
    pass

def calculate_subject_wise_score(text):
    # Implement your logic to calculate subject-wise score
    # Example: Assuming subject-wise scores are mentioned in a table format
    pass

def calculate_sgpa(subject_wise_score):
    # Implement your logic to calculate SGPA
    # Example: Assuming SGPA calculation is based on subject-wise scores
    pass

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
            
            # Parse the PDF file
            pdf_text = parse_pdf(file_path)
            
            if pdf_text is not None:
                # Process the text to calculate total score, subject-wise score, and SGPA
                total_score = calculate_total_score(pdf_text)
                subject_wise_score = calculate_subject_wise_score(pdf_text)
                sgpa = calculate_sgpa(subject_wise_score)
                
                # Return the result
                return jsonify({'totalScore': total_score, 'subjectWiseScore': subject_wise_score, 'sgpa': sgpa}), 200
            else:
                return jsonify({'error': 'Error parsing PDF file'}), 500
            
        else:
            return jsonify({'error': 'Invalid file type'}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
