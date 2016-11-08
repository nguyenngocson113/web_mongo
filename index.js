var express = require('express')
var app = express()
var multer = require('multer')
app.set('view engine','ejs')
app.set('views','./views')
app.use(express.static('public'))
app.listen(3001,function(){
  console.log('connect thanh cong')
})
var bodyParser = require('body-parser')
var urlencodeParser = bodyParser.urlencoded({extended:false})
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/cookies')
var dbMongo = mongoose.connection;
dbMongo.on('error',console.error.bind(console,'connection error:'))
dbMongo.once('open',function(){
  console.log('MongoDb connect')
})


var Schema = new mongoose.Schema({
  type: String,
  banh: [{
    name: String,
    image: String,
    mota: String
  }]
})
var product = mongoose.model('sanpham', Schema)

var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./public/upload')
  },
  filename: function(req,file,cb){
    cb(false,file.originalname)
  }
})

var upload = multer({
  storage:storage,
}).single('file')


app.post('/product_types',urlencodeParser,function(req,res){
  upload(req,res,function(err) {
    if (err) {
      console.log(err);
      res.send('that bai')
    }else
    {
      var banht = {"name": req.body.ten, "image":req.file.originalname,"mota":req.body.mota};
      product.findOneAndUpdate({type: req.body.loai}, {$push: {banh: banht}},function(err,result){
        console.log(result)
      });
      res.render('test')
    }
  })
})

app.get('/product_types',function(req,res){
  res.render('test')
})



app.get('/',function(req,res){
  res.render('form')
})

app.get('/cupcakes',function(req,res){
  var mang = [];
  var mang1 = [];
  product.find({type:'cupcakes'},function(err,result){
    result.forEach(function(pd){
      mang = pd.banh;
    })

    console.log(mang[0])
    res.render('index',{mang})

  })
})
app.get('/cakes',function(req,res){
  var mang = [];
  product.find({type:'cakes'},function(err,result){
    result.forEach(function(pd){
      mang = pd.banh;
    })

    console.log(mang.length)
    console.log(mang)
    res.render('index',{mang})

  })
})
app.get('/macarons',function(req,res){
  var mang = [];
  product.find({type:'macarons'},function(err,result){

    result.forEach(function(pd){
      mang = pd.banh;
    })
    console.log(mang)
    res.render('index',{mang})

  })
})

app.get('/cookies',function(req,res){
  var mang = [];
  product.find({type:'cookies'},function(err,result){
    result.forEach(function(pd){
      mang = pd.banh;
    })
    res.render('index',{mang})
  })
})
