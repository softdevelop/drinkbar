/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.import-ingredient')
		.controller('IngredientImportHistoryCtrl', IngredientImportHistoryCtrl);

	/** @ngInject */
	function IngredientImportHistoryCtrl($stateParams, $scope, RobotService, IngredientService, toastr, $rootScope, $location, $window, $uibModal) {
        $scope.ingredients = [];
        $scope.data_create = {
            quantity : 0,
            status : 0
        }

        // ============ get list ingredient ==========
        function getListIngredient(){
            var offset = 0;
            IngredientService.getList($rootScope.userLogin.token, offset).success(function(res){
                $scope.ingredients = res.results;
            }).error(function(err, stt, res){
                console.log(res)
                toastr.error('Error!')
            })
        }

        getListIngredient();

        // ========== function change from ===============
		$scope.changeInfo = function(field, value){
            $scope.data_create[field] = value;
		}

        // ========== import ==========
        $scope.import = function(){
            console.log($scope.data_create)
            RobotService.importHistoryRobo($scope.data_create, $rootScope.userLogin.token).success(function(res){
                toastr.success('Import robot success!');
                $rootScope.robotId = $scope.data_create.machine;
                $window.location.href = '#/manager-ingredient/history/list';
            }).error(function(err, stt, res){
                console.log(res)
                toastr.error('Error!');
            })
        }

	}

})();