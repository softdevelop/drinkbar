(function() {
    'use strict';
    angular.module('BlurAdmin')
    .factory('ManagerUserService', function($http, AppSetting){
        return {
            getAllUser: function(token) {
                // return $http.get('http://petshopro.giinger.com/api/users/');
                return $http.get(AppSetting.BASE_URL + '/api/user/', {
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Token ' + token
                    }
                });
            }
        }
    });
})();