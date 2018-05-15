/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.order-carts')
		.controller('OrderCartsCtrl', OrderCartsCtrl);

	/** @ngInject */
	function OrderCartsCtrl($scope, OrderService, ManagerUserService, RobotService, toastr, $rootScope, $location, $window) {
		$scope.listData = [];

        // ================= get list ===============
		function getList(){
			OrderService.addCart($rootScope.userLogin.token).success(function(res){
				console.log(res)
				$scope.listData = res.results;
			}).error(function(err, stt, res){
				toastr.error(err.detail);
			});
		}

		getList();

	}

})();