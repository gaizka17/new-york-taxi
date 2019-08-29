function DateCtrl($scope, dateService){

    var vm = this;
    vm.currentDay = moment();
    vm.currentDayLabel = '';
    vm.period = 'month';
    vm.radioModel = '';
    vm.isCalendarVisible = false;
    vm.todayBtnStr = "This month";
    vm.bThisPeriod = true;

    vm.updateLabel = function(){
        console.log("En datectrl")
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
    }

    vm.goToday = function(){
        vm.currentDay = moment();
        vm.updateLabel();
    }

    vm.goBack = function(){
        console.log("Estoy aqui dos")
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
}

angular
    .module('inspinia')
	.controller('DateCtrl', DateCtrl)
