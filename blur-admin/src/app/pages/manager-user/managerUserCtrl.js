/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.list-user')
        .controller('ManagerUserCtrl', ManagerUserCtrl);

    function ManagerUserCtrl($rootScope, ManagerUserService, $window, $scope, fileReader, $filter, $uibModal, ProfileService, baProgressModal, toastr) {
        $scope.listUser = [];

        $scope.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // =========== option notification ==================
        $scope.option = {
			"autoDismiss": false,
			"positionClass": "toast-bottom-right",
			"type": "success",
			"timeOut": "5000",
			"extendedTimeOut": "2000",
			"allowHtml": false,
			"closeButton": false,
			"tapToDismiss": false,
			"progressBar": false,
			"newestOnTop": false,
			"maxOpened": 0,
			"preventDuplicates": false,
			"preventOpenDuplicates": false
        };

        // ================= open modal info of user ============================
        $scope.openUser = function(data, size){
            var page = 'app/pages/manager-user/user-detail/user.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                resolve: {
                    items: function () {
                        return data;
                    }
                },
                controller: 'UserDetailCtrl',
            });
        }

        // =================== open modal create user ==========================
        $scope.openCreateUser = function(size){
            var page = 'app/pages/manager-user/user-create/user-create.html';
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                resolve: {
                    token: function () {
                        return $scope.currentUser.token;
                    }
                },
                controller: 'UserCreateCtrl',
            });
        }

        // ====================== delete user ================================
        $scope.deleteUser = function(data){
            ManagerUserService.deleteUser(data.id, $scope.currentUser.token).success(function(res){
                toastr.success('', 'Deleted success!');
                getAllUser();
            }).error(function (err, status, response) {
                console.log(response);
            });
        }

        // ===================== function get list user ============================
        function getAllUser(){
            ManagerUserService.getAllUser($scope.currentUser.token).success(function(res){
                $scope.listUser = res;
            }).error(function (err, status, response) {
                console.log(response);
                toastr.error('', 'Error!');
            });
        }

        console.log($rootScope.loadDataListUser)
        if($rootScope.loadDataListUser){
            getAllUser();
        }

        getAllUser();

    }

})();
