function DateCtrl($scope, dateService){

    var vm = this;
    vm.currentDay = moment();
    vm.currentDayLabel = '';
    vm.period = 'year';
    vm.radioModel = '';
    vm.isCalendarVisible = false;
    vm.todayBtnStr = "This year";
    vm.bThisPeriod = true;

    vm.updateLabel = function(){
        if (vm.period == 'all'){
            if (vm.currentDay.year() == moment().year())
                vm.currentDayLabel = vm.currentDay.format("MMMM");
            else
                vm.currentDayLabel = vm.currentDay.format("MMMM YYYY");
            vm.todayBtnStr = "all";
            vm.bThisPeriod = moment().isSame(vm.currentDay, 'day');
        }else{ //month
            if (vm.currentDay.year() == moment().year())
                vm.currentDayLabel = vm.currentDay.format("YYYY");
            else
                vm.currentDayLabel = vm.currentDay.format("YYYY");
            vm.todayBtnStr = "This year";
            vm.bThisPeriod = moment().isSame(vm.currentDay, 'year');
        }

        dateService.setDate(vm.currentDay.format("YYYYMMDD"), vm.period);
    }

    vm.goToday = function(){
        vm.currentDay = moment();
        vm.updateLabel();
    }

    vm.goBack = function(){
        // Si no lo clonamos, se cambia el dia en la UI del calendario
        vm.currentDay = vm.currentDay.clone();
        if (vm.period == 'all')
            vm.currentDay.subtract(1, 'month');
        else if (vm.period == 'week')
            vm.currentDay.subtract(1, 'week');
        else
            vm.currentDay.subtract(1, 'year');

        vm.updateLabel();
    }

    vm.goForward = function() {
        vm.currentDay = vm.currentDay.clone();
        if (vm.period == 'all')
            vm.currentDay.add(1, 'month');
        else if (vm.period == 'week')
            vm.currentDay.add(1, 'week');
        else
            vm.currentDay.add(1, 'year');

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
}

angular
    .module('inspinia')
	.controller('DateCtrl', DateCtrl)
