(function() {
    'use strict';
    angular.module('BlurAdmin')
        .controller('AppCtrl', AppCtrl);

    function AppCtrl($scope, $state, $timeout, $window, $location) {
        $scope.appState = $state;
        $scope.$watch('appState.current', function(value) {
            var user = $window.localStorage.getItem('currentUser');
            user = JSON.parse(user);
            if (user && user.token) {
                //logined
                if (value.url.indexOf('login') !== -1) {
                    $location.path('/');
                }
            } else {
                if (value.url.indexOf('login') === -1) {
                    $location.path('/login');
                }
            }
        }, true);
    }
})();