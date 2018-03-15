/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.drink-types')
		.controller('DrinkTypesCtrl', DrinkTypesCtrl);

	/** @ngInject */
	function DrinkTypesCtrl($scope, ProfileService, toastr, ManagerUserService, $rootScope, $location, $window) {
        // $scope.account = {
        //     username : '',
        //     password : '',
        //     re_password : ''
        // };
        // $scope.isDisable = true;

        // // =========== change form create user ========
        // $scope.changeInfo = function(field, value){
        //     if(field === 're_password'){
        //         $scope.account.password === value && ($scope.isDisable = false);
        //     }
        //     $scope.account[field] = value;
        // }

        // $scope.create = function(){
        //     var _data = {
        //         password : $scope.account.password,
        //         username : $scope.account.username,
        //         email : $scope.account.username,
        //     }
        //     ManagerUserService.createUser(_data, $rootScope.userLogin.token).success(function(res){
        //         toastr.success('Created success!');
        //         if(res.id > 0){
        //             var url_redirect = '#/user-detail/'+res.id;
        //             $window.location.href = url_redirect;
        //         }
        //     }).error(function (err, status, response) {
        //         console.log(response);
        //         toastr.error('', 'Error!');
        //     });
        // }
	}

})();