var xmlHttp = new XMLHttpRequest();

xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var videosResponseObject = JSON.parse(xmlHttp.response);
        var videoPlayer = document.getElementById('video-player');
        var recordingsTable = document.getElementById('recording-table');

        for (var i = 0; i < videosResponseObject.length; i++) {
            var currentIndex = i;
            var recordingRow = recordingsTable.insertRow();
            var recordingCell = recordingRow.insertCell();

            recordingCell.innerHTML = videosResponseObject[i].date.slice(5) + ": " + videosResponseObject[i].title;

            recordingRow.onclick = function() {
                var videoSource = document.createElement('source');
                videoSource.setAttribute('src', '../lectures/' + videosResponseObject[currentIndex].src);
                if (videoPlayer.childElementCount >= 1) {
                    videoPlayer.removeChild(videoPlayer.firstChild);
                } 
                videoPlayer.appendChild(videoSource);
            }
        }
    }
}

xmlHttp.open("GET", "/video", true);
xmlHttp.send(null);