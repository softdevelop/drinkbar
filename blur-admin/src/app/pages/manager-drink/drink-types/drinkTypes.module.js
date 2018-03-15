/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.drink-types', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('drink-types', {
			url: '/manager-drink/drink-types',
			title: 'Drink Types',
			templateUrl: 'app/pages/manager-drink/drink-types/drink-types.html',
			controller: 'DrinkTypesCtrl',
		});
		
	}

})();
