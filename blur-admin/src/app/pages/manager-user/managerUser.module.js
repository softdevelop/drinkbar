/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.list-user', [])
        .config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider
          .state('list-user', {
            url: '/list-user',
            title: 'List User',
            templateUrl: 'app/pages/manager-user/list-user.html',
            controller: 'ManagerUserCtrl',
          });
    }
  
  })();
  