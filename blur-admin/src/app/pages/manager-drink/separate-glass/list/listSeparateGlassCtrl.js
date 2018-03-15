/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-separate-glass')
		.controller('SeparateGlassListCtrl', SeparateGlassListCtrl)
		.controller('SeparateGlassListDeleteCtrl', SeparateGlassListDeleteCtrl);

	/** @ngInject */
	function SeparateGlassListCtrl($scope, toastr, SeparateService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listGalss = [];
		$scope.status = true;

		// ================= get list glass ===============
		function getList(){
			SeparateService.getList($rootScope.userLogin.token).success(function(res){
				$rootScope.listGalss = res;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error('Error!');
			});
		}

		getList();

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function(data){
			var page = 'app/pages/manager-drink/separate-glass/list/confirm-delete.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'SeparateGlassListDeleteCtrl',
            });
		}

		// =============== fucntion change status ================
		$scope.changeStatus = function(data){
			console.log(data)
			data.status === 0 ? data.status = 10 : data.status = 0;
			SeparateService.changeStatusGlass(data, $rootScope.userLogin.token).success(function(res){
				toastr.success('Change status success!');
				getList();
			}).error(function(err, status, res){
				console.log(err);
				toastr.error('Error!');
			})
		}
		
	};

	function SeparateGlassListDeleteCtrl($scope, toastr, SeparateService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		console.log(items)
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			SeparateService.getList($rootScope.userLogin.token).success(function(res){
				$rootScope.listGalss = res;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error('Error!');
			});
		}

		

		// =========== function delete glass =============
		$scope.remove = function(data){
			SeparateService.deleteGlass(data.id, $rootScope.userLogin.token).success(function(res){
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