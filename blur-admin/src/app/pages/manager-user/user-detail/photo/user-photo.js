/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.list-user')
        .controller('UserPhotoCtrl', UserPhotoCtrl);

    /** @ngInject */
    function UserPhotoCtrl(items, $stateParams, $window, fileReader, $filter, $uibModal, ProfileService, baProgressModal, $scope, toastr, $rootScope, ManagerUserService, $uibModalInstance) {
        // $scope.products = items.products;
        // $scope.data_order = items;

        // console.log(items)

        // $scope.openDrinkDetail = function(id){
        //     var url_redirect = '#/manager-drink/drink/detail/' + id ;
        //     $uibModalInstance.close();
        //     $window.location.href = url_redirect;
        // }

        $scope.photo = items.photo;

    }

})();