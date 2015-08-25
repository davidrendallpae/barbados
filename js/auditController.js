'use strict';

define(['app'], function (app) {

    var injectParams = ['$rootScope','$q','$scope', '$location', '$filter', '$window',
                      '$timeout', 'authService', 'dataService', 'modalService'];

    var AuditController = function ($rootScope,$q, $scope, $location, $filter, $window,
        $timeout, authService, dataService, modalService) {
        
        var vm = this;

        vm.data = null;// Please do not change variable name 'data'
        
        //Getting data from parent form and setting the mode of child form to open
        $scope.$on('on_Parentsubmit', function (event, data)
        {
            
            if (data.type == "Licenses") {
                vm.data = data.value;
            }
        });
        

        //PERFORMING THE Validatin etc,  should always return bool value . Please do not change function Name
        vm.PreAction = function () {
            // Validation can be writtern in either way using Angular tag or jquery etc
            vm.data.ErrorMessage = "";
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
                vm.data.ErrorMessage = "(*) Mandatory to fill";
                return;
            }
            //VALIDATIONS OR BUSINESS LOGIC ENDS HERE
            return true;
        }
    };

    AuditController.$inject = injectParams;

    app.register.controller('AuditController', AuditController);
   

});
