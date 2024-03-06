function ekUpload() {
    function Init() {
        console.log("Upload Initialized");

        var fileSelect = document.getElementById('file-upload'),
            fileDrag = document.getElementById('file-drag');

        fileSelect.addEventListener('change', fileSelectHandler, false);

        // Check if XHR2 is available
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
            // File Drag and Drop
            fileDrag.addEventListener('dragover', fileDragHover, false);
            fileDrag.addEventListener('dragleave', fileDragHover, false);
            fileDrag.addEventListener('drop', fileSelectHandler, false);
        }
    }

    function fileDragHover(e) {
        var fileDrag = document.getElementById('file-drag');

        e.stopPropagation();
        e.preventDefault();

        fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
    }

    function fileSelectHandler(e) {
        // Fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // Cancel event and hover styling
        fileDragHover(e);

        // Process all File objects
        for (var i = 0, f; f = files[i]; i++) {
            parseFile(f);
            uploadFile(f);
        }
    }

    function output(msg) {
        // Output response
        var m = document.getElementById('messages');
        m.innerHTML = msg;
    }

    function parseFile(file) {
        console.log(file.name);
        output('<strong>' + encodeURI(file.name) + '</strong>');
        document.getElementById('start').classList.add("hidden");
        document.getElementById('response').classList.remove("hidden");
        document.getElementById('file-image').classList.add("hidden");
    }

    function uploadFile(file) {
        var xhr = new XMLHttpRequest();

        // Set up event listeners
        xhr.upload.addEventListener('progress', function (event) {
            if (event.lengthComputable) {
                var percentComplete = (event.loaded / event.total) * 100;
                console.log('Upload progress: ' + percentComplete.toFixed(2) + '%');
                document.getElementById('file-progress').value = percentComplete;
            }
        });

        xhr.upload.addEventListener('load', function (event) {
            console.log('Upload completed');
            output('File uploaded successfully!');
            document.getElementById('tick-animation').classList.remove("hidden"); // Show tick animation
            
            // Automatically hide the tick animation after 1 second
            setTimeout(() => {
                document.getElementById('tick-animation').classList.add('hidden');
            }, 1000);
            
            // Log success
            console.log('Upload successful');
            
            // Retrieve result from the server
            getResultFromServer();
        });

        xhr.upload.addEventListener('error', function (event) {
            console.error('Upload failed');
            output('File upload failed.');
            
            // Log error
            console.error('Upload failed');
        });

        xhr.upload.addEventListener('abort', function (event) {
            console.warn('Upload aborted');
            output('File upload aborted.');
            
            // Log abortion
            console.warn('Upload aborted');
        });

        // Set up the request
        xhr.open('POST', 'http://localhost:5000/uploads', true);

        // Create FormData object and append the file
        var formData = new FormData();
        formData.append('pdfFile', file);

        // Send the FormData object
        xhr.send(formData);
    }

    function getResultFromServer() {
        fetch('http://localhost:5000/result')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update HTML elements with the returned result
            document.getElementById('result').classList.remove('hidden');
            document.getElementById('totalScore').innerHTML = `<h3>Total Score: ${data.totalScore}</h3>`;
            document.getElementById('sgpa').innerHTML = `<h3>SGPA: ${data.sgpa}</h3>`;
            const subjectWiseScoreHTML = Object.entries(data.subjectWiseScore)
                .map(([subject, score]) => `<div>${subject}: ${score}</div>`)
                .join('');
            document.getElementById('subjectWiseScore').innerHTML = `<h3>Subject-wise Scores:</h3> ${subjectWiseScoreHTML}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    

    // Check for the various File API support.
    if (window.File && window.FileList && window.FileReader) {
        Init();
    } else {
        document.getElementById('file-drag').style.display = 'none';
    }
}

// Initialize file upload functionality
ekUpload();
