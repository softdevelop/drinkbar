/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-categories')
		.controller('CategoriesListCtrl', CategoriesListCtrl)
		.controller('CategoriesDeleteCtrl', CategoriesDeleteCtrl);

	/** @ngInject */
	function CategoriesListCtrl($scope, toastr, CategoriesService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listData = [];

		$scope.maxSize = 10;
		$scope.bigTotalItems = 0;
		$scope.bigCurrentPage = 1;
		$scope.countSwitch = 0;

		// ================ pagination ====================
		$scope.changePage = function (page_index) {
			$rootScope.offset = page_index > 1 ? ((page_index - 1) * 10) : 0;
			getList();
		}

		$scope.selectPage = function (page_number, e) {
		}

		// ============ change Switch ==============
		$scope.changeSwitch = function (data) {
			$scope.countSwitch ++;
			if($scope.countSwitch == 2){
				$scope.countSwitch = 0;
				var _obj = {
					id : data.id,
					active : data.active
				};

				CategoriesService.updated(_obj, $rootScope.userLogin.token).success(function (res) {
					toastr.success('Change status success!');
					getList();
				}).error(function (err, status, res) {
					toastr.error(err.detail);
				})
			}
		}

		// ================= get list ===============
		function getList() {
			CategoriesService.getList($rootScope.userLogin.token).success(function (res) {
				$rootScope.listData = res;
			}).error(function (err, status, res) {
				toastr.error(err.detail);
			});
		}

		getList();

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function (data) {
			var page = 'app/pages/manager-drink/categories/list/confirm/index.html';
			$uibModal.open({
				animation: true,
				templateUrl: page,
				size: 'sm',
				resolve: {
					items: function () {
						return data;
					}
				},
				controller: 'CategoriesDeleteCtrl',
			});
		}

	};

	// controler IngredientBrandListDeleteCtrl
	function CategoriesDeleteCtrl($scope, toastr, CategoriesService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance) {
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList() {
			CategoriesService.getList($rootScope.userLogin.token).success(function (res) {
				$rootScope.listData = res;
			}).error(function (err, status, res) {
				toastr.error(err.detail);
			});
		}

		// =========== function delete glass =============
		$scope.remove = function (data) {
			CategoriesService.removed(data.id, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Deleted success!');
				$uibModalInstance.close();
				getList();
			}).error(function (err, status, res) {
				toastr.error(err.detail);
			})
		}
	};

})();