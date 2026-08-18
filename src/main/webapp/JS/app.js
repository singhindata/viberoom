const audioPlayer = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");

const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const bottomSongTitle = document.getElementById("bottomSongTitle");
const bottomArtistName = document.getElementById("bottomArtistName");

const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");

const homeButton = document.getElementById("homeButton");
const searchNavButton = document.getElementById("searchNavButton");
const libraryButton = document.getElementById("libraryButton");
const favoritesButton = document.getElementById("favoritesButton");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");


/* ================================
   STATE
================================ */

let favorites = [];

let songs = [];

let currentSongIndex = 0;

let currentView = "home";

let isLoadingSong = false;


/* ================================
   TIME FORMATTER
================================ */

function formatTime(seconds) {

    seconds = Math.floor(seconds);

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const paddedMinutes =
        String(mins).padStart(2, "0");

    const paddedSeconds =
        String(secs).padStart(2, "0");

    return `${paddedMinutes}:${paddedSeconds}`;
}


/* ================================
   LOAD SONG
================================ */

function loadSong(song) {

    isLoadingSong = true;

    songTitle.textContent = song.title;
    artistName.textContent = song.artist;

    bottomSongTitle.textContent = song.title;
    bottomArtistName.textContent = song.artist;

    progressBar.value = 0;

    currentTime.textContent = "00:00";
    duration.textContent = "00:00";

    audioPlayer.src = song.filePath;

    audioPlayer.load();
}


/* ================================
   PLAY / PAUSE
================================ */

playButton.addEventListener("click", function() {

    if (audioPlayer.paused) {

        audioPlayer.play();

        playButton.textContent = "⏸";

    } else {

        audioPlayer.pause();

        playButton.textContent = "▶";
    }

});


/* ================================
   AUDIO METADATA
================================ */

audioPlayer.addEventListener("loadedmetadata", function() {

    const totalSeconds = audioPlayer.duration;

    duration.textContent =
        formatTime(totalSeconds);

    isLoadingSong = false;

});


/* ================================
   AUDIO PROGRESS
================================ */

audioPlayer.addEventListener("timeupdate", function() {

    if (isLoadingSong) {
        return;
    }

    currentTime.textContent =
        formatTime(audioPlayer.currentTime);

    const progress =
        (audioPlayer.currentTime /
            audioPlayer.duration) * 100;

    progressBar.value = progress;

});


/* ================================
   SEEK
================================ */

progressBar.addEventListener("input", function() {

    const progress = progressBar.value;

    audioPlayer.currentTime =
        (progress / 100) *
        audioPlayer.duration;

});


/* ================================
   VOLUME
================================ */

volumeBar.addEventListener("input", function() {

    const volume = volumeBar.value;

    audioPlayer.volume = volume;

});


/* ================================
   NEXT SONG
================================ */

function nextSong(autoPlay = false) {

    currentSongIndex++;

    if (currentSongIndex === songs.length) {

        currentSongIndex = 0;
    }

    loadSong(songs[currentSongIndex]);

    if (autoPlay) {

        audioPlayer.play();

        playButton.textContent = "⏸";
    }

}


/* ================================
   PREVIOUS SONG
================================ */

function previousSong() {

    const wasPlaying =
        !audioPlayer.paused;

    currentSongIndex--;

    if (currentSongIndex < 0) {

        currentSongIndex =
            songs.length - 1;
    }

    loadSong(songs[currentSongIndex]);

    if (wasPlaying) {

        audioPlayer.play();

        playButton.textContent = "⏸";
    }

}


/* ================================
   NEXT BUTTON
================================ */

nextButton.addEventListener("click", function() {

    const wasPlaying =
        !audioPlayer.paused;

    nextSong(wasPlaying);

});


/* ================================
   PREVIOUS BUTTON
================================ */

previousButton.addEventListener("click", function() {

    previousSong();

});


/* ================================
   AUTOMATIC NEXT
================================ */

audioPlayer.addEventListener("ended", function() {

    nextSong(true);

});

async function fetchFavorites() {

    try {

        const response =
            await fetch("/viberoom/favorites");

        if (!response.ok) {
            throw new Error("Failed to fetch favorites");
        }

        const favoriteData =
            await response.json();

        favorites = favoriteData.map(function(favorite) {
            return favorite.songId;
        });

        console.log("Favorites loaded:", favorites);

    } catch (error) {

        console.error(
            "Error loading favorites:",
            error
        );
    }
}


/* ================================
   RENDER SONGS
================================ */

