/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tivi-showing')
        .controller('TiviCtrl', TiviCtrl);

    /** @ngInject */
    function TiviCtrl($stateParams, $scope, TiviService, toastr, $rootScope, $location, $window, $uibModal) {
        $rootScope.products = [];
        $rootScope.action = '';
        $rootScope.data_socket = {};
        $rootScope.data_updated = {};
        $scope.status_view = '';
        $scope.pk = undefined;

        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        $rootScope.users_orders = [];
        $rootScope.user_key = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;

        $scope.addSlide = function () {
            var newWidth = 600 + slides.length + 1;
            slides.push({
                image: '//unsplash.it/' + newWidth + '/300',
                text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
                id: currIndex++
            });
        };

        $scope.randomize = function () {
            var indexes = generateIndexesArray();
            assignNewIndexesToSlides(indexes);
        };

        for (var i = 0; i < 4; i++) {
            $scope.addSlide();
        }

        // Randomize logic below

        function assignNewIndexesToSlides(indexes) {
            for (var i = 0, l = slides.length; i < l; i++) {
                slides[i].id = indexes.pop();
            }
        }

        function generateIndexesArray() {
            var indexes = [];
            for (var i = 0; i < currIndex; ++i) {
                indexes[i] = i;
            }
            return shuffle(indexes);
        }

        // http://stackoverflow.com/questions/962802#962890
        function shuffle(array) {
            var tmp, current, top = array.length;

            if (top) {
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }

            return array;
        }

        // ================= socket ==============

        function WebSocketTest() {
            if ("WebSocket" in window) {
                // alert("WebSocket is supported by your Browser!");
                console.log('WebSocket is supported by your Browser!')

                // var us open a web socket
                var ws = new WebSocket("ws://hiefficiencybar.com:80/");
                //var ws = new WebSocket("ws://localhost:8000/");		
                ws.onopen = function () {
                    // Web Socket is connected, send data using send()
                    var data = {
                        stream: "orders",
                        payload: {
                            action: "subscribe",
                            data: {
                                action: "create"
                            },
                        }
                    }
                    var mgs = JSON.stringify(data)
                    ws.send(mgs);
                    //alert("Message is sent...");
                    data = {
                        stream: "orders",
                        payload: {
                            action: "subscribe",
                            data: {
                                action: "update"
                            },
                        }
                    }
                    mgs = JSON.stringify(data);
                    ws.send(mgs);


                };

                ws.onmessage = function (evt) {
                    var received_msg = JSON.parse(evt.data);
                    $rootScope.action = received_msg.payload.action;
                    $rootScope.data_socket = received_msg.payload.data;
                    $scope.pk = $rootScope.data_socket.id;

                    if($rootScope.action === 'create'){
                        if($rootScope.data_socket.user){
                            var _user = $rootScope.data_socket.user;
                            _user.key = $scope.pk;
                            $rootScope.users_orders.push(_user);
                            $rootScope.user_key ++;
                        }
                    } else{
                        $rootScope.products = $rootScope.data_socket.products;
                        $rootScope.user_updated = $rootScope.data_socket.user;

                        $rootScope.users_orders = $rootScope.users_orders.filter(function(el){
                            return el.key !== $scope.pk;
                        })
                    }
                    
                };

                ws.onclose = function () {
                    // websocket is closed.
                    // alert("Connection is closed...");
                    console.log('Connection is closed...')
                };

                window.onbeforeunload = function (event) {
                    socket.close();
                };
            }

            else {
                // The browser doesn't support WebSocket
                alert("WebSocket NOT supported by your Browser!");
            }
        }

        WebSocketTest();

        // ============ ingredient =========
        $scope.data_ingredients = [
            {
                ingredient : {
                    id : 1,
                    name : 'Bourbon Full Proof'
                },
                ratio : 3,
                unit : 'Part',
            },
            {
                ingredient : {
                    id : 2,
                    name : 'Port Finish Bourbon'
                },
                ratio : 2,
                unit : 'Part',
            },
            {
                ingredient : {
                    id : 1,
                    name : 'Port Finish Bourbon'
                },
                ratio : 1,
                unit : 'Part',
            },
            // {
            //     ingredient : {
            //         id : 4,
            //         name : 'Small Batch Bourbon'
            //     },
            //     ratio : 30,
            //     unit : 'mL'
            // },
        ];
        $scope.total_part = 6;
        $scope.total_ml = 0;
        $scope._height = 0;
        $scope._width = 60;
        $scope.level = 2;
        $scope._top = 0;
        $scope._ratio = 0;
        $scope._k = $scope.total_part;

        for (var index = 0; index < $scope.data_ingredients.length; index++) {
            console.log($scope.data_ingredients[index])
            var _data = $scope.data_ingredients[index];

            var width = (100 -  $scope._width) / 2 * (_data.ratio / $scope._k) * 2 + $scope._width ;
            $scope._width = width;
            var _el = '<div class="color_' + $scope.level + ' animated zoomIn" style=" width: calc('+ width +'%); border-top: calc(293px * ' + (_data.ratio / $scope.total_part)
                + ') solid; bottom:'+ $scope._top +'%; border-left: calc(55px * ' + (_data.ratio / $scope.total_part)
                + ') solid transparent; border-right: calc(55px * ' + (_data.ratio / $scope.total_part)
                + ') solid transparent;" ></div>';
            $('#_ingredient').append(_el);

            $scope.level ++;
            // $scope._width = (40 * ($scope.total_part - $scope._ratio - _data.ratio) / $scope.total_part + 60);
            $scope._top = $scope._top + (100 * _data.ratio / $scope.total_part);
            $scope._ratio = _data.ratio + $scope._ratio;
            $scope._k = _data.ratio;
        }
    }

})();