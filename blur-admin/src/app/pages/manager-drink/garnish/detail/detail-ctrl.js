/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-garnish')
		.controller('GarnishDetailCtrl', GarnishDetailCtrl);

	/** @ngInject */
	function GarnishDetailCtrl($stateParams, $scope, GarnishService, toastr, $rootScope, $location, $window) {
		$scope.detail = {};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id : $scope.paramt_id
		};
		
		// ========= function get data glass by id ===========
		function getElement(){
			GarnishService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function(res){
				$scope.detail = res;
			}).error(function(err, status, res){
				console.log(err);
				toastr.error('Error!');
			})
		}

		getElement();

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_detail[field] = value;
		}
		
		// =========== function create =================
		$scope.save = function(){
			GarnishService.updated($scope.data_detail, $rootScope.userLogin.token).success(function(res){
				toastr.success('Updated success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/garnish/list');
				}, 300);
			}).error(function(err, status, res){
				console.log(err)
				toastr.error('Error!');
			})
		}

	}

})();