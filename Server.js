var formidable = require('formidable'),
    http = require('http'),
    fs = require('fs'),
    util = require('util');

const port = 80;

fs.readFile('./index.html' , function (err, html) {
    if(err){
        throw err;
    }
    console.log("html loaded - start Server listening to port: " + port);
    http.createServer(function(req, res) {
        if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
            // parse a file upload
            var form = new formidable.IncomingForm();
            form.uploadDir = __dirname + "/uploads";
            form.parse(req, function(err, fields, files) {
                res.writeHead(200, {'content-type': 'text/plain'});
                res.write('received upload:\n\n');
                res.end(util.inspect({fields: fields, files: files}));
                console.log("upload finished ");
                if(files && files.sampleFile && files.sampleFile.path && fields && fields.codeinput){
                    console.log(files.sampleFile.path + " " + fields.codeinput);
                    fs.rename(files.sampleFile.path, form.uploadDir + "/" + fields.codeinput + ".pdf" , function (err) {
                        if (err) throw err;
                        console.log('renamed complete');
                    });
                } else {
                    console.log("Error -> files.sampleFile or fields.codeinput not defined");
                }
                
            });
            form = null;
            return;
        } else if (req.url == '/download' && req.method.toLowerCase() == 'post') {
            // download a pdf file.
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files){
                res.writeHead(200, {'content-type': 'text/plain'})
            })

        }
        console.log("url = " + req.url);
        // show a file upload form
        res.writeHead(200, {'content-type': 'text/html'});
        res.write(html);
        res.end();

      }).listen(port);
});

