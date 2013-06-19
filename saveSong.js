var fs=require('fs'),
filename = "file.jason",
encode = "utf8";
dir_path = "mp3/",
    provider=require('./mongodbObj.js').mongodbObj;
    var db=new provider('localhost',27017,'songdb','song');
fs.readFile(filename, encode, function(err, data) {
        if (err) {
        console.log('Error: ' + err);
        return;
        }

        data = JSON.parse(data);
        var a=data.song;

        count(a);

        });

function count(ary){
 for(var i=0;i<ary.length;i++){
    console.dir(ary[i].fileName);
    db.saveInDb(ary[i].path,ary[i].fileName,ary[i],function(err,obj){
    if(err)console.log('Error: ' + err);
    });
 }
}

                                
