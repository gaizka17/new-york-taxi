// function TrendsCtrl($scope, $http, $window, $parse, $compile, dateService, machineService, DTOptionsBuilder, DTColumnDefBuilder, toaster) {
function NowCtrl($scope, $http,$timeout, dateService, DTOptionsBuilder,$window) {
	this.baseUrl="http://localhost:8080";
	var controller = this;
    var that = this;    
    var vm = this;
    vm.currentDay = moment();
    vm.currentDayLabel = '';
    vm.period = 'month';
    vm.radioModel = '';
    vm.isCalendarVisible = false;
    vm.todayBtnStr = "This month";
    vm.bThisPeriod = true;

    vm.updateLabel = function(){
        if (vm.period == 'day'){
            if (vm.currentDay.year() == moment().year())
                vm.currentDayLabel = vm.currentDay.format("MMMM D, dddd");
            else
                vm.currentDayLabel = vm.currentDay.format("D MMMM YYYY, dddd");
            vm.todayBtnStr = "Today";
            vm.bThisPeriod = moment().isSame(vm.currentDay, 'day');
        }else if (vm.period == 'week'){
            var weekStart = moment(vm.currentDay);
            weekStart.startOf('isoWeek');
            var weekEnd = moment(vm.currentDay);
            weekEnd.endOf('isoWeek');
            var label = weekStart.format("D");
            if (weekStart.month() != weekEnd.month()){
                label += weekStart.format(" MMMM");
                if (weekStart.year() != weekEnd.year())
                    label += weekStart.format(" YYYY");
            }
            label += " - ";
            label += weekEnd.format("D MMMM");
            if (weekEnd.year() != moment().year() || weekEnd.year() != weekStart.year())
                label += weekEnd.format(" YYYY");

            vm.currentDayLabel = label;
            vm.todayBtnStr = "This week";
            vm.bThisPeriod = moment().isSame(vm.currentDay, 'week');
        }else{ //month
            if (vm.currentDay.year() == moment().year())
                vm.currentDayLabel = vm.currentDay.format("MMMM");
            else
                vm.currentDayLabel = vm.currentDay.format("MMMM YYYY");
            vm.todayBtnStr = "This month";
            vm.bThisPeriod = moment().isSame(vm.currentDay, 'month');
        }
        dateService.setDate(vm.currentDay.format("YYYYMMDD"), vm.period);
        getLiveData();
    }

    vm.goToday = function(){
        vm.currentDay = moment();
        vm.updateLabel();
        
    }

    vm.goBack = function(){
        // Si no lo clonamos, se cambia el dia en la UI del calendario
        vm.currentDay = vm.currentDay.clone();
        if (vm.period == 'day')
            vm.currentDay.subtract(1, 'days');
        else if (vm.period == 'week')
            vm.currentDay.subtract(1, 'week');
        else
            vm.currentDay.subtract(1, 'month');

        vm.updateLabel();
    }

    vm.goForward = function() {
        vm.currentDay = vm.currentDay.clone();
        if (vm.period == 'day')
            vm.currentDay.add(1, 'days');
        else if (vm.period == 'week')
            vm.currentDay.add(1, 'week');
        else
            vm.currentDay.add(1, 'month');

        vm.updateLabel();
    }

    vm.updateLabel();

    $scope.$on('hidePicker', function(event, mass) {
        $("#dropDownCalendar").removeClass("open");
        $("#aCalendar").attr("aria-expanded", "false");
        $("#menuCalendar").children().removeClass("hidden");
        $("body").trigger("click");
    });

    $scope.maxDate = new Date();
    
    
    //$http.get(controller.baseUrl + "/production/" + dateService.getPeriod() + "/" + dateService.getDate()).then(function(response) {
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    	.withPaginationType('full_numbers')
		.withOption('columns', [null,null,null,null,{ "orderDataType": "dom-text", "type": "num" }])
        .withOption('order', []);
    
    function getLiveData(){
        month = dateService.getDate()
        $http.get(controller.baseUrl + '/now/'+month).
            then(function(response) {
                that.liveData = response.data;
                cleanData();
            }, AjaxErrorHandler($window, "Error"));
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
    
    }
    getLiveData();
    

}

angular
    .module('inspinia')
    .controller('NowCtrl', NowCtrl)
