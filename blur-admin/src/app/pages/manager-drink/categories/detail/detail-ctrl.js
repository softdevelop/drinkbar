/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.detail-categories')
		.controller('CategoriesDetailCtrl', CategoriesDetailCtrl);

	/** @ngInject */
	function CategoriesDetailCtrl($stateParams, $scope, CategoriesService, toastr, $rootScope, $location, $window, $filter) {
		$scope.detail = {};
		$scope.paramt_id = $stateParams.id;
		$scope.data_detail = {
			id : $scope.paramt_id
        };
        $scope.list_categories = [];
		$scope.isDisable = true;
		$scope.picture = undefined;
		
		// ========= function get data glass by id ===========
		function getElement(){
			CategoriesService.getElement($scope.paramt_id, $rootScope.userLogin.token).success(function(res){
                $scope.detail = res;
				$scope.detail.parent = String(res.parent);
				$scope.picture = res.image;
				
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

		// ============ upload image ===============
		$scope.removePicture = function () {
			console.log('asdasdas')
			$scope.detail.image = $scope.picture;
			console.log($scope.detail.image)
        };

        $scope.uploadPicture = function () {
            var fileInput = document.getElementById('uploadFile');
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
                $scope.isChangeAvatar = true;
                $scope.detail.image = e.target.result;

                var file = $window.document.getElementById('uploadFile');
                $scope.data_detail.image = file.files[0];
            });
        }

	}

})();