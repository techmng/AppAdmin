var app = angular.module('mainModule' ,['ngRoute']);
app.config(['$routeProvider',function($routeProvider){
	console.log("config Calle..");
	$routeProvider
	   .when("/home", {controller: 'homeController', templateUrl:'./index.html'})
	   .when("/register", {controller:'registerController', templateUrl:'views/register.html'})
	   .when("/signon", {controller:'signonController', templateUrl:'views/signon.html'})
	   .otherwise({redirectTo:'/'});
}]);

//Home Page Controller
app.controller('homeController', function($scope){
	console.log("Home controller call....");

});

// Register Page Controller
app.controller('registerController', function($scope){
	console.log("Register controller call....");

});

//Register Page Controller
app.controller('signonController', function($scope){
	console.log("Signon controller call....");

});



