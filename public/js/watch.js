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
        
        function bindRecordingRowClick(row, index) {
            row.onclick = function() {
                clearSearchResultTable();

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

            recordingCell.innerHTML = videosResponseObject[i].date.slice(5) + ": " + videosResponseObject[i].title;
            
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