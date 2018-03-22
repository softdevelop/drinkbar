/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-categories')
		.controller('CategoriesDetailCtrl', CategoriesDetailCtrl);

	/** @ngInject */
	function CategoriesDetailCtrl($stateParams, $scope, CategoriesService, toastr, $rootScope, $location, $window) {
		$scope.detail = {};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id : $scope.paramt_id
        };
        $scope.list_categories = [];
        $scope.isDisable = true;
		
		// ========= function get data glass by id ===========
		function getElement(){
			CategoriesService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function(res){
                $scope.detail = res;
                $scope.detail.parent = String(res.parent);
			}).error(function(err, status, res){
				console.log(err);
				toastr.error('Error!');
			})
		}

        getElement();
        
        // ================= get list ===============
		function getList(){
			CategoriesService.getList($rootScope.userLogin.token).success(function(res){
				$scope.list_categories = res;
			}).error(function(err, status, res){
				console.log(res)
				toastr.error('Error!');
			});
		}

        getList();
        
        // ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_detail.image = file;
			$scope.isDisable = false;
		}

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
			$scope.data_detail[field] = value;
		}
		
		// =========== function create =================
		$scope.save = function(){
			CategoriesService.updated($scope.data_detail, $rootScope.userLogin.token).success(function(res){
				toastr.success('Updated success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-drink/categories/list');
				}, 300);
			}).error(function(err, status, res){
				console.log(err)
				toastr.error('Error!');
			})
		}

	}

})();