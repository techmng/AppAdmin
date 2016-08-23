var express = require("Express");
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var FileStore = require('session-file-store')(session);
var path = require("path");
var Client = require('node-rest-client').Client;
var client = new Client();

app.set("views", path.resolve(__dirname, "public"));
app.use(express.static(path.resolve(__dirname, "public"),{index:false}));
app.engine('html', require('ejs').renderFile);

//Coockies Bases Session Management
app.use(session(
	{
	 secret :"s8c#r8t", 
	 name : "sessionId",
 	 saveUninitialized:false,
     cookie:{path: '/', httpOnly: false, secure: false, maxAge: 600000, domain:'localhost'},
     store: new FileStore(),
     resave: false
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var sessionObj;

//Send To login Page
app.get("/", function(req, res){
  	//console.log('/.. called user:' + req.session.user + " ...isauthenticated: " + req.session.authenticated);
    res.render("mainPage.html");
});

//Login Page submit call
app.post("/login", function(req, res){
    
	//-------Rest Service call to validate credentials-------
	if (req.body.email  && req.body.pwd ) {
	    console.log(" email-pwd login Start....");
        var url = "http://localhost:8080/PersentationApiService/rest/v1.0/user/findUser";
		var args = { 
			data:'email=' + req.body.email + '&' + 'pwd=' + req.body.pwd,
    		headers: { "Content-Type": "application/x-www-form-urlencoded" }
	    };
         
        client.post(url, args, function (data, response) {
    		console.log("data print: "+  data.userid);
    		sessionObj = req.session;
    		sessionObj.user = data;
    		req.session.authenticated = true;
    	    res.send(data);
        }).on('error', function (err) {
             req.session.authenticated=false;
   			 console.log('Something went wrong on the login request', err.request.options);
        });
	 }else{
 		console.log('/login authentication failed..');
 	    req.session.authenticated=false;
		//req.flash('error', 'Incorrect Username and password ');
		res.redirect('/');
	}
	
});

//logout call
app.get("/logout", function(req, res){
	console.log('/logout called..');
	req.session.destroy();
  	res.redirect('/');
});


//Get All users
app.get("/tanents", function(req, res){
    
	//-------Rest Service call -------
	    console.log(" /tanents Start....");
        var url = "http://localhost:8080/PersentationApiService/rest/v1.0/user/findAllUsers";
         
        client.get(url, function (data, response) {
    		console.log("tanents data print: "+  JSON.stringify(data));
    	    res.send(data);
        }).on('error', function (err) {
   			 console.log('Something went wrong on the tanents request', err.request.options);
        });
	
});

var server = app.listen(5001,function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("App Started on port: " + port + " host: " + host);
});