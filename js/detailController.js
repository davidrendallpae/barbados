'use strict';

define(['app'], function (app) {

    var injectParams = ['$rootScope','$q','$scope', '$location', '$filter', '$window',
                      '$timeout', 'authService', 'dataService', 'modalService'];

    var DetailController = function ($rootScope,$q, $scope, $location, $filter, $window,
        $timeout, authService, dataService, modalService) {

        //REQUIRED: DEFINED CLASS STRUCTURE FOR FORM - WE NEED THIS TO KNOW WHAT TO EXPECT. 
        var LicenseTemplateClass = {
            UniqueID: "",
            LicenseID: "",
            ApplicantName: "",
            Country: "",
            State: "",
            ApplyDate: "",
            ErrorMessage: "",
            CountryName: "",  // optional
            StateName: "",  // optional
            Status: "",
            ActionRemarks:""
            
        }
        var vm = this;

        vm.LicenseID_disabled = false; //UI

        vm.IsViewMode = false; //UI

        //SETTING  THE VARIABLES 
        vm.LocationList = [];
        vm.LicenseTemplate = angular.copy(LicenseTemplateClass);

        //BUSINESS LOGIC ON CHANGE OF COUNTRY FILTER
        vm.Filter_onChange = function (id) {
            try {
                
                if (id == "ddlCountry") {
                    vm.LicenseTemplate.State = "0";
                    for (var k = 0; k < vm.LocationList.length; k++) {
                        vm.LocationList[k].active = (vm.LicenseTemplate.Country == "0" ? "false"
                            : String(vm.LocationList[k].parentID == vm.LicenseTemplate.Country));
                    }
                }
            }
            catch (x) {
                alert(x.message);
            }
        }

        //Getting data from parent form and setting the mode of child form to open
        $scope.$on('on_Parentsubmit', function (event, data)
        {
            if (data.type == "new") {
                vm.resetTemplate(); // RESETTING THE OBJEC TO BLANK
                return;
            }
            else if (data.type == "edit") {
                vm.LicenseID_disabled = true;
                vm.IsViewMode = false;
            }
            else if (data.type == "view") {
                vm.LicenseID_disabled = true;
                vm.IsViewMode = true;
            }
            vm.LicenseTemplate.UniqueID = data.value.UniqueID;
            vm.LicenseTemplate.Status = data.value.Status;
            vm.LicenseTemplate.ActionRemarks = data.value.ActionRemarks;
            vm.LicenseTemplate.LicenseID = data.value.LicenseID;
            vm.LicenseTemplate.ApplicantName = data.value.ApplicantName;
            vm.LicenseTemplate.ApplyDate = data.value.ApplyDate;
            vm.LicenseTemplate.Country = data.value.Country;
            vm.LicenseTemplate.State = data.value.State;
            vm.LicenseTemplate.CountryName = data.value.CountryName;
            vm.LicenseTemplate.StateName = data.value.StateName;
            vm.ErrorMessage = "";
        });

        vm.cancelTemplate = function()
        {
            //THIS SENDS THE OBJECT TO THE PARENT FOR PROCESSING
            $rootScope.$broadcast('on_submit', { key: 'Licenses', value: null, type:"cancel" });
            vm.resetTemplate(); // RESETTING THE OBJEC TO BLANK
        }
       
        //PERFORMING THE SAVING
        vm.saveTemplate = function (id) {

            //if(vm.savelocked == 1) return;
            //VALIDATIONS OR BUSINESS LOGIC STARTS HERE
            // Validation can be writtern in either way using Angular tag or jquery etc
            vm.ErrorMessage = "";
            var arr = $("#modDetail input:text");
            var iserror = 0;
            for (var i = 0 ; i < arr.length ; i++) {
                $(arr[i]).parent().attr("class", "form-group");
                if ($(arr[i]).val() == "" || $(arr[i]).val() == "0") {
                    $(arr[i]).parent().attr("class", "form-group has-error");
                    iserror++;
                }
            }
            $("#ddlCountry").parent().attr("class", "form-group");
            if (vm.LicenseTemplate.Country == "0") {
                $("#ddlCountry").parent().attr("class", "form-group has-error");
                iserror++;
            }
            $("#ddlState").parent().attr("class", "form-group");
            if (vm.LicenseTemplate.State == "0") {
                $("#ddlState").parent().attr("class", "form-group has-error");
                iserror++;
            }
            if (iserror > 0) {
                vm.ErrorMessage = "(*) Mandatory to fill";
                return;
            }
            if (iserror <= 0) {
                if (IsNumber(vm.LicenseTemplate.LicenseID) == false) {
                    for (var i = 0 ; i < arr.length ; i++) {
                        $(arr[i]).parent().attr("class", "form-group");
                        if ($(arr[i]).val() == vm.LicenseTemplate.LicenseID) {
                            $(arr[i]).parent().attr("class", "form-group has-error");
                            iserror++;
                            vm.ErrorMessage = "EIN must be Numeric";
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
                    if (vm.LocationList[i].id == vm.LicenseTemplate.Country) {
                        vm.LicenseTemplate.CountryName = vm.LocationList[i].name;
                        continue;
                    }
                    if (vm.LocationList[i].id == vm.LicenseTemplate.State) {
                        vm.LicenseTemplate.StateName = vm.LocationList[i].name;
                        continue;
                    }
                }

                //Saving starts
                var objdata = angular.copy(vm.LicenseTemplate); // COPYING THE DATA TO OTHER OBJECT

                //THIS SENDS THE OBJECT TO THE PARENT FOR PROCESSING
                $rootScope.$broadcast('on_submit', { key: 'Licenses', value: objdata, type: "save" });
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
            vm.LicenseID_disabled = false;
            vm.IsViewMode = false;
            vm.LicenseTemplate.UniqueID = "";
            vm.LicenseTemplate.Status = "";
            vm.LicenseTemplate.ActionRemarks = "";
            vm.LicenseTemplate.LicenseID = "";
            vm.LicenseTemplate.ApplicantName = "";
            vm.LicenseTemplate.ApplyDate = "";
            vm.LicenseTemplate.Country = "0";
            vm.LicenseTemplate.State = "0";
            vm.LicenseTemplate.CountryName = "0";
            vm.LicenseTemplate.StateName = "0";
            vm.ErrorMessage = "";
            $("#ddlCountry").parent().attr("class", "form-group");
            $("#ddlState").parent().attr("class", "form-group");
            var arr = $("#modDetail input:text");
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
            GetLookupData();
        }

        //FETCHING THE LOOKUP FROM DATA SERVICE TO FILL COUNTRY AND STATES
        function GetLookupData() {
            dataService.getLookup('getMasterLookup', 'locations')
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
       

       
    };

    DetailController.$inject = injectParams;

    app.register.controller('DetailController', DetailController);
   

});
