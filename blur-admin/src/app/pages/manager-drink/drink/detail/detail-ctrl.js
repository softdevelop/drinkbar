/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-drink')
		.controller('DrinkDetailCtrl', DrinkDetailCtrl);

	/** @ngInject */
	function DrinkDetailCtrl($stateParams, $scope, DrinkService, toastr, $rootScope, $location, $window, $uibModal) {
		$scope.detail = {};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id: $scope.paramt_id
		};
		$scope.isChange = $scope.isChangeIngredient = $scope.isChangeGarnish = false;

		$scope.list_categories = $scope.list_glass = $rootScope.ingredients = $rootScope.garnishs = [];

		// ============ load data ==========
		function loadData() {
			console.log($rootScope.ingredients)
		}

		$rootScope.loadPageDrinkCreate = function (val) {
			if (val) {
				loadData();
			}
		}

		// ========== function get list categories ===========
		function getCategories() {
			DrinkService.getCategories($rootScope.userLogin.token).success(function (res) {
				$scope.list_categories = res;
			}).error(function (err, stt, res) {
				console.log(res)
				toastr.error('Error!');
			})
		}

		getCategories();

		// ============ get list glass ====================
		function getListGlass() {
			DrinkService.getListGlass($rootScope.userLogin.token).success(function (res) {
				$scope.list_glass = res;
			}).error(function (err, stt, res) {
				console.log(res)
				toastr.error('Error!');
			})
		}

		getListGlass();

		// ========= function get data glass by id ===========
		function getElement() {
			DrinkService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function (res) {
				$scope.detail = res;
				$scope.detail.glass = String(res.glass.id);
				var _category = res.category;
				var _arr = [];
				_category.forEach(function (el) {
					_arr.push(String(el.id))
				});

				$scope.detail.category = _arr;
				$rootScope.ingredients = res.ingredients;
				$rootScope.garnishs = res.garnishes;

			}).error(function (err, status, res) {
				console.log(err);
				toastr.error('Error!');
			})
		}

		getElement();

		// ========== function change from ===============
		$scope.changeInfo = function (field, value) {
			$scope.data_detail[field] = value;
			console.log($scope.data_detail)
			$scope.isChange = true;
		}

		// =========== function create =================
		$scope.save = function () {
			if ($scope.isChangeIngredient) {
				var _arr = $rootScope.ingredients;
				_arr.forEach(function (el) {
					el.ingredient = el.ingredient.id;
				});
				$scope.data_detail.ingredients = _arr;
			}

			if ($scope.isChangeGarnish) {
				var _arr_garnish = $rootScope.garnishs;
				_arr_garnish.forEach(function (el) {
					el.garnish = el.garnish.id;
				});
				$scope.data_detail.garnishs = _arr_garnish;
			}

			DrinkService.updated($scope.data_detail, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Updated success!');
				setTimeout(function () {
					res.id > 0 && ($window.location.href = '#/manager-drink/drink/list');
				}, 300);
			}).error(function (err, status, res) {
				console.log(err)
				toastr.error('Error!');
			})
		}

		// =========== open modal create ingredient ============
		$scope.openCreateIngredient = function (size) {
			var page = 'app/pages/manager-drink/drink/create/ingredient/add.html';
			$scope.isChangeIngredient = true;
			$scope.isChange = true;

			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: size,
				controller: 'DrinkCreateIngredientCtrl',
			});
		}

		// =========== open modal create garnish ============
		$scope.openCreateGarnish = function (size) {
			$scope.isChangeGarnish = true;
			$scope.isChange = true;
			var page = 'app/pages/manager-drink/drink/create/garnish/add.html';
			
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: size,
				controller: 'DrinkCreateGarnishCtrl',
			});
		}

		// =========== open modal confirm delete Ingredient ===========
		$scope.confirmDelete = function (data) {
			var page = 'app/pages/manager-drink/drink/create/ingredient/delete.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: 'sm',
				resolve: {
					items: function () {
						return data;
					}
				},
				controller: 'DrinkDeleteIngredientCtrl',
			});
		}

		// =========== open modal confirm delete garnish ===========
		$scope.confirmDeleteGarnish = function (data) {
			var page = 'app/pages/manager-drink/drink/create/garnish/delete.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: 'sm',
				resolve: {
					items: function () {
						return data;
					}
				},
				controller: 'DrinkDeleteGarnishCtrl',
			});
		}

	}

})();