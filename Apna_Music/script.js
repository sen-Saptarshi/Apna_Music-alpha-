console.log("\x1b[35mWelcome to Apna Music\x1b[0m");
let songIndex = 0;
let audioElement = new Audio(songs[songIndex].filepath);
let playPauseButton = document.getElementById("playPause");
let prevButton = document.getElementById("prev");
let nextButton = document.getElementById("next");
let progressBar = document.getElementById("progressBar");
let currentTimeElem = document.getElementById("currentTime");
let durationElem = document.getElementById("duration");
let songNameElem = document.getElementById("songName");
//initialize the Variables
let songItemContainer = document.querySelector(".songItemContainer");
let categoryContainer = document.querySelector(".categoryContainer");

let tags = new Set();

// Collect unique tags from songs
songs.forEach((song) => song.tags.forEach((tag) => tags.add(tag)));

// Create and append category elements
tags.forEach((tag) => {
  const tagElement = document.createElement("div");
  tagElement.classList.add("category");
  tagElement.innerText = tag;
  tagElement.onclick = () => toggleCategory(tagElement);
  categoryContainer.appendChild(tagElement);
});

let filteredSongs = songs;

// Display songs based on selected categories
function displaySongs() {
  songItemContainer.innerHTML = "";
  filteredSongs = filterSongs();

  filteredSongs.forEach((song, i) => {
    const songElement = document.createElement("div");
    songElement.classList.add("songItem");
    songElement.onclick = () => playSong(song, i);
    songElement.innerHTML = `
      <img alt=${i} src=${song.coverPath} />
      <span class="songItemName">${song.songName}</span>
      <span ></span>`;
    songItemContainer.appendChild(songElement);
  });
}

// Toggle category selection
function toggleCategory(element) {
  element.classList.toggle("active");
  displaySongs();
}

// Filter songs based on selected categories
function filterSongs() {
  const selectedCategories = Array.from(
    document.querySelectorAll(".category.active")
  ).map((el) => el.innerText);
  return songs.filter((song) =>
    selectedCategories.every((tag) => song.tags.includes(tag))
  );
}

// Initial display of all songs
displaySongs();

// Play song when user clicks on one of the songs
function playSong(element, index) {
  audioElement.src = element.filepath;
  songNameElem.innerText = element.songName;
  songIndex = index;
  audioElement.play();
}

// Audio Controls

audioElement.addEventListener("loadedmetadata", () => {
  durationElem.innerText = formatTime(audioElement.duration);
  progressBar.max = audioElement.duration;
  songNameElem.innerText = filteredSongs[songIndex].songName;
});

audioElement.addEventListener("timeupdate", () => {
  progressBar.value = audioElement.currentTime;
  currentTimeElem.innerText = formatTime(audioElement.currentTime);
});

audioElement.addEventListener("ended", () => {
  changeSong(1);
});

progressBar.addEventListener("input", () => {
  audioElement.currentTime = progressBar.value;
});

playPauseButton.addEventListener("click", () => {
  if (audioElement.paused || audioElement.ended) {
    audioElement.play();
    playPauseButton.innerHTML = `<span class="ph--pause-thin">`;
  } else {
    audioElement.pause();
    playPauseButton.innerHTML = `<span class="solar--play-outline"></span>`;
  }
});

prevButton.addEventListener("click", () => {
  changeSong(-1);
});

nextButton.addEventListener("click", () => {
  changeSong(1);
});

function changeSong(direction) {
  songIndex =
    (songIndex + direction + filteredSongs.length) % filteredSongs.length;
  audioElement.src = filteredSongs[songIndex].filepath;
  audioElement.play();
  playPauseButton.innerHTML = `<span class="ph--pause-thin">`;
  songNameElem.innerText = filteredSongs[songIndex].songName;
  audioElement.addEventListener("loadedmetadata", () => {
    durationElem.innerText = formatTime(audioElement.duration);
    progressBar.max = audioElement.duration;
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsPart = Math.floor(seconds % 60);
  return `${minutes}:${secondsPart < 10 ? "0" : ""}${secondsPart}`;
}
