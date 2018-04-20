let searchButton = document.getElementById('search-button');
let searchBar = document.getElementById('search-bar');
let resultTable = document.getElementById('result-table');
let videoPlayer = document.getElementById('video-player');

let currentTranscription = {};
let currentSelectedLecture;

let xmlHttp = new XMLHttpRequest();


let loadVideoOneCharts = () => {
    var data = [{
        x: ['product', 'brand management', 'scientist', 'customer management'],
        y: [20, 43, 13, 19],
        type: 'bar' 
    }];
      
    Plotly.newPlot('tester', data, {
        displayModeBar: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: {
            l: 60,
            r: 40,
            b: 30,
            t: 30,
            pad: 4
          }
      });

      TESTER = document.getElementById('tester2');

      Plotly.newPlot( TESTER, [{
          x: ['0:00', '0:01', '0:02', '0:03', '0:04', '0:05', '0:06', '0:07', '0:08', '0:09', '0:10', '0:11', '0:12', '0:13', '0:14', '0:15', '0:16', '0:17', '0:18', '0:19', '0:20', '0:21', '0:22', '0:23', '0:24', '0:25', '0:26', '0:27', '0:28', '0:29', '0:30', '0:31', '0:32', '0:33', '0:34', '0:35', '0:36', '0:37', '0:38', '0:39', '0:40', '0:41', '0:42', '0:43', '0:44', '0:45', '0:46', '0:47', '0:48', '0:49', '0:50', '0:51', '0:52', '0:53', '0:54', '0:55', '0:56', '0:57', '0:58', '0:59', '1:00', '1:01', '1:02', '1:03', '1:04', '1:05', '1:06', '1:07', '1:08', '1:09', '1:10', '1:11', '1:12', '1:13', '1:14', '1:15', '1:16', '1:17', '1:18', '1:19', '1:20', '1:21', '1:22', '1:23', '1:24', '1:25', '1:26', '1:27', '1:28', '1:29', '1:30', '1:31', '1:32', '1:33', '1:34', '1:35', '1:36', '1:37', '1:38', '1:39', '1:40', '1:41', '1:42', '1:43', '1:44', '1:45', '1:46', '1:47', '1:48', '1:49', '1:50', '1:51', '1:52', '1:53', '1:54', '1:55', '1:56', '1:57', '1:58', '1:59', '2:00', '2:01', '2:02', '2:03', '2:04', '2:05', '2:06', '2:07', '2:08', '2:09', '2:10', '2:11', '2:12', '2:13', '2:14', '2:15', '2:16', '2:17', '2:18', '2:19', '2:20', '2:21', '2:22', '2:23', '2:24', '2:25', '2:26', '2:27', '2:28', '2:29', '2:30', '2:31', '2:32', '2:33', '2:34', '2:35', '2:36', '2:37', '2:38', '2:39', '2:40', '2:41', '2:42', '2:43', '2:44', '2:45', '2:46', '2:47', '2:48', '2:49', '2:50', '2:51', '2:52', '2:53', '2:54', '2:55', '2:56', '2:57', '2:58', '2:59', '3:00', '3:01', '3:02', '3:03', '3:04', '3:05', '3:06', '3:07', '3:08', '3:09', '3:10', '3:11', '3:12', '3:13', '3:14', '3:15', '3:16', '3:17', '3:18', '3:19', '3:20', '3:21', '3:22', '3:23', '3:24', '3:25', '3:26', '3:27', '3:28', '3:29', '3:30', '3:31', '3:32', '3:33', '3:34', '3:35', '3:36', '3:37', '3:38', '3:39', '3:40', '3:41', '3:42', '3:43', '3:44', '3:45', '3:46', '3:47', '3:48', '3:49', '3:50', '3:51', '3:52', '3:53', '3:54', '3:55', '3:56', '3:57', '3:58', '3:59', '4:00', '4:01', '4:02', '4:03', '4:04', '4:05', '4:06', '4:07', '4:08', '4:09', '4:10', '4:11', '4:12', '4:13', '4:14', '4:15', '4:16', '4:17', '4:18', '4:19', '4:20', '4:21', '4:22', '4:23', '4:24', '4:25', '4:26', '4:27', '4:28', '4:29', '4:30', '4:31', '4:32', '4:33', '4:34', '4:35', '4:36', '4:37', '4:38', '4:39', '4:40', '4:41', '4:42', '4:43', '4:44', '4:45', '4:46', '4:47', '4:48', '4:49', '4:50', '4:51', '4:52', '4:53', '4:54', '4:55', '4:56', '4:57', '4:58', '4:59', '5:00', '5:01', '5:02', '5:03', '5:04', '5:05', '5:06', '5:07', '5:08', '5:09', '5:10', '5:11', '5:12', '5:13', '5:14', '5:15', '5:16', '5:17', '5:18', '5:19', '5:20', '5:21', '5:22', '5:23', '5:24', '5:25', '5:26', '5:27', '5:28', '5:29', '5:30', '5:31', '5:32', '5:33', '5:34', '5:35', '5:36', '5:37', '5:38', '5:39', '5:40', '5:41', '5:42', '5:43', '5:44', '5:45', '5:46', '5:47', '5:48', '5:49', '5:50', '5:51', '5:52', '5:53', '5:54', '5:55', '5:56', '5:57', '5:58', '5:59', '6:00', '6:01', '6:02', '6:03', '6:04', '6:05', '6:06', '6:07', '6:08', '6:09', '6:10', '6:11', '6:12', '6:13', '6:14'],
          y: [1, 0, 3, 2, 3, 3, 1, 3, 0, 2, 3, 0, 2, 1, 1, 2, 0, 3, 1, 1, 3, 0, 1, 2, 1, 3, 3, 2, 1, 0, 0, 2, 1, 3, 0, 0, 0, 3, 3, 0, 2, 3, 2, 2, 1, 1, 2, 1, 2, 3, 4, 5, 4, 4, 4, 4, 6, 6, 4, 4, 4, 5, 4, 3, 3, 4, 5, 3, 3, 4, 5, 5, 5, 4, 4, 6, 4, 3, 5, 4, 3, 3, 5, 6, 5, 3, 3, 4, 4, 4, 5, 4, 5, 6, 5, 5, 5, 4, 6, 6, 11, 9, 3, 4, 13, 12, 11, 4, 3, 6, 4, 5, 9, 6, 12, 6, 11, 9, 11, 6, 6, 8, 5, 4, 7, 13, 5, 6, 4, 5, 4, 10, 6, 6, 3, 5, 10, 3, 4, 9, 11, 4, 4, 8, 8, 10, 3, 8, 7, 8, 8, 6, 4, 7, 9, 7, 6, 5, 5, 9, 10, 5, 3, 11, 13, 13, 9, 13, 6, 10, 7, 3, 5, 5, 6, 12, 5, 11, 4, 9, 13, 12, 9, 12, 8, 9, 4, 3, 6, 7, 8, 6, 12, 4, 6, 4, 13, 8, 8, 11, 15, 16, 9, 7, 8, 15, 12, 17, 15, 8, 11, 17, 15, 7, 13, 14, 12, 7, 12, 11, 18, 11, 9, 15, 14, 13, 17, 14, 9, 18, 17, 13, 17, 10, 18, 17, 9, 10, 13, 8, 13, 17, 7, 12, 7, 18, 7, 13, 11, 12, 10, 18, 7, 17, 12, 16, 7, 18, 7, 11, 16, 11, 12, 7, 18, 14, 13, 11, 7, 18, 8, 18, 16, 16, 7, 8, 8, 8, 16, 15, 17, 17, 11, 10, 12, 11, 11, 12, 12, 14, 7, 13, 8, 11, 15, 7, 10, 12, 8, 13, 6, 5, 2, 7, 5, 6, 9, 9, 0, 3, 4, 6, 5, 6, 3, 6, 7, 6, 3, 3, 2, 0, 2, 7, 8, 0, 5, 4, 2, 6, 9, 7, 4, 7, 1, 5, 9, 5, 1, 9, 0, 8, 5, 1, 6, 9, 8, 0, 5, 4, 2, 5, 9, 7, 6, 6, 1, 6, 4, 7, 7, 6, 3, 1, 2, 5, 0, 0, 5, 4, 8, 2, 1, 7, 5, 5] }], { 
          xaxis: {
              title: 'Video Time',
              titlefont: {
                  family: 'Avenir',
                  size: 18,
                  color: '#7f7f7f'
              }
          },
          yaxis: {
              title: 'Bookmarks',
              titlefont: {
                  family: 'Avenir',
                  size: 18,
                  color: '#7f7f7f'
              }
          }, 
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)', 
          margin: {
              l: 60,
              r: 40,
              b: 80,
              t: 30,
              pad: 4
          } 
      });

}

