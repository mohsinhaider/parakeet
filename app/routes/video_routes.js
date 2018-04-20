const fs = require('fs');

module.exports = function(app, db) {
    app.get('/video', (req, res) => {
        db.collection('videos').find({}).toArray((err, items) => {
            res.send(items);
        });
    });

    app.post('/video', (req, res) => {
        const details = {
            "videoURL": req.body.videoURL
        };
        db.collection('videos').insertOne(details, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occured.' });
            }
            else {
                res.send(result.ops[0]);
            }
        });
    });

    app.post('/video/store/search', (req, res) => {
        let videoFileName = req.body.video;
        let searchQuery = req.body.query;
        let searchArray;

        db.collection('searches').findOne({ 'src': videoFileName }, (err, document) => {
            searchArray = document.searches;
            searchArray.push(searchQuery);
            db.collection('searches').updateOne(
                { src: videoFileName },
                { $set: { searches: searchArray } }, (err, document) => {
                    if (err) { res.send({ 'error': 'An error has occured updating a searches document for this video.' }); }
                })
        });
    });

    app.get('/video/store/bookmark/:src', (req, res) => {
        db.collection('bookmarks').find({ src: req.params.src }).toArray((err, items) => {
            res.send(items);
        });
    });

    app.post('/video/store/bookmark', (req, res) => {
        let videoFileName = req.body.video;
        let bookmarkedTime = req.body.time;
        let bookmarkArray;

        db.collection('bookmarks').findOne({ 'src': videoFileName }, (err, document) => {
            bookmarkArray = document.bookmarks;
            bookmarkArray.push(bookmarkedTime);
            db.collection('bookmarks').updateOne(
                { src: videoFileName },
                { $set: { bookmarks: bookmarkArray } }, (err, document) => {
                    if (err) { res.send({ 'error': 'An error has occured updating a searches document for this video.' }); }
                })
        });
    });

    app.post('/video/transcribe', (req, res) => {
        if (req.files) {
            var currentFile = req.files.lecturefile;

            var currentFileName = req.files.lecturefile.name;
            var videoTitle = req.body.videotitle;
            var videoSubject = req.body.videosubject;
            var videoCRN = req.body.videocrn;
            var videoDate = req.body.videodate;

            db.collection('searches').insertOne({ src: currentFileName, searches: [] }, (err, document) => {
                if (err) { res.send({ 'error': 'An error has occured creating a searches document for this video.' }); }
            });

            const details = {
                'src': currentFileName,
                'title': videoTitle,
                'subject': videoSubject,
                'code': videoCRN,
                'date': videoDate
            };

            db.collection('videos').insertOne(details, (err, result) => {
                if (err) { res.send({ 'error': 'An error has occured.' }); }
            });

            var buffer = currentFile.data;

            fs.writeFile("public/lectures/" + currentFileName, buffer, (err) => {
                if (err) { res.send(err); }
            });

            // **** CREATE TRANSCRIPTION ****

            const { exec } = require('child_process');
            var currentAbsoluteFileName = currentFileName.slice(0, -4);

            exec('ffmpeg -i ' + __dirname + '/../../public/lectures/' + currentFileName + ' ' + __dirname + '/../../public/audio/' + currentAbsoluteFileName + '.mp3', (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                }

                exec('ffmpeg -i ' + __dirname + '/../../public/audio/' + currentAbsoluteFileName + '.mp3' + ' -acodec pcm_s16le -ac 1 -ar 16000 ' + __dirname + '/../../public/audio/' + currentAbsoluteFileName + '.wav', (err, stdout, stderr) => {
                    if (err) {
                        console.log(err);
                    }

                    console.log("Reached speech model execution...");

                    var process = exec('java -jar ' + __dirname + '/../../public/speech-model/jar/sphinx-test-0.0.1-SNAPSHOT-jar-with-dependencies.jar ' + __dirname + '/../../public/audio/' + currentAbsoluteFileName + '.wav ' + currentAbsoluteFileName, (err, stdout, stderr) => {
                        if (err) {
                            console.log(err);
                        }

                        var transcriptionBuffer = fs.readFileSync(__dirname + '/../../public/transcriptions/' + currentAbsoluteFileName + '.json');
                        var transcriptionJSON = JSON.parse(transcriptionBuffer);
                        
                        db.collection('videos').update(
                            { 'src': currentFileName },
                            { $set: { 'transcription': transcriptionJSON } }
                        );

                    });
                });
            });
        }
    });
};