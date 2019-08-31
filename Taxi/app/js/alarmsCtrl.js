function AlarmsCtrl($scope, $http, $window,$timeout,DTOptionsBuilder) {
    this.baseUrl="http://localhost:8080";
	var controller = this;
    var that = this;
    
    this.onLoad = function(){
        $("#fileLoader").click();
    }
    $('input[type=file]').change(function () {
        console.dir(this.files[0].name)  
        that.displayUrl = that.baseUrl + "/file/"+this.files[0].name;
        process_file();
    })
    function process_file(){
        $http.get(that.displayUrl).then(function(response) {
            $window.alert("File is correctly loaded, thank you for waiting");
        }, AjaxErrorHandler($window, "Error"));
    }
}
angular
    .module('inspinia')
    .controller('AlarmsCtrl', AlarmsCtrl)