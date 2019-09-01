// function TrendsCtrl($scope, $http, $window, $parse, $compile, dateService, machineService, DTOptionsBuilder, DTColumnDefBuilder, toaster) {
function NowCtrl2($scope, $http,$timeout, dateService, DTOptionsBuilder,$window) {
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
    }

    vm.goToday = function(){
        vm.currentDay = moment();
        vm.updateLabel();
        getLiveData();
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
        getLiveData();
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
        getLiveData();
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
                greenCar();
                yellowCar();
                fhvCar();
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
    
    function greenCar(){
        try {
            var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Trips per hour"
            },
            axisY: {
                title: "Quantity"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "0- 23 hours",
                dataPoints: [      
                    { y: that.liveData.green.agrupado2.total_amount['0'], label: "0" },
                    { y: that.liveData.green.agrupado2.total_amount['1'],  label: "1" },
                    { y: that.liveData.green.agrupado2.total_amount['2'],  label: "2" },
                    { y: that.liveData.green.agrupado2.total_amount['3'],  label: "3" },
                    { y: that.liveData.green.agrupado2.total_amount['4'],  label: "4" },
                    { y: that.liveData.green.agrupado2.total_amount['5'], label: "5" },
                    { y: that.liveData.green.agrupado2.total_amount['6'],  label: "6" },
                    { y: that.liveData.green.agrupado2.total_amount['7'],  label: "7" },
                    { y: that.liveData.green.agrupado2.total_amount['8'], label: "8" },
                    { y: that.liveData.green.agrupado2.total_amount['9'],  label: "9" },
                    { y: that.liveData.green.agrupado2.total_amount['10'],  label: "10" },
                    { y: that.liveData.green.agrupado2.total_amount['11'],  label: "11" },
                    { y: that.liveData.green.agrupado2.total_amount['12'],  label: "12" },
                    { y: that.liveData.green.agrupado2.total_amount['13'], label: "13" },
                    { y: that.liveData.green.agrupado2.total_amount['14'],  label: "14" },
                    { y: that.liveData.green.agrupado2.total_amount['15'],  label: "15" },
                    { y: that.liveData.green.agrupado2.total_amount['16'], label: "16" },
                    { y: that.liveData.green.agrupado2.total_amount['17'],  label: "17" },
                    { y: that.liveData.green.agrupado2.total_amount['18'],  label: "18" },
                    { y: that.liveData.green.agrupado2.total_amount['19'],  label: "19" },
                    { y: that.liveData.green.agrupado2.total_amount['20'],  label: "20" },
                    { y: that.liveData.green.agrupado2.total_amount['21'], label: "21" },
                    { y: that.liveData.green.agrupado2.total_amount['22'],  label: "22" },
                    { y: that.liveData.green.agrupado2.total_amount['23'],  label: "23" }
                    ]
                }]
            });
            chart.render();
        }catch{
            try{
                var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                title:{
                    text: "Trips per hour"
                },
                axisY: {
                    title: "Quantity"
                },
                data: [{        
                    type: "column",  
                    showInLegend: true, 
                    legendMarkerColor: "grey",
                    legendText: "0- 23 hours",
                    dataPoints: [      
                        { y: that.liveData.green.agrupado2.Total_amount['0'], label: "0" },
                        { y: that.liveData.green.agrupado2.Total_amount['1'],  label: "1" },
                        { y: that.liveData.green.agrupado2.Total_amount['2'],  label: "2" },
                        { y: that.liveData.green.agrupado2.Total_amount['3'],  label: "3" },
                        { y: that.liveData.green.agrupado2.Total_amount['4'],  label: "4" },
                        { y: that.liveData.green.agrupado2.Total_amount['5'], label: "5" },
                        { y: that.liveData.green.agrupado2.Total_amount['6'],  label: "6" },
                        { y: that.liveData.green.agrupado2.Total_amount['7'],  label: "7" },
                        { y: that.liveData.green.agrupado2.Total_amount['8'], label: "8" },
                        { y: that.liveData.green.agrupado2.Total_amount['9'],  label: "9" },
                        { y: that.liveData.green.agrupado2.Total_amount['10'],  label: "10" },
                        { y: that.liveData.green.agrupado2.Total_amount['11'],  label: "11" },
                        { y: that.liveData.green.agrupado2.Total_amount['12'],  label: "12" },
                        { y: that.liveData.green.agrupado2.Total_amount['13'], label: "13" },
                        { y: that.liveData.green.agrupado2.Total_amount['14'],  label: "14" },
                        { y: that.liveData.green.agrupado2.Total_amount['15'],  label: "15" },
                        { y: that.liveData.green.agrupado2.Total_amount['16'], label: "16" },
                        { y: that.liveData.green.agrupado2.Total_amount['17'],  label: "17" },
                        { y: that.liveData.green.agrupado2.Total_amount['18'],  label: "18" },
                        { y: that.liveData.green.agrupado2.Total_amount['19'],  label: "19" },
                        { y: that.liveData.green.agrupado2.Total_amount['20'],  label: "20" },
                        { y: that.liveData.green.agrupado2.Total_amount['21'], label: "21" },
                        { y: that.liveData.green.agrupado2.Total_amount['22'],  label: "22" },
                        { y: that.liveData.green.agrupado2.Total_amount['23'],  label: "23" }
                        ]
                    }]
                });
                chart.render();
            }catch{
                var elemento = document.getElementById("chartContainer");
                elemento.innerHTML = "There is not data in the selected period";
            }
        }
    try {
            var chart = new CanvasJS.Chart("chartContainer5", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Passenger qty per hour"
            },
            axisY: {
                title: "Quantity"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "0- 23 hours",
                dataPoints: [      
                    { y: that.liveData.green.agrupado.passenger_count['0'], label: "0" },
                    { y: that.liveData.green.agrupado.passenger_count['1'],  label: "1" },
                    { y: that.liveData.green.agrupado.passenger_count['2'],  label: "2" },
                    { y: that.liveData.green.agrupado.passenger_count['3'],  label: "3" },
                    { y: that.liveData.green.agrupado.passenger_count['4'],  label: "4" },
                    { y: that.liveData.green.agrupado.passenger_count['5'], label: "5" },
                    { y: that.liveData.green.agrupado.passenger_count['6'],  label: "6" },
                    { y: that.liveData.green.agrupado.passenger_count['7'],  label: "7" },
                    { y: that.liveData.green.agrupado.passenger_count['8'], label: "8" },
                    { y: that.liveData.green.agrupado.passenger_count['9'],  label: "9" },
                    { y: that.liveData.green.agrupado.passenger_count['10'],  label: "10" },
                    { y: that.liveData.green.agrupado.passenger_count['11'],  label: "11" },
                    { y: that.liveData.green.agrupado.passenger_count['12'],  label: "12" },
                    { y: that.liveData.green.agrupado.passenger_count['13'], label: "13" },
                    { y: that.liveData.green.agrupado.passenger_count['14'],  label: "14" },
                    { y: that.liveData.green.agrupado.passenger_count['15'],  label: "15" },
                    { y: that.liveData.green.agrupado.passenger_count['16'], label: "16" },
                    { y: that.liveData.green.agrupado.passenger_count['17'],  label: "17" },
                    { y: that.liveData.green.agrupado.passenger_count['18'],  label: "18" },
                    { y: that.liveData.green.agrupado.passenger_count['19'],  label: "19" },
                    { y: that.liveData.green.agrupado.passenger_count['20'],  label: "20" },
                    { y: that.liveData.green.agrupado.passenger_count['21'], label: "21" },
                    { y: that.liveData.green.agrupado.passenger_count['22'],  label: "22" },
                    { y: that.liveData.green.agrupado.passenger_count['23'],  label: "23" }
                            ]
                        }]
                    });
                    chart.render();
        }catch{
            try{
                var chart = new CanvasJS.Chart("chartContainer5", {
                animationEnabled: true,
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                title:{
                    text: "Passenger qty per hour"
                },
                axisY: {
                    title: "Quantity"
                },
                data: [{        
                    type: "column",  
                    showInLegend: true, 
                    legendMarkerColor: "grey",
                    legendText: "0- 23 hours",
                    dataPoints: [      
                        { y: that.liveData.green.agrupado.Passenger_count['0'], label: "0" },
                        { y: that.liveData.green.agrupado.Passenger_count['1'],  label: "1" },
                        { y: that.liveData.green.agrupado.Passenger_count['2'],  label: "2" },
                        { y: that.liveData.green.agrupado.Passenger_count['3'],  label: "3" },
                        { y: that.liveData.green.agrupado.Passenger_count['4'],  label: "4" },
                        { y: that.liveData.green.agrupado.Passenger_count['5'], label: "5" },
                        { y: that.liveData.green.agrupado.Passenger_count['6'],  label: "6" },
                        { y: that.liveData.green.agrupado.Passenger_count['7'],  label: "7" },
                        { y: that.liveData.green.agrupado.Passenger_count['8'], label: "8" },
                        { y: that.liveData.green.agrupado.Passenger_count['9'],  label: "9" },
                        { y: that.liveData.green.agrupado.Passenger_count['10'],  label: "10" },
                        { y: that.liveData.green.agrupado.Passenger_count['11'],  label: "11" },
                        { y: that.liveData.green.agrupado.Passenger_count['12'],  label: "12" },
                        { y: that.liveData.green.agrupado.Passenger_count['13'], label: "13" },
                        { y: that.liveData.green.agrupado.Passenger_count['14'],  label: "14" },
                        { y: that.liveData.green.agrupado.Passenger_count['15'],  label: "15" },
                        { y: that.liveData.green.agrupado.Passenger_count['16'], label: "16" },
                        { y: that.liveData.green.agrupado.Passenger_count['17'],  label: "17" },
                        { y: that.liveData.green.agrupado.Passenger_count['18'],  label: "18" },
                        { y: that.liveData.green.agrupado.Passenger_count['19'],  label: "19" },
                        { y: that.liveData.green.agrupado.Passenger_count['20'],  label: "20" },
                        { y: that.liveData.green.agrupado.Passenger_count['21'], label: "21" },
                        { y: that.liveData.green.agrupado.Passenger_count['22'],  label: "22" },
                        { y: that.liveData.green.agrupado.Passenger_count['23'],  label: "23" }
                                ]
                            }]
                        });
                        chart.render();
            }catch{
                var elemento = document.getElementById("chartContainer5");
                elemento.innerHTML = "There is not data in the selected period";
            }
        }
        try {
            var chart = new CanvasJS.Chart("chartContainer7", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Income per hour"
            },
            axisY: {
                title: "$"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "0- 23 hours",
                dataPoints: [      
                    { y: that.liveData.green.agrupado.total_amount['0'], label: "0" },
                    { y: that.liveData.green.agrupado.total_amount['1'],  label: "1" },
                    { y: that.liveData.green.agrupado.total_amount['2'],  label: "2" },
                    { y: that.liveData.green.agrupado.total_amount['3'],  label: "3" },
                    { y: that.liveData.green.agrupado.total_amount['4'],  label: "4" },
                    { y: that.liveData.green.agrupado.total_amount['5'], label: "5" },
                    { y: that.liveData.green.agrupado.total_amount['6'],  label: "6" },
                    { y: that.liveData.green.agrupado.total_amount['7'],  label: "7" },
                    { y: that.liveData.green.agrupado.total_amount['8'], label: "8" },
                    { y: that.liveData.green.agrupado.total_amount['9'],  label: "9" },
                    { y: that.liveData.green.agrupado.total_amount['10'],  label: "10" },
                    { y: that.liveData.green.agrupado.total_amount['11'],  label: "11" },
                    { y: that.liveData.green.agrupado.total_amount['12'],  label: "12" },
                    { y: that.liveData.green.agrupado.total_amount['13'], label: "13" },
                    { y: that.liveData.green.agrupado.total_amount['14'],  label: "14" },
                    { y: that.liveData.green.agrupado.total_amount['15'],  label: "15" },
                    { y: that.liveData.green.agrupado.total_amount['16'], label: "16" },
                    { y: that.liveData.green.agrupado.total_amount['17'],  label: "17" },
                    { y: that.liveData.green.agrupado.total_amount['18'],  label: "18" },
                    { y: that.liveData.green.agrupado.total_amount['19'],  label: "19" },
                    { y: that.liveData.green.agrupado.total_amount['20'],  label: "20" },
                    { y: that.liveData.green.agrupado.total_amount['21'], label: "21" },
                    { y: that.liveData.green.agrupado.total_amount['22'],  label: "22" },
                    { y: that.liveData.green.agrupado.total_amount['23'],  label: "23" }
                ]
            }]
        });
        chart.render();
        }catch{
            try{
                    var chart = new CanvasJS.Chart("chartContainer7", {
                    animationEnabled: true,
                    theme: "light2", // "light1", "light2", "dark1", "dark2"
                    title:{
                        text: "Income per hour"
                    },
                    axisY: {
                        title: "$"
                    },
                    data: [{        
                        type: "column",  
                        showInLegend: true, 
                        legendMarkerColor: "grey",
                        legendText: "0- 23 hours",
                        dataPoints: [      
                            { y: that.liveData.green.agrupado.Total_amount['0'], label: "0" },
                            { y: that.liveData.green.agrupado.Total_amount['1'],  label: "1" },
                            { y: that.liveData.green.agrupado.Total_amount['2'],  label: "2" },
                            { y: that.liveData.green.agrupado.Total_amount['3'],  label: "3" },
                            { y: that.liveData.green.agrupado.Total_amount['4'],  label: "4" },
                            { y: that.liveData.green.agrupado.Total_amount['5'], label: "5" },
                            { y: that.liveData.green.agrupado.Total_amount['6'],  label: "6" },
                            { y: that.liveData.green.agrupado.Total_amount['7'],  label: "7" },
                            { y: that.liveData.green.agrupado.Total_amount['8'], label: "8" },
                            { y: that.liveData.green.agrupado.Total_amount['9'],  label: "9" },
                            { y: that.liveData.green.agrupado.Total_amount['10'],  label: "10" },
                            { y: that.liveData.green.agrupado.Total_amount['11'],  label: "11" },
                            { y: that.liveData.green.agrupado.Total_amount['12'],  label: "12" },
                            { y: that.liveData.green.agrupado.Total_amount['13'], label: "13" },
                            { y: that.liveData.green.agrupado.Total_amount['14'],  label: "14" },
                            { y: that.liveData.green.agrupado.Total_amount['15'],  label: "15" },
                            { y: that.liveData.green.agrupado.Total_amount['16'], label: "16" },
                            { y: that.liveData.green.agrupado.Total_amount['17'],  label: "17" },
                            { y: that.liveData.green.agrupado.Total_amount['18'],  label: "18" },
                            { y: that.liveData.green.agrupado.Total_amount['19'],  label: "19" },
                            { y: that.liveData.green.agrupado.Total_amount['20'],  label: "20" },
                            { y: that.liveData.green.agrupado.Total_amount['21'], label: "21" },
                            { y: that.liveData.green.agrupado.Total_amount['22'],  label: "22" },
                            { y: that.liveData.green.agrupado.Total_amount['23'],  label: "23" }
                        ]
                    }]
                });
                chart.render();
            }catch{
                var elemento = document.getElementById("chartContainer7");
                elemento.innerHTML = "There is not data in the selected period";    
            }
        }
        //agrupado.trip_distance
        try {
            var chart = new CanvasJS.Chart("chartContainer9", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Trip distance per hour"
            },
            axisY: {
                title: "miles"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "0- 23 hours",
                dataPoints: [      
                    { y: that.liveData.green.agrupado.trip_distance['0'], label: "0" },
                    { y: that.liveData.green.agrupado.trip_distance['1'],  label: "1" },
                    { y: that.liveData.green.agrupado.trip_distance['2'],  label: "2" },
                    { y: that.liveData.green.agrupado.trip_distance['3'],  label: "3" },
                    { y: that.liveData.green.agrupado.trip_distance['4'],  label: "4" },
                    { y: that.liveData.green.agrupado.trip_distance['5'], label: "5" },
                    { y: that.liveData.green.agrupado.trip_distance['6'],  label: "6" },
                    { y: that.liveData.green.agrupado.trip_distance['7'],  label: "7" },
                    { y: that.liveData.green.agrupado.trip_distance['8'], label: "8" },
                    { y: that.liveData.green.agrupado.trip_distance['9'],  label: "9" },
                    { y: that.liveData.green.agrupado.trip_distance['10'],  label: "10" },
                    { y: that.liveData.green.agrupado.trip_distance['11'],  label: "11" },
                    { y: that.liveData.green.agrupado.trip_distance['12'],  label: "12" },
                    { y: that.liveData.green.agrupado.trip_distance['13'], label: "13" },
                    { y: that.liveData.green.agrupado.trip_distance['14'],  label: "14" },
                    { y: that.liveData.green.agrupado.trip_distance['15'],  label: "15" },
                    { y: that.liveData.green.agrupado.trip_distance['16'], label: "16" },
                    { y: that.liveData.green.agrupado.trip_distance['17'],  label: "17" },
                    { y: that.liveData.green.agrupado.trip_distance['18'],  label: "18" },
                    { y: that.liveData.green.agrupado.trip_distance['19'],  label: "19" },
                    { y: that.liveData.green.agrupado.trip_distance['20'],  label: "20" },
                    { y: that.liveData.green.agrupado.trip_distance['21'], label: "21" },
                    { y: that.liveData.green.agrupado.trip_distance['22'],  label: "22" },
                    { y: that.liveData.green.agrupado.trip_distance['23'],  label: "23" }
                ]
            }]
        });
        chart.render();
        }catch{
            try{
                    var chart = new CanvasJS.Chart("chartContainer9", {
                    animationEnabled: true,
                    theme: "light2", // "light1", "light2", "dark1", "dark2"
                    title:{
                        text: "Trip distance per hour"
                    },
                    axisY: {
                        title: "miles"
                    },
                    data: [{        
                        type: "column",  
                        showInLegend: true, 
                        legendMarkerColor: "grey",
                        legendText: "0- 23 hours",
                        dataPoints: [      
                            { y: that.liveData.green.agrupado.Trip_distance['0'], label: "0" },
                            { y: that.liveData.green.agrupado.Trip_distance['1'],  label: "1" },
                            { y: that.liveData.green.agrupado.Trip_distance['2'],  label: "2" },
                            { y: that.liveData.green.agrupado.Trip_distance['3'],  label: "3" },
                            { y: that.liveData.green.agrupado.Trip_distance['4'],  label: "4" },
                            { y: that.liveData.green.agrupado.Trip_distance['5'], label: "5" },
                            { y: that.liveData.green.agrupado.Trip_distance['6'],  label: "6" },
                            { y: that.liveData.green.agrupado.Trip_distance['7'],  label: "7" },
                            { y: that.liveData.green.agrupado.Trip_distance['8'], label: "8" },
                            { y: that.liveData.green.agrupado.Trip_distance['9'],  label: "9" },
                            { y: that.liveData.green.agrupado.Trip_distance['10'],  label: "10" },
                            { y: that.liveData.green.agrupado.Trip_distance['11'],  label: "11" },
                            { y: that.liveData.green.agrupado.Trip_distance['12'],  label: "12" },
                            { y: that.liveData.green.agrupado.Trip_distance['13'], label: "13" },
                            { y: that.liveData.green.agrupado.Trip_distance['14'],  label: "14" },
                            { y: that.liveData.green.agrupado.Trip_distance['15'],  label: "15" },
                            { y: that.liveData.green.agrupado.Trip_distance['16'], label: "16" },
                            { y: that.liveData.green.agrupado.Trip_distance['17'],  label: "17" },
                            { y: that.liveData.green.agrupado.Trip_distance['18'],  label: "18" },
                            { y: that.liveData.green.agrupado.Trip_distance['19'],  label: "19" },
                            { y: that.liveData.green.agrupado.Trip_distance['20'],  label: "20" },
                            { y: that.liveData.green.agrupado.Trip_distance['21'], label: "21" },
                            { y: that.liveData.green.agrupado.Trip_distance['22'],  label: "22" },
                            { y: that.liveData.green.agrupado.Trip_distance['23'],  label: "23" }
                        ]
                    }]
                });
                chart.render();
            }catch{
                var elemento = document.getElementById("chartContainer9");
                elemento.innerHTML = "There is not data in the selected period";
            }
        }
        
    }
    function yellowCar(){
        try {
            var chart = new CanvasJS.Chart("chartContainer2", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Trips per hour"
            },
            axisY: {
                title: "Quantity"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "0- 23 hours",
                dataPoints: [      
                    { y: that.liveData.yellow.agrupado2.total_amount['0'], label: "0" },
                    { y: that.liveData.yellow.agrupado2.total_amount['1'],  label: "1" },
                    { y: that.liveData.yellow.agrupado2.total_amount['2'],  label: "2" },
                    { y: that.liveData.yellow.agrupado2.total_amount['3'],  label: "3" },
                    { y: that.liveData.yellow.agrupado2.total_amount['4'],  label: "4" },
                    { y: that.liveData.yellow.agrupado2.total_amount['5'], label: "5" },
                    { y: that.liveData.yellow.agrupado2.total_amount['6'],  label: "6" },
                    { y: that.liveData.yellow.agrupado2.total_amount['7'],  label: "7" },
                    { y: that.liveData.yellow.agrupado2.total_amount['8'], label: "8" },
                    { y: that.liveData.yellow.agrupado2.total_amount['9'],  label: "9" },
                    { y: that.liveData.yellow.agrupado2.total_amount['10'],  label: "10" },
                    { y: that.liveData.yellow.agrupado2.total_amount['11'],  label: "11" },
                    { y: that.liveData.yellow.agrupado2.total_amount['12'],  label: "12" },
                    { y: that.liveData.yellow.agrupado2.total_amount['13'], label: "13" },
                    { y: that.liveData.yellow.agrupado2.total_amount['14'],  label: "14" },
                    { y: that.liveData.yellow.agrupado2.total_amount['15'],  label: "15" },
                    { y: that.liveData.yellow.agrupado2.total_amount['16'], label: "16" },
                    { y: that.liveData.yellow.agrupado2.total_amount['17'],  label: "17" },
                    { y: that.liveData.yellow.agrupado2.total_amount['18'],  label: "18" },
                    { y: that.liveData.yellow.agrupado2.total_amount['19'],  label: "19" },
                    { y: that.liveData.yellow.agrupado2.total_amount['20'],  label: "20" },
                    { y: that.liveData.yellow.agrupado2.total_amount['21'], label: "21" },
                    { y: that.liveData.yellow.agrupado2.total_amount['22'],  label: "22" },
                    { y: that.liveData.yellow.agrupado2.total_amount['23'],  label: "23" }
                ]
            }]
        });
        chart.render();
        }catch{
            try{
                var chart = new CanvasJS.Chart("chartContainer2", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Trips per hour"
            },
            axisY: {
                title: "Quantity"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "0- 23 hours",
                dataPoints: [      
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['0'], label: "0" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['1'],  label: "1" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['2'],  label: "2" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['3'],  label: "3" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['4'],  label: "4" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['5'], label: "5" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['6'],  label: "6" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['7'],  label: "7" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['8'], label: "8" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['9'],  label: "9" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['10'],  label: "10" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['11'],  label: "11" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['12'],  label: "12" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['13'], label: "13" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['14'],  label: "14" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['15'],  label: "15" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['16'], label: "16" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['17'],  label: "17" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['18'],  label: "18" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['19'],  label: "19" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['20'],  label: "20" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['21'], label: "21" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['22'],  label: "22" },
                    { y: that.liveData.yellow.agrupado2[" total_amount"]['23'],  label: "23" }
                ]
            }]
        });
        chart.render();
            }catch{
                var elemento = document.getElementById("chartContainer2");
                elemento.innerHTML = "There is not data in the selected period";
            }
            
        }
        
        try {
            var chart = new CanvasJS.Chart("chartContainer4", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Passenger qty per hour"
            },
            axisY: {
                title: "Quantity"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "0- 23 hours",
                dataPoints: [      
                    { y: that.liveData.yellow.agrupado.passenger_count['0'], label: "0" },
                    { y: that.liveData.yellow.agrupado.passenger_count['1'],  label: "1" },
                    { y: that.liveData.yellow.agrupado.passenger_count['2'],  label: "2" },
                    { y: that.liveData.yellow.agrupado.passenger_count['3'],  label: "3" },
                    { y: that.liveData.yellow.agrupado.passenger_count['4'],  label: "4" },
                    { y: that.liveData.yellow.agrupado.passenger_count['5'], label: "5" },
                    { y: that.liveData.yellow.agrupado.passenger_count['6'],  label: "6" },
                    { y: that.liveData.yellow.agrupado.passenger_count['7'],  label: "7" },
                    { y: that.liveData.yellow.agrupado.passenger_count['8'], label: "8" },
                    { y: that.liveData.yellow.agrupado.passenger_count['9'],  label: "9" },
                    { y: that.liveData.yellow.agrupado.passenger_count['10'],  label: "10" },
                    { y: that.liveData.yellow.agrupado.passenger_count['11'],  label: "11" },
                    { y: that.liveData.yellow.agrupado.passenger_count['12'],  label: "12" },
                    { y: that.liveData.yellow.agrupado.passenger_count['13'], label: "13" },
                    { y: that.liveData.yellow.agrupado.passenger_count['14'],  label: "14" },
                    { y: that.liveData.yellow.agrupado.passenger_count['15'],  label: "15" },
                    { y: that.liveData.yellow.agrupado.passenger_count['16'], label: "16" },
                    { y: that.liveData.yellow.agrupado.passenger_count['17'],  label: "17" },
                    { y: that.liveData.yellow.agrupado.passenger_count['18'],  label: "18" },
                    { y: that.liveData.yellow.agrupado.passenger_count['19'],  label: "19" },
                    { y: that.liveData.yellow.agrupado.passenger_count['20'],  label: "20" },
                    { y: that.liveData.yellow.agrupado.passenger_count['21'], label: "21" },
                    { y: that.liveData.yellow.agrupado.passenger_count['22'],  label: "22" },
                    { y: that.liveData.yellow.agrupado.passenger_count['23'],  label: "23" }
                ]
            }]
        });
        chart.render();
        }catch{
            try{
                var chart = new CanvasJS.Chart("chartContainer4", {
                    animationEnabled: true,
                    theme: "light2", // "light1", "light2", "dark1", "dark2"
                    title:{
                        text: "Passenger qty per hour"
                    },
                    axisY: {
                        title: "Quantity"
                    },
                    data: [{        
                        type: "column",  
                        showInLegend: true, 
                        legendMarkerColor: "grey",
                        legendText: "0- 23 hours",
                        dataPoints: [      
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['0'], label: "0" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['1'],  label: "1" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['2'],  label: "2" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['3'],  label: "3" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['4'],  label: "4" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['5'], label: "5" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['6'],  label: "6" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['7'],  label: "7" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['8'], label: "8" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['9'],  label: "9" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['10'],  label: "10" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['11'],  label: "11" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['12'],  label: "12" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['13'], label: "13" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['14'],  label: "14" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['15'],  label: "15" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['16'], label: "16" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['17'],  label: "17" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['18'],  label: "18" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['19'],  label: "19" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['20'],  label: "20" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['21'], label: "21" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['22'],  label: "22" },
                            { y: that.liveData.yellow.agrupado[" passenger_count"]['23'],  label: "23" }
                        ]
                    }]
                });
                chart.render();
            }catch{
                var elemento = document.getElementById("chartContainer4");
                elemento.innerHTML = "There is not data in the selected period";
            }
            
        }
        try {
            var chart = new CanvasJS.Chart("chartContainer6", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Income per hour"
            },
            axisY: {
                title: "$"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "0- 23 hours",
                dataPoints: [      
                    { y: that.liveData.yellow.agrupado.total_amount['0'], label: "0" },
                    { y: that.liveData.yellow.agrupado.total_amount['1'],  label: "1" },
                    { y: that.liveData.yellow.agrupado.total_amount['2'],  label: "2" },
                    { y: that.liveData.yellow.agrupado.total_amount['3'],  label: "3" },
                    { y: that.liveData.yellow.agrupado.total_amount['4'],  label: "4" },
                    { y: that.liveData.yellow.agrupado.total_amount['5'], label: "5" },
                    { y: that.liveData.yellow.agrupado.total_amount['6'],  label: "6" },
                    { y: that.liveData.yellow.agrupado.total_amount['7'],  label: "7" },
                    { y: that.liveData.yellow.agrupado.total_amount['8'], label: "8" },
                    { y: that.liveData.yellow.agrupado.total_amount['9'],  label: "9" },
                    { y: that.liveData.yellow.agrupado.total_amount['10'],  label: "10" },
                    { y: that.liveData.yellow.agrupado.total_amount['11'],  label: "11" },
                    { y: that.liveData.yellow.agrupado.total_amount['12'],  label: "12" },
                    { y: that.liveData.yellow.agrupado.total_amount['13'], label: "13" },
                    { y: that.liveData.yellow.agrupado.total_amount['14'],  label: "14" },
                    { y: that.liveData.yellow.agrupado.total_amount['15'],  label: "15" },
                    { y: that.liveData.yellow.agrupado.total_amount['16'], label: "16" },
                    { y: that.liveData.yellow.agrupado.total_amount['17'],  label: "17" },
                    { y: that.liveData.yellow.agrupado.total_amount['18'],  label: "18" },
                    { y: that.liveData.yellow.agrupado.total_amount['19'],  label: "19" },
                    { y: that.liveData.yellow.agrupado.total_amount['20'],  label: "20" },
                    { y: that.liveData.yellow.agrupado.total_amount['21'], label: "21" },
                    { y: that.liveData.yellow.agrupado.total_amount['22'],  label: "22" },
                    { y: that.liveData.yellow.agrupado.total_amount['23'],  label: "23" }
                ]
            }]
        });
        chart.render();
        }catch{
            try{
                var chart = new CanvasJS.Chart("chartContainer6", {
                animationEnabled: true,
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                title:{
                    text: "Income per hour"
                },
                axisY: {
                    title: "$"
                },
                data: [{        
                    type: "column",  
                    showInLegend: true, 
                    legendMarkerColor: "grey",
                    legendText: "0- 23 hours",
                    dataPoints: [      
                        { y: that.liveData.yellow.agrupado[" total_amount"]['0'], label: "0" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['1'],  label: "1" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['2'],  label: "2" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['3'],  label: "3" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['4'],  label: "4" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['5'], label: "5" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['6'],  label: "6" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['7'],  label: "7" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['8'], label: "8" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['9'],  label: "9" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['10'],  label: "10" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['11'],  label: "11" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['12'],  label: "12" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['13'], label: "13" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['14'],  label: "14" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['15'],  label: "15" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['16'], label: "16" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['17'],  label: "17" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['18'],  label: "18" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['19'],  label: "19" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['20'],  label: "20" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['21'], label: "21" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['22'],  label: "22" },
                        { y: that.liveData.yellow.agrupado[" total_amount"]['23'],  label: "23" }
                    ]
                }]
            });
            chart.render();
            }catch{
                var elemento = document.getElementById("chartContainer6");
                elemento.innerHTML = "There is not data in the selected period";
            }
        }
        //agrupado.trip_distance
        try {
            var chart = new CanvasJS.Chart("chartContainer8", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Trip distance per hour"
            },
            axisY: {
                title: "miles"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "0- 23 hours",
                dataPoints: [      
                    { y: that.liveData.yellow.agrupado.trip_distance['0'], label: "0" },
                    { y: that.liveData.yellow.agrupado.trip_distance['1'],  label: "1" },
                    { y: that.liveData.yellow.agrupado.trip_distance['2'],  label: "2" },
                    { y: that.liveData.yellow.agrupado.trip_distance['3'],  label: "3" },
                    { y: that.liveData.yellow.agrupado.trip_distance['4'],  label: "4" },
                    { y: that.liveData.yellow.agrupado.trip_distance['5'], label: "5" },
                    { y: that.liveData.yellow.agrupado.trip_distance['6'],  label: "6" },
                    { y: that.liveData.yellow.agrupado.trip_distance['7'],  label: "7" },
                    { y: that.liveData.yellow.agrupado.trip_distance['8'], label: "8" },
                    { y: that.liveData.yellow.agrupado.trip_distance['9'],  label: "9" },
                    { y: that.liveData.yellow.agrupado.trip_distance['10'],  label: "10" },
                    { y: that.liveData.yellow.agrupado.trip_distance['11'],  label: "11" },
                    { y: that.liveData.yellow.agrupado.trip_distance['12'],  label: "12" },
                    { y: that.liveData.yellow.agrupado.trip_distance['13'], label: "13" },
                    { y: that.liveData.yellow.agrupado.trip_distance['14'],  label: "14" },
                    { y: that.liveData.yellow.agrupado.trip_distance['15'],  label: "15" },
                    { y: that.liveData.yellow.agrupado.trip_distance['16'], label: "16" },
                    { y: that.liveData.yellow.agrupado.trip_distance['17'],  label: "17" },
                    { y: that.liveData.yellow.agrupado.trip_distance['18'],  label: "18" },
                    { y: that.liveData.yellow.agrupado.trip_distance['19'],  label: "19" },
                    { y: that.liveData.yellow.agrupado.trip_distance['20'],  label: "20" },
                    { y: that.liveData.yellow.agrupado.trip_distance['21'], label: "21" },
                    { y: that.liveData.yellow.agrupado.trip_distance['22'],  label: "22" },
                    { y: that.liveData.yellow.agrupado.trip_distance['23'],  label: "23" }]
                    }]
                });
                chart.render();
        }catch{
            try{
                var chart = new CanvasJS.Chart("chartContainer8", {
                animationEnabled: true,
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                title:{
                    text: "Trip distance per hour"
                },
                axisY: {
                    title: "miles"
                },
                data: [{        
                    type: "column",  
                    showInLegend: true, 
                    legendMarkerColor: "grey",
                    legendText: "0- 23 hours",
                    dataPoints: [      
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['0'], label: "0" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['1'],  label: "1" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['2'],  label: "2" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['3'],  label: "3" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['4'],  label: "4" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['5'], label: "5" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['6'],  label: "6" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['7'],  label: "7" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['8'], label: "8" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['9'],  label: "9" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['10'],  label: "10" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['11'],  label: "11" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['12'],  label: "12" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['13'], label: "13" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['14'],  label: "14" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['15'],  label: "15" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['16'], label: "16" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['17'],  label: "17" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['18'],  label: "18" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['19'],  label: "19" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['20'],  label: "20" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['21'], label: "21" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['22'],  label: "22" },
                        { y: that.liveData.yellow.agrupado[" trip_distance"]['23'],  label: "23" }]
                        }]
                    });
                    chart.render();
            }catch{
                var elemento = document.getElementById("chartContainer8");
                elemento.innerHTML = "There is not data in the selected period";
            }
        }
    }
    //
    function fhvCar(){
        try {
            var chart = new CanvasJS.Chart("chartContainer3", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Trips per hour"
            },
            axisY: {
                title: "Quantity"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "0- 23 hours",
                dataPoints: [      
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['0'], label: "0" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['1'],  label: "1" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['2'],  label: "2" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['3'],  label: "3" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['4'],  label: "4" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['5'], label: "5" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['6'],  label: "6" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['7'],  label: "7" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['8'], label: "8" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['9'],  label: "9" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['10'],  label: "10" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['11'],  label: "11" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['12'],  label: "12" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['13'], label: "13" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['14'],  label: "14" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['15'],  label: "15" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['16'], label: "16" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['17'],  label: "17" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['18'],  label: "18" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['19'],  label: "19" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['20'],  label: "20" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['21'], label: "21" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['22'],  label: "22" },
                    { y: that.liveData.fhv.agrupado2.lpep_pickup_datetime['23'],  label: "23" }
                ]
            }]
        });
        chart.render();
        }catch{
            var elemento = document.getElementById("chartContainer3");
            elemento.innerHTML = "There is not data in the selected period";
        }
    }

}

angular
    .module('inspinia')
    .controller('NowCtrl2', NowCtrl2)
