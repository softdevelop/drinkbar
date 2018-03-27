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
						title: "Create",
						level: 1,
						name: 'create-user'
					},
					{
						stateRef: "list-user",
						title: "List",
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
						title: "Categories",
						level: 1,
						name: 'drink-categories',
						subMenu : [
							{
								stateRef: "create-categories",
								title: "Create",
								level: 2,
								name: 'create-categories'
							},
							{
								stateRef: "list-categories",
								title: "List",
								name: 'list-categories',
								level: 2
							}
						]
					},
					{
						stateRef: "drink",
						title: "Drinks",
						name: 'drink',
						level: 1,
						subMenu : [
							{
								stateRef: "create-drink",
								title: "Create",
								level: 2,
								name: 'create-drink'
							},
							{
								stateRef: "list-drink",
								title: "List",
								name: 'list-drink',
								level: 2
							}
						]
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
					
					
				]
			},
			{
				icon: "ion-waterdrop",
				name: "manager-ingredient",
				level: 0,
				title: "Manager Ingredient",
				subMenu : [
					{
						stateRef: "ingredient-types",
						title: "Types",
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
						title: "Brand",
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
					},
					{
						stateRef: "ingredient-history",
						title: "History",
						name: 'ingredient-history',
						level: 1,
						subMenu : [
							{
								stateRef: "create-history",
								title: "Create",
								level: 2,
								name: 'create-history'
							},
							{
								stateRef: "list-history",
								title: "List",
								name: 'list-history',
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