/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-drink')
		.controller('DrinkCreateCtrl', DrinkCreateCtrl);

	/** @ngInject */
	function DrinkCreateCtrl($scope, DrinkService, toastr, $rootScope, $location, $window) {
        $scope.data_create = {
            name : '',
            active : false
		};
		$scope.list_categories = [];

		// ========== function get list categories ===========
		function getCategories(){
			DrinkService.getCategories($rootScope.userLogin.token).success(function(res){
				$scope.list_categories = res;
			}).error(function(err, stt, res){
				console.log(res)
				toastr.error('Error!');
			})
		}

		getCategories();

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_create[field] = value;
        }

		// =========== function create =================
		$scope.create = function(){
			DrinkService.created($scope.data_create, $rootScope.userLogin.token).success(function(res){
				toastr.success('Created success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/drink/detail/'+res.id);
				}, 300);
			}).error(function(err, status, res){
				console.log(err)
				toastr.error('Error!');
			})
		}

	}

})();