(function() {
    'use strict';
    angular.module('BlurAdmin')
    .factory('SeparateService', function($http, AppSetting){
        return {
            getList: function(token) {
                return $http.get(AppSetting.BASE_URL + '/api/glass/', {
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Token ' + token
                    }
                });
            },
            
        }
    });
})();