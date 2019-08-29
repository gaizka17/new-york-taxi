/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl($scope, $http, $timeout) {

    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';
    var that = this;
    // codigo para la libreria knob
    $scope.value_col1 = 0;
    $scope.value_col2 = 0;
    $scope.value_col3 = 0;
    $scope.value_col4 = 0;
    that.selectedMachine = null; //con esto saldra al principio
    that.allMachines = {name: "test",test2: "test2"};
    
    $scope.options1 = {
        dynamicOptions: true,
        skin: {
            type: 'tron',
            color: 'rgba(0,0,150)'
        },
        min: 0,
        max: 100,
        readOnly: true,
        size: 200,
        unit: "%",
        barWidth: 30,
        barColor: 'rgba(0,0,150)'
    };
    $scope.options2 = {
        dynamicOptions: true,
        skin: {
            type: 'tron',
            color: 'rgba(0,0,150)'
        },
        min: 0,
        max: 100,
        readOnly: true,
        size: 200,
        unit: "%",
        barWidth: 30,
        barColor: 'rgba(0,0,150)'
    };
    $scope.options3 = {
        dynamicOptions: true,
        skin: {
            type: 'tron',
            color: 'rgba(0,0,150)'
        },
        min: 0,
        max: 100,
        readOnly: true,
        size: 200,
        unit: "%",
        barWidth: 30,
        barColor: 'rgba(0,0,150)'
    };
    $scope.options4 = {
        dynamicOptions: true,
        skin: {
            type: 'tron',
            color: 'rgba(0,0,150)'
        },
        min: 0,
        max: 100,
        readOnly: true,
        size: 200,
        unit: "%",
        barWidth: 30,
        barColor: 'rgba(0,0,150)'
    };
    $scope.options1n = {
        dynamicOptions: true,
        skin: {
            type: 'tron',
            color: 'rgba(150,0,0)'
        },
        min: 0,
        max: 100,
        readOnly: true,
        size: 200,
        unit: "%",
        barWidth: 30,
        barColor: 'rgba(150,0,0)'
    };
    $scope.options2n = {
        dynamicOptions: true,
        skin: {
            type: 'tron',
            color: 'rgba(150,0,0)'
        },
        min: 0,
        max: 100,
        readOnly: true,
        size: 200,
        unit: "%",
        barWidth: 30,
        barColor: 'rgba(150,0,0)'
    };
    $scope.options3n = {
        dynamicOptions: true,
        skin: {
            type: 'tron',
            color: 'rgba(150,0,0)'
        },
        min: 0,
        max: 100,
        readOnly: true,
        size: 200,
        unit: "%",
        barWidth: 30,
        barColor: 'rgba(150,0,0)'
    };
    $scope.options4n = {
        dynamicOptions: true,
        skin: {
            type: 'tron',
            color: 'rgba(150,0,0)'
        },
        min: 0,
        max: 100,
        readOnly: true,
        size: 200,
        unit: "%",
        barWidth: 30,
        barColor: 'rgba(150,0,0)'
    };
    // fin knob

	this.baseUrl = "http://10.8.0.105:5000";
	// this.baseUrl = "http://10.21.34.236:5000";
    var controller = this;

    //getColstatus();
    //getLiveData();

    function getColstatus(){
        $http.get(controller.baseUrl + '/colscurrent?muestras=5').
            then(function(response) {
                that.colscurrent = response.data;
            }, function(err) {
                console.error("error ocurred: ", err);
            });

            var limit_value =  20;
            if( that.colscurrent != null ) {
                $scope.value_col1 = that.colscurrent.col1.toFixed();
                $scope.value_col2 = that.colscurrent.col2.toFixed();
                $scope.value_col3 = that.colscurrent.col3.toFixed();
                $scope.value_col4 = that.colscurrent.col4.toFixed();

                $scope.col1Ok = function() {
                    return $scope.value_col1 > limit_value;
                };
                $scope.col1Nok = function() {
                    return $scope.value_col1 <= limit_value;
                };

                $scope.col2Ok = function() {
                    return $scope.value_col2 > limit_value;
                };
                $scope.col2Nok = function() {
                    return $scope.value_col2 <= limit_value;
                };

                $scope.col3Ok = function() {
                    return $scope.value_col3 > limit_value;
                };
                $scope.col3Nok = function() {
                    return $scope.value_col3 <= limit_value;
                };

                $scope.col4Ok = function() {
                    return $scope.value_col4 > limit_value;
                };
                $scope.col4Nok = function() {
                    return $scope.value_col4 <= limit_value;
                };
            }
        $timeout(getColstatus, 2000);
    }

    function getLiveData(){
        $http.get(controller.baseUrl + '/live?' + (new Date()).getTime()).
            then(function(response) {
                that.liveData = response.data;
            });
        $timeout(getLiveData, 2000);
    }
    
};

function DateService($rootScope) {
    var date = moment().format("YYYYMMDD");
    var period = "month";

    return {
        getDate: function () {
            return date;
        },
        setDate: function(adate, aperiod) {
         if (date != adate || aperiod != period){
               date = adate;
               period = aperiod;
            $rootScope.$broadcast('date-changed', date, period);
         }
        },
        getPeriod: function() {
            return period;
        },
        setPeriod: function (value){
         if (value != period){
               period = value;
               $rootScope.$broadcast('date-changed');
         }
        }
    };
}

function MachineSelectionService($rootScope) {
    var selectedMachine = null;

    return {
        getMachine: function() {
            return selectedMachine;
        },
        setMachine: function(newMachine) {
            if (newMachine != selectedMachine){
                selectedMachine = newMachine;
                $rootScope.$broadcast('machine-changed');
            }
        }
    };
}


angular
    .module('inspinia')
    .service('dateService', DateService)
    .service('machineService', MachineSelectionService)
    .controller('MainCtrl', MainCtrl)
