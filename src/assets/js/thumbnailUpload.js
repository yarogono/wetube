const UPLOAD_FILE = document.getElementById("jsUploadfile");

// Edit-profile thumbnail Img
const THUMBNAIL_IMG = document.getElementById("jsThumbnail");

// videoThumbnail
const videoTag = document.getElementById("jsVideoPreview");

function imgThumbnail(event) {
  const file = event.target.files[0];
  const fileReader = new FileReader();
  if (file.type.match("image")) {
    fileReader.onload = () => {
      const img = document.createElement("img");
      img.src = fileReader.result;
      THUMBNAIL_IMG.src = img.src;
    };
    fileReader.readAsDataURL(file);
  } else {
    fileReader.onload = () => {
      const blob = new Blob([fileReader.result], { type: file.type });
      const url = URL.createObjectURL(blob);
      const video = document.createElement("video");
      const timeupdate = () => {
        if (snapImage()) {
          video.removeEventListener("timeupdate", timeupdate);
          video.pause();
        }
      };
      video.addEventListener("loadeddata", () => {
        if (snapImage()) {
          video.removeEventListener("timeupdate", timeupdate);
        }
      });
      const snapImage = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL();
        const success = image.length > 100000;
        if (success) {
          const img = document.createElement("img");
          img.src = image;
          THUMBNAIL_IMG.src = img.src;
          URL.revokeObjectURL(url);
        }
        return success;
      };
      video.addEventListener("timeupdate", timeupdate);
      video.preload = "metadata";
      video.src = url;
      // Load video in Safari / IE11
      video.muted = true;
      video.playsInline = true;
      video.play();
    };
    fileReader.readAsArrayBuffer(file);
  }
}

function videoThumbnail(event) {
  let file = event.target.files[0];
  let blobURL = URL.createObjectURL(file);
  videoTag.src = blobURL;
}

function init() {
  if (videoTag) {
    UPLOAD_FILE.addEventListener("change", videoThumbnail);
  } else {
    UPLOAD_FILE.addEventListener("change", imgThumbnail);
  }
}

if (UPLOAD_FILE) {
  init();
}
