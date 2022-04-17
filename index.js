const express = require("express");
const fs = require("fs");
const path = require('path');
const app = express();
app.disable('x-powered-by');

const port = process.env.PORT || 8080;
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', express.static('public'));

function videoStream(req, res, videoPath) {
    const options = {};

    let start;
    let end;

    const range = req.headers.range;
    if (range) {
        const bytesPrefix = "bytes=";
        if (range.startsWith(bytesPrefix)) {
            const bytesRange = range.substring(bytesPrefix.length);
            const parts = bytesRange.split("-");
            if (parts.length === 2) {
                const rangeStart = parts[0] && parts[0].trim();
                if (rangeStart && rangeStart.length > 0) {
                    options.start = start = parseInt(rangeStart);
                }
                const rangeEnd = parts[1] && parts[1].trim();
                if (rangeEnd && rangeEnd.length > 0) {
                    options.end = end = parseInt(rangeEnd);
                }
            }
        }
    }

    res.setHeader("content-type", "video/mp4");

    fs.stat(videoPath, (err, stat) => {
        if (err) {
            console.error(`File stat error for ${videoPath}.`);
            console.error(err);
            res.sendStatus(500);
            return;
        }

        let contentLength = stat.size;

        if (req.method === "HEAD") {
            res.statusCode = 200;
            res.setHeader("accept-ranges", "bytes");
            res.setHeader("content-length", contentLength);
            res.end();
        } else {
            let retrievedLength;
            if (start !== undefined && end !== undefined) {
                retrievedLength = (end + 1) - start;
            } else if (start !== undefined) {
                retrievedLength = contentLength - start;
            } else if (end !== undefined) {
                retrievedLength = (end + 1);
            } else {
                retrievedLength = contentLength;
            }

            res.statusCode = start !== undefined || end !== undefined ? 206 : 200;

            res.setHeader("content-length", retrievedLength);

            if (range !== undefined) {
                res.setHeader("content-range", `bytes ${start || 0}-${end || (contentLength-1)}/${contentLength}`);
                res.setHeader("accept-ranges", "bytes");
            }

            const fileStream = fs.createReadStream(videoPath, options);
            fileStream.on("error", error => {
                console.log(`Error reading file ${videoPath}.`);
                console.log(error);
                res.sendStatus(500);
            });

            fileStream.pipe(res);
        }
    });
}

app.get('/getvideo', (req, res) => {
    var video = req.query.video;
    var quality = req.query.quality;
    var videoPath = rootVideoDirectory;
    videoPath += "/" + quality + "/" + video + h264Suffix;
    if (!getVideosQueryIsOK('/'+quality, video)) {
        console.log(quality," quality. No video on query or incorrect video: ", video);
        res.status(400).send('Query must have an existing video.');
        return;
    }
    videoStream(req, res, videoPath);
});

app.listen(port, () => {
    console.log(`Open your browser and navigate to http://localhost:${port}`)
});