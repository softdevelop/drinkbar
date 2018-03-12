/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.list-user')
        .controller('ManagerUserCtrl', ManagerUserCtrl);

    function ManagerUserCtrl(ManagerUserService, $window, $scope, fileReader, $filter, $uibModal, ProfileService, baProgressModal, toastr) {
        $scope.listUser = [
            // {
            //     username : 'asdasd',
            //     email : 'asd@gmail.com',
            //     first_name : 'asd',
            //     last_name : 'asd',
            //     birthday : '2012-10-10',
            //     avatar : 'http://localhost:8000/media/avatars/coding-3013602_960_720_QBb5yGK.jpg',
            //     avatar_url : '14',
            //     is_email_verified : true,
            //     opt : '22222',
            //     is_active : true,
            //     is_staff : true,
            //     is_superuser : true,
            //     last_login : '2018-12-12',
            //     data_joined : ''
            // }
        ];

        $scope.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        function getAllUser(){
            ManagerUserService.getAllUser($scope.currentUser.token).success(function(res){
                $scope.listUser = res;
            })
        }

        getAllUser();

    }

})();
