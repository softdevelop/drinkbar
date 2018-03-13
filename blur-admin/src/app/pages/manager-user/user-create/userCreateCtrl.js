/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-user')
		.controller('UserCreateCtrl', UserCreateCtrl);

	/** @ngInject */
	function UserCreateCtrl($scope, $uibModalInstance, ProfileService, token, toastr, ManagerUserService) {
		console.log(token)

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
        
        $scope.account = {
            username : '',
            password : '',
            re_password : ''
        };
        $scope.data_create = {};
        $scope.isDisable = true;
        $scope.isChange = false;

        // ================= function change form =============
        $scope.changeInfo = function(field, value){
            $scope.isChange = true;
            if(field === 're_password'){
                $scope.account.password === value ? $scope.isDisable = false : $scope.isDisable = true;
            }
            $scope.account[field] = value;
        }

		$scope.create = function () {
            $scope.data_create = {
                username : $scope.account.username,
                password : $scope.account.password
            };

		};
	}

})();