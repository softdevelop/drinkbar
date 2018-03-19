/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.detail-ingredient')
        .controller('IngredientDetailCtrl', IngredientDetailCtrl);

    /** @ngInject */
    function IngredientDetailCtrl($stateParams, $scope, IngredientService, toastr, $rootScope, $location, $window) {
        $scope.detail = {};
        $scope.paramt_id = $stateParams.id;
        $scope.data_detail = {
            id: $scope.paramt_id
        };
        $scope.types = [];
        $scope.brands = [];

        // ========= function get data glass by id ===========
        function getElement() {
            IngredientService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function (res) {
                res.status = String(res.status);
                res.brand = String(res.brand);
                $scope.detail = res;

                getListType();
                getListBrand($scope.detail.type);
            }).error(function (err, status, res) {
                console.log(err);
                toastr.error('Error!');
            })
        }

        getElement();

        // ========== function get list type ============
        function getListType() {
            IngredientService.getListType($rootScope.userLogin.token).success(function (res) {
                $scope.types = res;
            }).error(function (err, stt, res) {
                console.log(res)
                toastr.error('Error!');
            });
        }

        // ============ function get list brand ===========
        function getListBrand(type) {
            IngredientService.getListBrand($rootScope.userLogin.token, type).success(function (res) {
                $scope.brands = res;
            }).error(function (err, stt, res) {
                console.log(res)
                toastr.error('Error!');
            });
        }

        // ========== function change from ===============
        $scope.changeInfo = function (field, value) {
            $scope.data_detail[field] = value;
        }

        // =========== function create =================
        $scope.save = function () {
            IngredientService.updated($scope.data_detail, $rootScope.userLogin.token).success(function (res) {
                toastr.success('Updated success!');
                setTimeout(function () {
                    res.id > 0 && ($window.location.href = '#/manager-drink/ingredient/list');
                }, 300);
            }).error(function (err, status, res) {
                console.log(err)
                toastr.error('Error!');
            })
        }

    }

})();