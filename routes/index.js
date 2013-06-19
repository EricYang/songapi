var libpath = require('path'),
    mime = require('mime'),
    url=require('url'),
    fs = require("fs"),
    filename = "",
    dir_path = "mp3/",
    provider=require('../mongodbObj.js').mongodbObj;
var db=new provider('localhost',27017,'songdb','song');


exports.savesong=function(req,res){
console.log('req.params.filename:'+req.params.filename);
 db.saveInDb(dir_path+'C0100-C.mp3',req.params.id,{songname:req.params.filename,artistname:'周杰掄'}, function(error, obj) {
	 })
 res.end('save');
}
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

