const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const port = 80;

// default options
app.use(fileUpload());

app.post('/upload', function(req, res) {
    
    console.log("upload endpoint");
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log("sending reg:");
    console.log(Object.keys(req));
    console.log("req = " + req.body);
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.body.sampleFile;
    let TargetFileName = req.body.codeinput + ".pdf";
    console.log("samplefile = " + sampleFile);
    console.log("codeinput  = " + TargetFileName);

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('uploads/' + TargetFileName , function(err) {
        if (err){
            console.log("Error: " + err);
            return res.status(500).send(err);
        }
        res.send('File uploaded!');
    });
});

app.get('/presentationfile', function (req, res) {
    res.sendFile( __dirname + "/" + "index.htm" );
 })

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
});