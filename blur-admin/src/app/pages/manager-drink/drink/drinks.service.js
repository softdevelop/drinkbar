(function () {
    'use strict';
    angular.module('BlurAdmin')
        .factory('DrinkService', function ($http, AppSetting) {
            return {
                getList: function (token, offset) {
                    return $http.get(AppSetting.BASE_URL + '/api/drink/?limit=100&offset=' + offset, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                },
                created: function (data, token) {
                    var fd = new FormData();
                    
                    data.ingredients.length > 0 && data.ingredients.forEach(function (el) {
                        el.ingredient = el.ingredient.id;
                        fd.append('ingredients', JSON.stringify(el))
                    });

                    data.ingredients.length === 0 && fd.append('ingredients', []);
                    
                    data.garnishes.forEach(function(el){
                        el.garnish = el.garnish.id;
                        fd.append('garnishes', JSON.stringify(el))
                    });

                    var _arr = [];
                    data.category.forEach(function (el) {
                        _arr.push(el.id)
                    });
                    data.category = _arr;


                    for (var key in data) {
                        if(!(key === 'garnishes' || key == 'ingredients')){
                            fd.append(key, data[key])
                        }
                            
                        
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
                    
                    data.ingredients.forEach(function (el) {
                        el.ingredient = el.ingredient.id;
                        fd.append('ingredients', JSON.stringify(el))
                    });
                    
                    data.garnishes.forEach(function(el){
                        el.garnish = el.garnish.id;
                        fd.append('garnishes', JSON.stringify(el))
                    });

                    var _arr = [];
                    data.category.forEach(function (el) {
                        _arr.push(el.id)
                    });
                    data.category = _arr;


                    for (var key in data) {
                        if(!(key === 'garnishes' || key == 'ingredients')){
                            fd.append(key, data[key])
                        }
                    }

                    for (var key in data) {
                        if (key === 'image') {
                            if (data[key])
                                fd.append(key, data[key]);
                        } else if(key === 'image_background'){
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
                getListBrand: function (token, type) {
                    return $http.get(AppSetting.BASE_URL + '/api/ingredient/brand/type/?type=' + type, {
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Token ' + token
                        }
                    });
                }

            }
        });
})();