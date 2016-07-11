var express = require('express');
var path = require('path'); 
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var multer = require('multer');

var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var sign = require('./routes/sign');
var logout = require('./routes/logout');
var admin = require('./routes/admin/admin');
var taskCircle = require('./routes/taskCircle');
var searchTaskName = require('./routes/searchTaskName');
var myPage = require('./routes/myPage');
var aboutUs = require('./routes/aboutUs');
var userAdvice = require('./routes/userAdvice');
// 注意，先要运行multer，后运行upload.js。否则报错
 // 上传的东西，先暂存到此文件夹
 module.exports.uploadFunc = multer({ dest: './public/tmp_uploads/' });
 // module.exports.uploadFunc = multer({ dest: './routes' });
// 处理上传块
var upload = require('./routes/upload');
// 此处有不同之处
var chatRoom = require('./routes/chatRoom').chatRoom;
var taskCircleDeal = require('./routes/taskCircleDeal');
// 处理首页deal
var indexDeal = require('./routes/indexDeal');
var adminDeal = require('./routes/admin/adminDeal');

var app = express();

global.dbHandel = require('./database/dbHandel');
global.db = mongoose.connect("mongodb://localhost:27017/tmsdb");

var tempSessions = session({ 
  secret: 'secret',
  cookie:{ 
    maxAge: 1000*60*60*24*7
  },
  resave: true, 
  saveUninitialized: true
});
app.use(tempSessions);

// view engine setup
// /Users/shaoqianfei/Desktop/TMS/todoist-express/views
// 设置app配置的视图文件目录
app.set('views', path.join(__dirname, 'views'));
// 设置app配置的引擎
app.set("view engine","ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//使用cookieParser()中间件
app.use(cookieParser());
// 开启静态文件服务
app.use(express.static(path.join(__dirname, 'public')));


// app.use(function(req,res,next){ 
//   res.locals.user = req.session.user;
//   var err = req.session.error;
//   // 删除这个属性
//   delete req.session.error;
//   res.locals.message = "";
//   if(err){ 
//     res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
//   }
//   next();
// });


app.use('/', index);
app.use('/login.html', login);
app.use('/register.html', register);
app.use('/sign.html', sign);
app.use('/userLogout.html', logout);
app.use('/taskCircle.html', taskCircle);
app.use('/searchTaskName.html', searchTaskName);
app.use('/myPage.html', myPage);
app.use('/aboutUs.html', aboutUs);
app.use('/userAdvice', userAdvice);
app.use('/chatRoom.html', chatRoom);
app.use('/indexDeal', indexDeal);
app.use('/taskCircleDeal', taskCircleDeal);
// 上传块
app.use('/upload', upload);
// 只要是/admin路径的，就去admin.js处理
app.use('/admin', admin);
app.use('/admin/adminDeal', adminDeal);
// 用户账户分页
// app.use("/admin/userAccount", )

module.exports = app;
