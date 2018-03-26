/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-drink')
		.controller('DrinkCreateCtrl', DrinkCreateCtrl)
		.controller('DrinkDeleteIngredientCtrl', DrinkDeleteIngredientCtrl);

	/** @ngInject */
	function DrinkCreateCtrl($scope, DrinkService, toastr, $rootScope, $location, $window, $uibModal) {
		$scope.data_create = {
			name: '',
			active: false,
		};
		$scope.list_categories = [];
		$scope.list_glass = [];
		$rootScope.ingredients = [];

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
			console.log(value)

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
			var _arr = $rootScope.ingredients;
			_arr.forEach(function(el){
				el.ingredient = el.ingredient.id;
			});
			$scope.data_create.ingredients = _arr;
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

		// =========== open modal confirm delete Glass ===========
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

	}

	// controler DrinkDeleteIngredientCtrl
	function DrinkDeleteIngredientCtrl($scope, toastr, DrinkService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance) {
		console.log(items)
		$scope.item_del = items;

		// =========== function delete glass =============
		$scope.remove = function (data) {
			var _arr = $rootScope.ingredients;

			for (var i = _arr.length; i--;) {
				if (_arr[i].ingredient.id === items.ingredient.id) {
					console.log('===> YES')
					_arr.splice(i, 1);
				}
			}
			$rootScope.ingredients = _arr;
			toastr.success('Remove success!');
			$uibModalInstance.close();

		}
	}

})();