/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-garnish')
		.controller('GarnishListCtrl', GarnishListCtrl)
		.controller('GarnishDeleteCtrl', GarnishDeleteCtrl);

	/** @ngInject */
	function GarnishListCtrl($scope, toastr, GarnishService, $rootScope, $location, $window, $uibModal) {
		$rootScope.listData = [];
		
		// ================= get list ===============
		function getList(){
			GarnishService.getList($rootScope.userLogin.token).success(function(res){
				$rootScope.listData = res;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error('Error!');
			});
		}

        getList();
        
        // =========== change active ==================
        $scope.changeActive = function(data){
            GarnishService.updated(data, $rootScope.userLogin.token).success(function(res){
                toastr.success('Updated active success!');
                getList();
            }).error(function(err, stt, res){
                console.log(res);
                toastr.error('Error!');
            })
        }

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function(data){
			var page = 'app/pages/manager-drink/garnish/list/confirm.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'GarnishDeleteCtrl',
            });
		}

	};

	// controler GarnishListDeleteCtrl
	function GarnishDeleteCtrl($scope, toastr, GarnishService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		console.log(items)
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			GarnishService.getList($rootScope.userLogin.token).success(function(res){
				$rootScope.listData = res;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error('Error!');
			});
		}

		// =========== function delete glass =============
		$scope.remove = function(data){
			GarnishService.removed(data.id, $rootScope.userLogin.token).success(function(res){
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