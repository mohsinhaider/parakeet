const fs = require('fs');

module.exports = function(app, db) {
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
        // receive mp4
        // use fs to write bytestream into file
        console.log("Reached route /video/transcribe!");
        if (req.files) {
            var currentFile = req.files.lecturefile;
            var buffer = currentFile.data;

            fs.writeFile("lecture.mp4", buffer, (err) => {
                if (err) {
                    console.log("ERROR");
                    res.send(err);
                }
                else {
                    console.log("File created");
                }

                const { exec } = require('child_process');

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

            // Sphinx
            // Database
        }
    });
};