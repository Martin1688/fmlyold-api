require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// require('./app_api/models/fmaccount');
// require('./app_api/models/user');
const passport = require('passport');
require('./app_api/models/db');
require('./app_api/config/passport');

const apiRouter = require('./app_api/routes/index');

var app = express();
app.use(express.json());
// view engine setup
//app.set('views', path.join(__dirname, 'app_server', 'views'));

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);




app.use(logger('dev'));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//app.use(bodyParser.json({limit: '50mb'}))

app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'build')));
app.use(passport.initialize());

app.use('/api', (req, res, next) => {
    //console.log(req.headers.origin);
    var allowedOrigins = ['http://127.0.0.1:4200', 'https://fmlyoldweb-public.vercel.app', 'http://localhost:4200', 'http://127.0.0.1:3000', 'http://localhost:3000', 'https://familyaccount.herokuapp.com'];
    var origin = req.headers.origin;
    //console.log(req.headers.origin);
    if (allowedOrigins.indexOf(origin) > -1) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://localhost:4200');

    //res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS,PATCH,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use('/api', apiRouter);

//app.use('/', indexRouter);
// app.use('/users', usersRouter);
//app.use('/api', apiRoutes);

app.get('*', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get(/(\/about)|(\/location\/[a-z0-9]{24})/, function(req, res, next) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res
            .status(401)
            .json({ "message": err.name + ": " + err.message });
    }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});