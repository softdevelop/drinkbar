/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-robot')
		.controller('RobotDetailCtrl', RobotDetailCtrl);

	/** @ngInject */
	function RobotDetailCtrl($stateParams, $scope, RobotService, toastr, $rootScope, $location, $window, $uibModal) {
		$scope.detail = {};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id: $scope.paramt_id
		};
		$scope.isDisable = true;
		$rootScope.ingredients = [];

		// ========= function get data glass by id ===========
		function getElement() {
			RobotService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function (res) {
				// res.status = String(res.status);
				res.status = res.status === 0 ? true : false;
				$scope.detail = res;
			}).error(function (err, status, res) {
				console.log(err);
				toastr.error('Error!');
			})
		}

		getElement();

		// ========== function change from ===============
		$scope.changeInfo = function (field, value) {
			if(field === 'status'){
				value = value ? 0 : 10;
			}
			$scope.data_detail[field] = value;
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

		// =========== function create =================
		$scope.save = function () {
			$scope.data_detail.ingredients = $rootScope.ingredients;
			RobotService.updated($scope.data_detail, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Updated success!');
				setTimeout(function () {
					res.id > 0 && ($window.location.href = '#/robot/list');
				}, 300);
			}).error(function (err, status, res) {
				console.log(err)
				toastr.error('Error!');
			})
		}

	}

})();