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
			// https://150.241.54.111/login/?next=/training/1004/presence

			this.availableTimeRatio = null;
//			this.timeLine = null;
			var component = this;
			var container = document.getElementById('timeline');
			var chart = null;
			
			function onChartLoadCB() {
				chart = new google.visualization.Timeline(container);
//				for (var element in $scope.timeline) {
//					var toWatch = "timeline['"+element+"'].data";
//					$scope.$watch(toWatch, drawChart);
//				}
				$scope.$watch("timeline", drawChart, true);
				drawChart();
			}

			google.charts.load('current', {'packages':['timeline']});
			google.charts.setOnLoadCallback(onChartLoadCB);
			
			function drawChart() {
				var timeline = $scope.timeline;
				var dataTable = new google.visualization.DataTable();
				var periodType = dateService.getPeriod();

				var options = {
						legend: { position: 'none' },
						//focusTarget: 'category',
						avoidOverlappingGridLines:false,
						tooltip: {
							//trigger: 'selection',
							isHtml: true,
							textStyle: {
								fontName: '"Open Sans", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"'
									//fontSize: intFontSizeAnnotation
							}
						},
						//enableInteractivity: false,
						fontName: '"Open Sans", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"',
						//hAxis: {
						//  format: 'HH:mm',
						//  //gridlines: {count: 12}
						//},
						hAxis: {
							//format:'d'
							//format:'EEE'
							//format: 'HH:mm',
						},
						height: 64,
						timeline: {
							alternatingRowStyle:false,
							//showRowLabels: false,
							//groupByRowLabel: false
							//colorByRowLabel: true
							rowLabelStyle: {fontName: '"Open Sans", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"', fontSize: 12, color: 'rgb(106, 108, 111)' },
							barLabelStyle: { fontName: '"Open Sans", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"', fontSize: 12 },
							showBarLabels: false
						},
						colors: []
				};

				switch ( periodType ) {
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
				}


				var element, row_data, label, timelinedata, start, end;
				var elements =[];
				for (var iLine=0; iLine < timeline.lines.length; ++iLine) { //timeline.toJSON()) {
					elements.push(timeline.lines[iLine].label);
				}

				dataTable.addColumn({ type: 'string', id: 'Position' });
				dataTable.addColumn({ type: 'string', id: 'Name' });
				dataTable.addColumn({ type: 'string', role: 'tooltip', id: 'Tooltip', 'p': {'html': true} });
				dataTable.addColumn({ type: 'date', id: 'Start' });
				dataTable.addColumn({ type: 'date', id: 'End' });


				for (var iLine=0; iLine < timeline.lines.length; ++iLine) {
					var rows = [];
					row_data = timeline.lines[iLine];//.get ( element );
					label = row_data['label'];//.get('label');
					timelinedata = row_data['data'];//.get('timelinedata');
					timelinedata.forEach( function ( datum, index, data ) {
						if ( index+1 < data.length ) {
							var valueDescr = row_data.getDescription(datum[1]);
							var progPiece = datum[2] || "";
							start = moment(datum[0], "X");
							end = moment(data[index+1][0], "X");
							if ( end > start ) {
								if ( options.colors.indexOf ( row_data.colors[valueDescr] ) === - 1 ) { options.colors.push(row_data.colors[valueDescr]) }
								rows.push( [label, valueDescr, createCustomHTMLContent(valueDescr, progPiece, start, end), start.toDate(), end.toDate()] );
							}
						}
					} );					

					options.height += 41;
					dataTable.addRows( rows );
				}

				google.visualization.events.addListener(chart, 'ready', function(e) {
//					component.$('#timeline > div div:nth-of-type(3)').css ( "display", "none" );
//
//					Ember.run.scheduleOnce('afterRender', this, function () {
//						Ember.run.scheduleOnce('afterRender', this, function () {
//							component.$('#timeline > div div:nth-of-type(3)').css ( "display", "block" );
//						} );
//					} );
				});

				if ( dataTable.getNumberOfRows() > 0 ) {
					chart.draw(dataTable, options);
				} else {
					chart.clearChart();
				}

				// Every time the table fires the "select" event, it should call your selectHandler() function.
				//google.visualization.events.addListener(chart, 'select', getOnSelectHandler(chart, dataTable));
			}

			function getOnSelectHandler( chart, dataTable ) {
				return function selectHandler(e) {
					var selection = chart.getSelection();

					if (dateService.getPeriod() === 'day' && selection.length ) {
						var table_row = dataTable.Tf[selection[0].row];

						//alert('A table row was selected ' + selection.length + ' items.');
						//component.$('.timeline-panel').css('display', 'block');
						if (table_row.c && table_row.c[3].v ) {
							component.selected_start_date = moment(table_row.c[3].v).format('X');
						}
						else { component.selected_start_date = null; }

						if (table_row.c && table_row.c[4].v ) {
							component.selected_end_date = moment(table_row.c[4].v).format('X');
						}
						else { component.selected_end_date = null; }

						component.show_timeline_panel = true;
					}
				};
			}

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
				/*
                                       '<div class="google-visualization-tooltip-separator"></div>' +
                                       '<ul class="google-visualization-tooltip-action-list">' +
                                       '<li class="google-visualization-tooltip-action">' +
                                       '<button id="tooltip_button" type="submit" class="btn btn-zayer-success btn-block"> Show </button>' +
                                       '</li>' +
                                       '</ul>' +
                                       '</div>' +
				 */
				'</div>';
				return content;
			}
		}
	};
}

angular
.module('inspinia')
.directive('timeline', timeline)
