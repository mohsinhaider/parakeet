let searchButton = document.getElementById('search-button');
let searchBar = document.getElementById('search-bar');
let resultTable = document.getElementById('result-table');
let videoPlayer = document.getElementById('video-player');

let currentTranscription = {};

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

                let currentVideoDayUploaded = dayOfWeekCodes[new Date(videosResponseObject[i].date).getDay()];
                let currentVideoDateArray = (videosResponseObject[i].date).split('-');
                let currentVideoProperDate = currentVideoDateArray[1] + '/' + currentVideoDateArray[2] + '/' + currentVideoDateArray[0].slice(2);
                
                let currentVideoDayAndDateDiv = document.createElement('div');
                currentVideoDayAndDateDiv.setAttribute('class', 'recording-upload-date');
                currentVideoDayAndDateDiv.innerHTML = currentVideoDayUploaded + ', ' + currentVideoProperDate;

                let currentVideoTitleDiv = document.createElement('div');
                currentVideoTitleDiv.setAttribute('class', 'recording-title');
                currentVideoTitleDiv.innerHTML = videosResponseObject[i].title;

                recordingCell.appendChild(currentVideoDayAndDateDiv);
                recordingCell.appendChild(currentVideoTitleDiv);
                
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
        let searchQuery = searchBar.value;

        if (searchQuery != '') {
            searchQuery = searchQuery.toLowerCase();
            let searchQueryArray = searchQuery.split(' ');
            let currentTranscriptionResults = currentTranscription.results;

            currentTranscriptionResults.forEach(transcriptionResult => {
                let currentTimestamp = transcriptionResult.timestamp;
                let currentResult = transcriptionResult.result;

                if (searchQueryArray.length > 1) {
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
            })
        }
    }
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
    
    recordingTableRowsArray.every(row => row.classList.remove('active'));
}

loadLectures();
processSearchQuery();