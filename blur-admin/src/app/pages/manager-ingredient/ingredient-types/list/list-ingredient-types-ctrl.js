/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-ingredient-types')
		.controller('IngredientTypesListCtrl', IngredientTypesListCtrl)
		.controller('IngredientTypesDeleteCtrl', IngredientTypesDeleteCtrl);

	/** @ngInject */
	function IngredientTypesListCtrl($scope, toastr, IngredientTypesService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listData = [];
		
		// ================= get list ===============
		function getList(){
			IngredientTypesService.getList($rootScope.userLogin.token).success(function(res){
				$rootScope.listData = res;
			}).error(function(err, status, res){
				toastr.error(err.detail);
			});
		}

		getList();

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function(data){
			var page = 'app/pages/manager-ingredient/ingredient-types/list/confirm-delete.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'IngredientTypesDeleteCtrl',
            });
		}

	};

	// controler IngredientTypesListDeleteCtrl
	function IngredientTypesDeleteCtrl($scope, toastr, IngredientTypesService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			IngredientTypesService.getList($rootScope.userLogin.token).success(function(res){
				$rootScope.listData = res;
			}).error(function(err, status, res){
				toastr.error(err.detail);
			});
		}

		// =========== function delete glass =============
		$scope.remove = function(data){
			IngredientTypesService.removed(data.id, $rootScope.userLogin.token).success(function(res){
				toastr.success('Deleted success!');
				$uibModalInstance.close();
				getList();
			}).error(function(err, status, res){
				toastr.error(err.detail);
			})
		}
	}

})();