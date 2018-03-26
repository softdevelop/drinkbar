/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-drink')
		.controller('DrinkDetailCtrl', DrinkDetailCtrl);

	/** @ngInject */
	function DrinkDetailCtrl($stateParams, $scope, DrinkService, toastr, $rootScope, $location, $window) {
		$scope.detail = {};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id : $scope.paramt_id
		};
		$scope.isChange = false;

		$scope.list_categories = [];
		$scope.list_glass = [];

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

		// ============ get list glass ====================
		function getListGlass(){
			DrinkService.getListGlass($rootScope.userLogin.token).success(function(res){
				$scope.list_glass = res;
			}).error(function(err, stt, res){
				console.log(res)
				toastr.error('Error!');
			})
		}

		getListGlass();
		
		// ========= function get data glass by id ===========
		function getElement(){
			DrinkService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function(res){
				$scope.detail = res;
				$scope.detail.glass = String(res.glass.id);
				var _category = res.category;
				var _arr = [];
				_category.forEach(function(el){
					_arr.push(String(el.id))
				});

				$scope.detail.category = _arr;

			}).error(function(err, status, res){
				console.log(err);
				toastr.error('Error!');
			})
		}

		getElement();

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_detail[field] = value;
			console.log($scope.data_detail)
			$scope.isChange = true;
		}
		
		// =========== function create =================
		$scope.save = function(){
			DrinkService.updated($scope.data_detail, $rootScope.userLogin.token).success(function(res){
				toastr.success('Updated success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/drink/list');
				}, 300);
			}).error(function(err, status, res){
				console.log(err)
				toastr.error('Error!');
			})
		}

	}

})();