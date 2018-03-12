(function() {
    'use strict';
    angular.module('BlurAdmin')
    .factory('ManagerUserService', function($http, AppSetting){
        return {
            getAllUser: function() {
                return $http.get(AppSetting.BASE_URL + '/api/user/me/', data);
            }
        }
    });
})();