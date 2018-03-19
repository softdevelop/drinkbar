/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.theme.components')
		.controller('BaSidebarCtrl', BaSidebarCtrl);

	/** @ngInject */
	function BaSidebarCtrl($scope, baSidebarService, BarLeftService, $rootScope, toastr) {

		// $scope.menuItems = baSidebarService.getMenuItems();
		$scope.menuItems = [
			{
				icon: "ion-android-home",
				level: 0,
				name: "dashboard",
				order: 0,
				stateRef: "dashboard",
				subMenu: null,
				title: "Dashboard"
			},
			{
				icon: "ion-person-stalker",
				name: "manager",
				level: 0,
				subMenu: [
					{
						stateRef: "create-user",
						title: "Create User",
						level: 1,
						name: 'create-user'
					},
					{
						stateRef: "list-user",
						title: "List User",
						name: 'list-user',
						level: 1
					}
				],
				title: "Manager User"
			},
			{
				icon: "ion-beer",
				name: "drink",
				level: 0,
				title: "Manager Drink",
				subMenu: [
					{
						stateRef: "drink-categories",
						title: "Drink Catefories",
						level: 1,
						name: 'drink-categories'
					},
					{
						stateRef: "drink-types",
						title: "Drink Types",
						name: 'drink-types',
						level: 1,
						subMenu : [
							{
								stateRef: "create-drink-types",
								title: "Create",
								level: 2,
								name: 'create-drink-types'
							},
							{
								stateRef: "list-drink-types",
								title: "List",
								name: 'list-drink-types',
								level: 2
							}
						]
					},
					{
						stateRef: "drinks",
						title: "Drinks",
						name: 'drinks',
						level: 1
					},
					{
						stateRef: "separate-glass",
						title: "Separate Glass",
						name: 'separate-glass',
						level: 1,
						subMenu : [
							{
								stateRef: "create-separate-glass",
								title: "Create",
								level: 2,
								name: 'create-separate-glass'
							},
							{
								stateRef: "list-separate-glass",
								title: "List",
								name: 'list-separate-glass',
								level: 2
							}
						]
					},
					{
						stateRef: "garnish",
						title: "Garnish",
						name: 'garnish',
						level: 1,
						subMenu : [
							{
								stateRef: "create-garnish",
								title: "Create",
								level: 2,
								name: 'create-garnish'
							},
							{
								stateRef: "list-garnish",
								title: "List",
								name: 'list-garnish',
								level: 2
							}
						]
					},
					{
						stateRef: "ingredient-types",
						title: "Ingredient Types",
						name: 'ingredient-types',
						level: 1,
						subMenu : [
							{
								stateRef: "create-ingredient-types",
								title: "Create",
								level: 2,
								name: 'create-ingredient-types'
							},
							{
								stateRef: "list-ingredient-types",
								title: "List",
								name: 'list-ingredient-types',
								level: 2
							}
						]
					},
					{
						stateRef: "ingredient-brand",
						title: "Ingredient Brand",
						name: 'ingredient-brand',
						level: 1,
						subMenu : [
							{
								stateRef: "create-ingredient-brand",
								title: "Create",
								level: 2,
								name: 'create-ingredient-brand'
							},
							{
								stateRef: "list-ingredient-brand",
								title: "List",
								name: 'list-ingredient-brand',
								level: 2
							}
						]
					},
					{
						stateRef: "ingredient",
						title: "Ingredient",
						name: 'ingredient',
						level: 1,
						subMenu : [
							{
								stateRef: "create-ingredient",
								title: "Create",
								level: 2,
								name: 'create-ingredient'
							},
							{
								stateRef: "list-ingredient",
								title: "List",
								name: 'list-ingredient',
								level: 2
							}
						]
					}
					
				]
			}
		];

		$scope.defaultSidebarState = $scope.menuItems[0].stateRef;

		$scope.hoverItem = function ($event) {
			$scope.showHoverElem = true;
			$scope.hoverElemHeight = $event.currentTarget.clientHeight;
			var menuTopValue = 66;
			$scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
		};

		$scope.$on('$stateChangeSuccess', function () {
			if (baSidebarService.canSidebarBeHidden()) {
				baSidebarService.setMenuCollapsed(true);
			}
		});
	}
})();