// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const PDFParser = require('pdf-parse');

// const app = express();
// const port = 3000;

// // Serve static files
// app.use(express.static('public'));

// // Configure Multer for handling file uploadss
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Specify the directory where uploadsed files will be stored
//   },
//   filename: function (req, file, cb) {
//     // Generate a unique filename for the uploadsed file
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const uploads = multer({ 
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
// });

// // Define API endpoint for file uploads
// app.post('/uploads', uploads.single('pdfFile'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploadsed' });
//   }

//   if (req.file.mimetype !== 'application/pdf') {
//     return res.status(400).json({ error: 'uploadsed file is not a PDF' });
//   }

//   const filePath = req.file.path;

//   // Read the uploadsed PDF file
//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Error reading uploadsed file' });
//     }

//     // Instantiate PDFParser object
//     const pdfParser = new PDFParser();

//     // Parse the PDF file to extract text
//     pdfParser.parseBuffer(data).then(pdf => {
//       const text = pdf.text;

//       // Process the text to calculate total score, subject-wise score, and SGPA
//       const totalScore = calculateTotalScore(text);
//       const subjectWiseScore = calculateSubjectWiseScore(text);
//       const sgpa = calculateSGPA(subjectWiseScore);

//       // Return the result in JSON format
//       res.json({ totalScore, subjectWiseScore, sgpa });
//     }).catch(error => {
//       console.error(error);
//       return res.status(500).json({ error: 'Error parsing PDF file' });
//     });
//   });
// });

// // Helper functions to calculate total score, subject-wise score, and SGPA
// function calculateTotalScore(text) {
//   // Implement your logic to calculate total score
//   // Example: Assuming the total score is mentioned at a specific position in the text
//   const totalScoreRegex = /Total Score: (\d+)/;
//   const match = text.match(totalScoreRegex);
//   if (match && match[1]) {
//     return parseInt(match[1]);
//   } else {
//     return 0; // If total score is not found in the text, return 0
//   }
// }

// function calculateSubjectWiseScore(text) {
//   // Implement your logic to calculate subject-wise score
//   // Example: Assuming subject-wise scores are mentioned in a table format
//   const subjectWiseScore = {};
//   const subjectScoreRegex = /Subject: (\w+), Score: (\d+)/g;
//   let match;
//   while ((match = subjectScoreRegex.exec(text)) !== null) {
//     const subject = match[1];
//     const score = parseInt(match[2]);
//     subjectWiseScore[subject] = score;
//   }
//   return subjectWiseScore;
// }

// function calculateSGPA(subjectWiseScore) {
//   // Implement your logic to calculate SGPA
//   // Example: Assuming SGPA calculation is based on subject-wise scores
//   let totalCreditPoints = 0;
//   let totalCredits = 0;
//   for (const subject in subjectWiseScore) {
//     const score = subjectWiseScore[subject];
//     const creditPoints = score / 10; // Assuming each subject has 10 credits
//     totalCreditPoints += creditPoints;
//     totalCredits += 1; // Assuming each subject has 1 credit
//   }
//   const sgpa = totalCreditPoints / totalCredits;
//   return sgpa;
// }

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// // Define route handler for the /result endpoint
// app.get('/result', (req, res) => {
//   // Replace this with your actual logic to retrieve the result data
//   const resultData = {
//     totalScore: 100,
//     subjectWiseScore: {
//       Math: 90,
//       Science: 95,
//       English: 85
//     },
//     sgpa: 9.5
//   };

//   // Send the result data as JSON
//   res.json(resultData);
// });

// // Define route handler for the root URL
// app.get('/', (req, res) => {
//   res.send('Welcome to my Express server!');
// });
