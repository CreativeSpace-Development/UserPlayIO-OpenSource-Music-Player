$(document).ready(function () {});

// Change Tab Name In correspondence to currently playing track \\\\\\\
var pagetitle = "Now Playing: ";

function changePageName() {
  $(document).prop("title", "UserPlayio");
  setTimeout(() => {
    $(document).prop("title", pagetitle);
  }, 3000);
}

// Select all the elements in the HTML page
// and assign them to a variable
//var now_playing = document.querySelector(".now-playing");
//var track_art = document.querySelector(".track-art");
var track_name = document.querySelector(".track-name");
var track_artist = document.querySelector(".track-artist");

var playpause_btn = document.querySelector(".playpause-track");
var next_btn = document.querySelector(".next-track");
var prev_btn = document.querySelector(".prev-track");

var seek_slider = document.querySelector(".seek_slider");
var volume_slider = document.querySelector(".volume_slider");
var curr_time = document.querySelector(".current-time");
var total_duration = document.querySelector(".total-duration");

// Specify global values
var track_index = 0;
var isPlaying = false;
var updateTimer;
var seekto;

// Create the 
element for the player
var curr_track = document.createElement("audio");
curr_track.classList.add("audio");

// Audio Tracklist
var track_list = [
  {
    name: "Flares",
    artist: "NIVIRO",
    image: "https://i1.sndcdn.com/artworks-000284683649-el5ngz-t500x500.jpg",
    path:
      "https://firebasestorage.googleapis.com/v0/b/userplayer-58833.appspot.com/o/flares-1586953595-MWxybuVljR.mp3?alt=media&token=10214818-3dfd-4895-b139-ea0b67cbe6a6"
  },
  {
    name: "With You",
    artist: "Rameses B",
    image: "https://i1.sndcdn.com/artworks-000108089418-eyd9ov-t500x500.jpg",
    path:
      "https://firebasestorage.googleapis.com/v0/b/userplayer-58833.appspot.com/o/Rameses%20B%20-%20With%20You.mp3?alt=media&token=43b5c409-bea6-4bc7-97ad-0a57fde7fa0d"
  },
  {
    name: "Strada",
    artist: "Ricky Mears ft. Deja Elyze",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTyWgGGMdcCnlj96RAZ4uZFosm2ejSxcCYZdcA42qpuXQnLxXAfX5TgSBVgBOYmHIzdnjkYAyF4NbyrmmL:https://i1.sndcdn.com/artworks-000122428233-1v0l8j-t500x500.jpg&usqp=CAU",
    path:
      "https://firebasestorage.googleapis.com/v0/b/userplayer-58833.appspot.com/o/Ricky%20Mears%20-%20Strada%20ft.%20Deja%20Elyze.mp3?alt=media&token=cda003cb-1385-4998-86da-c95f3f211487"
  },
  {
    name: "Monster",
    artist: "Nightcore",
    image:
      "https://coub-anubis-a.akamaized.net/coub_storage/coub/simple/cw_timeline_pic/a7ef8dcc0e7/6cd42db1fa82cfcb46597/1559238641_image.jpg",
    path:
      "https://firebasestorage.googleapis.com/v0/b/userplayer-58833.appspot.com/o/Nightcore%20-%20Monster%20(Dubstep)%20%5BHD%5D.mp3?alt=media&token=33a99e36-8ba8-41c2-a510-66c9cd2adb2a"
  }
];

// Functions
// Functiom to reset all values to their default
function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function loadTrack(track_index) {
  // Clear the previous seek timer
  clearInterval(updateTimer);
  resetValues();

  // Load a new track
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  // Update details of the track
  document.getElementById("trackimg").src = track_list[track_index].image;
  track_name.textContent = track_list[track_index].name;
  pagetitle = `Now Playing: ${track_list[track_index].name} by ${track_list[track_index].artist}`;
  track_artist.textContent = track_list[track_index].artist;

  // Set an interval of 1000 milliseconds
  // for updating the seek slider
  updateTimer = setInterval(seekUpdate, 1000);
  // Move to the next track if the current finishes playing
  // using the 'ended' event
  curr_track.addEventListener("ended", nextTrack);
}

function render() {
  for (var track_index = 0; track_index < track_list.length; track_index++) {
    var node = document.createElement("LI");
    node.classList.add("list-group-item");
    node.setAttribute("id", `${track_list[track_index].name}`);
    // node.setAttribute("id", `${track_list[track_index]}`);
    var textnode = document.createTextNode(
      track_list[track_index].name + " by " + track_list[track_index].artist
    ); // Create a text node
    node.appendChild(textnode);
    document.getElementById("playlist_items").appendChild(node);
  }
}

function playpauseTrack() {
  // Switch between playing and pausing
  // depending on the current state
  if (!isPlaying) {
    playTrack();
  } else {
    pauseTrack();
  }
}
function playTrack() {
  // Play the loaded track
  $(".list-group-item").removeClass("active");
  document
    .getElementById(`${track_list[track_index].name}`)
    .classList.add("active");
  curr_track.play();
  isPlaying = true;
  $("#control").removeClass("fa-play-circle").addClass("fa-pause-circle");
  $(document).prop("title", pagetitle);
}

function pauseTrack() {
  // Pause the loaded track
  curr_track.pause();
  isPlaying = false;
  $("#control").removeClass("fa-pause-circle").addClass("fa-play-circle");
  $(document).prop("title", "UserPlayio");
}

function nextTrack() {
  // Go back to the first track if the
  // current one is the last in the track list
  if (track_index < track_list.length - 1) track_index += 1;
  else track_index = 0;

  // Load and play the new track
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  // Go back to the last track if the
  // current one is the first in the track list
  if (track_index > 0) {
    track_index -= 1;
  } else {
    track_index = 0; //track_list.length;
  }

  // Load and play the new track
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  // Calculate the seek position by the
  // percentage of the seek slider
  // and get the relative duration to the track
  seekto = curr_track.duration * (seek_slider.value / 100);

  // Set the current track position to the calculated seek position
  curr_track.currentTime = seekto;
}

function setVolume() {
  // Set the volume according to the
  // percentage of the volume slider set
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  var seekPosition = 0;

  // Check if the current track duration is a legible number
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    // Calculate the time left and the total duration
    var currentMinutes = Math.floor(curr_track.currentTime / 60);
    var currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    );
    var durationMinutes = Math.floor(curr_track.duration / 60);
    var durationSeconds = Math.floor(
      curr_track.duration - durationMinutes * 60
    );

    // Add a zero to the single digit time values
    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    // Display the updated duration
    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

// Load the first track in the tracklist
loadTrack(track_index);
render();

$(playpause_btn).click(playpauseTrack);
$(next_btn).click(nextTrack);
$(prev_btn).click(prevTrack);
$(volume_slider).change(setVolume);
$(seek_slider).change(seekTo);
$(".list-group-item").click(function (event) {
  $(".list-group-item").removeClass("active");
  $(this).addClass("active");
  console.log(this.innerHTML.split(" ")[0]);
});

$(document).on("keypress", function (e) {
  if (e.which === 32) {
    playpauseTrack();
  }
});
$(document).on("keydown", function (e) {
  if (e.which === 39) {
    nextTrack();
  }
  if (e.which === 37) {
    prevTrack();
  }
});
