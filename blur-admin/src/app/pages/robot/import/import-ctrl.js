/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.import-robot')
		.controller('RobotImportHistoryCtrl', RobotImportHistoryCtrl);

	/** @ngInject */
	function RobotImportHistoryCtrl($stateParams, $scope, RobotService, IngredientService, toastr, $rootScope, $location, $window, $uibModal) {
        console.log('RobotImportHistoryCtrl')
        
        $scope.list_robot = [];
        $scope.ingredients = [];
        $scope.data_create = {
            place_number : 0,
            status : 0
        }

        // ============ get list robot ===========
        function getListRobot(){
            RobotService.getList($rootScope.userLogin.token).success(function(res){
                $scope.list_robot = res.results;
            }).error(function(err, stt, res){
                console.log(res)
                toastr.error('Error!');
            })
        }

        getListRobot();

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
                $window.location.href = '#/robot/history/list';
            }).error(function(err, stt, res){
                console.log(res)
                toastr.error('Error!');
            })
        }

	}

})();