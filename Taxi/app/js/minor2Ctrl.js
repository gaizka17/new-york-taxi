// function TrendsCtrl($scope, $http, $window, $parse, $compile, dateService, machineService, DTOptionsBuilder, DTColumnDefBuilder, toaster) {
// function TrendsCtrl($scope, $http, $window, $parse, $compile, dateService, machineService, DTOptionsBuilder, DTColumnDefBuilder, toaster) {
function Minor2Ctrl($scope, $http,$timeout,DTOptionsBuilder,dateService,$window) {
	this.baseUrl="http://pm.smartfactory.grupoantolin.com/api";
	var controller = this;
    var that = this;
    
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    	.withPaginationType('full_numbers')
		.withOption('columns', [null,null,null,null,{ "orderDataType": "dom-text", "type": "num" }])
        .withOption('order', []);
    
var position = 'right';

    var lineOptions = {
        xaxes: [
            {
                mode: 'time'
            }
        ],
        /*yaxes: [
            {
                // align if we are to the right
                alignTicksWithAxis: position == "right" ? 1 : null,
                position: position
            }
        ],*/
        legend: {
            position: 'sw'
        },
        colors: ["#47ACB1", "#F26522", "#FFCD33", "#676766", "#ADD5D7", "#F9AA7B", "#FFE8AF", "#A5A8AA"],//["#9cd8ff", "#0097fa", "#0079c8", "#005a94", "#003050"],
        grid: {
            color: "#999999",
            hoverable: true,
            clickable: true,
            tickColor: "#D4D4D4",
            borderWidth: 0

        },
        tooltip: true,
        tooltipOpts: {
            content: "%s for %x was %y",
            xDateFormat: "%y-%m-%d",
            onHover: function (flotItem, $tooltipEl) {
            }
        }

    };


    this.flotMultiData = [];
    
    this.flotMultiOptions = lineOptions;
//    this.flotMultiOptions = {"xaxes":[{"mode":"time"}],"legend":{"position":"sw"},"colors":["#47ACB1","#F26522","#FFCD33","#676766","#ADD5D7","#F9AA7B","#FFE8AF","#A5A8AA"],"grid":{"color":"#999999","hoverable":true,"clickable":true,"tickColor":"#D4D4D4","borderWidth":0},"tooltip":true,"tooltipOpts":{"content":"%s for %x was %y","xDateFormat":"%y-%m-%d"},"yaxes":[{"label":"Feed.X3"},{"label":"Force.X2"},{"label":"Interval"}]};
    
    this.progsInPeriod = [];
    //this.progsInPeriod = [{name: "#1 11/06/2019 16:25:35", value: "LOW PROFILE/1560263135_1", type: "LOW PROFILE", $$hashKey: "object:278"}];
    this.progsInPeriod = ["M-933","M:1011","M-991","M-951","0"];
    //this.availableVars = [];
    //TODO esto habria que cargarlo desde algun lado
    this.availableVars =  [
        "MoldSafetyTime_s",
        "HopperTemp_oC",
        "CoolingTime_s",
        "InjectionTime_s",
        "BarrelZone3Temp_oC",
        "BarrelZone2Temp_oC",
        "HeatBalancing101_oC",
        "MoldStroke_mm",
        "BarrelZone4Temp_oC",
        "BarrelZone1Temp_oC",
        "BarrelZone5Temp_oC",
        "OilTemp_oC",
        "HoldingTime_s",
        "EjectorStroke_mm",
        "RealLastCycleTime_s",
        "H1Z501Temp_oC",
        "PauseTime_s",
        "HeatBalancing112_oC",
        "PlastincizingTime_s",
        "LastCycleTime_s",
        "dist"
    ];
    this.program = [];
    this.varsToDisplay = [];
    this.xVar = 'time';
    this.displayUrl = "";
    this.urlParams = "";
    var that = this;
    
    function updateDataUrl(){
        var varsToRequest = that.varsToDisplay.slice(0);
        var programsToRequest = [];
        if (that.xVar != 'time' && that.varsToDisplay.indexOf(that.xVar) < 0)
            varsToRequest.push(that.xVar);
        for (var i = 0; i < that.program.length; i++)
            programsToRequest.push(that.program);
        
        urlParams = "?vars=" + varsToRequest+"&machine=mp31&db=pla&collection=mp31"+"&mold="+programsToRequest;

        that.displayUrl = that.baseUrl + "/mold/" + dateService.getPeriod()+"/"+dateService.getDate()+"/"+urlParams;
    }

    this.onSelProgChanged = updateDataUrl;

    this.onDisplay = function(){
        $http.get(that.displayUrl).then(function(response) {
            var series = [];
            lineOptions.yaxes = [];

            // Set Y axes. One axis per variable displayed
            var iVar = 0;
            for(var numb in response.data){
                lineOptions.yaxes[iVar] = {
            			label: response.data[numb].label,
						tickFormatter: function(val, axis) { return val < axis.max ? val.toFixed(axis.tickDecimals) : lineOptions.yaxes[axis.n - 1].label; }
            	};
            	iVar++;
            }

            that.flotMultiData = series; //esto lo vaciaba
            that.flotMultiData = response.data;
            
//            if (that.xVar != 'time')
//                that.flotMultiOptions = pointOptions;
//            else
//                that.flotMultiOptions = lineOptions;
//            this.flotMultiOptions = {"xaxes":[{"mode":"time"}],"legend":{"position":"sw"},"colors":["#47ACB1","#F26522","#FFCD33","#676766","#ADD5D7","#F9AA7B","#FFE8AF","#A5A8AA"],"grid":{"color":"#999999","hoverable":true,"clickable":true,"tickColor":"#D4D4D4","borderWidth":0},"tooltip":true,"tooltipOpts":{"content":"%s for %x was %y","xDateFormat":"%y-%m-%d"},"yaxes":[{"label":"Feed.X3"},{"label":"Force.X2"},{"label":"Interval"}]};
        }
        , AjaxErrorHandler($window, "Error"));
    }
    

    function getProgramsAndVars(){
        $http.get(that.baseUrl + "/trace/programs/" + dateService.getPeriod() + "/" + dateService.getDate()).then(function(response) {
            that.progsInPeriod = [];
            that.program = [];

            toaster.clear();
            that.flotMultiData = [];

            if (typeof response.data.alert !== 'undefined'){
                toaster.error({body: response.data.alert});
                return;
            }

            var hasPrograms = false;
            for (var program in response.data.programs){
            	var temp = [];
                for (var i = 0; i < response.data.programs[program].length; i++){
                    var nameTokens = response.data.programs[program][i].split("_");
                    var name = moment(parseInt(nameTokens[0]) * 1000).toDate();
                    var objInSelect = {
                    		name: name,
                            value: program + "/" + response.data.programs[program][i],
                            type: program
                    };
                    temp.push(objInSelect);
                    if ( program === $stateParams.program && parseInt(nameTokens) === $stateParams.timestamp ) {
                    	that.program.push(objInSelect);
                    }
                }
                that.progsInPeriod.push(shortByDescendingDate(temp));
                if (!hasPrograms) hasPrograms = true;
            }
            
            that.progsInPeriod = [].concat.apply([], that.progsInPeriod);

            if (!hasPrograms)
                toaster.error({body: 'No programs have been executed in this period'});

        }, AjaxErrorHandler($window, "Get programs list"));
        $http.get(that.baseUrl + "/trace/vars/" + dateService.getDate()).then(function(response) {
            that.availableVars = response.data.vars;
            that.varsToDisplay = [];
        }, AjaxErrorHandler($window, "Get variables list"));
    }

	$scope.$on('date-changed', function(event, data){
		//getProgramsAndVars();
		updateDataUrl();
	});

	$scope.$on('machine-changed', function(event, data){
		//getProgramsAndVars();
		updateDataUrl();
	});
}

angular
    .module('inspinia')
    .controller('Minor2Ctrl', Minor2Ctrl)
