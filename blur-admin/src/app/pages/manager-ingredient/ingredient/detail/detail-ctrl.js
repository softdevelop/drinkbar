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
            id: $scope.paramt_id,
        };
        $scope.types = [];
        $scope.brands = [];
        $scope.isDisable = true;
        $scope.isChangeImage = true;

        // ========= function get data glass by id ===========
        function getElement() {
            IngredientService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function (res) {
                res.status = String(res.status);
                res.brand = String(res.brand.id);
                $scope.detail = res;
                $scope.detail.type = res.type.id;
                getListType();
                getListBrand($scope.detail.type);
            }).error(function (err, status, res) {
                toastr.error(err.detail);
            })
        }

        getElement();

        // ========== function get list type ============
        function getListType() {
            IngredientService.getListType($rootScope.userLogin.token).success(function (res) {
                $scope.types = res;
            }).error(function (err, stt, res) {
                toastr.error(err.detail);
            });
        }

        // ============ function get list brand ===========
        function getListBrand(type) {
            IngredientService.getListBrand($rootScope.userLogin.token, type).success(function (res) {
                $scope.brands = res;
            }).error(function (err, stt, res) {
                toastr.error(err.detail);
            });
        }

        // ========== function change from ===============
        $scope.changeInfo = function (field, value) {
            $scope.data_detail[field] = value;
        }

        // ========= fucntion upload image ===============
		$scope.imageUpload = function(e){
			var file = event.target.files[0];
			$scope.data_detail.image = file;
			$scope.isDisable = false;
		}

        // =========== function create =================
        $scope.save = function () {
            IngredientService.updated($scope.data_detail, $rootScope.userLogin.token).success(function (res) {
                toastr.success('Updated success!');
                setTimeout(function () {
                    res.id > 0 && ($window.location.href = '#/manager-ingredient/ingredient/list');
                }, 300);
            }).error(function (err, status, res) {
                toastr.error(err.detail);
            })
        }

        // ============================= upload image =================
		$scope.removePicture = function () {
            $scope.isChangeImage = true;
        };

        $scope.uploadPicture = function () {
            var fileInput = document.getElementById('uploadImage');
            fileInput.click();

        };

        $scope.unconnect = function (item) {
            item.href = undefined;
        };

        $scope.showModal = function (item) {
            $uibModal.open({
                animation: false,
                controller: 'ProfileModalCtrl',
                templateUrl: 'app/pages/profile/profileModal.html'
            }).result.then(function (link) {
                item.href = link;
            });
        };

        $scope.getFile = function () {
            fileReader.readAsDataUrl($scope.file, $scope)
                .then(function (result) {
                    $scope.data_profile.picture = result;
                });
        };

        $scope.file = '';
        $scope.onFileSelect = function ($file) {
        }

        $scope.changeAvatar = function () {
        }

        $scope.switches = [true, true, false, true, true, false];

        $scope.stepsModel = [];

        $scope.imageUpload = function (event) {
            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }

        $scope.imageIsLoaded = function (e) {
            $scope.isUpdated = true;
            $scope.$apply(function () {
                $scope.stepsModel.push(e.target.result);
                $scope.isChangeImage = false;
                $scope.image = e.target.result;
                var file = $window.document.getElementById('uploadImage');
                $scope.data_detail.image = file.files[0];
            });
        }

    }

})();