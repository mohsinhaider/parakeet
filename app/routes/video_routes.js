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

                // const { exec } = require('child_process');

                // Node child process exec mp4 -> mp3

                // exec('ffmpeg -i ../../lecture.mp4 ../../newlec.mp3', (err, stdout, stderr) => {
                //     if (err) {
                //         console.log("Error occured in node child proc exec");
                //         res.send(err);
                //         return;
                //     }
                //     console.log(`stdout: ${stdout}`);
                //     console.log(`stderr: ${stderr}`);
                // });

                // exec('ffmpeg -i ../../newlec.mp3 -acodec pcm_s16le -ac 1 -ar 16000 ../../newout.wav', (err, stdout, stderr) => {
                //     if (err) {
                //         console.log("Error occured in node child proc exec");
                //         res.send(err);
                //         return;
                //     }
                //     console.log(`stdout: ${stdout}`);
                //     console.log(`stderr: ${stderr}`);
                // });

            });

            
        }
    });
};