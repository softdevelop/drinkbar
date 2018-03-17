/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages', [
		'ui.router',

		'BlurAdmin.pages.dashboard',
		'BlurAdmin.pages.ui',
		'BlurAdmin.pages.components',
		'BlurAdmin.pages.form',
		'BlurAdmin.pages.tables',
		'BlurAdmin.pages.charts',
		'BlurAdmin.pages.maps',
		'BlurAdmin.pages.profile',
		'BlurAdmin.pages.list-user',
		'BlurAdmin.pages.create-user',
		// 'BlurAdmin.pages.drink-types',
		'BlurAdmin.pages.create-separate-glass',
		'BlurAdmin.pages.list-separate-glass',
		'BlurAdmin.pages.detail-separate-glass',
		'BlurAdmin.pages.list-ingredient-types',
		'BlurAdmin.pages.create-ingredient-types',
		'BlurAdmin.pages.detail-ingredient-types',
		'BlurAdmin.pages.list-ingredient-brand',
		'BlurAdmin.pages.create-ingredient-brand',
		'BlurAdmin.pages.detail-ingredient-brand',
		'BlurAdmin.pages.list-garnish',
		'BlurAdmin.pages.create-garnish',
		'BlurAdmin.pages.detail-garnish',
		'BlurAdmin.pages.list-drink-types',
		'BlurAdmin.pages.create-drink-types',
		'BlurAdmin.pages.detail-drink-types',
	])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
		$urlRouterProvider.otherwise('/dashboard');

		baSidebarServiceProvider.addStaticItem({
			title: 'Pages',
			icon: 'ion-document',
			subMenu: [
				{
					title: 'Sign In',
					fixedHref: 'auth.html',
					blank: true
				}, {
					title: 'Sign Up',
					fixedHref: 'reg.html',
					blank: true
				},
				{
					title: 'User Profile',
					stateRef: 'profile'
				},
				{
					title: 'List User',
					stateRef: 'list-user'
				},
				{
					title: 'Create User',
					stateRef: 'create-user'
				},
				{
					title: 'Drink Types',
					stateRef: 'drink-types'
				},
				{
					title: 'Separate Glass Create',
					stateRef: 'create-separate-glass'
				},
				{
					title: 'Separate Glass List',
					stateRef: 'list-separate-glass'
				},
				{
					title: 'Separate Glass Detail',
					stateRef: 'detail-separate-glass/:id'
				},
				{
					title: 'Ingredient Types List',
					stateRef: 'list-ingredient-types'
				},
				{
					title: 'Ingredient Types Create',
					stateRef: 'create-ingredient-types'
				},
				{
					title: 'Ingredient Types Detail',
					stateRef: 'detail-ingredient-types/:id'
				},
				{
					title: 'Ingredient Brand List',
					stateRef: 'list-ingredient-brand'
				},
				{
					title: 'Ingredient Brand Create',
					stateRef: 'create-ingredient-brand'
				},
				{
					title: 'Ingredient Brand Detail',
					stateRef: 'detail-ingredient-brand/:id'
				},
				{
					title: 'Garnish List',
					stateRef: 'list-garnish'
				},
				{
					title: 'Garnish Create',
					stateRef: 'create-garnish'
				},
				{
					title: 'Garnish Detail',
					stateRef: 'detail-garnish/:id'
				},
				{
					title: 'Drink Types List',
					stateRef: 'list-drink-types'
				},
				{
					title: 'Drink Types Create',
					stateRef: 'create-drink-types'
				},
				{
					title: 'Drink Types Detail',
					stateRef: 'detail-drink-types/:id'
				},
				{
					title: '404 Page',
					fixedHref: '404.html',
					blank: true
				}
			]
		});
		baSidebarServiceProvider.addStaticItem({
			title: 'Menu Level 1',
			icon: 'ion-ios-more',
			subMenu: [{
				title: 'Menu Level 1.1',
				disabled: true
			}, {
				title: 'Menu Level 1.2',
				subMenu: [{
					title: 'Menu Level 1.2.1',
					disabled: true
				}]
			}]
		});
	}

})();
