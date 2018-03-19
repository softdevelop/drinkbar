/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-garnish')
		.controller('GarnishCreateCtrl', GarnishCreateCtrl);

	/** @ngInject */
	function GarnishCreateCtrl($scope, GarnishService, toastr, $rootScope, $location, $window) {
        $scope.data_create = {
            name : '',
            active : false
		};

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_create[field] = value;
        }

		// =========== function create =================
		$scope.create = function(){
			GarnishService.created($scope.data_create, $rootScope.userLogin.token).success(function(res){
				toastr.success('Created success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/garnish/detail/'+res.id);
				}, 300);
			}).error(function(err, status, res){
				console.log(err)
				toastr.error('Error!');
			})
		}

	}

})();