/*
 進入點
*/

var express=require('express');
var routes=require('./routes');
var app=express();

app.configure(function(){
      //運用jade為views engine
	app.set('views',__dirname+'/views');
	app.set('view engine','jade');
	app.use(app.router);
		});


app.get('/',function(req,res){
  res.send('hello world');
})

//取得歌曲
app.get('/getsong/:id',routes.getsong);

//取得歌曲
app.get('/getsongindb/:id',routes.getsongindb);

//儲存歌曲
app.get('/savesong/:filename',routes.savesong);

app.listen('3400');
