/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-separate-glass')
		.controller('SeparateGlassListCtrl', SeparateGlassListCtrl);

	/** @ngInject */
	function SeparateGlassListCtrl($scope, toastr, SeparateService, $rootScope, $location, $window) {
		$scope.listGalss = [];

		// ================= get list glass ===============
		function getList(){
			SeparateService.getList($rootScope.userLogin.token).success(function(res){
				console.log(res)
				$scope.listGalss = res;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error('Error!');
			});
		}

		getList();
	}

})();