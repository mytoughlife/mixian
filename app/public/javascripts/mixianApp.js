var app = angular.module('mixianApp', ['ngRoute', 'ngResource']).run(function($rootScope) {
	
});

app.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'collection.html',
			controller: 'collectionController'
		})
		.when('/people', {
			templateUrl: 'people.html',
			controller: 'peopleController'
		})
		.when('/item', {
			templateUrl: 'item.html',
			controller: 'itemController'
		});
});

app.factory('dataService', ['$resource', function($resource) {
	return $resource('/api/items/:id', null,
		{
			'update': { method:'PUT' }
		});
}]);

app.controller('collectionController', function(dataService, $scope, $http, $location){

	$scope.items = dataService.query();

	$scope.newItem = function(){

		$location.path('/item').search('');
    };

	$scope.editItem = function(item){
		
		$location.path('/item').search('id=' + item.id);
    };

});

app.controller('itemController', function(dataService, $scope, $http, $location){
  
	var id = $location.search().id;

	if (id){
		// Editing an existing item
		$scope.isNew = false;
		$scope.item = dataService.get({id: id});
	}
	else{
		// Creating a new one
		$scope.isNew = true;
	}

	$scope.cancel = function(){
		$location.path('/').search('');
    };

	$scope.save = function(){

		if (id)
		{
			// Editing
			dataService.update({id: id}, $scope.item, function() {
				$location.path('/').search('');
			});
		}
		else
		{
			// New
			dataService.save($scope.item, function() {
				$location.path('/').search('');
			});
		}
    };

	$scope.delete = function(){
		
		dataService.delete({id: id}, function() {
				$location.path('/').search('');
		});
    };

});


app.controller('peopleController', function($scope, $http, $location){
  
});
