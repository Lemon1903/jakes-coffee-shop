const audios = document.querySelectorAll(".music-player__audio");
const playpauseButtons = document.querySelectorAll(".music-player__btn--play-pause");

// Update the total time display when the metadata has loaded
const totalTimeDisplays = document.querySelectorAll(".music-player__total-time");
window.addEventListener("load", () => {
  totalTimeDisplays.forEach((totalTimeDisplay, index) => {
    const totalMinutes = Math.floor(audios[index].duration / 60);
    let totalSeconds = Math.floor(audios[index].duration % 60);
    totalSeconds = totalSeconds < 10 ? "0" + totalSeconds : totalSeconds;
    totalTimeDisplay.textContent = totalMinutes + ":" + totalSeconds;
  });
});

const previousBtns = document.querySelectorAll(".music-player__btn--skip-previous");
const nextBtns = document.querySelectorAll(".music-player__btn--skip-next");
previousBtns.forEach((button, index) => {
  nextBtns[index].addEventListener("click", () => {
    pausePlayer(index);
    togglePlayer(index + 1);
  });

  button.addEventListener("click", () => {
    pausePlayer(index);
    togglePlayer(index - 1);
  });
});

let currentPlayingIdx = -1;
playpauseButtons.forEach((playpauseButton, index) => {
  playpauseButton.addEventListener("click", () => {
    if (currentPlayingIdx !== -1 && currentPlayingIdx !== index) {
      pausePlayer(currentPlayingIdx);
    }
    togglePlayer(index);
  });
});

// Update the volume as the user interacts with the volume control
const volumeControls = document.querySelectorAll(".volume-track");
const volumeIcons = document.querySelectorAll(".music-player__btn--volume");
volumeIcons.forEach((volumeIcon, index) => {
  volumeIcon.addEventListener("click", () => {
    volumeControls[index].classList.toggle("show");
    volumeControls[index].focus();
  });
});

volumeControls.forEach((volumeControl, index) => {
  volumeControl.addEventListener("blur", () => {
    volumeControl.classList.remove("show");
  });

  volumeControl.addEventListener("input", () => {
    audios[index].volume = volumeControl.value;
    if (volumeControl.value > 0.5) {
      volumeIcons[index].classList = "bx bxs-volume-full music-player__btn music-player__btn--volume";
    } else if (volumeControl.value > 0) {
      volumeIcons[index].classList = "bx bxs-volume-low music-player__btn music-player__btn--volume";
    } else {
      volumeIcons[index].classList = "bx bxs-volume-mute music-player__btn music-player__btn--volume";
    }
    volumeControl.style.setProperty("--volume", volumeControl.value * 100 + "%");
  });
});

// Update the progress bar as the audio plays
const trackProgresses = document.querySelectorAll(".track-progress");
const currentTimeDisplays = document.querySelectorAll(".music-player__current-time");
audios.forEach((audio, index) => {
  audio.addEventListener("timeupdate", () => {
    if (audio.currentTime === audio.duration) {
      playpauseButtons[index].classList.replace("bx-pause", "bx-revision");
    }

    const progress = (audio.currentTime / audio.duration) * 100;
    trackProgresses[index].value = progress;
    trackProgresses[index].style.setProperty("--progress", progress + "%");

    // Update the current time display
    const currentMinutes = Math.floor(audio.currentTime / 60);
    let currentSeconds = Math.floor(audio.currentTime % 60);
    currentSeconds = currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
    currentTimeDisplays[index].textContent = currentMinutes + ":" + currentSeconds;
  });
});

// Seek when the user interacts with the progress bar
trackProgresses.forEach((trackProgress, index) => {
  trackProgress.addEventListener("input", () => {
    const time = (trackProgress.value / 100) * audios[index].duration;
    audios[index].currentTime = time;
  });
});

function pausePlayer(index) {
  const playpauseButton = playpauseButtons[index];
  audios[index].pause();
  playpauseButton.classList.replace("bx-pause", "bx-play");
  currentPlayingIdx = -1;
}

function playPlayer(index) {
  const playpauseButton = playpauseButtons[index];
  audios[index].play();
  playpauseButton.classList.replace("bx-play", "bx-pause");
  currentPlayingIdx = index;
}

function restartPlayer(index) {
  const playpauseButton = playpauseButtons[index];
  audios[index].currentTime = 0;
  audios[index].play();
  playpauseButton.classList.replace("bx-revision", "bx-pause");
  currentPlayingIdx = index;
}

function togglePlayer(index) {
  const playpauseButton = playpauseButtons[index];
  if (playpauseButton.classList.contains("bx-play")) {
    playPlayer(index);
  } else if (playpauseButton.classList.contains("bx-pause")) {
    pausePlayer(index);
  } else {
    restartPlayer(index);
  }
}
