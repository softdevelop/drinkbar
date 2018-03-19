/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-ingredient')
		.controller('IngredientCreateCtrl', IngredientCreateCtrl);

	/** @ngInject */
	function IngredientCreateCtrl($scope, IngredientService, toastr, $rootScope, $location, $window) {
        $scope.data_create = {
            name : '',
            type : null,
            status : '0',
            price : 0,
            bottles : 0,
            quanlity_of_bottle : 0,
            brand : null,
            image : null
        };
        $scope.types = [];
        $scope.brands = [];
        $scope.isDisableBrand = true;
        $scope.isDisable = true;
        
        // ========== function get list type ============
        function getListType(){
            IngredientService.getListType($rootScope.userLogin.token).success(function(res){
                $scope.types = res;
            }).error(function(err, stt, res){
                console.log(res)
                toastr.error('Error!');
            });
        }

        getListType();

        // ============ function get list brand ===========
        function getListBrand(type){
            IngredientService.getListBrand($rootScope.userLogin.token, type).success(function(res){
                $scope.brands = res;
            }).error(function(err, stt, res){
                console.log(res)
                toastr.error('Error!');
            });
        }

        // ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_create.image = file;
			$scope.isDisable = false;
		}

		// ========== function change from ===============
		$scope.changeInfo = function(field, value){
            if(field === 'type'){
                $scope.isDisableBrand = false;
                getListBrand($scope.data_create.type)
            }
            $scope.data_create[field] = value;
		}

		// =========== function create =================
		$scope.create = function(){
			IngredientService.created($scope.data_create, $rootScope.userLogin.token).success(function(res){
				toastr.success('Created success!');
				setTimeout(function(){
					res.id > 0 && ($window.location.href = '#/manager-ingredient/ingredient/detail/'+res.id);
				}, 300);
			}).error(function(err, status, res){
				console.log(err)
				toastr.error('Error!');
			})
		}

	}

})();