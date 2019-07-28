/**
 * 
 */
function timeline() {
	return {
		restrict: 'E',
		scope: {
//			config: '=config',
//			close: '=close'
			timeline: '=timeline'
		},
		templateUrl: 'views/timeline.html',
		controller: function ($scope, $element, dateService) {
            // console.log("datos entrada timeline")
            // console.log($scope)
            // console.log($element)
            // console.log(dateService)
            // console.log("fin datos entrada timeline")
			// this.availableTimeRatio = null;
//			this.timeLine = null;
            // var component = this;
            var container = document.getElementById('timeline');
            // var chart = null;
            var timelineObj = null;
			
            /*
			function onChartLoadCB() {
				chart = new google.visualization.Timeline(container);
//				for (var element in $scope.timeline) {
//					var toWatch = "timeline['"+element+"'].data";
//					$scope.$watch(toWatch, drawChart);
//				}
				$scope.$watch("timeline", drawChart, true);
				drawChart();
			}
            */

			function getTitle(tlitem, tlnextItem){
				var start = new Date(tlitem[0] * 1000);
				var end = new Date(tlnextItem[0] * 1000);
                var mode = "Off";
                if( tlitem[1] != 0 )
                    mode = tlitem[2];
                /*
				var mode;
				switch (tlitem[1]){
					case 0: mode = "Off"; break;
					case 1: mode = "Analitycs"; break;
					case 2: mode = "Part set-up"; break;
					case 3: mode = "Error"; break;
					default: mode = "Unknown"; break;
				}
                */
				var durationSecs = tlnextItem[0] - tlitem[0];
				var lenMin = parseInt(durationSecs / 60);
				var lenSec = durationSecs % 60;
				var lenHr = parseInt(lenMin / 60);
				lenMin = lenMin % 60;
				var lenStr = "";
				if (lenHr > 0) lenStr += lenHr + "h ";
				lenStr += lenMin + "m " + lenSec + "s";
                var html = ""
                console.log(tlitem)
                if (tlitem[1] <= 1) {
                    html = "<span class=\"timelineProduction" + tlitem[1] + "\"><b>" + mode + "</b></span><br><b>Interval:</b> " + 
                        start.toLocaleTimeString() + " - " + end.toLocaleTimeString() + "<br><b>Duration:</b> " + lenStr;
                } else {
                    html = "<span class=\"timelineProduction" + tlitem[1] + "\"><b>" + mode + " (" + tlitem[1] + ")" + "</b></span><br><b>Interval:</b> " + 
                        start.toLocaleTimeString() + " - " + end.toLocaleTimeString() + "<br><b>Duration:</b> " + lenStr;
                }
                /*
				if (tlitem[2].length > 0)
					html += "<br><b>Part:</b> " + tlitem[2];
                */
				return html;
			}
			
			function drawChart() {
                // console.log("Dentro de drawChart")
				var timeline = $scope.timeline;
                var groups = new vis.DataSet();
                var items = new vis.DataSet();
                var groupId = 1;
                var itemId = 1;
                var start = 0, end = 0;
                // console.log(timeline);
                for (var tlgroup in timeline){
                    // console.log(tlgroup);
                    groups.add({'id': groupId, 'content': tlgroup});
                    if (start == 0 && timeline[tlgroup].length > 0){
                        start = timeline[tlgroup][0][0] * 1000;
                        end = timeline[tlgroup][timeline[tlgroup].length - 1][0] * 1000;
                    }
                    if (tlgroup == "Mold"){
                        for (var i = 0; i < timeline[tlgroup].length - 1; i++){
                            // console.log('timeline' + tlgroup + timeline[tlgroup][i][1]);
                            items.add({
                                'id': itemId, 
                                'group': groupId, 
                                'start': new Date(timeline[tlgroup][i][0] * 1000), 
                                'end': new Date(timeline[tlgroup][i + 1][0] * 1000), 
                                'className': 'timeline' + tlgroup + timeline[tlgroup][i][1],
                                'content': '',
                                'title': getTitle(timeline[tlgroup][i], timeline[tlgroup][i + 1])
                            });
                            itemId++;
                        }
                    } else if(tlgroup === "Status") {
                        for (var i = 0; i < timeline[tlgroup].length - 1; i++){
                            // console.log('timeline' + tlgroup + timeline[tlgroup][i][1]);
                            items.add({
                                'id': itemId, 
                                'group': groupId, 
                                'start': new Date(timeline[tlgroup][i][0] * 1000), 
                                'end': new Date(timeline[tlgroup][i + 1][0] * 1000), 
                                'className': 'timeline' + tlgroup + timeline[tlgroup][i][1],
                                'content': '',
                                'title': getTitle(timeline[tlgroup][i], timeline[tlgroup][i + 1])
                            });
                            itemId++;
                        }
                    }
                      
                    groupId++;
                }

                var options = {
                    stack: false,
                    start: start,
                    end: end,
                    moveable: false,
                    selectable: false,
                    editable: false,
                    margin: {
                        item: 10, // minimal margin between items
                        axis: 5   // minimal margin between items and the axis
                    }
                };

                if (timelineObj != null) timelineObj.destroy();
                timelineObj = new vis.Timeline(container, null, options);
                timelineObj.setGroups(groups);
                timelineObj.setItems(items);

				var periodType = dateService.getPeriod();

				/*switch ( periodType ) {
                    case 'day':
                        options.hAxis.format= 'HH:mm';
                        break;
                    case 'week':
                        //options.hAxis.format= 'EEE';
                        delete options.hAxis.format;
                        break;
                    case 'month':
                        //options.hAxis.format= 'd';
                        delete options.hAxis.format;
                        break;
				}*/
			}

            drawChart();
            $scope.$watch("timeline", drawChart, true);

            /*
			function createCustomHTMLContent(title, program, start, end) {
				var content = '<div class="google-visualization-tooltip" style="pointer-events: none;">' +
				'<ul class="google-visualization-tooltip-item-list">' +
				'<li class="google-visualization-tooltip-item">' +
				'<span white-space: nowrap; style="font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 12px; color: rgb(0, 0, 0); margin: 0px; text-decoration: none; font-weight: bold;">' +
				title +
				'</span>' +
				'</li>';

				if ( program ) {
					content = content + '<li class="google-visualization-tooltip-action">' +
					'<span style="font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 12px; color: rgb(0, 0, 0); margin: 0px; text-decoration: none; font-weight: bold;">' +
					'Program path:  ' +
					'</span>' +
					'<span style="white-space: nowrap; font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 12px; color: rgb(0, 0, 0); margin: 0px; text-decoration: none;">' +
					program +
					'</span>' +
					'</li>';
				}

				content = content + '</ul>' +
				'<div class="google-visualization-tooltip-separator"></div>' +
				'<ul class="google-visualization-tooltip-action-list">' +
				'<li class="google-visualization-tooltip-action">' +
				'<span style="font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 12px; color: rgb(0, 0, 0); margin: 0px; text-decoration: none; font-weight: bold;">' +
				'Interval:  ' +
				'</span>' +
				'<span style="white-space: nowrap; font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 12px; color: rgb(0, 0, 0); margin: 0px; text-decoration: none;">' +
				start.format("h:mma") + ' - ' + end.format("h:mma") +
				'</span>' +
				'</li>' +
				'<li class="google-visualization-tooltip-action">' +
				'<span style="font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 12px; color: rgb(0, 0, 0); margin: 0px; text-decoration: none; font-weight: bold;">' +
				'Duration:  ' +
				'</span>' +
				'<span style="white-space: nowrap; font-family: &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 12px; color: rgb(0, 0, 0); margin: 0px; text-decoration: none;">' +
				moment.preciseDiff(start, end) + //'24 hours' +
				'</span>' +
				'</li>' +
				'</ul>' +
				'</div>' +
                                       // '<div class="google-visualization-tooltip-separator"></div>' +
                                       // '<ul class="google-visualization-tooltip-action-list">' +
                                       // '<li class="google-visualization-tooltip-action">' +
                                       // '<button id="tooltip_button" type="submit" class="btn btn-zayer-success btn-block"> Show </button>' +
                                       // '</li>' +
                                       // '</ul>' +
                                       // '</div>' +
				'</div>';
				return content;
			}
            */
		}
	};
}

angular
.module('inspinia')
.directive('timelineii', timeline)
