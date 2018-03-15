var xmlHttp = new XMLHttpRequest();

var searchButton = document.getElementById('search-button');
var searchBar = document.getElementById('search-bar');
var resultTable = document.getElementById('result-table');
var videoPlayer = document.getElementById('video-player');

var currentTranscription = {};

xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var videosResponseObject = JSON.parse(xmlHttp.response);
        var resultTable = document.getElementById('result-table');
        var recordingsTable = document.getElementById('recording-table');

        var dayOfWeekCodes = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" };
        
        function bindRecordingRowClick(row, index) {
            row.onclick = function() {
                clearSearchResultTable();
                unhighlightCurrentRecordingRow();

                row.classList.toggle('active');

                var videoSource = document.createElement('source');
                videoSource.setAttribute('src', '../lectures/' + videosResponseObject[index].src);
                currentTranscription = videosResponseObject[index].transcription;

                if (videoPlayer.childElementCount >= 1) {
                    videoPlayer.removeChild(videoPlayer.firstChild);
                } 

                videoPlayer.appendChild(videoSource);
                videoPlayer.load();
            }
        }

        for (var i = 0; i < videosResponseObject.length; i++) {
            var currentIndex = i;
            var recordingRow = recordingsTable.insertRow();
            var recordingCell = recordingRow.insertCell();
            recordingRow.setAttribute('class', 'recording-row')

            var currentVideoDayUploaded = dayOfWeekCodes[new Date(videosResponseObject[i].date).getDay()];
            var currentVideoDateArray = (videosResponseObject[i].date).split("-");
            var currentVideoProperDate = currentVideoDateArray[1] + "/" + currentVideoDateArray[2] + "/" + currentVideoDateArray[0].slice(2);
            
            var currentVideoDayAndDateDiv = document.createElement('div');
            currentVideoDayAndDateDiv.setAttribute('class', 'recording-upload-date');
            currentVideoDayAndDateDiv.innerHTML = currentVideoDayUploaded + ", " + currentVideoProperDate;

            var currentVideoTitleDiv = document.createElement('div');
            currentVideoTitleDiv.setAttribute('class', 'recording-title');
            currentVideoTitleDiv.innerHTML = videosResponseObject[i].title;

            recordingCell.appendChild(currentVideoDayAndDateDiv);
            recordingCell.appendChild(currentVideoTitleDiv);
            
            bindRecordingRowClick(recordingRow, i);
        }
    }
}

xmlHttp.open("GET", "/video", true);
xmlHttp.send(null);

searchButton.onclick = function() {
    clearSearchResultTable();
    var searchQuery = searchBar.value;

    if (searchQuery != "") {
        searchQuery = searchQuery.toLowerCase();
        var searchQueryArray = searchQuery.split(" ");
        var currentTranscriptionResults = currentTranscription.results;

        for (var key in currentTranscriptionResults) {
            var currentTimestamp = currentTranscriptionResults[key].timestamp;
            var currentResult = currentTranscriptionResults[key].result;

            if (searchQueryArray.length > 1) {
                if (currentResult.includes(searchQuery)) {
                    loadSearchResults(currentTimestamp, currentResult);
                }
            }
            else {
                var currentResultArray = currentResult.split(' ');

                for (var j = 0; j < currentResultArray.length; j++) {
                    if (searchQuery === currentResultArray[j]) {
                        loadSearchResults(currentTimestamp, currentResult);
                        break;
                    }
                }
            }   
        }
    }
}

function loadSearchResults(currentTimestamp, currentResult) {
    var resultRow = resultTable.insertRow();

    var resultTimestampCell = resultRow.insertCell();
    resultTimestampCell.setAttribute('valign', 'top');

    var resultContentCell = resultRow.insertCell();

    var timestampTotalSeconds = Math.floor(currentTimestamp / 1000)
    var finalTimestamp = formatTime(timestampTotalSeconds);
    var finalTimestampLinkWrapped = document.createElement('a');
    finalTimestampLinkWrapped.setAttribute('href', '#');
    finalTimestampLinkWrapped.innerHTML = finalTimestamp;

    finalTimestampLinkWrapped.onclick = function() {
        videoPlayer.currentTime = timestampTotalSeconds;
        videoPlayer.play();
    }

    resultTimestampCell.appendChild(finalTimestampLinkWrapped);
    resultContentCell.innerHTML = currentResult;
}

function bindTimestampRowClick() {

}

function formatTime(secondsTime) {
    var seconds = secondsTime % 60;
    var minutes = Math.floor((secondsTime % 3600) / 60);
    var hours = Math.floor(secondsTime / 3600);

    var finalTimestamp = "";

    if (hours > 0) {
        finalTimestamp += "" + hours + ":" + (minutes < 10 ? "0" : "");
    }

    finalTimestamp += "" + minutes + ":" + (seconds < 10 ? "0" : "");
    finalTimestamp += "" + seconds;

    return finalTimestamp;
}

function clearSearchResultTable() {
    var currentResultTableBody = document.getElementById('result-table-body');
    var clearedResultTableBody = document.createElement('tbody');
    clearedResultTableBody.setAttribute('id', 'result-table-body');
    currentResultTableBody.parentNode.replaceChild(clearedResultTableBody, currentResultTableBody);
}

function unhighlightCurrentRecordingRow() {
    var recordingTableRows = document.getElementsByClassName('recording-row');
    for (let index = 0; index < recordingTableRows.length; index++) {
        recordingTableRows[index].classList.remove('active');
    }
}