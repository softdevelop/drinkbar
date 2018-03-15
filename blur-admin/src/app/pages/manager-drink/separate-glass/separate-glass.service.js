(function () {
    'use strict';
    angular.module('BlurAdmin')
        .factory('SeparateService', function ($http, AppSetting) {
            return {
                getList: function (token) {
                    return $http.get(AppSetting.BASE_URL + '/api/glass/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                createGlass: function (data, token) {
                    var fd = new FormData();
                    for (var key in data) {
                        fd.append(key, data[key])
                    }
                    return $http.post(AppSetting.BASE_URL + '/api/glass/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                deleteGlass: function (id, token) {
                    return $http.delete(AppSetting.BASE_URL + '/api/glass/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                updateGlass: function (data, token) {
                    var fd = new FormData();

                    for (var key in data) {
                        fd.append(key, data[key])
                    }
                    return $http.patch(AppSetting.BASE_URL + '/api/glass/' + id + '/', fd , {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                }
            }
        });
})();