/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-user', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		$stateProvider.state('create-user', {
			url: '/manager-user/create-user',
			title: 'Create User',
			templateUrl: 'app/pages/manager-user/user-create/user-create.html',
			controller: 'UserCreateCtrl',
		});
	}

})();
