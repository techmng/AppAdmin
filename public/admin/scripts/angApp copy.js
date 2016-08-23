var app = angular.module('mainModule' ,['ngRoute','ngCookies']);
app.config(['$routeProvider',function($routeProvider){
	console.log("config Called..");
	$routeProvider
	   .when("/", {controller:'signonController', templateUrl:'admin/views/loginPage.html'})
	   .when("/home", {controller: 'homeController', templateUrl:'admin/views/home.html'})
	   .when("/register", {controller:'registerController', templateUrl:'admin/views/register.html'})
	   .when("/signon", {controller:'signonController', templateUrl:'admin/views/signon.html'})
	   .when("/signout", {controller:'signoutController', templateUrl:'admin/views/loginPage.html'})
       .when("/profile", {controller:'profilePageController', templateUrl:'admin/views/profile.html'})
       .when("/tanentList", {controller:'tanentListController', templateUrl:'admin/views/tanents.html'})
	   .otherwise({redirectTo:'/'});
	//$locationProvider.html5Mode(true);
}]);




/*app.config(function(IdleProvider, KeepaliveProvider) {
  IdleProvider.idle(25); // 15 min
  IdleProvider.timeout(20);
  KeepaliveProvider.interval(10); // heartbeat every 10 min
  //KeepaliveProvider.http('/api/heartbeat'); // URL that makes sure session is alive
});

app.run(function($rootScope, Idle) {
  Idle.watch();
  $rootScope.$on('IdleStart', function() { /* Display modal warning or sth */ 
       
 /* });
  $rootScope.$on('IdleTimeout', function() { /* Logout user */ 
  
/*  });
});*/




//Home Page Controller
app.controller('homeController', function($scope,$location,$rootScope){
	console.log("Home controller call....");
    var authFlag = window.localStorage.getItem("authFlag");
 	var currentUser =   window.localStorage.getItem("currentUser");
    var currentPageUrl = window.localStorage.getItem("currentPageUrl");
    var newPageUrl = currentPageUrl;
    if(currentPageUrl ==null || angular.isUndefined(currentPageUrl)) {
    	  newPageUrl = "/home";
    } 
	$rootScope.currentUser = currentUser;
	$rootScope.authFlag = authFlag;
    $rootScope.currentPageUrl = newPageUrl;
    	
    console.log("Home Controller...currentUser " + currentUser + " authFlag: " + authFlag + " currentPageUrl: " + currentPageUrl + " newPageUrl: " +newPageUrl);
    
   // $location.path(newPageUrl);

});

// Register Page Load and submit Controller
app.controller('registerController', function($scope, $rootScope, $location){
	
	console.log("Register controller call....");
	
	
	if($rootScope.authFlag){
	    //console.log("Register controller loggedin user....");
	    $location.path("/profile");
	    return;
    }
	//	console.log("Register controller call2....");

	$scope.register = function(){
	    var email = $scope.email;
        var pwd   =  $scope.pwd;
    	var pwdConfirm = $scope.pwdConfirm;
    	
        if( email == null || angular.isUndefined(email)|| pwd == null || angular.isUndefined(pwd)|| pwdConfirm == null || angular.isUndefined(pwdConfirm))
        {
           console.log(" On register Continue fields are empty");
           return;
        } 
	 	console.log(" On register Continue1...." + "Email " + email + " pwd " + pwd + " pwdConfirm " + pwdConfirm);
	}
});

