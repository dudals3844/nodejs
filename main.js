var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

//mongoose.connect(process.env.MONGO_DB);

mongoose.connect("mongodb+srv://dudals3844:dudals34273844@cluster0-ie0jk.mongodb.net/test?retryWrites=true&w=majority");

var db = mongoose.connection;
db.once("open", function(){
    console.log("DB connected");
});
db.on("error",function(err){
    console.log("DB Error: ", err);
});

var dataSchema = mongoose.Schema({
    name:String,
    count:Number
});

var Data = mongoose.model('data',dataSchema);
Data.findOne({name:"myData"}, function(err,data){
    if(err) return console.log("Data ERROR:",err);
    if(!data){
        Data.create({name:"myData",count:0}, function (err,data){
            if(err) return console.log("Data ERROR:",err);
            console.log("Counter initialized: ",data);
        });
    }
});






app.set("view engine", 'ejs');
app.use(express.static(__dirname+'/public'));

//var data = {count:0};
app.get('/', function(req, res){
    //https://m.blog.naver.com/azure0777/220488363644
    Data.findOne({name:"myData"}, function(err , data){
        if(err) return console.log("Data ERROR:",err);
        data.count++;
        data.save(function (err){
            if(err) return console.log("Data ERROR:", err);
            res.render('my_first_ejs',data);
        });
    });
   
});

app.get('/reset',function(req,res){
    data.count = 0;
    res.render('my_first_ejs',data);
  
});
app.get('/set/count', function(req,res){
    if(req.query.count) data.count=req.query.count;
    res.render('my_first_ejs',data);
    
});
app.get('/set/:num', function (req,res){
    data.count = req.params.num;
    res.render('my_first_ejs',data);
    
});





app.listen(3000, function(){
    console.log('Server on');
});