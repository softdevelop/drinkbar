/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-ingredient')
		.controller('IngredientCreateNewTypeCtrl', IngredientCreateNewTypeCtrl);

	/** @ngInject */
	function IngredientCreateNewTypeCtrl($scope, IngredientTypesService, toastr, $rootScope, $location, $window, $uibModalInstance) {
        $scope.data_create = {
			name : ''
		};

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_create[field] = value;
		}

		// =========== function create =================
		$scope.create = function(){
			IngredientTypesService.created($scope.data_create, $rootScope.userLogin.token).success(function(res){
                toastr.success('Created success!');
                $rootScope.create_new_type = res;
                $rootScope.load_page();
                $uibModalInstance.close();
			}).error(function(err, status, res){
				toastr.error(err.detail);
			})
		}

	}

})();