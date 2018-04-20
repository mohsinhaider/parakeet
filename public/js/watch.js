let searchButton = document.getElementById('search-button');
let searchBar = document.getElementById('search-bar');
let resultTable = document.getElementById('result-table');
let videoPlayer = document.getElementById('video-player');

let currentTranscription = {};
let currentSelectedLecture;

let xmlHttp = new XMLHttpRequest();

function loadLectures() {
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let videosResponseObject = JSON.parse(xmlHttp.response);

            let resultTable = document.getElementById('result-table');
            let recordingsTable = document.getElementById('recording-table');

            let dayOfWeekCodes = {
                0: 'Sunday',
                1: 'Monday',
                2: 'Tuesday',
                3: 'Wednesday',
                4: 'Thursday',
                5: 'Friday',
                6: 'Saturday'
            };

            function bindRecordingRowClick(row, index) {
                row.onclick = function() {
                    clearSearchResultTable();
                    unhighlightCurrentRecordingRow();

                    row.classList.toggle('active');

                    let videoSource = document.createElement('source');
                    videoSource.setAttribute('src', '../lectures/' + videosResponseObject[index].src);
                    currentTranscription = videosResponseObject[index].transcription;

                    currentSelectedLecture = videosResponseObject[index].src;
                    loadBookmarks(currentSelectedLecture);

                    executeSearch(currentTranscription.results, true);

                    if (videoPlayer.childElementCount >= 1) {
                        videoPlayer.removeChild(videoPlayer.firstChild);
                    }

                    videoPlayer.appendChild(videoSource);
                    videoPlayer.load();
                }
            }

            for (let i = 0; i < videosResponseObject.length; i++) {
                let recordingRow = recordingsTable.insertRow();
                let recordingCell = recordingRow.insertCell();
                recordingRow.setAttribute('class', 'recording-row')
                recordingCell.setAttribute('class', 'recording-cell-content')
                recordingCell.setAttribute('onclick', 'changeColor(this)');

                let currentVideoDayUploaded = dayOfWeekCodes[new Date(videosResponseObject[i].date).getDay()];
                let currentVideoDateArray = (videosResponseObject[i].date).split('-');
                let currentVideoProperDate = currentVideoDateArray[1] + '/' + currentVideoDateArray[2] + '/' + currentVideoDateArray[0].slice(2);

                let currentVideoTitleDiv = document.createElement('div');
                currentVideoTitleDiv.setAttribute('class', 'recording-title');
                currentVideoTitleDiv.innerHTML = videosResponseObject[i].title;

                let currentVideoDayAndDateDiv = document.createElement('div');
                currentVideoDayAndDateDiv.setAttribute('class', 'recording-upload-date');
                currentVideoDayAndDateDiv.innerHTML = currentVideoDayUploaded + ', ' + currentVideoProperDate;

                recordingCell.appendChild(currentVideoTitleDiv);
                recordingCell.appendChild(currentVideoDayAndDateDiv);

                bindRecordingRowClick(recordingRow, i);
            }
        }
    }
    xmlHttp.open('GET', '/video', true);
    xmlHttp.send(null);
}

function processSearchQuery() {
    searchButton.onclick = function() {
        clearSearchResultTable();
        let currentTranscriptionResults = currentTranscription.results;
        let searchQuery = searchBar.value;

        if (searchQuery === '' || !searchQuery.replace(/\s/g, '').length) {
            executeSearch(currentTranscriptionResults, true);
        }
        else if (searchQuery != '') {
            searchQuery = searchQuery.toLowerCase();

            xmlHttp = new XMLHttpRequest();
            xmlHttp.open('POST', '/video/store/search', true);
            xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            let requestParams = 'query=' + searchQuery + '&video=' + currentSelectedLecture;

            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    console.log(xmlHttp.responseText);
                }
            }
            xmlHttp.send(requestParams);

            let searchQueryArray = searchQuery.split(' ');
            executeSearch(currentTranscriptionResults, false, searchQuery, searchQueryArray);
        }
    }
}

function executeSearch(currentTranscriptionResults, isDisplay, searchQuery = '', searchQueryArray = []) {
    currentTranscriptionResults.forEach(transcriptionResult => {
        let currentTimestamp = transcriptionResult.timestamp;
        let currentResult = transcriptionResult.result;

        if (isDisplay) {
            loadSearchResults(currentTimestamp, currentResult);
        }
        else if (searchQueryArray.length > 1) {
            if (currentResult.includes(searchQuery)) {
                loadSearchResults(currentTimestamp, currentResult);
            }
        }
        else {
            let currentResultArray = currentResult.split(' ');

            for (let j = 0; j < currentResultArray.length; j++) {
                if (searchQuery === currentResultArray[j]) {
                    loadSearchResults(currentTimestamp, currentResult);
                    break;
                }
            }
        }
    });
}

function loadSearchResults(currentTimestamp, currentResult) {
    let resultRow = resultTable.insertRow();

    let resultTimestampCell = resultRow.insertCell();
    resultTimestampCell.setAttribute('valign', 'top');

    let resultContentCell = resultRow.insertCell();

    let timestampTotalSeconds = Math.floor(currentTimestamp / 1000)
    let finalTimestamp = formatTime(timestampTotalSeconds);
    let finalTimestampLinkWrapped = document.createElement('a');
    finalTimestampLinkWrapped.setAttribute('href', '#');
    finalTimestampLinkWrapped.innerHTML = finalTimestamp;

    finalTimestampLinkWrapped.onclick = function() {
        videoPlayer.currentTime = timestampTotalSeconds;
        videoPlayer.play();
    }

    resultTimestampCell.appendChild(finalTimestampLinkWrapped);
    resultContentCell.innerHTML = currentResult;
}

