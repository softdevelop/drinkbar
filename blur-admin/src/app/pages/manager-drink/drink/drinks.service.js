(function () {
    'use strict';
    angular.module('BlurAdmin')
        .factory('DrinkService', function ($http, AppSetting) {
            return {
                getList: function (token, offset) {
                    return $http.get(AppSetting.BASE_URL + '/api/drink/?limit=10&offset=' + offset, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                created: function (data, token) {

                    data.ingredients.forEach(function(el){
                        el.ingredient = el.ingredient.id;
                    });

                    data.garnishes.forEach(el => {
                        el.garnish = el.garnish.id;
                    });

                    var _arr = [];
                    data.category.forEach(function (el) {
                        _arr.push(el.id)
                    });
                    data.category = _arr;

                    var fd = new FormData();
                    for (var key in data) {
                        if(key === 'garnishes' || key === 'ingredients'){
                            data[key] = JSON.stringify(data[key])
                        }
                        fd.append(key, data[key])
                    }

                    return $http.post(AppSetting.BASE_URL + '/api/drink/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                removed: function (id, token) {
                    return $http.delete(AppSetting.BASE_URL + '/api/drink/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                updated: function (data, token) {
                    var fd = new FormData();

                    for (var key in data) {
                        if (key === 'image') {
                            if (data[key])
                                fd.append(key, data[key]);
                        }
                        else {
                            fd.append(key, data[key]);
                        }
                    }
                    return $http.patch(AppSetting.BASE_URL + '/api/drink/' + data.id + '/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                changed: function (data, token) {
                    var fd = new FormData();
                    fd.append('status', data.status);

                    return $http.patch(AppSetting.BASE_URL + '/api/drink/' + data.id + '/', fd, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                getElement: function (id, token) {
                    return $http.get(AppSetting.BASE_URL + '/api/drink/' + id + '/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    })
                },
                getCategories: function (token) {
                    return $http.get(AppSetting.BASE_URL + '/api/drink/category/', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                getListGlass: function (token) {
                    return $http.get(AppSetting.BASE_URL + '/api/glass/?admin=true', {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                getListIngredient: function (token, type, brand) {
                    return $http.get(AppSetting.BASE_URL + '/api/ingredient/?type=' + type + '&brand=' + brand, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
            }
        });
})();