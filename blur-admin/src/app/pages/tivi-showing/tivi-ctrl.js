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
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
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

                // Let us open a web socket
                var ws = new WebSocket("ws://hiefficiencybar.com:80/");
                //var ws = new WebSocket("ws://localhost:8000/");		
                ws.onopen = function () {
                    // Web Socket is connected, send data using send()
                    let data = {
                        stream: "orders",
                        payload: {
                            action: "subscribe",
                            data: {
                                action: "create"
                            },
                        }
                    }
                    let mgs = JSON.stringify(data)
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
                    var received_msg = evt.data;
                    // alert("Message is received..." + received_msg);
                    console.log(received_msg)
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
    }

})();