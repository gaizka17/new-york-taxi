/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/indexSystem/mainSystem");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('indexSystem', {
                abstract: true,
                url: "/indexSystem",
                templateUrl: "views/common/contentSystem.html",
                resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                name: 'datePicker',
                                files: ['js/plugins/moment/moment.min.js',
                                        'css/plugins/datapicker/angular-datapicker.css',
                                        'js/plugins/datapicker/angular-datepicker.js']
                            },
                            {
                                insertBefore: '#loadBefore',
                                name: 'toaster',
                                files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                            }
                        ]);
                    }
                }
            })
        .state('indexSystem.mainSystem', {
                url: "/mainSystem",
                templateUrl: "views/system/main.html",
                data: { pageTitle: 'Now!' },
                resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                name: 'datatables',
                                files: ['js/plugins/dataTables/angular-datatables.min.js',
                                        'js/plugins/dataTables/dom-text.js']
                            },
                            {
                                serie: true,
                                name: 'datatables.buttons',
                                files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                            }
                   ]);
            }
            }
            })
        .state('menuprincipal', {
            url: "/menuprincipal",
            templateUrl: "views/mp31/index.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js',
                                    'js/plugins/dataTables/dom-text.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        }
               ]);
        }
        }})
        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'datePicker',
                            files: ['js/plugins/moment/moment.min.js',
                                    'css/plugins/datapicker/angular-datapicker.css',
                                    'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/mp31/main.html",
            data: { pageTitle: 'Now!' },
            resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                name: 'datatables',
                                files: ['js/plugins/dataTables/angular-datatables.min.js',
                                        'js/plugins/dataTables/dom-text.js']
                            },
                            {
                                serie: true,
                                name: 'datatables.buttons',
                                files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                            }
                   ]);
            }
            }
        })
        .state('index.minor1', {
            url: "/minor1",
            templateUrl: "views/mp31/minor1.html",
            data: { pageTitle: 'Timelog' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js',
                                    'js/plugins/dataTables/dom-text.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
                        {
                            name: 'ui.select',
                            files: ['js/plugins/ui-select/select.min.js', 'css/plugins/ui-select/select.min.css']
                        },
                        {
                            name: 'angular-flot',
                            files: ['js/plugins/flot/angular-flot.js']
                        }
               ]);
        }
        }
        })
        .state('index.minor2', {
            url: "/minor2",
            templateUrl: "views/mp31/minor2.html",
            data: { pageTitle: 'Mold Log' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js',
                                    'js/plugins/dataTables/dom-text.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
                        {
                            name: 'ui.select',
                            files: ['js/plugins/ui-select/select.min.js', 'css/plugins/ui-select/select.min.css']
                        },
                        {
                            name: 'angular-flot',
                            files: ['js/plugins/flot/angular-flot.js']
                        }
               ]);
        }
        }
        })
        .state('index.analitycs', {
            url: "/analitycs",
            templateUrl: "views/mp31/analitycs.html",
            data: { pageTitle: 'Time Log' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
//                        {
//                            insertBefore: '#loadBefore',
//                            name: 'localytics.directives',
//                            files: ['css/plugins/chosen/chosen.css','js/plugins/chosen/chosen.jquery.js','js/plugins/chosen/chosen.js']
//                        },
                        {
                            serie: true,
                            name: 'datePicker',
                            files: ['js/plugins/moment/moment.min.js',
                                    'css/plugins/datapicker/angular-datapicker.css',
                                    'js/plugins/datapicker/angular-datepicker.js']
                        },
//                        {
//                            serie: true,
//                            files: ['js/plugins/moment/moment.min.js',
//                                    'js/plugins/moment/moment-precise-range.js']
//                        },
//                        {
//                            name: 'angular-flot',
//                            files: ['js/plugins/flot/angular-flot.js']
//                        },
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js',
                                    'js/plugins/dataTables/dom-text.js']
                        }
//                        {
//                            name: 'datatables.buttons',
//                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
//                        },
                    ]);
                }
            }
        })
        .state('indexMP32', {
                abstract: true,
                url: "/indexMP32",
                templateUrl: "views/common/contentMP32.html",
                resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                name: 'datePicker',
                                files: ['js/plugins/moment/moment.min.js',
                                        'css/plugins/datapicker/angular-datapicker.css',
                                        'js/plugins/datapicker/angular-datepicker.js']
                            },
                            {
                                insertBefore: '#loadBefore',
                                name: 'toaster',
                                files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                            }
                        ]);
                    }
                }
            })
        .state('indexMP32.mainMP32', {
                url: "/mainMP32",
                templateUrl: "views/mp32/main.html",
                data: { pageTitle: 'Now!' },
        resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                name: 'datatables',
                                files: ['js/plugins/dataTables/angular-datatables.min.js',
                                        'js/plugins/dataTables/dom-text.js']
                            },
                            {
                                serie: true,
                                name: 'datatables.buttons',
                                files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                            }
                   ]);
            }
            }
            })
        .state('indexMP32.minor', {
            url: "/minorMP32",
            templateUrl: "views/mp32/minor.html",
            data: { pageTitle: 'Embridaje' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js',
                                    'js/plugins/dataTables/dom-text.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
                        {
                            name: 'ui.select',
                            files: ['js/plugins/ui-select/select.min.js', 'css/plugins/ui-select/select.min.css']
                        },
                        {
                            name: 'angular-flot',
                            files: ['js/plugins/flot/angular-flot.js']
                        }
               ]);
        }
        }
        })
        .state('indexMP32.minor1', {
            url: "/minor1MP32",
            templateUrl: "views/mp32/minor1.html",
            data: { pageTitle: 'Timelog' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js',
                                    'js/plugins/dataTables/dom-text.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
                        {
                            name: 'ui.select',
                            files: ['js/plugins/ui-select/select.min.js', 'css/plugins/ui-select/select.min.css']
                        },
                        {
                            name: 'angular-flot',
                            files: ['js/plugins/flot/angular-flot.js']
                        }
               ]);
        }
        }
        })
        .state('indexMP32.minor2', {
                url: "/minor2MP32",
                templateUrl: "views/mp32/minor2.html",
                data: { pageTitle: 'Mold log' },
                resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                name: 'datatables',
                                files: ['js/plugins/dataTables/angular-datatables.min.js',
                                        'js/plugins/dataTables/dom-text.js']
                            },
                            {
                                serie: true,
                                name: 'datatables.buttons',
                                files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                            }
                   ]);
            }
            }
            })
}
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
