/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-ingredient-brand')
		.controller('IngredientBrandListCtrl', IngredientBrandListCtrl)
		.controller('IngredientBrandDeleteCtrl', IngredientBrandDeleteCtrl);

	/** @ngInject */
	function IngredientBrandListCtrl($scope, toastr, IngredientBrandService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listData = [];
		
		// ================= get list ===============
		function getList(){
			IngredientBrandService.getList($rootScope.userLogin.token).success(function(res){
				$rootScope.listData = res.results;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error('Error!');
			});
		}

		getList();

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function(data){
			var page = 'app/pages/manager-drink/ingredient-brand/list/confirm.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'IngredientBrandDeleteCtrl',
            });
		}

	};

	// controler IngredientBrandListDeleteCtrl
	function IngredientBrandDeleteCtrl($scope, toastr, IngredientBrandService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		console.log(items)
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			IngredientBrandService.getList($rootScope.userLogin.token).success(function(res){
				$rootScope.listData = res.results;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error('Error!');
			});
		}

		// =========== function delete glass =============
		$scope.remove = function(data){
			IngredientBrandService.removed(data.id, $rootScope.userLogin.token).success(function(res){
				toastr.success('Deleted success!');
				$uibModalInstance.close();
				getList();
			}).error(function(err, status, res){
				console.log(err);
				toastr.error('Error!');
			})
		}
	}

})();