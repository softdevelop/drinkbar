/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.list-ingredient', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('list-ingredient', {
			url: '/manager-drink/ingredient/list',
			title: 'Ingredient / List',
			templateUrl: 'app/pages/manager-drink/ingredient/list/list.html',
			controller: 'IngredientListCtrl',
		});
		
	}

})();
