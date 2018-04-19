/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-drink')
		.controller('DrinkListCtrl', DrinkListCtrl)
		.controller('DrinkDeleteCtrl', DrinkDeleteCtrl);

	/** @ngInject */
	function DrinkListCtrl($scope, toastr, DrinkService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listData = [];

		$scope.maxSize = 10;
		$scope.bigTotalItems = 0;
		$scope.bigCurrentPage = 1;
		$rootScope.offset = 0;
		$scope.keywork = '';

		// ================ pagination ====================
		$scope.changePage = function (page_index) {
			$rootScope.offset = page_index > 1 ? ((page_index - 1) * 10) : 0;
			getList();
		}

		// ============= change keywork ============
		$scope.changeKeywork = function(keywork){
			$scope.keywork = keywork;
		}

		// ============== search data ==============
		$scope.searchData = function(){
			DrinkService.searchData($rootScope.userLogin.token, $scope.keywork, $rootScope.offset).success(function(res){
				$rootScope.listData = res.results;
				$scope.bigTotalItems = res.count;
			})
		}
		
		// ================= get list ===============
		function getList(){
			DrinkService.getList($rootScope.userLogin.token, $rootScope.offset).success(function(res){
				$rootScope.listData = res.results;
				$scope.bigTotalItems = res.count;
			}).error(function(err, status, res){
				toastr.error(err.detail);
			});
		}

        getList();
        
        // =========== change active ==================
        $scope.changeActive = function(data){
            DrinkService.updated(data, $rootScope.userLogin.token).success(function(res){
                toastr.success('Updated active success!');
                getList();
            }).error(function(err, stt, res){
                toastr.error(err.detail);
            })
        }

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function(data){
			var page = 'app/pages/manager-drink/drink/list/confirm/confirm.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'DrinkDeleteCtrl',
            });
		}

	};

	// controler drinkListDeleteCtrl
	function DrinkDeleteCtrl($scope, toastr, DrinkService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			DrinkService.getList($rootScope.userLogin.token).success(function(res){
				$rootScope.listData = res;
			}).error(function(err, status, res){
				toastr.error(err.detail);
			});
		}

		// =========== function delete glass =============
		$scope.remove = function(data){
			DrinkService.removed(data.id, $rootScope.userLogin.token).success(function(res){
				toastr.success('Deleted success!');
				$uibModalInstance.close();
				getList();
			}).error(function(err, status, res){
				toastr.error(err.detail);
			})
		}
	}

})();