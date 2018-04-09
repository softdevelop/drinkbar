/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-ingredient')
		.controller('IngredientCreateNewBrandCtrl', IngredientCreateNewBrandCtrl);

	/** @ngInject */
	function IngredientCreateNewBrandCtrl($scope, IngredientBrandService, toastr, $rootScope, $location, $window, $uibModalInstance) {
        $scope.data_create = {
			name : ''
		};

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_create[field] = value;
		}

		// =========== function create =================
		$scope.create = function(){
			IngredientBrandService.created($scope.data_create, $rootScope.userLogin.token).success(function(res){
                toastr.success('Created success!');
				$rootScope.create_new_brand = res;
				console.log($rootScope.create_new_brand)
                $rootScope.load_page();
                $uibModalInstance.close();
			}).error(function(err, status, res){
				console.log(err)
				toastr.error(err.detail);
			})
		}

	}

})();