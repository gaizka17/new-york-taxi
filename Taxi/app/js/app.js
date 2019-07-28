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

(function () {
    angular.module('inspinia', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'ui.knob',                      // Ui ng-knob
        'angular-flot',                 // Ui flot
    ])
})();

