/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages.create-ingredient-brand', [])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider, $urlRouterProvider) {
		
		$stateProvider.state('create-ingredient-brand', {
			url: '/manager-drink/ingredient-brand/create',
			title: 'Ingredient Brand / Create',
			templateUrl: 'app/pages/manager-drink/ingredient-brand/create/create.html',
			controller: 'IngredientBrandCreateCtrl',
		});
	}

})();
