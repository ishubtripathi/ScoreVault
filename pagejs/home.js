function ekUpload() {
    function Init() {
        console.log("Upload Initialized");

        var fileSelect = document.getElementById('file-upload'),
            fileDrag = document.getElementById('file-drag');

        fileSelect.addEventListener('change', fileSelectHandler, false);

        // Is XHR2 available?
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
            // File Drop
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

    // Output
    function output(msg) {
        // Response
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
        xhr.open('POST', '/upload', true);

        // Create FormData object and append the file
        var formData = new FormData();
        formData.append('pdfFile', file);

        // Send the FormData object
        xhr.send(formData);
    }

    // Check for the various File API support.
    if (window.File && window.FileList && window.FileReader) {
        Init();
    } else {
        document.getElementById('file-drag').style.display = 'none';
    }
}

// Call the function to initialize file upload functionality
ekUpload();
