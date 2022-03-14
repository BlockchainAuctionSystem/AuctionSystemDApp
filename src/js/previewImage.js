document.querySelector('#img').addEventListener('change', function(event) {
    if(event.target.files.length > 0){
        var src = URL.createObjectURL(event.target.files[0]);
        var preview = document.getElementById("file-preview");
        preview.src = src;
        preview.style.display = "inline-block";
        preview.style.maxWidth = "100%";
        preview.style.maxHeight = "100%";
      }
});