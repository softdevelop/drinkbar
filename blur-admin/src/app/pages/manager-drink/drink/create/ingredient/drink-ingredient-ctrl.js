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

        // =========== get list ingredient ==============
        function getListIngredient() {
            IngredientService.getList($rootScope.userLogin.token, $scope.offset).success(function (res) {
                $scope.list_ingredient = res.results;
            })
        }

        getListIngredient();

        // ========== function change from ===============
        $scope.changeInfo = function (field, value) {
            if (field === 'ingredient') {
                $scope.ingredient = value;
                var _arr = $scope.list_ingredient;
                var _val = _arr.filter(function (el) {
                    return String(el.id) === value;
                })[0];
                $scope.data_create.ingredient = _val;
            } else {
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