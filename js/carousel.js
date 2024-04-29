const track = document.querySelector(".carousel");

window.addEventListener("load", () => {
  setSlidesOffset();
  document.querySelector(":root").style.setProperty("--vh", window.innerHeight / 100 + "px");
});

window.addEventListener("resize", () => {
  setSlidesOffset();
  if (window.innerHeight <= 768) {
    document.querySelector(":root").style.setProperty("--vh", window.innerHeight / 100 + "px");
  }
});

previousBtns.forEach((button) => {
  button.addEventListener("click", () => {
    moveToPrevSlide();
  });
});

nextBtns.forEach((button) => {
  button.addEventListener("click", () => {
    moveToNextSlide();
  });
});

audios.forEach((audio) => {
  audio.addEventListener("ended", () => {
    setSlidesStyle(false);
    track.style.overflowX = "auto";
  });
});

const slides = document.querySelectorAll(".carousel__slide");
playpauseButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const currentSlide = track.querySelector(".current-slide");
    const targetSlide = slides[index];
    moveToSlide(currentSlide, targetSlide);
  });
});

function setSlidesStyle(shrink) {
  slides.forEach((slide) => {
    slide.style.pointerEvents = shrink ? "none" : "auto";
    slide.style.filter = shrink ? "blur(0.25rem)" : "none";
    if (window.innerWidth < 768) {
      slide.style.transform = `scaleY(${shrink ? 0.9 : 1})`;
    } else {
      slide.style.transform = `scale(${shrink ? 0.9 : 1})`;
    }
  });
}

function setSlidesOffset() {
  const currentSlide = track.querySelector(".current-slide");
  const slideWidth = currentSlide.getBoundingClientRect().width;
  slides.forEach((slide, index) => {
    slide.setAttribute("data-offset-x", slideWidth * index + "px");
  });
  track.scroll({ left: parseFloat(currentSlide.getAttribute("data-offset-x")), behavior: "smooth" });
}

function moveToNextSlide() {
  const currentSlide = track.querySelector(".current-slide");
  const nextSlide = currentSlide.nextElementSibling;
  if (nextSlide && !nextSlide.classList.contains("carousel__slide--empty")) {
    moveToSlide(currentSlide, nextSlide);
  }
}

function moveToPrevSlide() {
  const currentSlide = track.querySelector(".current-slide");
  const prevSlide = currentSlide.previousElementSibling;
  if (prevSlide && !prevSlide.classList.contains("carousel__slide--empty")) {
    moveToSlide(currentSlide, prevSlide);
  }
}

function moveToSlide(currentSlide, targetSlide) {
  track.scroll({ left: parseFloat(targetSlide.getAttribute("data-offset-x")), behavior: "smooth" });
  // reset the previous slide
  currentSlide.classList.remove("current-slide");
  if (currentSlide !== targetSlide || currentPlayingIdx === -2) {
    currentSlide.classList.remove("current-playing");
  }
  // set the new slide
  targetSlide.classList.add("current-slide");
  targetSlide.classList.toggle("current-playing");

  if (currentPlayingIdx === -1) {
    // all players paused
    setSlidesStyle(false);
    track.style.overflowX = "auto";
  } else {
    // a player is played
    setSlidesStyle(true);
    track.style.overflowX = "hidden";
  }
}
