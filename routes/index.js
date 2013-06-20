/*
  routes進入點
*/
var libpath = require('path'),
    mime = require('mime'),
    url=require('url'),
    fs = require("fs"),
    filename = "",
    dir_path = "mp3/",
    provider=require('../mongodbObj.js').mongodbObj,
    Formidable = require('formidable');

var db=new provider('localhost',27017,'songdb','song');

//upload
exports.upload=function(req,res){
 res.render('upload', { title: '上傳影音'});
}

//測試本地存檔
exports.savesong=function(req,res){
console.log('req.params.filename:'+req.params.filename);
 db.saveInDb(dir_path+'C0100-C.mp3',req.params.id,{songname:req.params.filename,artistname:'周杰掄'}, function(error, obj) {
	 })
 res.end('save');
}

//取得在資料庫內的檔案
exports.getsongindb=function(req,res){
 db.readInDb(req.params.id, function(error, data) {
        //console.dir('get file:'+obj);
        //var type = mime.lookup(filename);
        res.writeHead(200, {
            "Content-Type": "audio/mpeg"
            });
        res.write(data, "binary");
        res.end();
        })
}

//func getsong
exports.getsong=function(req,res){
console.log('req.params.id:'+req.params.id);
    db.findBySongId(req.params.id, function(error, obj) {
 filename=dir_path+obj.path;
  console.log('filename:'+filename);
 })
//filename=getSongPath(req.params.id);
libpath.exists(filename, function (exists) {
	if (!exists) {
	res.writeHead(404, {
		"Content-Type": "text/plain"
		});
	res.write("404 Not Found\n");
	res.end();
	return;
	}
	fs.readFile(filename, "binary", function (err, file) {
		if (err) {
		res.writeHead(500, {
			"Content-Type": "text/plain"
			});
		res.write(err + "\n");
		res.end();
		return;
		}

		var type = mime.lookup(filename);
		res.writeHead(200, {
			"Content-Type": type
			});
		res.write(file, "binary");
		res.end();
		});
})
}

exports.upload_in_db=function(req,res){
    var store=db.saveInDbByUpload("testfile",{"songId":"9999","filename":"testfile"})
    store.open( function (error, store) {
            var form = new Formidable.IncomingForm();
            form.onPart = function (part) {
            if(!part.filename){
            form.handlePart(part);
            return;
            }

            part.on('data', function(buffer){
                store.write(buffer);
                });

            part.on('end', function() {
                store.close();
                });
            };
            form.parse(req);
            });

}

//存在server本地端/mp3
exports.upload_in_dir=function(req, res) {
    var form = new formidable.IncomingForm({
uploadDir: __dirname +'/mp3',  // don't forget the __dirname here
keepExtensions: true
});
// form.uploadDir = "./upload";
console.log(form.uploadDir);

form.parse(req, function(err, fields, files){
        if (err) return res.end('You found error');
        console.log(files.mp3);
        });

form.on('progress', function(bytesReceived, bytesExpected) {
        console.log(bytesReceived + ' ' + bytesExpected);
        });

form.on('error', function(err) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('error:\n\n'+util.inspect(err));
        });

// res.end('Done');
res.send("well done");

return;
}
