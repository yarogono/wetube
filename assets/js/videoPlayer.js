const videoContainer = document.getElementById("jsVideo");
const videoPlayer = document.getElementById("jsVideoPlayer");

// videoPlayer__duration
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

// videoPlayer__control
const stepBackward = document.getElementById("jsMediaBackward");
const playBtn = document.getElementById("jsPlayButton");
const stepForward = document.getElementById("jsMediaForward");

// videoPlayer__progressbar

// videoPlayer__volume
const volumeRange = document.getElementById("jsVolume");
const volumeBtn = document.getElementById("jsVolumeBtn");

// videoPlayer__size
const fullScrnBtn = document.getElementById("jsFullScreen");

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
  videoPlayer.currentTime = videoPlayer.currentTime - 5;
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
      volumeBtn.innerHTML = '<i class="fas fa-volume-up fa-lg"></i>';
    } else if (volumeRange.value >= 0.2) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-down fa-lg"></i>';
    } else {
      volumeBtn.innerHTML = '<i class="fas fa-volume-off fa-lg"></i>';
    }
  } else {
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute fa-lg"></i>';
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
  playBtn.innerHTML = '<i class="fas fa-play fa-lg"></i>';
}

function handleDrag(event) {
  const {
    target: { value },
  } = event;
  videoPlayer.volume = value;
  if (value >= 0.6) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up fa-lg"></i>';
  } else if (value >= 0.2) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down fa-lg"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off fa-lg"></i>';
  }
}

// 함수명 변경
// 키보드 좌, 우 누를 시 mediaForward, mediaBackward
function test(e) {
  if (e.code === "Space") {
    handlePlayClick();
    e.preventDefault();
  }
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
  window.addEventListener("keydown", test);

  // Progressbar

  // Volume
  videoPlayer.volume = 0.5;
  volumeBtn.addEventListener("click", handleVolumeClick);
  volumeRange.addEventListener("input", handleDrag);

  // Size
  fullScrnBtn.addEventListener("click", goFullScreen);
  document.addEventListener("fullscreenchange", scrnBtnChange);
}

if (videoContainer) {
  init();
}
