from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import shutil
from tika import parser

app = Flask(__name__)
CORS(app, resources={r"/process-pdf": {"origins": "http://localhost:3000"}})

def extract_text_from_pdf(pdf_file):
    try:
        raw = parser.from_file(pdf_file)
        return raw['content']
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None

def search_keyword_in_text(text, keyword):
    return keyword.lower() in text.lower()

def separate_pdfs_by_keyword(input_dir, output_dir, keyword):
    if not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
        except Exception as e:
            print(f"Error creating output directory: {e}")
            return

    for filename in os.listdir(input_dir):
        if filename.endswith('.pdf'):
            pdf_path = os.path.join(input_dir, filename)
            text = extract_text_from_pdf(pdf_path)
            if text and search_keyword_in_text(text, keyword):
                try:
                    shutil.copy(pdf_path, output_dir)
                except Exception as e:
                    print(f"Error copying PDF: {e}")
                    

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    keyword = request.json.get('keyword')
    input_directory = 'F:/FYP/FYP-N/FYP/FYP-N/server/Project Dataset'  # Change to your input directory path
    output_directory = 'F:/FYP/FYP-N/FYP/FYP-N/frontend/public/cvs'  # Change to your output directory path

    # Call function to separate PDFs based on keyword
    separate_pdfs_by_keyword(input_directory, output_directory, keyword)

    # Count number of PDFs in the output directory
    num_pdfs = len([name for name in os.listdir(output_directory) if name.endswith('.pdf')])

    return jsonify({'numPdfs': num_pdfs})

if __name__ == '__main__':
    app.run(debug=True)
