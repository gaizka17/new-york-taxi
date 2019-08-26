function AlarmsCtrl($scope, $http, $window,$timeout,DTOptionsBuilder) {
    this.baseUrl="http://localhost:8080";
	var controller = this;
    var that = this;
    
    this.onLoad = function(){
        console.log("Here!")
        $("#fileLoader").click();
    }
    $('input[type=file]').change(function () {
        console.dir(this.files[0].name)  
        that.displayUrl = that.baseUrl + "/file/"+this.files[0].name;
        process_file();
    })
    function process_file(){
        $http.get(that.displayUrl).then(function(response) {
            console.log("Parece que estoy aqui");
        })
        .catch(function(e){
        	// handle errors in processing or in error.
        	$window.alert(e.data);
        });
    }
}
angular
    .module('inspinia')
    .controller('AlarmsCtrl', AlarmsCtrl)