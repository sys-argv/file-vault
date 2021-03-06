var 
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  path = require('path'),
  db = require('./models/db'),
  account = require('./routes/accounts'),
  //gallery = require('./routes/gallery'),
  image = require('./routes/photos'),
  subdomain = 'dev.localserver.com:3000';


app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public'), 
    { maxAge: 3600,
      'index' : 'filevault.html'
    }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.use(function(req, res, next){
  if(req.headers.host === subdomain){
    console.log('SUBDOMAIN REQUEST');
    req.url = '/api' + req.url;
    console.log(req.url);
    next();
  }else{
    next();
  }
});

app.get('/', function(req, res){
  console.log('Root node');
  //res.sendFile(__dirname + '/public/filevault.html');
});

app.use('/api/image', image);
app.use('/image/', image);
//app.use('/gallery', gallery);
app.use('/account', account);

//catch 404 and forward to error handler
app.use(function(req, res, next){
  var err = new Error('not Found');
  err.status = 404;
  next(err);
});

//error handlers

//dev environment error
//will print stacktrace
if(app.get('env') === 'development'){
  app.use(function(err, req, res, next){
    console.log('DEVELOPMENT ENV');
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

//production error handler
//no stacktrace printed
app.use(function(err, req, res, next){
    console.log('PRODUCTION ENV');
  res.status(err.status || 500);
  res.json({message: err.message});
});


module.exports = app;
