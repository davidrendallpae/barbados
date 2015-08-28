'use strict';

define(['app'], function (app) {

    var injectParams = ['$rootScope','$q','$scope', '$location', '$filter', '$window',
                      '$timeout', 'authService', 'dataService', 'modalService'];

    var AuditController = function ($rootScope,$q, $scope, $location, $filter, $window,
        $timeout, authService, dataService, modalService) {
        
        var vm = this;

        //getting parameters on loading 
        var uniqueid = $scope.params.Id;

        vm.data = null;// Please do not change variable name 'data'

        //FETCH THE DATA FROM DATASERVICE TO BIND ALL CONTROLS. 
        //IT RECEIVES ONLY FORM SPECIFIC 'JSON OBJECT STRUCTURE'
        vm.GetData = function () {
            dataService.getData('ImportLicenseFormInitial_v1.0', uniqueid).then(function (result)
            {
                vm.data = angular.copy(result.data);  //SET DATA FROM SERVICE i.e. GETTING FORM SPECIFIC 'JSON OBJECT STRUCTURE
            }, function (error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        }


        //PERFORMING THE VALIDATION: Should always return bool value. Please do not change function Name
        vm.PreAction = function () {
            // Validation can be written in either way using Angular tag or jquery etc
            vm.data.errorMessage = "";
            var arr = $("#modAudit input:text");
            var iserror = 0;
            for (var i = 0 ; i < arr.length ; i++) {
                $(arr[i]).parent().attr("class", "form-group");
                if ($(arr[i]).val() == "" || $(arr[i]).val() == "0") {
                    $(arr[i]).parent().attr("class", "form-group has-error");
                    iserror++;
                }
            }
            if (iserror > 0) {
                vm.data.errorMessage = "(*) Mandatory to fill";
                return;
            }
            //VALIDATIONS OR BUSINESS LOGIC ENDS HERE
            return true;
        }

        //CALLING TO INITIALIZE THE FORMS VARIABLES AND FORM ITSELF
        vm.GetData();
    };

    AuditController.$inject = injectParams;

    app.register.controller('AuditController', AuditController);
});
