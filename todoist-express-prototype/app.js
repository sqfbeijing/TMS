var express = require('express');
var path = require('path'); 
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var multer = require('multer');

var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var logout = require('./routes/logout');
var admin = require('./routes/admin/admin');
var taskCircle = require('./routes/taskCircle');
// 处理首页deal
var indexDeal = require('./routes/indexDeal');

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
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer());
//使用cookieParser()中间件
app.use(cookieParser());
// 开启静态文件服务
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req,res,next){ 
  res.locals.user = req.session.user;
  var err = req.session.error;
  // 删除这个属性
  delete req.session.error;
  res.locals.message = "";
  if(err){ 
    res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
  }
  next();
});


app.use('/', index);
app.use('/login.html', login);
app.use('/register.html', register);
app.use('/userLogout.html', logout);
app.use('/taskCircle.html', taskCircle);
app.use('/indexDeal', indexDeal);
app.use('/admin', admin);




module.exports = app;
