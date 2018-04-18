/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-fifo')
		.controller('FifoListCtrl', FifoListCtrl)
		.controller('FifoShowQRCodeCtrl', FifoShowQRCodeCtrl)
		.controller('FifoDeleteCtrl', FifoDeleteCtrl);

	/** @ngInject */
	function FifoListCtrl($scope, toastr, FifoService, $rootScope, $location, $window, $uibModal) {
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

        $scope.selectPage = function(page_number, e){
        }

        // =============== show zoom QR Code =====================
        $scope.showQR = function(image){
        	console.log(image)
        	var page = 'app/pages/fifo/list/show-qr-code.html';

            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return image;
                    }
                },
                controller: 'FifoShowQRCodeCtrl',
            });
        }

        // =============== fucntion change status ================
		$scope.changeStatus = function (data) {
			data.active === true ? data.active = false : data.active = true;
			var _obj = {
				id: data.id,
				active: data.active
			}
			FifoService.updated(_obj, $rootScope.userLogin.token).success(function (res) {
				toastr.success('Change status success!');
				getList();
			}).error(function (err, status, res) {
				toastr.error(err.detail);
			})
		}
		
		// ================= get list ===============
		function getList(){
			var _key = 1;
			FifoService.getList($rootScope.userLogin.token, $rootScope.offset).success(function(res){
				$rootScope.listData = res.results;
				// $rootScope.listData.products.forEach(function(el){
				// 	el.key = _key;
				// 	_key++;
				// });
				$scope.products = $rootScope.listData.products;
				console.log($scope.products)
				$scope.bigTotalItems = res.count;
			}).error(function(err, status, res){
				toastr.error(err.detail);
			});
		}

		getList();

		// =========== open modal confirm delete Glass ===========
		$scope.confirmDelete = function(data){
			var page = 'app/pages/fifo/list/confirm/index.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
				size: 'sm',
				resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'FifoDeleteCtrl',
            });
		}

	};

	// controler IngredientBrandListDeleteCtrl
	function FifoDeleteCtrl($scope, toastr, FifoService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		$scope.item_del = items;

		// ================= get list glass ===============
		function getList(){
			FifoService.getList($rootScope.userLogin.token, $rootScope.offset).success(function(res){
				$rootScope.listData = res;
			}).error(function(err, status, res){
				toastr.error(err.detail);
			});
		}

		// =========== function delete glass =============
		$scope.remove = function(data){
			FifoService.removed(data.id, $rootScope.userLogin.token).success(function(res){
				toastr.success('Deleted success!');
				$uibModalInstance.close();
				getList();
			}).error(function(err, status, res){
				toastr.error(err.detail);
			})
		}
	}

	// controler IngredientBrandListDeleteCtrl
	function FifoShowQRCodeCtrl($scope, toastr, FifoService, $rootScope, $location, $window, $uibModal, items, $uibModalInstance){
		$scope.qr_code = items;
	}

})();