let formatTime = (secondsTime) => {
    let seconds = secondsTime % 60;
    let minutes = Math.floor((secondsTime % 3600) / 60);
    let hours = Math.floor(secondsTime / 3600);

    let finalTimestamp = '';

    if (hours > 0) {
        finalTimestamp = '' + hours + ':' + (minutes < 10 ? '0' : '');
    }

    finalTimestamp += '' + minutes + ':' + (seconds < 10 ? '0' : '');
    finalTimestamp += '' + seconds;

    return finalTimestamp;
}

let clearSearchResultTable = () => {
    let currentResultTableBody = document.getElementById('result-table-body');
    let clearedResultTableBody = document.createElement('tbody');

    clearedResultTableBody.setAttribute('id', 'result-table-body');
    currentResultTableBody.parentNode.replaceChild(clearedResultTableBody, currentResultTableBody);
}

let unhighlightCurrentRecordingRow = () => {
    let recordingTableRows = document.getElementsByClassName('recording-row');
    let recordingTableRowsArray = Array.prototype.slice.call(recordingTableRows);

    for (let index = 0; index < recordingTableRows.length; index++) {
        recordingTableRows[index].classList.remove('active');

    }
}

let changeColor = (recordingCellContent) => {
    var recordingCells = document.getElementsByClassName('recording-cell-content');
    for (let i = 0; i < recordingCells.length; i++) {
        recordingCells[i].style.color = "#2E4E64";
    }
    recordingCellContent.style.color = (recordingCellContent.style.color === 'white') ? ('#2E4E64') : ('white');
}

let sendTimestamp = () => {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', '/video/store/bookmark', true);
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    let requestParams = 'time=' + videoPlayer.currentTime + '&video=' + currentSelectedLecture;

    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            console.log(xmlHttp.responseText);
        }
    }
    xmlHttp.send(requestParams);
}

let loadBookmarks = (currentSelectedLecture) => {
    let newxmlHttp = new XMLHttpRequest();

    newxmlHttp.onreadystatechange = () => {
        if (newxmlHttp.readyState == 4 && newxmlHttp.status == 200) {
            let bookmarksResponseObject = JSON.parse(newxmlHttp.response);
            let currentBookmarks = bookmarksResponseObject[0].bookmarks;

            let bookmarkTable = document.getElementById('bookmark-table-body');
            bookmarkTable.innerHTML = "";

            for (let i = 0; i < currentBookmarks.length; i++) {
                let bookmarkRow = bookmarkTable.insertRow();
                let bookmarkCell = bookmarkRow.insertCell();

                let formattedBookmarkTime = formatTime(currentBookmarks[i]).split('.');

                let bookmarkTimestampLinkWrapped = document.createElement('a');
                bookmarkTimestampLinkWrapped.setAttribute('href', '#');
                bookmarkTimestampLinkWrapped.innerHTML = formattedBookmarkTime[0];

                bookmarkTimestampLinkWrapped.onclick = function() {
                    videoPlayer.currentTime = currentBookmarks[i];
                    videoPlayer.play();
                }
                bookmarkCell.appendChild(bookmarkTimestampLinkWrapped);
            }
        }
    }
    newxmlHttp.open('GET', '/video/store/bookmark/' + currentSelectedLecture, true);
    newxmlHttp.send(null);
}

// Video
var video = document.getElementById("video-player");

// Buttons
var playButton = document.getElementById("play-button");
var muteButton = document.getElementById("mute");
var fullScreenButton = document.getElementById("full-screen");
var bookmarkButton = document.getElementById("bookmark-button");

// Sliders
var seekBar = document.getElementById("seek-bar");
var volumeBar = document.getElementById("volume-bar");

var playPause = function() {
    if (video.paused == true) {
        // Play the video
        video.play();

        // Update the button text to 'Pause'
        playButton.classList.remove("fa-play");
        playButton.classList.add("fa-pause");
        } else {
        // Pause the video
        video.pause();

        // Update the button text to 'Play'
        playButton.classList.remove("fa-pause");
        playButton.classList.add("fa-play");
    }
}

var mute = function() {
    if (video.muted == false) {
        // Mute the video
        video.muted = true;
  
        // Update the button text
        muteButton.classList.remove('fa-volume-up');
        muteButton.classList.add('fa-volume-off');
      } else {
        // Unmute the video
        video.muted = false;
  
        // Update the button text
        muteButton.classList.remove('fa-volume-off');
        muteButton.classList.add('fa-volume-up');
      }
}

var fullscreen = function() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen(); // Firefox
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen(); // Chrome and Safari
    }
}

loadLectures();
processSearchQuery();

window.onload = function() {

  // Update video when seekbar changes
  seekBar.addEventListener("change", function() {
    // Calculate the new time
    var time = video.duration * (seekBar.value / 100);

    // Update the video time
    video.currentTime = time;
  });

  // Update seekbar with video
  video.addEventListener("timeupdate", function() {
    // Calculate the slider value
    var value = (100 / video.duration) * video.currentTime;

    // Update the slider value
    seekBar.value = value;
  });

  // Pause the video when the slider handle is being dragged
  seekBar.addEventListener("mousedown", function() {
    video.pause();
  });

  // Play the video when the slider handle is dropped
  seekBar.addEventListener("mouseup", function() {
    video.play();
  });

  // Event listener for the volume bar
  volumeBar.addEventListener("change", function() {
    // Update the video volume
    video.volume = volumeBar.value;
  });
}








// Hello
