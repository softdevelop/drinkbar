/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.list-user')
        .controller('UserOrderCtrl', UserOrderCtrl);

    /** @ngInject */
    function UserOrderCtrl(items, $stateParams, $window, fileReader, $filter, $uibModal, ProfileService, baProgressModal, $scope, toastr, $rootScope, ManagerUserService) {
        console.log('UserOrderCtrl')
        console.log(items)

        $scope.products = items.products;

    }

})();