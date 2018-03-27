/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-order')
		.controller('OrderCreateCtrl', OrderCreateCtrl);

	/** @ngInject */
	function OrderCreateCtrl($scope, OrderService, toastr, $rootScope, $location, $window) {
        $scope.data_create = {
            name : '',
            parent : '',
            image : ''
        };
        $scope.isDisable = true;
        $scope.list_categories = [];

        // ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_create.image = file;
			$scope.isDisable = false;
		}

        // ================= get list ===============
		function getList(){
			OrderService.getList($rootScope.userLogin.token).success(function(res){
				$scope.list_categories = res;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error('Error!');
			});
		}

		getList();

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_create[field] = value;
		}

		// =========== function create =================
		$scope.create = function(){
            $scope.data_create.slug = $scope.data_create.name;
			OrderService.created($scope.data_create, $rootScope.userLogin.token).success(function(res){
				toastr.success('Created success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/order/detail/'+res.id);
				}, 300);
			}).error(function(err, status, res){
				console.log(err)
				toastr.error('Error!');
			})
		}

	}

})();