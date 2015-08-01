(function(){

	var app = angular.module('app', ['ui.bootstrap'])
	
	.config(['$httpProvider', function ($httpProvider) {
	    $httpProvider.defaults.headers.common.Accept = "application/json;odata=verbose";
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/json;odata=verbose';
		$httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
		$httpProvider.defaults.headers.post['If-Match'] = "*";
	}])

	.controller('appCtrl', ['$scope','sampleService', '$modal',function($scope, sampleService, $modal){
		sampleService.get().then(function(data){
			$scope.home = {
				loaded: true,
				documents: data,
				openForm: function(){
					this.newDoc = {
						data: {},
						modal: $modal.open({
				      		templateUrl: 'views/forms/new-document.html',
				      		scope: $scope
				    	}),
				    	submit: function(form){
				    		if(form.$valid && form.$dirty){
					    		sampleService.post(this.data).then(function(ret){
									$scope.home.documents.unshift(ret);
								});
					    		this.modal.close();
				    		}
				    	},
				    	cancel: function(){
				    		this.modal.close();
				    	}
					};
				},
				deleteDoc: function(doc){
					var index = $scope.home.documents.indexOf(doc);
  					$scope.home.documents.splice(index, 1);
				}
			};
		});
	}])
		
	.factory('sampleService', ['$q','$timeout', function($q,$timeout) {
		return {
			get: function(){
				var def = $q.defer();
				var randomDate = function (start, end) {
    				return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
				};
				$timeout(function(){ //simulate get request
					var sampleData = [
						{name: 'Sample Form 1', description: 'This is the first sample form', date: randomDate(new Date(2015, 0, 1), new Date()), created: randomDate(new Date(2015, 0, 1), new Date())},
						{name: 'Sample Form 2', description: 'This is the second sample form', date: randomDate(new Date(2015, 0, 1), new Date()), created: randomDate(new Date(2015, 0, 1), new Date())},
						{name: 'Sample Form 3', description: 'This is the third sample form', date: randomDate(new Date(2015, 0, 1), new Date()), created: randomDate(new Date(2015, 0, 1), new Date())},
						{name: 'Sample Form 4', description: 'This is the fourth sample form', date: randomDate(new Date(2015, 0, 1), new Date()), created: randomDate(new Date(2015, 0, 1), new Date())},
						{name: 'Sample Form 5', description: 'This is the fifth sample form', date: randomDate(new Date(2015, 0, 1), new Date()), created: randomDate(new Date(2015, 0, 1), new Date())}
					];
					def.resolve(sampleData);
				},2500);

				return def.promise;
			},
			post: function(data){
				var def = $q.defer();

				$timeout(function(){ //simulate post request
					data.created = new Date();
					def.resolve(data);
				},1000);

				return def.promise;
			}
		}

	}]);
	
})();