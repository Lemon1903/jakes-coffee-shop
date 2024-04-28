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

const track = document.querySelector(".carousel");
const slides = document.querySelectorAll(".carousel__slide");
playpauseButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const currentSlide = track.querySelector(".current-slide");
    const targetSlide = slides[index];
    moveToSlide(currentSlide, targetSlide);
  });
});

function disableScroll(e) {
  if (e.deltaX !== 0) {
    e.preventDefault();
  }
}

function setSlidesStyle(shrink) {
  slides.forEach((slide) => {
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
  slides.forEach((slide, index) => {
    const width = window.getComputedStyle(slide).getPropertyValue("width");
    const computedWidth = parseInt(width.split("px")[0]);
    slide.setAttribute("data-offset-x", computedWidth * index + "px");
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
  if (currentSlide !== targetSlide) {
    currentSlide.classList.remove("current-playing");
  }
  // set the new slide
  targetSlide.classList.toggle("current-playing");
  targetSlide.classList.add("current-slide");

  // set the track and slides
  if (currentPlayingIdx === -1) {
    // all players paused
    setSlidesStyle(false);
    track.removeEventListener("wheel", disableScroll);
    track.removeEventListener("touchmove", disableScroll);
  } else {
    // a player is played
    setSlidesStyle(true);
    track.addEventListener("wheel", disableScroll);
    track.addEventListener("touchmove", disableScroll);
  }
}
