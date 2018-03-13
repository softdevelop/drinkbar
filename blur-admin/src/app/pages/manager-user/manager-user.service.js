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
            },
            createUser : function(data, token){
                return $http.post(AppSetting.BASE_URL + '/api/user/', {
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Token ' + token
                    }
                });
            },
            deleteUser : function(id, token){
                return $http.delete(AppSetting.BASE_URL + '/api/user/' + id + '/', {
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Token ' + token
                    }
                });
            }
        }
    });
})();