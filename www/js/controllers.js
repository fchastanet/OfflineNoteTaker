"use strict";

angular.module('nodeEdit.controllers', [])

.controller('AppController', 
	[
		'$scope', '$ionicSideMenuDelegate', 
		function($scope, $ionicSideMenuDelegate) {
		  $scope.toggleLeft = function() {
		    $ionicSideMenuDelegate.toggleLeft();
		  };
		}
	]
)
.controller('NodeSearchController', 
	[
		'$scope',
		function($scope) {  
	  
		}
	]
)
.controller('NodeListController', 
	[
		'$scope',
		function($scope) {  
		  $scope.nodeList = [
		  	{title: "titre 1"},
		  	{title: "titre 2"},
		  	{title: "titre 3"},
		  ];
		}
		]
)
;