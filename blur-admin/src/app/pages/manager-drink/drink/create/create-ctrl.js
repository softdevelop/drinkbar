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
			name: '',
			active: false
		};
		$scope.list_categories = [];
		$scope.list_glass = [];

		$scope.cars = [{ id: 1, name: 'Audi' }, { id: 2, name: 'BMW' }, { id: 1, name: 'Honda' }];
		$scope.selectedCar = [];

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
	}

})();