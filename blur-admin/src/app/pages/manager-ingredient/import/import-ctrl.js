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
        // function getListIngredient(){
        //     var offset = 0;
        //     IngredientService.getList($rootScope.userLogin.token, offset).success(function(res){
        //         $scope.ingredients = res.results;
        //     }).error(function(err, stt, res){
        //         console.log(res)
        //         toastr.error('Error!')
        //     })
        // }

        // getListIngredient();

         // =========== get list ingredient ==============
         function getListIngredient(type, brand) {
            DrinkService.getListIngredient($rootScope.userLogin.token, type, brand).success(function (res) {
                $scope.list_ingredient = res.results;
            })
        }

        // getListIngredient();

        // ========== function get list type ============
        function getListType() {
            $scope.types = [];
            $scope.list_ingredient = [];
            $rootScope.brands = [];
            IngredientService.getListType($rootScope.userLogin.token).success(function (res) {
                $scope.types = res;
                getListBrand(res.id);
                $scope.types.length === 0 && ($scope.isAddElement.type = true);
            }).error(function (err, stt, res) {
                console.log(res)
                toastr.error('Error!');
            });
        }

        getListType();

        // ============ function get list brand ===========
        function getListBrand(type) {
            $scope.list_ingredient = [];
            $rootScope.brands = [];
            DrinkService.getListBrand($rootScope.userLogin.token, type).success(function (res) {
                $rootScope.brands = res;
                $rootScope.brands.length === 0 && ($scope.isAddElement.brand = true);
            }).error(function (err, stt, res) {
                console.log(res)
                toastr.error('Error!');
            });
        }

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