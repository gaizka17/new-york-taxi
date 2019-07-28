// function TrendsCtrl($scope, $http, $window, $parse, $compile, dateService, machineService, DTOptionsBuilder, DTColumnDefBuilder, toaster) {
function NowCtrl($scope, $http,$timeout, DTOptionsBuilder) {
	this.baseUrl="http://pm.smartfactory.grupoantolin.com/api";
	var controller = this;
    var that = this;    
    
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    	.withPaginationType('full_numbers')
		.withOption('columns', [null,null,null,null,{ "orderDataType": "dom-text", "type": "num" }])
        .withOption('order', []);
    function getLiveData(){
        $http.get(controller.baseUrl + '/nowPlasbur/mp31').
            then(function(response) {
                that.liveData = response.data;
                cleanData();
                
            })
            .catch(function(e){
                console.log("Problema con la llamada");
            });
        $timeout(getLiveData, 60000);
    }
    function cleanData(){
        const keys = Object.keys(that.liveData)
        for (const key of keys) {
            const keys2 = Object.keys(that.liveData[key])
            for(const key1 of keys2){
                if(typeof that.liveData[key][key1] == 'number'){
                    that.liveData[key][key1] = that.liveData[key][key1].toFixed(2)
                }
            }
        }
        
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(that.liveData.ana.start);
        //d = d.setMilliseconds(0)
        //that.liveData.int2.start = d.toLocaleDateString()
        that.liveData.ana.start = d.toLocaleString()
    }
    getLiveData();
    this.deleteAll = false;
    this.deleteSpecific = false;
    that.selected = {};
    that.selectAll = false;
    that.toggleAll = toggleAll;
    that.toggleOne = toggleOne;
    
    function toggleAll (selectAll, selectedItems) {
        if (confirm('Are you sure you want to delete every alarm from the database?')) {
            $http.delete(controller.baseUrl + '/alarms/pla/mp31')
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
    .controller('NowCtrl', NowCtrl)
