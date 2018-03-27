/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-drink')
		.controller('DrinkCreateCtrl', DrinkCreateCtrl)
		.controller('DrinkDeleteIngredientCtrl', DrinkDeleteIngredientCtrl)
		.controller('DrinkDeleteGarnishCtrl', DrinkDeleteGarnishCtrl);

	/** @ngInject */
	function DrinkCreateCtrl($scope, DrinkService, toastr, $rootScope, $location, $window, $uibModal) {
		$scope.data_create = {
			name: '',
			active: false,
		};
		$scope.list_categories = [];
		$scope.list_glass = [];
		$rootScope.ingredients = [];
		$rootScope.garnishs = [];

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

		// ========== function change from ===============
		$scope.changeInfo = function (field, value) {
			$scope.data_create[field] = value;
		}

		// ========= fucntion upload image ===============
		$scope.imageUpload = function (e, field) {
			var file = event.target.files[0];
			$scope.data_create[field] = file;
			$scope.isDisable = false;
		}

		// =========== function create =================
		$scope.create = function () {
			$scope.data_create.garnishes = $rootScope.garnishs;
			$scope.data_create.ingredients = $rootScope.ingredients;

			DrinkService.created($scope.data_create, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Created success!');
				setTimeout(function () {
					res.id > 0 && ($window.location.href = '#/manager-drink/drink/detail/' + res.id);
				}, 300);
			}).error(function (err, status, res) {
				console.log(err)
				toastr.error('Error!');
			})
		}

		// =========== open modal create ingredient ============
		$scope.openCreateIngredient = function (size) {
			var page = 'app/pages/manager-drink/drink/create/ingredient/add.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: size,
				controller: 'DrinkCreateIngredientCtrl',
			});
		}

		// =========== open modal create garnish ============
		$scope.openCreateGarnish = function (size) {
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

	// controler DrinkDeleteIngredientCtrl
	function DrinkDeleteIngredientCtrl($scope, toastr, DrinkService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance) {
		$scope.item_del = items;

		// =========== function delete glass =============
		$scope.remove = function (data) {
			var _arr = $rootScope.ingredients;

			for (var i = _arr.length; i--;) {
				if (_arr[i].ingredient.id === items.ingredient.id) {
					_arr.splice(i, 1);
				}
			}
			$rootScope.ingredients = _arr;
			toastr.success('Remove success!');
			$uibModalInstance.close();

		}
	}

	// controler DrinkDeleteGarnishCtrl
	function DrinkDeleteGarnishCtrl($scope, toastr, DrinkService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance) {
		$scope.item_del = items;

		// =========== function delete glass =============
		$scope.remove = function (data) {
			var _arr = $rootScope.garnishs;

			for (var i = _arr.length; i--;) {
				if (_arr[i].garnish.id === items.garnish.id) {
					_arr.splice(i, 1);
				}
			}
			$rootScope.garnishs = _arr;
			toastr.success('Remove success!');
			$uibModalInstance.close();

		}
	}

})();