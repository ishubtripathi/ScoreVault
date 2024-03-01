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

      // Start upload
      xhr.open('POST', 'your_upload_endpoint', true);
      xhr.setRequestHeader('X-File-Name', file.name);
      xhr.setRequestHeader('Content-Type', 'application/pdf');

      // Send the file
      xhr.send(file);
  }

  // Check for the various File API support.
  if (window.File && window.FileList && window.FileReader) {
      Init();
  } else {
      document.getElementById('file-drag').style.display = 'none';
  }
}

ekUpload();
