const express = require('express');
const multer = require('multer');
const fs = require('fs');
const PDFParser = require('pdf-parse');

const app = express();
const port = 3000;

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Define API endpoint for file upload
app.post('/upload', upload.single('pdfFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ error: 'Uploaded file is not a PDF' });
  }

  const filePath = req.file.path;

  // Read the uploaded PDF file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading uploaded file' });
    }

    // Instantiate PDFParser object
    const pdfParser = new PDFParser();

    // Parse the PDF file to extract text
    pdfParser.parseBuffer(data).then(pdf => {
      const text = pdf.text;

      // Process the text to calculate total score, subject-wise score, and SGPA
      const totalScore = calculateTotalScore(text);
      const subjectWiseScore = calculateSubjectWiseScore(text);
      const sgpa = calculateSGPA(text);

      // Return the result in JSON format
      res.json({ totalScore, subjectWiseScore, sgpa });
    }).catch(error => {
      console.error(error);
      return res.status(500).json({ error: 'Error parsing PDF file' });
    });
  });
});

// Helper functions to calculate total score, subject-wise score, and SGPA
function calculateTotalScore(text) {
  // Implement your logic to calculate total score
  return 0; // Placeholder
}

function calculateSubjectWiseScore(text) {
  // Implement your logic to calculate subject-wise score
  return {}; // Placeholder
}

function calculateSGPA(text) {
  // Implement your logic to calculate SGPA
  return 0; // Placeholder
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
