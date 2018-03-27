/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.create-drink')
        .controller('DrinkCreateIngredientCtrl', DrinkCreateIngredientCtrl);

    /** @ngInject */
    function DrinkCreateIngredientCtrl($scope, DrinkService, IngredientService, toastr, $rootScope, $location, $window, $uibModalInstance) {
        $scope.offset = 0;
        $scope.list_ingredient = [];
        $scope.data_create = {
            unit: '0'
        };
        $scope.ingredient = null;
        $scope.isDisableBrand = $scope.isDisableIngredient = true;

        // =========== get list ingredient ==============
        function getListIngredient(type, brand) {
            DrinkService.getListIngredient($rootScope.userLogin.token, type, brand).success(function (res) {
                $scope.list_ingredient = res.results;
            })
        }

        // getListIngredient();

        // ========== function get list type ============
        function getListType(){
            IngredientService.getListType($rootScope.userLogin.token).success(function(res){
                $scope.types = res;

                $scope.types.length === 0 && ($scope.isAddElement.type = true);
            }).error(function(err, stt, res){
                console.log(res)
                toastr.error('Error!');
            });
        }

        getListType();

        // ============ function get list brand ===========
        function getListBrand(type){
            IngredientService.getListBrand($rootScope.userLogin.token, type).success(function(res){
                $rootScope.brands = res.results;

                $rootScope.brands.length === 0 && ($scope.isAddElement.brand = true);
            }).error(function(err, stt, res){
                console.log(res)
                toastr.error('Error!');
            });
        }

        // ========== function change from ===============
        $scope.changeInfo = function (field, value) {
            if (field === 'ingredient') {
                $scope.ingredient = value;
                var _arr = $scope.list_ingredient;
                var _val = _arr.filter(function (el) {
                    return String(el.id) === value;
                })[0];
                $scope.data_create.ingredient = _val;
            } else if(field === 'type'){
                $scope.isDisableBrand = false;
                getListBrand($scope.data_create.type)
            } else if(field === 'brand'){
                $scope.isDisableIngredient = false;
                getListIngredient($scope.type, $scope.brand);
            }
            else {
                $scope.data_create[field] = value;
            }
        }

        // ============== add ingredient =============
        $scope.add = function () {
            console.log($scope.data_create)
            toastr.success('Add Ingredient success!');
            $rootScope.ingredients.push($scope.data_create);
            $uibModalInstance.close();
            $rootScope.loadPageDrinkCreate(true);
        }
    }

})();