'use strict';

define(['app'], function (app) {

    var injectParams = ['$rootScope','$q','$scope', '$location', '$filter', '$window',
                      '$timeout', 'authService', 'dataService', 'modalService'];

    var DetailController = function ($rootScope,$q, $scope, $location, $filter, $window,
        $timeout, authService, dataService, modalService) {

        //REQUIRED: DEFINED CLASS STRUCTURE FOR FORM - WE NEED THIS TO KNOW WHAT TO EXPECT. 
        var ShipmentTemplateClass = {
            ShippingID: "",
            ConveyanceName: "",
            Country: "",
            State: "",
            ArrivalDate: "",
            ErrorMessage: "",
            CountryName: "",  // optional
            StateName: ""  // optional
            
        }
        var vm = this;

        vm.savelocked = 0;

        //SETTING  THE VARIABLES 
        vm.LocationList = [];
        vm.ShipmentTemplate = angular.copy(ShipmentTemplateClass);

        //BUSINESS LOGIC ON CHANGE OF COUNTRY FILTER
        vm.Filter_onChange = function (id) {
            try {
                
                if (id == "ddlCountry") {
                    vm.ShipmentTemplate.State = "0";
                    for (var k = 0; k < vm.LocationList.length; k++) {
                        vm.LocationList[k].active = (vm.ShipmentTemplate.Country == "0" ? "false"
                            : String(vm.LocationList[k].parentID == vm.ShipmentTemplate.Country));
                    }
                }
            }
            catch (x) {
                alert(x.message);
            }
        }

        $scope.$on('on_Parentsubmit', function (event, data)
        {
            
            if (data.type == "new") {
                vm.resetTemplate(); // RESETTING THE OBJEC TO BLANK
            }
            else if (data.type == "edit") {
                vm.savelocked = 1;
                vm.ShipmentTemplate.ShippingID = data.value.ShippingID;
                vm.ShipmentTemplate.ConveyanceName = data.value.ConveyanceName;
                vm.ShipmentTemplate.ArrivalDate = data.value.ArrivalDate;
                vm.ShipmentTemplate.Country = data.value.Country;
                vm.ShipmentTemplate.State = data.value.State;
                vm.ShipmentTemplate.CountryName = data.value.CountryName;
                vm.ShipmentTemplate.StateName = data.value.StateName;
                vm.ErrorMessage = "";
            }
            //alert("parent submitted successfully");
        });

        vm.cancelTemplate = function()
        {
            //THIS SENDS THE OBJECT TO THE PARENT FOR PROCESSING
            $rootScope.$broadcast('on_submit', { key: 'shipments', value: null, type:"cancel" });
            vm.resetTemplate(); // RESETTING THE OBJEC TO BLANK
        }
       
        //PERFORMING THE SAVING
        vm.saveTemplate = function (id) {

            if(vm.savelocked == 1) return;
            //VALIDATIONS OR BUSINESS LOGIC STARTS HERE
            vm.ErrorMessage = "";
            var arr = $("#divShipingForm input:text");
            var iserror = 0;
            for (var i = 0 ; i < arr.length ; i++) {
                $(arr[i]).parent().attr("class", "form-group");
                if ($(arr[i]).val() == "" || $(arr[i]).val() == "0") {
                    $(arr[i]).parent().attr("class", "form-group has-error");
                    iserror++;
                }
            }
            $("#ddlCountry").parent().attr("class", "form-group");
            if (vm.ShipmentTemplate.Country == "0") {
                $("#ddlCountry").parent().attr("class", "form-group has-error");
                iserror++;
            }
            $("#ddlState").parent().attr("class", "form-group");
            if (vm.ShipmentTemplate.State == "0") {
                $("#ddlState").parent().attr("class", "form-group has-error");
                iserror++;
            }
            if (iserror > 0) {
                vm.ErrorMessage = "(*) Mandatory to fill";
                return;
            }
            if (iserror <= 0) {
                if (IsNumber(vm.ShipmentTemplate.ShippingID) == false) {
                    for (var i = 0 ; i < arr.length ; i++) {
                        $(arr[i]).parent().attr("class", "form-group");
                        if ($(arr[i]).val() == vm.ShipmentTemplate.ShippingID) {
                            $(arr[i]).parent().attr("class", "form-group has-error");
                            iserror++;
                            vm.ErrorMessage = "ShippingID must be Numeric";
                            return;
                        }
                    }
                    iserror++;
                }
                var curdate = new Date();
                curdate = curdate.getFullYear() + "/" + formatnum(curdate.getMonth() + 1) + "/" + formatnum(curdate.getDate()) + " "
                     + formatnum(curdate.getHours()) + ":" + formatnum(curdate.getMinutes());
                curdate = new Date(curdate);
                if (vm.ShipmentTemplate.ArrivalDate < curdate) {
                    var arrivaldate = vm.ShipmentTemplate.ArrivalDate;
                    arrivaldate = arrivaldate.getFullYear() + "/" + formatnum(arrivaldate.getMonth() + 1) + "/" + formatnum(arrivaldate.getDate()) + " "
                       + formatnum(arrivaldate.getHours()) + ":" + formatnum(arrivaldate.getMinutes());
                    for (var i = 0 ; i < arr.length ; i++) {
                        $(arr[i]).parent().attr("class", "form-group");
                        if ($(arr[i]).val() == arrivaldate) {
                            $(arr[i]).parent().attr("class", "form-group has-error");
                            iserror++;
                            vm.ErrorMessage = "Arrival Date should be greater than current date";
                            return;
                        }
                    }
                    iserror++;
                }
            }
            if (iserror > 0) {
                vm.ErrorMessage = "Errors in Form";
                return;
            }
            //VALIDATIONS OR BUSINESS LOGIC ENDS HERE


            document.body.style.cursor = 'wait';
            try {
                for (var i = 0 ; i < vm.LocationList.length ; i++) {
                    if (vm.LocationList[i].id == vm.ShipmentTemplate.Country) {
                        vm.ShipmentTemplate.CountryName = vm.LocationList[i].name;
                        continue;
                    }
                    if (vm.LocationList[i].id == vm.ShipmentTemplate.State) {
                        vm.ShipmentTemplate.StateName = vm.LocationList[i].name;
                        continue;
                    }
                }

                //Saving starts
                var objdata = angular.copy(vm.ShipmentTemplate); // COPYING THE DATA TO OTHER OBJECT

                //THIS SENDS THE OBJECT TO THE PARENT FOR PROCESSING
                $rootScope.$broadcast('on_submit', { key: 'shipments', value: objdata, type: "save" });
                vm.resetTemplate(); // RESETTING THE OBJEC TO BLANK

                //Saving ends
                document.body.style.cursor = 'auto';
            }
            catch (x) {
                alert(x.message);
                document.body.style.cursor = 'auto';
            }

        }

        //RESETTING ALL VARIABLES TO EMPTY
        vm.resetTemplate = function () {
            vm.savelocked = 0;
            vm.ShipmentTemplate.ShippingID = "";
            vm.ShipmentTemplate.ConveyanceName = "";
            vm.ShipmentTemplate.ArrivalDate = "";
            vm.ShipmentTemplate.Country = "0";
            vm.ShipmentTemplate.State = "0";
            vm.ShipmentTemplate.CountryName = "0";
            vm.ShipmentTemplate.StateName = "0";
            vm.ErrorMessage = "";
            $("#ddlCountry").parent().attr("class", "form-group");
            $("#ddlState").parent().attr("class", "form-group");
            var arr = $("#divShipingForm input:text");
            var iserror = 0;
            for (var i = 0 ; i < arr.length ; i++) {
                $(arr[i]).parent().attr("class", "form-group");
            }
        }
              
        //CALLING TO INITIALIZE THE FORMS VARIABLES AND FORM ITSELF
        init();

        function init()
        {
            vm.resetTemplate();
            getMastetLookup();
        }

        //FETCHING THE LOOKUP FROM DATA SERVICE TO FILL COUNTRY AND STATES
        function getMastetLookup() {
            dataService.getMastetLookup('getMastetLookup', 'locations')
            .then(function (data) {
                vm.LocationList = data.results;

                // ENABLING THE UI - OPTIONAL
                var def = $q.defer();
                def.resolve(vm.LocationList);
                return def.promise;
                // ENABLING THE UI - OPTIONAL

            }, function (error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        }


        function IsNumber(num) {
            return !isNaN(parseFloat(num)) && isFinite(num);
        }
        function formatnum(num) {
            return String(num).length <= 1 ? "0" + String(num) : num;
        }

       
    };

    DetailController.$inject = injectParams;

    app.register.controller('DetailController', DetailController);
   
    //

});
