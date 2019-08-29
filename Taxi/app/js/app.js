/**
 * INSPINIA - Responsive Admin Theme
 *
 */
function DurationToString(duration) {
	var retString = "";
	var hours = Math.floor(duration.asHours());
	if ( hours )
		retString += " " + hours + "h";
	var minutes = duration.minutes();
	if ( hours || minutes )
		retString += " " + minutes + "min";
	var seconds = duration.seconds();
	if ( seconds || (!hours && !minutes) )
		retString += " " + seconds + "sec";
	return retString.trim();
};

function AjaxErrorHandler($window, dataAccessMsg) {
	return function(response) {
        console.log(response.status)
		switch ( response.status ) {
		case 401:
			alert("Session expired / not started");
			$window.location.href = "/Taxi/";
			break;
		default:
			alert(dataAccessMsg + ": Error " + response.status);
		}		
	};
};

(function () {
    angular.module('inspinia', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'ui.knob',                      // Ui ng-knob
        'angular-flot',                 // Ui flot
    ])
})();

