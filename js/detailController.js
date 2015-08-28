'use strict';

define(['app'], function (app) {

    var injectParams = ['$rootScope','$q','$scope', '$location', '$filter', '$window',
                      '$timeout', 'authService', 'dataService', 'modalService', '$routeParams'];

    var DetailController = function ($rootScope,$q, $scope, $location, $filter, $window,
        $timeout, authService, dataService, modalService, $routeParams) {

        
        var vm = this;

        //GET PARAMETERS ON LOAD. THESE WILL BE USED TO PULL THE CORRECT FORM DATA 
        var uniqueid = $scope.params.Id;
        var openmode = $scope.params.openmode;

        //SETTING  THE VARIABLES  
        vm.data; //Handles all data. Please do not change variable name 'data' 
				 //On creation and configuration of workflow, all elements will be created and associated with form. 
        vm.LocationList = [];
        vm.ein_disabled = false; //UI enable/disable variable
       

        //BUSINESS LOGIC ON CHANGE OF COUNTRY FILTER
        vm.Filter_onChange = function (id) {
            try {
                if (id == "ddlCountry") {
                    vm.data.state = "0";
                    
                    for (var k = 0; k < vm.LocationList.length; k++)
                    {
                        vm.LocationList[k].active = (vm.data.country == "0" ? "false"
                            : String(vm.LocationList[k].parentID == vm.data.country));
                    }
                }
            }
            catch (x) {
                alert(x.message);
            }
        }


        //PERFORMING THE VALIDATION: Should always return bool value . Please do not change function Name
        vm.PreAction = function () {
            // Validation can be writtern in either way using Angular tag or jquery etc
            vm.errorMessage = "";
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

            if (vm.data.country == "0") {
                $("#ddlCountry").parent().attr("class", "form-group has-error");
                iserror++;
            }
            $("#ddlState").parent().attr("class", "form-group");
            if (vm.data.state == "0") {
                $("#ddlState").parent().attr("class", "form-group has-error");
                iserror++;
            }
            if (iserror > 0) {
                vm.errorMessage = "(*) Mandatory to fill";
                return;
            }
            if (iserror <= 0) {
                if (IsNumber(vm.data.ein) == false) {
                    for (var i = 0 ; i < arr.length ; i++) {
                        $(arr[i]).parent().attr("class", "form-group");
                        if ($(arr[i]).val() == vm.data.ein) {
                            $(arr[i]).parent().attr("class", "form-group has-error");
                            iserror++;
                            vm.errorMessage = "EIN must be Numeric";
                            return;
                        }
                    }
                    iserror++;
                }
            }

            //if (vm.data.myfile == "")
            //{
            //    vm.errorMessage = "No file Uploaded..!!";
            //    return false;
            //}
            if (iserror > 0) {
                vm.errorMessage = "Errors in Form";
                return false;
            }
            //VALIDATIONS OR BUSINESS LOGIC ENDS HERE

            //optional - Updating the countryName with ID and same for state
            for (var i = 0 ; i < vm.LocationList.length ; i++) {
                if (vm.LocationList[i].id == vm.data.country) {
                    vm.data.countryName = vm.LocationList[i].name;
                    continue;
                }
                if (vm.LocationList[i].id == vm.data.state) {
                    vm.data.stateName = vm.LocationList[i].name;
                    continue;
                }
            }
            //optional
            return true;
        }

        //PERFORMING THE POST ACTION: Parameter result will decide whether saving is successful or not. The [data] parameter will give you data after saving, if needed.
        //Please do not change function Name
        vm.PostAction = function (result,data) 
        {
            try {
                if(result)
                {
                    alert("saved successfully.");
                    document.body.style.cursor = 'auto';
                }
                else
                {
                    alert("error in saving!");
                }
            }
            catch (x) {
                alert(x.message);
                document.body.style.cursor = 'auto';
            }
        }


        //RESETTING ALL VARIABLES TO EMPTY
        //Please do not change function Name
        vm.reset = function () {
            vm.ein_disabled = false;
            vm.data.uniqueID = "";
            vm.data.status = "";
            vm.data.actionRemarks = "";
            vm.data.ein = "";
            vm.data.applicantName = "";
            vm.data.applyDate = "";
            vm.data.myfile = "";
            vm.data.country = "0";
            vm.data.state = "0";
            vm.data.countryName = "0";
            vm.data.stateName = "0";
            vm.errorMessage = "";
            $("#ddlCountry").parent().attr("class", "form-group");
            $("#ddlState").parent().attr("class", "form-group");
            var arr = $("#modDetail input:text");
            var iserror = 0;
            for (var i = 0 ; i < arr.length ; i++) {
                $(arr[i]).parent().attr("class", "form-group");
            }
        }
              
        //FETCH THE DATA FROM DATASERVICE TO BIND ALL CONTROLS. 
        vm.GetData = function () {
            dataService.getData('ImportLicenseFormInitial_v1.0', uniqueid).then(function (result)//IT RECEIVES ONLY FORM SPECIFIC 'JSON OBJECT STRUCTURE'
            {
                vm.data = angular.copy(result.data);  //SET DATA FROM SERVICE: i.e. GET FORM SPECIFIC 'JSON OBJECT STRUCTURE
                if (openmode == "edit" || openmode == "view") {
                    vm.ein_disabled = true;
                    vm.Filter_onChange('ddlCountry');//OPTIONAL
                }
                else {
                    vm.reset();
                }
            }, function (error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        }

        //FETCH THE LOOKUP FROM DATASERVICE TO FILL COUNTRY AND STATES
        vm.GetLookupData = function () {
            dataService.getLookup('getMasterLookup', 'locations')
            .then(function (data) {
                vm.LocationList = data.results;
            },
            function (error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            }
            );
        }

      
        vm.GetData(); //CALL TO INITIALIZE DATA        
        vm.GetLookupData();//CALL TO INITIALIZE THE FORMS VARIABLES AND FORM ITSELF


        function IsNumber(num) {
            return !isNaN(parseFloat(num)) && isFinite(num);
        }
    };

    DetailController.$inject = injectParams;

    app.register.controller('DetailController', DetailController); 
});
