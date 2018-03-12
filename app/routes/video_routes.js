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

    app.post('/video/transcribe', (req, res) => {
        if (req.files) {
            var currentFile = req.files.lecturefile;

            var currentFileName = req.files.lecturefile.name;
            var videoTitle = req.body.videotitle;
            var videoSubject = req.body.videosubject;
            var videoCRN = req.body.videocrn;
            var videoDate = req.body.videodate;

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