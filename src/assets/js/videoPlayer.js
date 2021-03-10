const videoContainer = document.getElementById("jsVideo");
const videoPlayer = document.getElementById("jsVideoPlayer");
const videoController = document.getElementById("jsVideoController");

// Duration
const currentTime = document.getElementById("jsCurrentTime");
const totalTime = document.getElementById("jsTotalTime");

// Control
const stepBackward = document.getElementById("jsMediaBackward");
const playBtn = document.getElementById("jsPlayButton");
const stepForward = document.getElementById("jsMediaForward");

// Progressbar
const progress = document.getElementById("jsProgress");
const progressBar = document.getElementById("jsProgressBar");
const porgressTest = document.getElementById("jsProgressFill");

// Volume
const volumeRange = document.getElementById("jsVolume");
const volumeBtn = document.getElementById("jsVolumeBtn");

// Size
const fullScrnBtn = document.getElementById("jsFullScreen");

let timeout;

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST",
  });
};

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause fa-lg"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play fa-lg"></i>';
  }
}

function handleBackward() {
  videoPlayer.currentTime -= 5;
}

function handleForward() {
  if (videoPlayer.currentTime >= videoPlayer.duration - 5) {
    videoPlayer.currentTime = videoPlayer.duration;
    playBtn.innerHTML = '<i class="fas fa-play fa-lg"></i>';
  } else {
    videoPlayer.currentTime += 5;
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeRange.value = videoPlayer.volume;
    if (volumeRange.value >= 0.6) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-up fa-2x"></i>';
    } else if (volumeRange.value >= 0.2) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-down fa-2x"></i>';
    } else {
      volumeBtn.innerHTML = '<i class="fas fa-volume-off fa-2x"></i>';
    }
  } else {
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute fa-2x"></i>';
    volumeRange.value = 0;
  }
}

function exitFullScreen() {
  fullScrnBtn.addEventListener("click", goFullScreen);
  if (document.exitFullscreen) {
    document.exitFullscreen().catch((err) => Promise.resolve(err));
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function goFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
  fullScrnBtn.addEventListener("click", exitFullScreen);
}

function scrnBtnChange() {
  if (document.fullscreenElement) {
    fullScrnBtn.innerHTML = '<i class="fas fa-compress fa-2x"></i>';
  } else {
    fullScrnBtn.innerHTML = '<i class="fas fa-expand fa-2x"></i>';
  }
}

const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${minutes}:${totalSeconds}`;
};

function getCurrentTime() {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}

function setTotalTime() {
  const totalTimeString = formatDate(videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime, 1000);
}

function handleEnded() {
  registerView();
  playBtn.innerHTML = '<i class="fas fa-play fa-2x"></i>';
}

function handleDrag(event) {
  const {
    target: { value },
  } = event;
  videoPlayer.volume = value;
  if (value >= 0.6) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up fa-2x"></i>';
  } else if (value >= 0.2) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down fa-2x"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off fa-2x"></i>';
  }
}

function handleKeyboardbtn(event) {
  if (event.code === "Space") {
    handlePlayClick();
    event.preventDefault();
  } else if (event.code === "ArrowRight") {
    handleForward();
  } else if (event.code === "ArrowLeft") {
    handleBackward();
  }
}

function handleProgress() {
  const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
  progressBar.style.width = `${percent}%`;
}

function scrub(event) {
  const scrubTime =
    (event.offsetX / progress.offsetWidth) * videoPlayer.duration;
  videoPlayer.currentTime = scrubTime;
}

function handleProgressFill(event) {
  let result = event.offsetX;
  porgressTest.style.width = result + "px";
}

function handleProgressScrub() {
  let mousedown = true;
  progress.addEventListener("mousemove", (event) => mousedown && scrub(event));
  progress.addEventListener("mouseup", () => (mousedown = false));
  progress.addEventListener("mouseover", () => (mousedown = false));
  progress.ondragstart = () => {
    return false;
  };
}

function checkMouseAfk() {
  videoController.style.zIndex = "0";
  videoController.style.opacity = "1";
  videoController.style.transform = "translate(0, 0)";
  videoContainer.style.cursor = "auto";

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    videoController.style.opacity = "0";
    videoController.style.zIndex = "-1";
    videoController.style.transform = "translate(0, 100%)";
    videoContainer.style.cursor = "none";
  }, 5000);
}

function init() {
  // Duration
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("ended", handleEnded);

  // Control
  playBtn.addEventListener("click", handlePlayClick);
  videoPlayer.addEventListener("click", handlePlayClick);
  stepBackward.addEventListener("click", handleBackward);
  stepForward.addEventListener("click", handleForward);
  window.addEventListener("keydown", handleKeyboardbtn);

  // ProgressBar
  videoPlayer.addEventListener("timeupdate", handleProgress);
  progress.addEventListener("click", scrub);
  progress.addEventListener("mousedown", handleProgressScrub);
  progress.addEventListener("mousemove", handleProgressFill);

  // Volume
  videoPlayer.volume = 0.5;
  volumeBtn.addEventListener("click", handleVolumeClick);
  volumeRange.addEventListener("input", handleDrag);

  // Size
  fullScrnBtn.addEventListener("click", goFullScreen);
  document.addEventListener("fullscreenchange", scrnBtnChange);

  //
  videoContainer.addEventListener("mousemove", checkMouseAfk);
  videoContainer.addEventListener("click", checkMouseAfk);
}

if (videoContainer) {
  init();
}
