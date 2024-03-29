//import modules
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//mongoose.connect(process.env.MONGO_DB);

//connect database
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


//model setting
var postSchema = mongoose.Schema({
    title: {type:String, required:true},
    body: {type:String,  required:true},
    createdAt: {type:Date,default:Date.now},
    updatedAt: Data
});

var Post = mongoose.model('post',postSchema);


//view setting
app.set("view engine", 'ejs');


//set middlewares
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());


//set routes
app.get('/posts',  function(req,res){
    Post.find({},function (err, posts){
        if(err) return res.json({success: false, message: err});
        res.json({success:true , data:posts});
    });
});

//index
app.post('/posts', function(req, res){
    Post.create(req.body.post, function(err, post){
        if(err) return res.json({success: false , message:err});
        res.json({success: true, data:post});
    });
}); //create


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




//start server
app.listen(3000, function(){
    console.log('Server on');
});