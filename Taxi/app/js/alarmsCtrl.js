function AlarmsCtrl($scope, $http, $window,$timeout,DTOptionsBuilder) {
    //that.alarms = [{"timestamp":10,"desc": "hola", "id":23}]
//    that.alarms = [{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23},{"timestamp":10,"desc": "hola", "id":23}]
    this.baseUrl="http://pm.smartfactory.grupoantolin.com/api";
	var controller = this;
    var that = this;
    
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    	.withPaginationType('full_numbers')
		.withOption('columns', [null,null,null,null,{ "orderDataType": "dom-text", "type": "num" }])
        .withOption('order', []);
    
    function getLiveData(){
        $http.get(controller.baseUrl + '/alarms/pla/').
            then(function(response) {

                that.alarms = response.data;
//                var table = $('#alarms').DataTable();
//                table.clear().draw();
                cleanData();
            })
            .catch(function(e){
                console.log("Problema con la llamada");
            });
            $http.get(controller.baseUrl + '/status/pla').
            then(function(response) {
                that.status = response.data;
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(that.status.status.start);
                that.status.status.start = d.toLocaleString();
                //that.alarms = response.data;
//                var table = $('#alarms').DataTable();
//                table.clear().draw();
                //cleanData();
                
            })
            .catch(function(e){
                console.log("Problema con la llamada");
            });
        $timeout(getLiveData, 60000);
    }
    
    function cleanData(){
        const keys = Object.keys(that.alarms.alarms)
        for (const key of keys) {
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            d.setUTCSeconds(that.alarms.alarms[key].timestamp);
            that.alarms.alarms[key].timestamp = d.toLocaleString()
//            table.row.add([that.alarms.alarms[key].alarm,that.alarms.alarms[key].machine, that.alarms.alarms[key].machine, that.alarms.alarms[key].timestamp, that.alarms.alarms[key].checked]).draw();
        }
        
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
            $http.delete(controller.baseUrl + '/alarms/pla/all')
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
                //var timeNew = ts[0]

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
//        for (var id in selectedItems) {
//            console.log(id)
//            if (selectedItems.hasOwnProperty(id)) {
//                console.log("test")
//                if(!selectedItems[id]) {
//                    console.log("test")
//                    that.selectAll = false;
//                    return;
//                }
//            }
//        }
        //that.selectAll = true;
    }

}
angular
    .module('inspinia')
    .controller('AlarmsCtrl', AlarmsCtrl)