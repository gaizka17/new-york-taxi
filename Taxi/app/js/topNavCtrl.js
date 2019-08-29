function TopNavController($scope, $http, $window, machineService) {
	var controller = this;
	

    this.DoLogout = function() {
    	$http.get("http://localhost:8080/do-logout").then(function(response) {
    		$window.location.href = "/Taxi/";
    	}, AjaxErrorHandler($window, "Log out"));
    };

};

angular
    .module('inspinia')
	.controller('TopNavController', TopNavController)