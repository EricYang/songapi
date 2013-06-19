/*
DB class
*/
var mongo= require('mongodb');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var _collection_name='';
//建構子
mongodbObj = function(host, port, db_name, collection_name ) {
	this.db= new Db(db_name, new Server(host, port, {auto_reconnect: true}, {}));
	this.db.open(function(){});
	_collection_name=collection_name;
};

//獲取collection
mongodbObj.prototype.getCollection= function(callback) {
	this.db.collection(_collection_name, function(error, the_collection) {
			if( error ) callback(error);
			else callback(null, the_collection);
			});
};
//查全部
mongodbObj.prototype.findAll = function(callback) {
	this.getCollection(function(error, the_collection) {
			if( error ) callback(error)
			else {
			the_collection.find().toArray(function(error, results) {
				if( error ) callback(error)
				else callback(null, results)
				});
			}
			});
};
//查詢by SongId
mongodbObj.prototype.findBySongId = function(id, callback) {
	this.getCollection(function(error, the_collection) {
			if( error ) callback(error)
			else {
			the_collection.findOne({songId:id}, function(error, result) {
				if( error ) callback(error)
				else callback(null, result)
                console.dir(result);
				});
			}
			});
};
//查詢by Id
mongodbObj.prototype.findById = function(id, callback) {
	this.getCollection(function(error, the_collection) {
			if( error ) callback(error)
			else {
			the_collection.findOne({_id: the_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
				if( error ) callback(error)
				else callback(null, result)
				});
			}
			});
};
//儲存
mongodbObj.prototype.save = function(Obj, callback) {
	this.getCollection(function(error, the_collection) {
			if( error ) callback(error)
			else {
			if( typeof(Obj.length)=="undefined")
			Obj = [Obj];

			for( var i =0;i< Obj.length;i++ ) {
			obj = Obj[i];
			obj.created_at = new Date();
			}

			the_collection.insert(Obj,{safe: true}, function() {
				//callback(null, Obj);
				});
			}
			});
};
// 寫入資料庫
mongodbObj.prototype.saveInDb = function(filePath,fileName,matedata,callback) {
 
    var fileId=new mongo.ObjectID();	
    var gridStore = new mongo.GridStore(this.db, fileId, fileName,"w", {root: _collection_name});
	gridStore.metadata=matedata;
	gridStore.writeFile(filePath, function(err, fileInfo) {
      if(err) callback(err)
          console.log(fileInfo);
			});
}
var BSON = require('mongodb').BSONPure;

//讀取資料庫
mongodbObj.prototype.readInDb = function(fileId,callback) {
   var obj_id = BSON.ObjectID.createFromHexString(fileId);
   console.dir(obj_id);
   var gridFs = new mongo.Grid(this.db, 'song');
    gridFs.get(obj_id, function(error, data) {
            if( error ) callback(error)
                 else callback(null, data)
            });
}
exports.mongodbObj = mongodbObj;

