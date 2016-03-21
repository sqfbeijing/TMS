var express = require('express');
var path = require('path'); 
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var multer = require('multer');

var routes = require('./routes/index');
var admin = require('./routes/admin');

var app = express();

global.dbHandel = require('./database/dbHandel');
global.db = mongoose.connect("mongodb://localhost:27017/tmsdb");

var tempSessions = session({ 
  secret: 'secret',
  cookie:{ 
    maxAge: 1000*60*30
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


app.use('/', routes);
app.use('/admin', admin);


// 上面的都没有找到,则进入下面的代码
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });



module.exports = app;