function renderSongs(songArray = songs) {

    const songList =
        document.getElementById("songList");

    songList.innerHTML = "";

    if (songArray.length === 0) {

        songList.innerHTML = `
            <p class="empty-message">
                No songs found.
            </p>
        `;

        return;
    }


    songArray.forEach(function(song) {

        const songCard =
            document.createElement("div");

        songCard.classList.add("song-card");


        songCard.innerHTML = `
            <div class="song-info">

                <div class="song-cover">
                    🎵
                </div>

                <div>
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>

            </div>

            <div class="song-actions">

                <button class="favorite-button">
                    ${favorites.includes(song.id)
                        ? "♥"
                        : "♡"}
                </button>

                <button class="song-play-button">
                    ▶
                </button>

            </div>
        `;


        /* ================================
           FAVORITE BUTTON
        ================================= */

        const favoriteButton =
            songCard.querySelector(
                ".favorite-button"
            );


			favoriteButton.addEventListener("click", async function(event) {

			    event.stopPropagation();

			    const isFavorite =
			        favorites.includes(song.id);

			    try {

			        if (isFavorite) {

			            const response = await fetch(
			                "/viberoom/favorites?songId=" + song.id,
			                {
			                    method: "DELETE"
			                }
			            );

			            if (!response.ok) {
			                throw new Error("Failed to remove favorite");
			            }

			            favorites = favorites.filter(function(favoriteId) {
			                return favoriteId !== song.id;
			            });

			        } else {

			            const response = await fetch(
			                "/viberoom/favorites?songId=" + song.id,
			                {
			                    method: "POST"
			                }
			            );

			            if (!response.ok) {
			                throw new Error("Failed to add favorite");
			            }

			            favorites.push(song.id);
			        }

			        // Immediately update the UI
			        if (currentView === "favorites") {
			            showFavorites();
			        } else {
			            renderSongs();
			        }

			    } catch (error) {

			        console.error(
			            "Favorite error:",
			            error
			        );
			    }

			});


        /* ================================
           SONG CARD CLICK
        ================================= */

        songCard.addEventListener(
            "click",
            function() {

                const songIndex =
                    songs.indexOf(song);

                currentSongIndex =
                    songIndex;

                loadSong(song);

                audioPlayer.play();

                playButton.textContent = "⏸";
            }
        );


        songList.appendChild(songCard);

    });

}


/* ================================
   SHOW FAVORITES
================================ */

function showFavorites() {

    const favoriteSongs =
        songs.filter(function(song) {

            return favorites.includes(song.id);

        });

    renderSongs(favoriteSongs);
}


/* ================================
   SEARCH
================================ */

function searchSongs() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredSongs =
        songs.filter(function(song) {

            return (
                song.title
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                song.artist
                    .toLowerCase()
                    .includes(searchTerm)
            );

        });


    renderSongs(filteredSongs);
}


/* ================================
   SEARCH BUTTON
================================ */

searchButton.addEventListener(
    "click",
    function() {

        searchSongs();

    }
);


/* ================================
   SEARCH INPUT
================================ */

searchInput.addEventListener(
    "input",
    function() {

        searchSongs();

    }
);


/* ================================
   ACTIVE SIDEBAR BUTTON
================================ */

function setActiveButton(activeButton) {

    const buttons =
        document.querySelectorAll(".nav-item");


    buttons.forEach(function(button) {

        button.classList.remove("active");

    });


    activeButton.classList.add("active");
}


/* ================================
   VIEW NAVIGATION
================================ */

function showView(view) {

    currentView = view;


    if (view === "home") {

        renderSongs(songs);

    }


    else if (view === "library") {

        renderSongs(songs);

    }


    else if (view === "favorites") {

        showFavorites();

    }

}


/* ================================
   HOME BUTTON
================================ */

homeButton.addEventListener(
    "click",
    function() {

        setActiveButton(homeButton);

        showView("home");

    }
);


/* ================================
   LIBRARY BUTTON
================================ */

libraryButton.addEventListener(
    "click",
    function() {

        setActiveButton(libraryButton);

        showView("library");

    }
);


/* ================================
   FAVORITES BUTTON
================================ */

favoritesButton.addEventListener(
    "click",
    function() {

        setActiveButton(
            favoritesButton
        );

        showView("favorites");

    }
);


/* ================================
   SEARCH NAVIGATION
================================ */

searchNavButton.addEventListener(
    "click",
    function() {

        setActiveButton(
            searchNavButton
        );

        searchInput.focus();

    }
);


/* ================================
   FETCH SONGS FROM BACKEND
================================ */

async function fetchSongs() {

    try {

        const response =
            await fetch("/viberoom/songs");


        if (!response.ok) {

            throw new Error(
                "Failed to fetch songs"
            );

        }


        songs =
            await response.json();


        console.log(
            "Songs loaded:",
            songs
        );


        if (songs.length > 0) {

            renderSongs();

            loadSong(
                songs[currentSongIndex]
            );

        }


    } catch (error) {

        console.error(
            "Error loading songs:",
            error
        );

    }

}


/* ================================
   START APPLICATION
================================ */

async function initializeApp() {

    await fetchFavorites();

    await fetchSongs();

}

initializeApp();