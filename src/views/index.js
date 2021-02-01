// index.js
function upload(e) {
  var file = e.target.files[0];

  var fd = new FormData();
  fd.append("file", file);
  fetch("/upload", {
    method: "POST",
    body: fd,
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
    });
}

function handleClick() {
  window.open("/download/2+3图片.jpg", "myIframe");
}

function downloadAll() {
  window.open("/downloadAll", "myIframe");
}
