/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-separate-glass')
		.controller('SeparateGlassDetailCtrl', SeparateGlassDetailCtrl);

	/** @ngInject */
	function SeparateGlassDetailCtrl($stateParams, $scope, toastr, $rootScope, $location, $window, SeparateService) {
		$scope.glass = {};
		$scope.glass_id = $stateParams.id;
		$scope.data_detail = {
			id : $scope.glass_id
		};
		
		// ========= function get data glass by id ===========
		function getGlassById(){
			SeparateService.getGlass($scope.glass_id, $rootScope.userLogin.token).success(function(res){
				res.status = res.status === 0 ? '0' : '10';
				res.unit = res.unit === 0 ? '0' : '10';
				$scope.glass = res;
			}).error(function(err, status, res){
				console.log(err);
				toastr.error('Error!');
			})
		}

		getGlassById();

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_detail[field] = value;
		}
		
		// ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_detail.image = file;
			$scope.isDisable = false;
		}

		// =========== function create =================
		$scope.save = function(){
			SeparateService.updateGlass($scope.data_detail, $rootScope.userLogin.token).success(function(res){
				toastr.success('Updated success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/separate-glass/list');
				}, 300);
			}).error(function(err, status, res){
				console.log(err)
				toastr.error('Error!');
			})
		}

	}

})();