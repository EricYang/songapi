/*
   進入點
*/

var express=require('express');
var routes=require('./routes');
var format=require('util').format;
var app=express();


app.configure(function(){
      //運用jade為views engine
	app.set('views',__dirname+'/views');
	app.set('view engine','jade');
	app.use(app.router);
    app.use(express.bodyParser({
              keepExtensions: true
                  }));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.multipart());
		});


//上傳歌曲
app.get('/upload',routes.upload); 
app.post('/upload',routes.upload_in_db);

//取得歌曲
app.get('/getsong/:id',routes.getsong);

//取得歌曲
app.get('/getsongindb/:id',routes.getsongindb);

//儲存歌曲
app.get('/savesong/:filename',routes.savesong);


app.listen('3400');
