var formidable = require('formidable'),
    http = require('http'),
    fs = require('fs'),
    util = require('util');
const port = 8012;
const uploadsPath = __dirname + "/uploads";

// if Uploads folder does not exist -> create it.
fs.exists(uploadsPath, function(exists){
    if (!exists) {
        fs.mkdirSync(uploadsPath);
     }
});

// read Index html and start server
fs.readFile('./index.html' , function (err, html) {
    if(err){
        throw err;
    }
    console.log("html loaded - start Server listening to port: " + port);
    http.createServer(function(req, res) {
        if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
            // parse a file upload
            var form = new formidable.IncomingForm();
            form.uploadDir = uploadsPath;
            form.parse(req, function(err, fields, files) {
                res.writeHead(200, {'content-type': 'text/plain'});
                res.write('received upload:\n\n');
                res.end("upload finished"); // util.inspect({fields: fields, files: files})
                // rename File to the codeinput value
                if(files && files.sampleFile && files.sampleFile.path && fields && fields.codeinput){
                    console.log(files.sampleFile.path + " " + fields.codeinput);
                    fs.rename(files.sampleFile.path, form.uploadDir + "/" + fields.codeinput + ".pdf" , function (err) {
                        if (err) {
                            console.log("Error at renaming file" + err);
                        };
                        console.log('renamed complete');
                    });
                } else {
                    console.log("Error -> files.sampleFile or fields.codeinput not defined");
                }
            });
            return;

        // download a pdf file.    
        } else if (req.url == '/download' && req.method.toLowerCase() == 'post') {
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files){
                if (fields && fields.codeinput){
                    var filePath = uploadsPath + fields.codeinput + ".pdf";
                    fs.exists(filePath, function(exists){
                        if (exists) {   
                            var pdfFileStat = fs.statSync(filePath);
                            res.writeHead(200, {
                                'Content-Type': 'application/pdf',
                                'Content-Length': pdfFileStat.size
                            });
                            var readStream = fs.createReadStream(filePath);
                            // We replaced all the event handlers with a simple call to readStream.pipe()
                            readStream.pipe(res);
                            readStream.on("finish" , () => {
                                console.log('All writes are now complete - deleting old PDF file now.');
                                fs.unlink(filePath, (err) => {
                                    if (err) {
                                      console.error(err)
                                      return
                                    }
                                });                                  
                            });
                        } else {
                            res.writeHead(400, {"Content-Type": "text/plain"});
                            res.end("ERROR File does not exist");
                        }
                    });
                }
            })
            return;
        }
        console.log("url = " + req.url);
        // show a file upload form
        res.writeHead(200, {'content-type': 'text/html'});
        res.write(html);
        res.end();

      }).listen(port);
});

