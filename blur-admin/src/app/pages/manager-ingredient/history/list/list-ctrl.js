/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-history')
		.controller('HistoriesIngredientListCtrl', HistoriesIngredientListCtrl)
		.controller('HistoriesIngredientDeleteCtrl', HistoriesIngredientDeleteCtrl);

	/** @ngInject */
	function HistoriesIngredientListCtrl($scope, toastr, HistoryIngredientService, IngredientService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listData = [];

		$scope.maxSize = 10;
        $scope.bigTotalItems = 0;
		$scope.bigCurrentPage = 1;
		// $scope.ingredients = [];
		
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
			data.active === true ? data.active = false : data.active = true;
			var _obj = {
				id: data.id,
				active: data.active
			}
			console.log(_obj)
			HistoryIngredientService.updated(_obj, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Change status success!');
				getList();
			}).error(function (err, status, res) {
				toastr.error(err.detail);
			})
		}
		
		// ================= get list ===============
		function getList(){
			HistoryIngredientService.getList($rootScope.userLogin.token).success(function(res){
				res.results.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listData = res.results;
			}).error(function(err, status, res){
                $window.location.href = '#/robot/list';
				toastr.error(err.detail);
			});
		}

		getList();

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function(data){
			var page = 'app/pages/robot/history/list/confirm/index.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'HistoriesIngredientDeleteCtrl',
            });
		}

	};

	// controler IngredientBrandListDeleteCtrl
	function HistoriesIngredientDeleteCtrl($scope, toastr, HistoryIngredientService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		console.log(items)
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			HistoryIngredientService.getList($rootScope.userLogin.token).success(function(res){
				res.results.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listData = res.results;
			}).error(function(err, status, res){
				toastr.error(err.detail);
			});
		}

		// =========== function delete glass =============
		$scope.remove = function(data){
			HistoryIngredientService.removed(data.id, $rootScope.userLogin.token).success(function(res){
				toastr.success('Deleted success!');
				$uibModalInstance.close();
				getList();
			}).error(function(err, status, res){
				toastr.error(err.detail);
			})
		}
	}

})();