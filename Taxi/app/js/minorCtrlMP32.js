// function TrendsCtrl($scope, $http, $window, $parse, $compile, dateService, machineService, DTOptionsBuilder, DTColumnDefBuilder, toaster) {
function MinorCtrlMP32($scope, $http,$timeout,DTOptionsBuilder,dateService,$window) {
	this.baseUrl="http://pm.smartfactory.grupoantolin.com/api";
	var controller = this;
    var that = this;
    
    this.varsToDisplay = [];
    this.varsToDisplay2 = [];
    this.availableVars = [];
    this.availableVars2 = [];
    //this.availableVars = []
    function updateDataUrl(){
        /*var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(that.availableVars[key]);
        that.availableVars[key] = d.toLocaleString()*/
        
        var divided = that.varsToDisplay[0].split("/")
        var time = divided[1]+"/"+divided[0]+"/"+divided[2]
        
        var epoch = new Date(time).getTime()/ 1000;
        //var epoch = new Date(that.varsToDisplay[0]).getTime()/ 1000;
                
        urlParams = "?epoch=" + epoch;

        that.displayUrl = that.baseUrl + "/Plasbur/platoFijo"+urlParams;
    }
    function updateDataUrl2(){
        var divided = that.varsToDisplay2[0].split("/")
        var time = divided[1]+"/"+divided[0]+"/"+divided[2]
        
        var epoch = new Date(time).getTime()/ 1000;
        //var epoch = new Date(that.varsToDisplay2[0]).getTime()/ 1000;
                
        urlParams = "?epoch=" + epoch;

        that.displayUrl2 = that.baseUrl + "/Plasbur/platoMovil"+urlParams;
    }

    this.onSelProgChanged = updateDataUrl;
    this.onSelProgChanged2 = updateDataUrl2;
    
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    	.withPaginationType('full_numbers')
		.withOption('columns', [null,null,null,null,{ "orderDataType": "dom-text", "type": "num" }])
        .withOption('order', []);
    
    $scope.value_col1 = 100;
    limit_value = 0;
    $scope.col1Ok = function() {
        return that.liveData.plato_movil.health_status_clamp5 > limit_value;
    };
    
    function getLiveData(){
        $http.get(controller.baseUrl + '/Plasbur/embridaje').
            then(function(response) {
                that.availableVars = response.data.plato_fijo;
                that.availableVars2 = response.data.plato_movil;
                cleanData();
            })
            .catch(function(e){
                console.log("Problema con la llamada");
            });
        $http.get(controller.baseUrl + '/alarms/pla/mp32').
                then(function(response) {

                    that.alarms = response.data;
    //                var table = $('#alarms').DataTable();
    //                table.clear().draw();
                    cleanDataAlarms();
                })
            .catch(function(e){
                console.log("Problema con la llamada");
            });
        $http.get(controller.baseUrl + '/nowPlasbur/mp32').
            then(function(response) {
                that.liveData = response.data;
                cleanData();
            })
            .catch(function(e){
                console.log("Problema con la llamada");
            });
        $timeout(getLiveData, 60000);
    }
    function cleanDataAlarms(){
        const keys = Object.keys(that.alarms.alarms)
        for (const key of keys) {
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            d.setUTCSeconds(that.alarms.alarms[key].timestamp);
            that.alarms.alarms[key].timestamp = d.toLocaleString()
//            table.row.add([that.alarms.alarms[key].alarm,that.alarms.alarms[key].machine, that.alarms.alarms[key].machine, that.alarms.alarms[key].timestamp, that.alarms.alarms[key].checked]).draw();
        }
        
    }
    this.onDisplay = function(){
        $http.get(that.displayUrl).then(function(response) {
            var series = [];
            lineOptions.yaxes = [];

            that.flotMultiData = series; //esto lo vaciaba
            that.flotMultiData = response.data;
        })
        .catch(function(e){
        	// handle errors in processing or in error.
        	$window.alert(e.data);
        });
    }
    this.onDisplay2 = function(){
        $http.get(that.displayUrl2).then(function(response) {
            var series = [];

            that.flotMultiData2 = series; //esto lo vaciaba
            that.flotMultiData2 = response.data;
            
        })
        .catch(function(e){
        	// handle errors in processing or in error.
        	$window.alert(e.data);
        });
    }
    function cleanData(){
        const keys = Object.keys(that.availableVars)
        for (const key of keys) {
            if(typeof that.availableVars[key] == 'number'){
                //that.availableVars[key] = that.availableVars[key].toFixed(2)
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(that.availableVars[key]);
                //d = d.setMilliseconds(0)
                //that.liveData.int2.start = d.toLocaleDateString()
                that.availableVars[key] = d.toLocaleString()
            }
            
        }
        const keys3 = Object.keys(that.availableVars2)
        for (const key of keys3) {
            if(typeof that.availableVars2[key] == 'number'){
                //that.availableVars2[key] = that.availableVars2[key].toFixed(2)
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(that.availableVars2[key]);
                //d = d.setMilliseconds(0)
                //that.liveData.int2.start = d.toLocaleDateString()
                that.availableVars2[key] = d.toLocaleString()
            }
            
        }
        
        that.liveData.plato_fijo.math = Math.round(that.liveData.plato_fijo.end-that.liveData.plato_fijo.start)
        if(that.liveData.plato_fijo.health_status_clamp1==undefined){
            that.liveData.plato_fijo.health_status_clamp1 = "N/A"
        }else{
            that.liveData.plato_fijo.health_status_clamp1 = that.liveData.plato_fijo.health_status_clamp1.toFixed(1)
        }
        if(that.liveData.plato_fijo.health_status_clamp2==undefined){
            that.liveData.plato_fijo.health_status_clamp2 = "N/A"
        }else{
            that.liveData.plato_fijo.health_status_clamp2 = that.liveData.plato_fijo.health_status_clamp2.toFixed(1)
        }
        if(that.liveData.plato_fijo.health_status_clamp3==undefined){
            that.liveData.plato_fijo.health_status_clamp3 = "N/A"
        }else{
            that.liveData.plato_fijo.health_status_clamp3 = that.liveData.plato_fijo.health_status_clamp3.toFixed(1)
        }
        if(that.liveData.plato_fijo.health_status_clamp4==undefined){
            that.liveData.plato_fijo.health_status_clamp4 = "N/A"
        }else{
            that.liveData.plato_fijo.health_status_clamp4 = that.liveData.plato_fijo.health_status_clamp4.toFixed(1)
        }
        if(that.liveData.plato_fijo.health_status_clamp5==undefined){
            that.liveData.plato_fijo.health_status_clamp5 = "N/A"
        }else{
            that.liveData.plato_fijo.health_status_clamp5 = that.liveData.plato_fijo.health_status_clamp5.toFixed(1)
        }
        if(that.liveData.plato_fijo.health_status_clamp6==undefined){
            that.liveData.plato_fijo.health_status_clamp6 = "N/A"
        }else{
            that.liveData.plato_fijo.health_status_clamp6 = that.liveData.plato_fijo.health_status_clamp6.toFixed(1)
        }
        if(that.liveData.plato_fijo.health_status_clamp7==undefined){
            that.liveData.plato_fijo.health_status_clamp7 = "N/A"
        }else{
            that.liveData.plato_fijo.health_status_clamp7 = that.liveData.plato_fijo.health_status_clamp7.toFixed(1)
        }
        if(that.liveData.plato_fijo.health_status_clamp8==undefined){
            that.liveData.plato_fijo.health_status_clamp8 = "N/A"
        }else{
            that.liveData.plato_fijo.health_status_clamp8 = that.liveData.plato_fijo.health_status_clamp8.toFixed(1)
        }
    }
    
    getLiveData();
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

    
    this.flotMultiOptions = lineOptions;
        this.deleteAll = false;
    this.deleteSpecific = false;
    that.selected = {};
    that.selectAll = false;
    that.toggleAll = toggleAll;
    that.toggleOne = toggleOne;
    
    function toggleAll (selectAll, selectedItems) {
        if (confirm('Are you sure you want to delete every alarm from the database?')) {
            $http.delete(controller.baseUrl + '/alarms/pla/mp32/mp32')
                    .catch(function(e){
                        console.log("Problema con la llamada");
                });
            $timeout(getLiveData, 2000);
        }
//        console.log("toggleAll",selectAll)
//        for (var id in selectedItems) {
//            console.log(id)
//            if (selectedItems.hasOwnProperty(id)) {
//                selectedItems[id] = selectAll;
//            }
//        }
    }
    function toggleOne (selectedItems) {
        if (confirm('Are you sure you want to delete this alarm from the database?')) {
            // Save it!
            for (var id in selectedItems) {
                var ts = id.split(",");
                var divided = ts[0].split("/")
                var timeNew = divided[1]+"/"+divided[0]+"/"+divided[2]

                var epoch = new Date(timeNew).getTime()/ 1000;

                $http.delete(controller.baseUrl + '/alarms/pla/'+"?ts="+epoch+"&alarm="+ts[1]).
                    then(function(response) {

//                        that.alarms = response.data;
//        //                var table = $('#alarms').DataTable();
//        //                table.clear().draw();
//                        cleanData();

                    })
                    .catch(function(e){
                        console.log("Problema con la llamada");
                });
                $timeout(getLiveData, 2000);
        }
        }

    }
}
    

angular
    .module('inspinia')
    .controller('MinorCtrlMP32', MinorCtrlMP32)
