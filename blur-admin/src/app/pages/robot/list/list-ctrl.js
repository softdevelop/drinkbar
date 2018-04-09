/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-robot')
		.controller('RobotListCtrl', RobotListCtrl);

	/** @ngInject */
	function RobotListCtrl($scope, toastr, RobotService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listData = [];

		$scope.maxSize = 10;
        $scope.bigTotalItems = 0;
		$scope.bigCurrentPage = 1;
		$rootScope.ingredients = [];
		
		// ================ pagination ====================
        $scope.changePage =  function(page_index){
            $rootScope.offset = page_index > 1 ? ((page_index - 1)*10) : 0;
            getList();
        }

        $scope.selectPage = function(page_number, e){
            console.log('select page')
            console.log(page_number)
            console.log(e)
        }

        // =============== fucntion change status ================
		$scope.changeStatus = function (data) {
			data.status === 0 ? data.status = 10 : data.status = 0;
			var _obj = {
				id: data.id,
				status: data.status,
				ingredients : $rootScope.ingredients
			}
			
			RobotService.updated(_obj, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Change status success!');
				getList();
			}).error(function (err, status, res) {
				console.log(err);
				toastr.error(err.detail);
			})
		}
		
		// ================= get list ===============
		function getList(){
			RobotService.getList($rootScope.userLogin.token).success(function(res){
				res.results.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listData = res.results;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error(err.detail);
			});
		}

		getList();

		// ============ change Switch ==============
		$scope.countSwitch = 0;
		$scope.changeSwitch = function (data) {
			$scope.countSwitch ++;
			if($scope.countSwitch == 2){
				$scope.countSwitch = 0;
				var _obj = {
					id : data.id,
					status : data.status ? 0 : 10
				};

				RobotService.updated(_obj, $rootScope.userLogin.token).success(function(res){
					toastr.success('Change status success!');
					getList();
				}).error(function(err, status, res){
					console.log(err);
					toastr.error(err.detail);
				})
			}
		}

		// ============ open import robot ==========
		$scope.openImportRobot = function(size){
			var page = 'app/pages/robot/import/import.html';

            $uibModal.open({
				animation: true,
				templateUrl: page,
                size: size,
                controller : 'RobotImportHistoryCtrl'
			});
		}

	};

})();