/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-history', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-history', {
			url: '/manager-ingredient/history/create',
			title: 'History / Create',
			templateUrl: 'app/pages/manager-ingredient/history/create/create.html',
			controller: 'HistoriesCreateCtrl',
		});
	}

})();
