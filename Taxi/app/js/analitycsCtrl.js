function AnalitycsCtrl($scope, $http, $window, $parse, $compile, dateService, machineService, DTOptionsBuilder, DTColumnDefBuilder, toaster) {
	$scope.timeline = {
		'Status': [],
		'Mold': []
	}

	this.baseUrl = "http://10.8.0.105:5000";
	var controller = this;

	function getProgramsAndVars(){
        // console.log("getProgramsAndVars");

        // console.log(controller.baseUrl + "/analitycs/" + dateService.getPeriod() + "/" + dateService.getDate());
        // console.log(dateService.getPeriod());
        datestr = dateService.getDate();
        var year = datestr.slice(0,4);
        var month = datestr.slice(4, 6)-1;
        var day = datestr.slice(6, 8);
        // console.log("year: " + year);
        // console.log("month: " + month);
        // console.log("day: " + day);
        var start_time = null;
        var end_time = null;
        var interval_time = getIntervalTime( year, month, day, dateService.getPeriod() );
        if( interval_time != null && interval_time.length == 2) {
            start_time = interval_time[0];
            end_time   = interval_time[1];
        }
        // console.log(new Date(year, month, day, 0, 0, 0).getTime());
        // console.log(new Date(year, month, day, 23, 59, 59).getTime());
        // console.log( start_time )
        // console.log( end_time )

        $http.get(controller.baseUrl + '/timeline?period=' + dateService.getPeriod() + '&start=' + start_time + '&end=' + end_time).then(function(response) {
            $scope.analitycs = response.data;
            // console.log(response.data);

            // Timeline
			$scope.timeline['Status'] = $scope.analitycs.tlStatus;
			$scope.timeline['Mold'] = $scope.analitycs.tlMold;
            // console.log($scope.timeline['Mold'])
						
        });
    }

    $scope.dataset = {data1: [], data2: [], data3: [], data4: [], timeformat: "%d.%m.%Y %H.%M", tickSize: [2, "hour"] };
    $scope.group   = {data: [], timeformat: "%d.%m.%Y %H.%M", tickSize: [2, "hour"] };

    function getIntervalTime( year, month, day, period ) {
        var now = Date.now();
        var start_time = null;
        var end_time = null;
        daytime = 86400.0;
        // console.log( dateService.getPeriod() )
        switch( dateService.getPeriod() ) {
            case "week":
                // console.log("week")
                date_value = new Date(year, month, day, 0, 0, 0);
                day_of_week = date_value.getDay();
                if( day_of_week == 0 ) {
                    day_of_week = 7;
                }
                start_time = new Date(year, month, day - day_of_week + 1, 0, 0, 0).getTime() / 1000;
                end_time   = start_time + (daytime * 7);
                $scope.dataset.tickSize = [1, "day"];
                $scope.dataset.timeformat = "%d.%m";
                break;
            case "month":
                // console.log("month")
                date_value = new Date(year, month+1, 0);
                month_days = date_value.getDate();
                // console.log("month_days");
                // console.log(month_days);
                start_time = new Date(year, month, 1, 0, 0, 0).getTime() / 1000;
                end_time   = start_time + (daytime * month_days);
                $scope.dataset.tickSize = [1, "day"];
                $scope.dataset.timeformat = "%d";
                break;
            default:
            case "day":
                // console.log("day")
                start_time = new Date(year, month, day, 0, 0, 0).getTime() / 1000;
                end_time   = start_time + daytime;
                $scope.dataset.tickSize = [2, "hour"];
                $scope.dataset.timeformat = "%H:%M";
                break;
        }

        if( end_time > (now / 1000) ) {
            end_time = now / 1000;
        }

        return [start_time, end_time];

    }

    function getIntervalTime2( year, month, day, period ) {
        var now = Date.now();
        var start_time = null;
        var end_time = null;
        daytime = 86400.0;
        // console.log( dateService.getPeriod() )
        switch( dateService.getPeriod() ) {
            case "week":
                // console.log("week")
                date_value = new Date(year, month, day, 0, 0, 0);
                day_of_week = date_value.getDay();
                if( day_of_week == 0 ) {
                    day_of_week = 7;
                }
                start_time = new Date(year, month, day - day_of_week + 1, 0, 0, 0).getTime() / 1000;
                end_time   = start_time + (daytime * 7);
                $scope.group.tickSize = [1, "day"];
                $scope.group.timeformat = "%d.%m";
                break;
            case "month":
                // console.log("month")
                date_value = new Date(year, month+1, 0);
                month_days = date_value.getDate();
                // console.log("month_days");
                // console.log(month_days);
                start_time = new Date(year, month, 1, 0, 0, 0).getTime() / 1000;
                end_time   = start_time + (daytime * month_days);
                $scope.group.tickSize = [1, "day"];
                $scope.group.timeformat = "%d";
                break;
            default:
            case "day":
                // console.log("day")
                start_time = new Date(year, month, day, 0, 0, 0).getTime() / 1000;
                end_time   = start_time + daytime;
                $scope.group.tickSize = [2, "hour"];
                $scope.group.timeformat = "%H:%M";
                break;
        }

        if( end_time > (now / 1000) ) {
            end_time = now / 1000;
        }

        return [start_time, end_time];

    }

    function getColumnHistory() {
        datestr = dateService.getDate();
        var year = datestr.slice(0,4);
        var month = datestr.slice(4, 6)-1;
        var day = datestr.slice(6, 8);

        var start_time = null;
        var end_time = null;
        var interval_time = getIntervalTime( year, month, day, dateService.getPeriod() );
        if( interval_time != null && interval_time.length == 2) {
            start_time = interval_time[0];
            end_time   = interval_time[1];
        }

        // console.log( "start_time y end_time" );
        // console.log( start_time );
        // console.log( end_time );

        $http.get(controller.baseUrl + '/colshistory?start=' + start_time + '&end=' + end_time).then(function(response) {
            // console.log( response.data );
            /*
            if( response.data.col1.length > 0 ) {
                console.log( response.data.col1[0][0] );
            } else {
                console.log( "No se han recibido datos" );
            }
            */

            for( i = 0; i < response.data.col1.length; ++i ) {
                response.data.col1[i][0] = new Date(parseInt(response.data.col1[i][0]*1000));
                response.data.col2[i][0] = new Date(parseInt(response.data.col2[i][0]*1000));
                response.data.col3[i][0] = new Date(parseInt(response.data.col3[i][0]*1000));
                response.data.col4[i][0] = new Date(parseInt(response.data.col4[i][0]*1000));
            }
            // console.log( response.data.col1 );

            $scope.dataset.data1 = response.data.col1;
            $scope.dataset.data2 = response.data.col2;
            $scope.dataset.data3 = response.data.col3;
            $scope.dataset.data4 = response.data.col4;

            // console.log("$scope.dataset.data1[0]:");
            // console.log($scope.dataset.data1[0]);
            // console.log($scope.dataset.tickSize);

            $("<div id='tooltip'></div>").css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                // padding: "2px",
                color: "#fff",
                "background-color": "black",
                padding: "5px 0",
                "z-index": "100",
                // border-radius: "6px",
                // "background-color": "#fee",
                opacity: 0.60
            }).appendTo("body");

            $.plot( $("#flot-dataset"), [
                    {label: "col1 (%)", data: $scope.dataset.data1}, 
                    {label: "col2 (%)", data: $scope.dataset.data2}, 
                    {label: "col3 (%)", data: $scope.dataset.data3}, 
                    {label: "col4 (%)", data: $scope.dataset.data4}], {
                xaxis: {
                    mode: "time",
                    timeformat: $scope.dataset.timeformat,
                    tickSize: $scope.dataset.tickSize,
                    timezone: "browser"
                },
                yaxis: {
                    mode: "number",
                    tickSize: 10
                },
                legend: {
                    alignTicksWithAxis: 1,
                    show: true
                },
                grid: {
                    color: "#9a999e",
                    hoverable: true,
                    clickable: true,
                    tickColor: "#D4D4D4",
                    borderWidth: 0
                },
                series: {
                    lines: {show: true}
                }
            });

            $("#flot-dataset").bind("plothover", function (event, pos, item) {

                if (item) {
                    var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);

                    // xDate = new Date(x*1000);
                    // $("#tooltip").html(item.series.label + " " + xDate.toLocaleDateString()+ " " + xDate.toLocaleTimeString() + " = " + y)
                    $("#tooltip").html(item.series.label + " = " + y)
                    .css({top: item.pageY-40, left: item.pageX-100})
                    .fadeIn(200);
                } else {
                    $("#tooltip").hide();
                }
            });

        });

    }

    function getGroupHistory() {
        // console.log("getgroupHistory");

        datestr = dateService.getDate();
        var year = datestr.slice(0,4);
        var month = datestr.slice(4, 6)-1;
        var day = datestr.slice(6, 8);

        var start_time = null;
        var end_time = null;
        var interval_time = getIntervalTime2( year, month, day, dateService.getPeriod() );
        if( interval_time != null && interval_time.length == 2) {
            start_time = interval_time[0];
            end_time   = interval_time[1];
        }

        // console.log( "start_time y end_time" );
        // console.log( start_time );
        // console.log( end_time );

        $http.get(controller.baseUrl + '/grupo?start=' + start_time + '&end=' + end_time).then(function(response) {
            // console.log( response.data );
            /*
            if( response.data.energy.length > 0 ) {
                console.log( response.data.energy[0][0] );
            } else {
                console.log( "No se han recibido datos" );
            }
            */

            for( i = 0; i < response.data.energy.length; ++i ) {
                response.data.energy[i][0] = new Date(parseInt(response.data.energy[i][0]*1000));
            }

            $scope.group.data = response.data.energy;

            // console.log("$scope.group.data[0]:");
            // console.log($scope.group.data[0]);
            // console.log($scope.group.timeformat);
            // console.log($scope.group.tickSize);

            $("<div id='tooltip'></div>").css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                // padding: "2px",
                color: "#fff",
                "background-color": "black",
                padding: "5px 0",
                "z-index": "100",
                // border-radius: "6px",
                // "background-color": "#fee",
                opacity: 0.60
            }).appendTo("body");

            $.plot( $("#flot-group"), [
                    {label: "energy (Wh)", data: $scope.group.data}], {
                xaxis: {
                    mode: "time",
                    timeformat: $scope.group.timeformat,
                    tickSize: $scope.group.tickSize,
                    timezone: "browser"
                },
                /* yaxis: {
                    mode: "number",
                    tickSize: 1000
                }, */
                legend: {
                    alignTicksWithAxis: 1,
                    show: true
                },
                grid: {
                    color: "#9a999e",
                    hoverable: true,
                    clickable: true,
                    tickColor: "#D4D4D4",
                    borderWidth: 0
                },
                series: {
                    lines: {show: true}
                }
            });

            $("#flot-group").bind("plothover", function (event, pos, item) {

                if (item) {
                    var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);

                    // xDate = new Date(x*1000);
                    // $("#tooltip").html(item.series.label + " " + xDate.toLocaleDateString()+ " " + xDate.toLocaleTimeString() + " = " + y)
                    // $("#tooltip").html(item.series.label + " of " + x + " = " + y)
                    $("#tooltip").html(item.series.label + " = " + y)
                    .css({top: item.pageY-40, left: item.pageX-150})
                    .fadeIn(200);
                } else {
                    $("#tooltip").hide();
                }
            });

        });

    }

    $scope.durationToString = DurationToString;

    function format ( program ) {
        // console.log("format");
    	//console.log(program);
        // `d` is the original data object for the row
    	var html =	'<table class="table table-condensed col-md-6">'+
    					'<thead>'+
    						'<th>Start</th>'+
    						'<th>Duration</th>'+
    					'</thead>';
    	var iRun = 0;
    	for (iRun = 0; iRun < program.executions.length; ++iRun) {
    		html += '<tr>'+
    					'<td><a ui-sref="index.trace({program:\''+program.name+'\', timestamp:' + program.executions[iRun].timestamp + '})">'+moment(program.executions[iRun].timestamp, "X").format("MMM Do YYYY, HH:mm:ss")+'</a></td>'+
    					'<td>'+DurationToString(moment.duration(program.executions[iRun].duration, 'seconds'))+'</td>'+
    				'</tr>';
    	}
    	html += '</table>';
    	return html;
    }

	$scope.toggleDetail = function() {
        // console.log("kk3");
		var tableElem = $('#partPrograms');
		var table = tableElem.DataTable();
		var row = table.row(this.$index);

		var rowChild = row.child();
		if (row.child.isShown()) {
			// This row is already open - close it
			this.areChildrenShown = false;
			row.child.hide();
		} else {
			// Open this row
			this.areChildrenShown = true;
			row.child(format(this.program)).show();
			// console.log(tableElem.contents());
			$compile(row.child().contents())($scope);
		}
	}

	$scope.$on('date-changed', function(event, data){
		getProgramsAndVars();
        getColumnHistory();
        getGroupHistory();
	});

	$scope.$on('machine-changed', function(event, data){
		getProgramsAndVars();
        getColumnHistory();
        getGroupHistory();
	});

    $scope.$on('$destroy', function() {
        $("#tooltip").hide();
    });

    getProgramsAndVars();
    getColumnHistory();
    getGroupHistory();

}

angular
    .module('inspinia')
    .controller('AnalitycsCtrl', AnalitycsCtrl)
