function readURL(input) {
    if (input.files && input.files[0]) {
        var textField = document.getElementById("upload-text");
        textField.innerText = input.files[0].name;
    }

    // POST to /video/transcribe
    
}