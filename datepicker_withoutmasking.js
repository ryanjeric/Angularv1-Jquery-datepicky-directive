hcare
/*
 AUTHOR :RYANJERIC 
 DATEPICKY USING UI JQUERY

READ.MD

USAGE :

<date-picky ng-model="sample" name="samplename" txtbox-id="sampleid" 
    config="{ dateFormat: 'mm/dd/yy',placeholder : 'mm/dd/yyyy' altFormat : ['mm/yy'] }">
</date-picky>

ng-model  = STRING
ng-required = bool
name      = STRING
txtbox-id = STRING
config    = OBJECT

Config Options 
   * dateFormat  : String 'mm/dd/yy' // FOR NOW WE CAN ONLY USE THIS FORMAT
   * placeholder : String like 'Birthday' / 'Birthdate' / 'Breakup date' / 'Last Date you cried'
   * altFormat   : Array U CAN ONLY USE THIS FORMAT - 'mm/yy' , 'yy'
*/ 
.directive('datePicky', function($timeout, $interval) {
    // Runs during compile
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            name: '@',
            txtboxId: "@",
            config: '=',
            ngRequired: "="
        },
        templateUrl: '/scripts/directives/datepicker/datepicky/datepicky.tpl.html',
        replace: true,
        link: function($scope, iElm, iAttrs, controller) {
            $scope.option = {
                placeholder: $scope.placeholder || 'mm/dd/yyyy',
                required: $scope.ngRequired || false,
            };
            $scope.validateData = function(data) {
                if (data) {
                    var datepickerData = data.split("/");
                    if (datepickerData.length == 1 ) {
                        // IF length is 1 its a YEAR 
                        if (($scope.config.altFormat && ($scope.config.altFormat.indexOf("yy")!=-1)) || $scope.config.dateFormat == 'yy') {
                            if (!(datepickerData[0] > 1800 && datepickerData[0].length==4)) { //Unless you were born in YEAR 1800 below this statement is invalid
                                controller.$setValidity('yearValid', false);
                            } else {
                                controller.$setValidity('yearValid', true);
                            }
                        } else {
                            controller.$setValidity('validFormat', false);
                        }
                    }else{
                        controller.$setValidity('yearValid', true);
                    }
                    if (datepickerData.length == 2) {
                        // IF length is 2 its MONTH/YEAR 
                        if (($scope.config.altFormat && ($scope.config.altFormat.indexOf("mm/yy")!=-1)) || $scope.config.dateFormat == 'mm/yy') {
                            // lest validate 1st the month
                            if (!(datepickerData[0] < 13)) {
                                controller.$setValidity('monthValid', false);
                            } else {
                                controller.$setValidity('monthValid', true);
                            }
                            // Yr validate
                            if (!(datepickerData[1] > 1800 && datepickerData[1].length==4)) {
                                controller.$setValidity('yearmonthValid', false);
                            } else {
                                controller.$setValidity('yearmonthValid', true);
                            }
                            if ((datepickerData[0] < 13) && (datepickerData[1] > 1800)) {
                                controller.$setValidity('validFormat', true);
                            }
                        } 
                        else {
                            controller.$setValidity('validFormat', false);
                        }
                    }else{
                        controller.$setValidity('monthValid', true);
                        controller.$setValidity('yearmonthValid', true);
                    }

                    if (datepickerData.length == 3) {
                        // IF 3 Full DATE FORMAT IS ALWAYS MM/DD/YYYY
                        if (($scope.config.altFormat && ($scope.config.altFormat.indexOf("mm/dd/yy")!=-1)) || $scope.config.dateFormat == 'mm/dd/yy') {
                            // lest validate da date using moment
                            if ((moment(data, "MM/DD/YYYY", true).isValid() || moment(data, "M/D/YYYY", true).isValid() || moment(data, "MM/D/YYYY", true).isValid() || moment(data, "M/DD/YYYY", true).isValid()) && datepickerData.length == 3) {
                                controller.$setValidity('dateValid', true);
                                controller.$setValidity('validFormat', true);
                            } else {
                                controller.$setValidity('dateValid', false);
                            }
                        } else {
                            controller.$setValidity('validFormat', false);
                        }
                    }else{
                        controller.$setValidity('dateValid', true);
                    }
                }
            }
            $scope.formDate = controller;
        }
    };
}).directive('redatepicker', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            var attributes = scope.$eval(attrs.redatepicker);
            scope.$watch(attrs.redatepicker, function(data) {
                attributes = data;
                $(function() {
                    //ALL OPTIONS ARE HERE MY FRIEND - http://api.jqueryui.com/datepicker/  
                    element.datepicker({
                        dateFormat: 'mm/dd/yy', // attributes.dateFormat ,
                        changeMonth: true,
                        changeYear: true,
                        showOn: "button",
                        showButtonPanel: true,
                        buttonImage: "scripts/directives/datepicker/datepicky/calendar-solid.png",
                        buttonImageOnly: true,
                        constrainInput: false,
                        buttonText: "Select date",
                        onSelect: function(date) {
                            scope.$apply(function() {
                                ngModelCtrl.$setViewValue(date);
                            });
                        },
                        onChangeMonthYear: function(year,month){
                            var $datepicker = jQuery(this);
                            var date = new Date($datepicker.datepicker("getDate"));
                            var lastDayOfMonth = new Date(year, month, 0).getDate();
                            var preservedDay = Math.min(lastDayOfMonth, Math.max(1, date.getDate()));
                            $datepicker.datepicker("setDate", month + "/" + preservedDay + "/" + year);
                        },
                        forceParse: false
                    });
                    if (attributes.disabled) {
                        // THIS THING CLEARING THE INPUT FIELD maybe it does parsing it to date why u doin this..
                        //element.datepicker({ disabled: true });
                        //element.datepicker( "option", "disabled", true );
                    } else {
                        // ADDED forceParse: false still not working
                        //element.datepicker({ disabled: false,forceParse: false });
                        //element.datepicker( "option", "disabled", false );
                    }
                });
            })
        }
    };
});