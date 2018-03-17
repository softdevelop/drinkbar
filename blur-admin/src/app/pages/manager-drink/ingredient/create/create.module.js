/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-ingredient', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-ingredient', {
			url: '/manager-drink/ingredient/create',
			title: 'Ingredient / Create',
			templateUrl: 'app/pages/manager-drink/ingredient/create/create.html',
			controller: 'IngredientCreateCtrl',
		});
	}

})();
