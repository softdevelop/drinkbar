/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-history')
		.controller('HistoriesListCtrl', HistoriesListCtrl)
		.controller('HistoriesDeleteCtrl', HistoriesDeleteCtrl);

	/** @ngInject */
	function HistoriesListCtrl($scope, toastr, HistoryService, IngredientService, $rootScope, $location, $window, $uibModal) {
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
			HistoryService.updated(_obj, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Change status success!');
				getList();
			}).error(function (err, status, res) {
				console.log(err);
				toastr.error(err.detail);
			})
		}
		
		// ================= get list ===============
		function getList(){
			HistoryService.getList($rootScope.userLogin.token, $rootScope.robotId).success(function(res){
				res.results.forEach(function(el){
					el.status = el.status === 0 ? true : false;
				});
				$rootScope.listData = res.results;
				console.log($rootScope.listData)
			}).error(function(err, status, res){
				console.log(res)
                $window.location.href = '#/robot/list';
				toastr.error(err.detail);
			});
		}

		getList();

		// ============ get list ingredient ==========
        // function getListIngredient(){
        //     var offset = 0;
        //     IngredientService.getList($rootScope.userLogin.token, offset).success(function(res){
        //         $scope.ingredients = res.results;
        //     }).error(function(err, stt, res){
        //         console.log(res)
        //         toastr.error(err.detail)
        //     })
        // }

        // getListIngredient();

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
                controller: 'HistoriesDeleteCtrl',
            });
		}

	};

	// controler IngredientBrandListDeleteCtrl
	function HistoriesDeleteCtrl($scope, toastr, HistoryService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		console.log(items)
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			HistoryService.getList($rootScope.userLogin.token).success(function(res){
				$rootScope.listData = res.results;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error(err.detail);
			});
		}

		// =========== function delete glass =============
		$scope.remove = function(data){
			HistoryService.removed(data.id, $rootScope.userLogin.token).success(function(res){
				toastr.success('Deleted success!');
				$uibModalInstance.close();
				getList();
			}).error(function(err, status, res){
				console.log(err);
				toastr.error(err.detail);
			})
		}
	}

})();