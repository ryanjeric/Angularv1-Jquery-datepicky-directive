hcare.directive('datePicky', function($timeout, $interval, store, Momentservice) {
    // Runs during compile
    return {
        restrict: 'E',
        require: ['ngModel', '^form'],
        scope: {
            ngModel: '=',
            name: '@',
            txtboxId: "@",
            config: '=',
            ngRequired: "=",
            onDateChange: '&',
            onDateBlur: '&',
            onDateKeypress: '&',
            inputStyle: "=",
            mirrorDate: '=',
            ngDisabled: '=',
            tabIndex: "@",
            checkErr: '='
        },
        templateUrl: '/scripts/directives/datepicker/datepicky/datepicky.tpl.html',
        replace: true,
        link: function($scope, iElm, iAttrs, controller) {
            $scope.formDate = controller[0]; // model
            $scope.myForm = controller[1] // ^form
            $scope.$watch(function() {
                return $scope.myForm.$submitted;
            }, function(currentValue) {
                $scope.submitted = currentValue;
            });
            $scope.myStyle = $scope.inputStyle ? $scope.inputStyle : {
                'width': '95px'
            };
            $scope.option = {
                placeholder: $scope.config.placeholder || 'mm/dd/yyyy',
                required: $scope.ngRequired || false,
            }; 
            $scope.noErrMsg = $scope.config.noErrMsg || 'false';

            /*CHECK IF VARIABLE VALUE IS INTEGER*/
            var isInt = function(value) {
                return !isNaN(value) && (function(x) {
                    return (x | 0) === x;
                })(parseFloat(value))
            }
            /*CHECK IF HAS INTEGER*/
            var hasInt = function(value) {
                var matches = value.match(/\d+/g);
                if (matches != null) {
                    return true;
                }
                return false;
            }
            //ONBLUR
            $scope.blurr = function() {
                $scope.formDate.$setTouched();
                $scope.onDateBlur(); //if exist will trigger
            }
            //ONkeypress
            $scope.keypress = function() {
                $scope.onDateKeypress(); //if exist will trigger
                $scope.onDateChange(); //if exist will trigger
            }

            var mirror = false;
            $scope.$watch("mirrorDate", function(value) {
                if (mirror && value) {
                    $scope.ngModel = Momentservice.dateformat(value, 'MM/DD/YYYY');
                }
                mirror = true;
            });

            //CHECK ERROR MANUAL FOR EXTERNAL FORM (USED ON ALLERGY PROFILE ON MEDICATION PROFLE)
            $scope.checkhasErr = function(boolData){
                return boolData ? true : false;
            }

            //VALIDATE
            $scope.validateData = function(data) {
                if (data) {
                    var datepickerData = data.split("/");
                    // DATE FORMAT IS ALWAYS MM/DD/YYYY
                    if ($scope.config.allowIncomplete) { // if this exist we allow incomplete but we have validitions
                        // Validate month
                        if (isInt(datepickerData[0])) { // CHECK IF FULL INT
                            $scope.formDate.$setValidity('monthValid', true);
                            $scope.formDate.$setValidity('monthRequired', true);
                        } else {
                            if (hasInt(datepickerData[0])) {
                                $scope.formDate.$setValidity('monthRequired', true);
                                $scope.formDate.$setValidity('monthValid', false);
                                return;
                            } else {
                                $scope.formDate.$setValidity('monthValid', true);
                                $scope.formDate.$setValidity('monthRequired', true);
                            }
                        }
                        // Validate day
                        if (isInt(datepickerData[1])) { //HAS Day
                            if (!isInt(datepickerData[0])) { // BUT NO MONTH
                                $scope.formDate.$setValidity('monthRequired', false);
                                return;
                            } else {
                                $scope.formDate.$setValidity('dayValid', true);
                            }
                        } else {
                            if (hasInt(datepickerData[1])) {
                                $scope.formDate.$setValidity('dayValid', false);
                                return;
                            } else {
                                $scope.formDate.$setValidity('dayValid', true);
                            }
                        }
                        // Validate Year
                        // IF YEAR IS MISSING ITS INVALID
                        if (!isInt(datepickerData[2])) {
                            if (hasInt(datepickerData[2])) {
                                $scope.formDate.$setValidity('yearValid', false);
                                return;
                            } else {
                                if ($scope.ngRequired) {
                                    $scope.formDate.$setValidity('yearValid', false);
                                    return;
                                } else {
                                    if (hasInt(datepickerData[0]) || hasInt(datepickerData[1])) { // BUT HAS DAY AND MONTH?
                                        $scope.formDate.$setValidity('yearValid', false);
                                        return;
                                    } else {
                                        $scope.formDate.$setValidity('yearValid', true);
                                    }
                                }
                            }
                        } else {
                            //HAS COMPLETE YEAR VALUE
                            $scope.formDate.$setValidity('yearValid', true);
                            $scope.formDate.$setValidity('dateValid', true);
                        }
                    } else {
                        //VALIDATE MIN DATE

                        if ($scope.ngModel) {
                            if (moment($scope.ngModel, "MM/DD/YYYY", true).isValid() == false && moment($scope.ngModel, 'MM/DD/YYYY').toDate() >= moment(new Date(data)).toDate()) {
                                $scope.formDate.$setValidity('minDate', false);
                                return;
                            } else {
                                $scope.formDate.$setValidity('minDate', true);
                            }
                        }

                        
                        if ($scope.config.min) {
                            if ($scope.config.min == 'current') {
                                $scope.config.min =  moment().format('MM/DD/YYYY');
                            }
                            if (moment(Momentservice.dateformat($scope.config.min, 'MM/DD/YYYY'), "MM/DD/YYYY", true).isValid() && (moment(Momentservice.dateformat($scope.config.min, 'MM/DD/YYYY'), 'MM/DD/YYYY').toDate() > moment(Momentservice.dateformat(data, 'MM/DD/YYYY'), 'MM/DD/YYYY').toDate())) {
                                $scope.formDate.$setValidity('minDate', false);
                                return;
                            } else {
                                $scope.formDate.$setValidity('minDate', true);
                            }
                        }
                        //VALIDATE MAX DATE
                        if ($scope.config.max) {
                            if ($scope.config.max == 'current') {
                                $scope.config.max =  moment().format('MM/DD/YYYY');
                            }
                            if (moment(Momentservice.dateformat($scope.config.max, 'MM/DD/YYYY'), "MM/DD/YYYY", true).isValid() && (moment(Momentservice.dateformat($scope.config.max, 'MM/DD/YYYY'), 'MM/DD/YYYY').toDate() < moment(Momentservice.dateformat(data, 'MM/DD/YYYY'), 'MM/DD/YYYY').toDate())) {
                                $scope.formDate.$setValidity('maxDate', false);
                                return;
                            } else {
                                $scope.formDate.$setValidity('maxDate', true);
                            }
                        }
                    }
                } else {
                    //I HAVE no Data IM CLEAR AND PURE
                    if ($scope.ngRequired) { // MY REQUIRED VALIDATION IS ON THE FORM SOMETIMES ON SIDEPANE VALIDATION
                        $scope.formDate.$setValidity('yearValid', true);
                        $scope.formDate.$setValidity('monthValid', true);
                        $scope.formDate.$setValidity('dateValid', true);
                        $scope.formDate.$setValidity('dayValid', true);
                        $scope.formDate.$setValidity('monthRequired', true);
                        $scope.formDate.$setValidity('minDate', true);
                        $scope.formDate.$setValidity('maxDate', true);
                    }
                }
                $timeout(function(){
                    $scope.onDateChange(); 
                })               
            }
            $scope.checkHasErr = function() {
                return $scope.formDate.$error['yearValid'] || $scope.formDate.$error['monthValid'] || $scope.formDate.$error['dateValid'] || $scope.formDate.$error['monthRequired'] || $scope.formDate.$error['dayValid'] || $scope.formDate.$error['minDate'] || $scope.formDate.$error['maxDate'];
            }
            $scope.formvalidity = function() {
                if ($scope.formDate.$error['yearValid']) {
                    return 'yearValid';
                } else if ($scope.formDate.$error['monthValid']) {
                    return 'monthValid';
                } else if ($scope.formDate.$error['monthRequired']) {
                    return 'monthRequired';
                } else if ($scope.formDate.$error['dateValid']) {
                    return 'dateValid';
                } else if ($scope.formDate.$error['dayValid']) {
                    return 'dayValid';
                } else if ($scope.formDate.$error['minDate']) {
                    return 'minDate';
                } else if ($scope.formDate.$error['maxDate']) {
                    return 'maxDate';
                }
            }
        }
    };
}).directive('redatepicker', function(Momentservice, $timeout) {
    return {
        restrict: 'EA',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            var attributes = scope.$eval(attrs.redatepicker);
            //SPECIAL CASE FOR TASK SCHEDULER
            if (attributes.taskschedule) {
                scope.ngModel = Momentservice.dateformat(scope.ngModel,'MM/DD/YYYY');
            }
            scope.$watch(attrs.redatepicker, function(data) {
                attributes = data;
                $(function() {
                    //ALL POSSIBLE OPTIONS ARE HERE MY FRIEND - http://api.jqueryui.com/datepicker/  TELL ME IF YOU HAVE SOMETHING TO ADD
                    element.datepicker({
                        dateFormat: 'mm/dd/yy',
                        changeMonth: true,
                        changeYear: true,
                        showOn: attributes.onlyMask=='true' ? "focus" : "button",
                        showButtonPanel: attributes.showButtonPanel!='false' || !attributes.showButtonPanel ? true : false,
                        buttonImage: "/scripts/directives/datepicker/datepicky/calendar-solid.png",
                        buttonImageOnly: true,
                        constrainInput: false,
                        buttonText: "",
                        onSelect: function(date) {
                            scope.$apply(function() {
                                if (attributes.allowIncomplete) {
                                    ngModelCtrl.$setViewValue(date); // mm/dd/yyyy
                                }else if(attributes.noformat) {
                                    ngModelCtrl.$setViewValue(date); // mm/dd/yyyy
                                }else{
                                    ngModelCtrl.$setViewValue(Momentservice.formatdate(date));   // yyyy-mm-dd
                                }
                                // scope.onDateChange(); // if exist will trigger // commented because the change is executed 2 times
                            });
                        },
                        onChangeMonthYear: function(year, month) {
                            var $datepicker = jQuery(this);
                            var date = new Date($datepicker.datepicker("getDate"));
                            var lastDayOfMonth = new Date(year, month, 0).getDate();
                            var preservedDay = Math.min(lastDayOfMonth, Math.max(1, date.getDate()));
                            scope.onDateChange(); // if exist will trigger
                        },
                        /*CHANGE DONE TO CLEAR BUTTON*/
                        closeText: 'Clear',
                        onClose: function(dateText, inst , e) {
                            var $datepicker = jQuery(this);
                            var event = arguments.callee.caller.caller.arguments[0];
                            if ($(event.delegateTarget).hasClass('ui-datepicker-close')) {
                                $datepicker.datepicker("setDate", '');
                                scope.$apply(function() {
                                    ngModelCtrl.$setViewValue('');
                                    scope.onDateChange(); // if exist will trigger
                                });
                            }
                        },
                        yearRange: '1901:2099',
                        forceParse: false,
                        beforeShow: function(input, datepicker) {
                            var $datepicker = jQuery(this);
                            setTimeout(function() {
                                datepicker.dpDiv.find('.ui-datepicker-current').text('Today').click(function() {
                                    $datepicker.datepicker('setDate', new Date()).datepicker('hide');
                                    scope.$apply(function() {
                                        if (attributes.allowIncomplete) {
                                            ngModelCtrl.$setViewValue(Momentservice.dateformat(new Date(),"MM/DD/YYYY")); // mm/dd/yyyy
                                        }else if(attributes.noformat) {
                                            ngModelCtrl.$setViewValue(Momentservice.dateformat(new Date(),"MM/DD/YYYY")); // mm/dd/yyyy
                                        }else{
                                            ngModelCtrl.$setViewValue(Momentservice.formatdate(new Date()));   // yyyy-mm-dd
                                        }
                                        scope.onDateChange(); // if exist will trigger
                                    });
                                });
                            }, 1);
                            return {};
                        },
                        beforeShowDay: function(date) {
                            if (attributes.sundayonly) {
                                return [date.getDay() === 0,''];
                            }else{
                                return [date];
                            }
                        }
                    });

                    if (attributes.allowIncomplete) {
                        element.inputmask("mm/dd/yyyy");
                    } else {
                        element.inputmask("mm/dd/yyyy", {
                            "clearIncomplete": true
                        }); // it .. it ..IT MEANS IF THE USER TYPEd INVALID DATE OR INCOMPLETE DAte IT WILL WILL WILL CLer - Clear the in in input field..
                    }
                    //Supports IE 11< (Disable function is now automagic - will detect if input is disabled)
                    scope.$watch(function() {
                        return element.is(':disabled')
                    }, function() {
                        if (element.is(':disabled')) {
                            $('[name="'+attrs.name+'"] .ui-datepicker-trigger').css({"pointer-events": "none"}); // REMOVED "margin" : '0 0 5px 5px'
                        } else {
                            $('[name="'+attrs.name+'"] .ui-datepicker-trigger').css({"pointer-events": ""}); // REMOVED "margin" : '0 0 5px 5px'
                        }
                    });
                    // MAX/MIN DATE
                    if (attributes.max) {
                        if (moment(Momentservice.dateformat(attributes.max,"MM/DD/YYYY"), "MM/DD/YYYY", true).isValid()) {
                            element.datepicker("option", "maxDate", moment(Momentservice.dateformat(attributes.max,"MM/DD/YYYY"), 'MM/DD/YYYY').toDate());
                        }
                    }
                    if (attributes.min) {
                        if (moment(Momentservice.dateformat(attributes.min,"MM/DD/YYYY"), "MM/DD/YYYY", true).isValid()) {
                            element.datepicker("option", "minDate", moment(Momentservice.dateformat(attributes.min,"MM/DD/YYYY"), 'MM/DD/YYYY').toDate());
                        }
                    }
                });
            })
        }
    };
});