let loadVideoTwoCharts = () => {
    var data = [{
        x: ['express', 'routes', 'model', 'developing'],
        y: [6, 3, 5, 2],
        type: 'bar' 
    }];
      
    Plotly.newPlot('tester', data, {
        displayModeBar: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: {
            l: 60,
            r: 40,
            b: 30,
            t: 30,
            pad: 4
          }
      });

      TESTER = document.getElementById('tester2');

      Plotly.newPlot( TESTER, [{
          x: ['0:00', '0:01', '0:02', '0:03', '0:04', '0:05', '0:06', '0:07', '0:08', '0:09', '0:10', '0:11', '0:12', '0:13', '0:14', '0:15', '0:16', '0:17', '0:18', '0:19'],
          y: [0, 1, 2, 3, 1, 6, 4, 12, 7, 6, 3, 1, 2, 5, 0, 0, 5, 4, 8] }], { 
          xaxis: {
              title: 'Video Time',
              titlefont: {
                  family: 'Avenir',
                  size: 18,
                  color: '#7f7f7f'
              }
          },
          yaxis: {
              title: 'Bookmarks',
              titlefont: {
                  family: 'Avenir',
                  size: 18,
                  color: '#7f7f7f'
              }
          }, 
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)', 
          margin: {
              l: 60,
              r: 40,
              b: 80,
              t: 30,
              pad: 4
          } 
      });
}

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
                    unhighlightCurrentRecordingRow();

                    row.classList.toggle('active');

                    let videoSource = document.createElement('source');
                    videoSource.setAttribute('src', '../lectures/' + videosResponseObject[index].src);
                    currentTranscription = videosResponseObject[index].transcription;

                    currentSelectedLecture = videosResponseObject[index].src;

                    let wordSearchDiv = document.getElementById('tester');
                    wordSearchDiv.innerHTML = '';

                    let bookmarkTrendsDiv = document.getElementById('tester2');
                    bookmarkTrendsDiv.innerHTML = '';

                    if (currentSelectedLecture === 'MK-387_04-19.mp4') {
                        loadVideoOneCharts();
                    } else if (currentSelectedLecture === 'ITM-421_03-01.mp4') {
                        loadVideoTwoCharts();
                        console.log('lol');
                    }

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

loadLectures();