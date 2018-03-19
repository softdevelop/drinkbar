/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-ingredient')
		.controller('IngredientListCtrl', IngredientListCtrl)
		.controller('IngredientDeleteCtrl', IngredientDeleteCtrl);

	/** @ngInject */
	function IngredientListCtrl($scope, toastr, IngredientService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listData = [];

		$scope.maxSize = 10;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;
		$rootScope.offset = 0;
		
		// ================ pagination ====================
        $scope.changePage =  function(page_index){
            $rootScope.offset = page_index > 1 ? ((page_index - 1)*10) : 0;
            getList();
        }
		
		// ================= get list ===============
		function getList(){
			IngredientService.getList($rootScope.userLogin.token, $rootScope.offset).success(function(res){
                $rootScope.listData = res.results;
                $scope.bigTotalItems = res.count;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error('Error!');
			});
		}

		getList();

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function(data){
			var page = 'app/pages/manager-drink/ingredient/list/confirm/index.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'IngredientDeleteCtrl',
            });
		}

	};

	// controler IngredientListDeleteCtrl
	function IngredientDeleteCtrl($scope, toastr, IngredientService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		console.log(items)
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			IngredientService.getList($rootScope.userLogin.token, $rootScope.offset).success(function(res){
				$rootScope.listData = res.results;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error('Error!');
			});
		}

		// =========== function delete glass =============
		$scope.remove = function(data){
			IngredientService.removed(data.id, $rootScope.userLogin.token).success(function(res){
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