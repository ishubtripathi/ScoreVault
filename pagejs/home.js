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
        if (m) {
            m.innerHTML = msg;
        } else {
            console.error("Element with ID 'messages' not found.");
        }
    }

    function parseFile(file) {
        console.log(file.name);
        output('<strong>' + encodeURI(file.name) + '</strong>');
        var startElement = document.getElementById('start');
        if (startElement) {
            startElement.classList.add("hidden");
        } else {
            console.error("Element with ID 'start' not found.");
        }
        var responseElement = document.getElementById('response');
        if (responseElement) {
            responseElement.classList.remove("hidden");
        } else {
            console.error("Element with ID 'response' not found.");
        }
        var fileImageElement = document.getElementById('file-image');
        if (fileImageElement) {
            fileImageElement.classList.add("hidden");
        } else {
            console.error("Element with ID 'file-image' not found.");
        }
    }

    function uploadFile(file) {
        var xhr = new XMLHttpRequest();

        // Set up event listeners
        xhr.upload.addEventListener('progress', function (event) {
            if (event.lengthComputable) {
                var percentComplete = (event.loaded / event.total) * 100;
                console.log('Upload progress: ' + percentComplete.toFixed(2) + '%');
                var fileProgressElement = document.getElementById('file-progress');
                if (fileProgressElement) {
                    fileProgressElement.value = percentComplete;
                } else {
                    console.error("Element with ID 'file-progress' not found.");
                }
            }
        });

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log('Upload completed');
                    output('File uploaded successfully!');
                    var tickAnimationElement = document.getElementById('tick-animation');
                    if (tickAnimationElement) {
                        tickAnimationElement.classList.remove("hidden"); // Show tick animation

                        // Automatically hide the tick animation after 1 second
                        setTimeout(() => {
                            tickAnimationElement.classList.add('hidden');
                        }, 1000);
                    } else {
                        console.error("Element with ID 'tick-animation' not found.");
                    }
                    // Log success
                    console.log('Upload successful');

                    // Retrieve result from the server and display on the homepage
                    getResultFromServer();
                } else {
                    console.error('Upload failed');
                    output('File upload failed.');
                    // Log error
                    console.error('Upload failed');
                }
            }
        };

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

    function ekUpload() {
        // Existing code...
    
        function getResultFromServer() {
            fetch('http://localhost:5000/result')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Display original marks and subjects
                    var marksAndSubjectsElement = document.getElementById('marksAndSubjects');
                    if (marksAndSubjectsElement) {
                        marksAndSubjectsElement.innerHTML = '';
    
                        for (const subject in data.marksAndSubjects) {
                            const scoreElement = document.createElement('div');
                            scoreElement.textContent = `${subject}: ${data.marksAndSubjects[subject]}`;
                            marksAndSubjectsElement.appendChild(scoreElement);
                        }
                    } else {
                        console.error("Marks and subjects element not found.");
                    }
    
                    // Additional code...
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error fetching data from the server.');
                });
        }
    
        // Additional code...
    }
    
    
    

    // Check for the various File API support.
    if (window.File && window.FileList && window.FileReader) {
        Init();
    } else {
        var fileDragElement = document.getElementById('file-drag');
        if (fileDragElement) {
            fileDragElement.style.display = 'none';
        } else {
            console.error("Element with ID 'file-drag' not found.");
        }
    }
}

// Initialize file upload functionality
ekUpload();