//Signon Page Controller
 app.controller('signonController', ['$scope', '$location','$http','$rootScope','$cookies', function($scope, $location,$http,$rootScope,$cookies){
	console.log("Signon controller call...." + $cookies.get('sessionId'));
    
    if($cookies.get('sessionId') && $rootScope.authFlag){
	    console.log("Loggedin user go to profile....");
	    $location.path("/profile");
	    return;
   }
     
     //loginPage Submit
     $scope.signon = function(){
    	var email = $scope.email;
     	var pwd = $scope.pwd; 
    
     	console.log("signon method call start...." + "email: " + $scope.email  +  " password: " + $scope.pwd );

    	$scope.customerData = {};
     	var requestObject = {  
            			  	method: 'POST',
 							url: '/login',
 							headers: {
   								  'Content-Type': 'application/x-www-form-urlencoded'
 							},
 							data: 'email='+$scope.email+'&'+'pwd='+$scope.pwd
     	}
            
     
        //Login Server API Call
	    $http(requestObject).success(function (userData, status, headers, config) {
	    	console.log("Signon Post start " + userData.userid);
         	//To show profile or login link on top right. Store values in local storage and in rootScope
           	var authFlag = ((userData.userid=="") || (userData.userid == null) || (angular.isUndefined(userData.userid)) )? false : true;  
           	if(authFlag){
           		var currentUser =   userData.firstName;
           		var currentPageUrl = $location.path();
        	
        		window.localStorage['data'] = angular.toJson(userData);
        		window.localStorage.setItem("currentUser", currentUser);
        		window.localStorage.setItem("authFlag",authFlag);
        		window.localStorage.setItem("currentPageUrl", currentPageUrl);
	        
	        	$rootScope.currentUser = currentUser;
        		$rootScope.authFlag = authFlag;
        		$rootScope.currentPageUrl = currentPageUrl;
            	console.log("Signon Post success...currentUser " + currentUser + " authFlag: " + authFlag + " currentPageUrl: " + currentPageUrl);                
        		$location.path("/profile");
        	}else{
        	    console.log("Invalid login " + userData.errorCode);
        	    $rootScope.globalError = "Invalid credentials. Please try again"
        		$location.path("/");
        	}
      }).error(function (userData, status, header, config) {
            $rootScope.globalError = "System error occurred, please try after some time.."
            console.log("Signon Post Error..." + " status " + status + " userData " + userData);
     });
     
 } 
}]);


//Signout Page Controller
app.controller('signoutController', ['$scope', '$location','$http','$rootScope','$cookies', function($scope, $location,$http,$rootScope, $cookies){
	console.log("Signout controller call.SessionId.." + $cookies.get('sessionId'));
	
	var signoutRequest = {  
            			  	method: 'Get',
 							url: '/logout',
 							headers: {
   								  'Content-Type': 'application/json'
 							},
 							data: {'sessionId':$cookies.get('sessionId')}
     }
     
     $http(signoutRequest).success(function (userData, status, headers, config) {
      	$rootScope.currentUser = null;
    	$rootScope.authFlag=false;
    	$rootScope.globalError=null;
    	window.localStorage.clear();
    	$cookies.remove('sessionId');   
        console.log("Logout success..");                
        $location.path("/");
      }).error(function (userData, status, header, config) {
            $rootScope.globalError = "System error occurred, please try after some time.."
            console.log("Logout Error..." + " status " + status);
     });
}]);


//Profile Page Controller 
app.controller('profilePageController', function($scope, $rootScope, $location){
	//console.log("ProfilePage controller call...");
	var storageData = window.localStorage['data'];
    window.localStorage.removeItem("currentPageUrl");
	window.localStorage.setItem("currentPageUrl", "/profile");
	$rootScope.authFlag = true;
	if(angular.isUndefined(storageData) || storageData == "" && storageData == null){
	    $rootScope.authFlag = false;
		$rootScope.globalError="Please login !! ";
	    $location.path("/");
        return;
	}else{
		var userData = JSON.parse(window.localStorage['data']);
		$scope.email = userData.userid;
		$scope.firstName = userData.firstName
		$scope.lastName =  userData.lastName
     }
   //	console.log("ProfilePage controller call end....");
});


//Tanents List Page Controller
app.controller('tanentListController', ['$scope', '$location','$http','$rootScope','$cookies', function($scope, $location,$http,$rootScope, $cookies){
	console.log("tanentListController controller..");
	
	var tanentsRequest = {  
            			  	method: 'Get',
 							url: '/tanents',
 							headers: {
   								  'Content-Type': 'application/json'
 							},
 							data: {'sessionId':$cookies.get('sessionId')}
     }
     
     $http(tanentsRequest).success(function (tanentsData, status, headers, config) {
        console.log("tanentListController success.." + JSON.stringify(tanentsData) + " --- " + tanentsData.usersList[0]);   
    	var isDataAvaliable = ((tanentsData=="") || (tanentsData == null) || (angular.isUndefined(tanentsData)) )? false : true;  
        if(isDataAvaliable){
           console.log("tanentListController data list.. "+ JSON.stringify(tanentsData.usersList[0]));
            $scope.userList = tanentsData.usersList;
        }else{
           $scope.userList = "";
        }
      }).error(function (tanentsData, status, header, config) {
            $rootScope.globalError = "System error occurred, please try after some time.."
            console.log("Tanentlist call Error..." + " status " + status);
     });
}]);
