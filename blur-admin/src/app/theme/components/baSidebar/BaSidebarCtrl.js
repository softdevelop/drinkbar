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
				name: "list-user",
				level: 0,
				stateRef: "list-user",
				title: "User Manager"
			},
			{
				icon: "ion-beer",
				name: "drink",
				level: 0,
				title: "Drink Manager",
				subMenu: [
					{
						stateRef: "list-categories",
						title: "Categories",
						level: 1,
						name: 'list-categories',
					},
					{
						stateRef: "list-drink",
						title: "Drinks",
						name: 'list-drink',
						level: 1,
					},
					{
						stateRef: "list-separate-glass",
						title: "Separate Glass",
						name: 'list-separate-glass',
						level: 1,
					},
					{
						stateRef: "list-garnish",
						title: "Garnish",
						name: 'list-garnish',
						level: 1,
					},
					
					
				]
			},
			{
				icon: "ion-waterdrop",
				name: "manager-ingredient",
				level: 0,
				title: "Ingredient Manager",
				subMenu : [
					{
						stateRef: "list-ingredient-types",
						title: "Types",
						name: 'list-ingredient-types',
						level: 1,
					},
					{
						stateRef: "list-ingredient-brand",
						title: "Brand",
						name: 'list-ingredient-brand',
						level: 1,
					},
					{
						stateRef: "list-ingredient",
						title: "Ingredient",
						name: 'list-ingredient',
						level: 1,
					},
				]
			},
			{
				icon: "ion-clipboard",
				name: "list-order",
				stateRef: "list-order",
				level: 0,
				title: "Order"
			},
			{
				icon: "ion-social-reddit-outline",
				name: "list-robot",
				stateRef: "list-robot",
				title: "Robot",
				level: 0,
				// subMenu: [
				// 	{
				// 		stateRef: "ingredient-history",
				// 		title: "History",
				// 		name: 'ingredient-history',
				// 		level: 1,
				// 		subMenu : [
				// 			{
				// 				stateRef: "create-history",
				// 				title: "Create",
				// 				level: 2,
				// 				name: 'create-history'
				// 			},
				// 			{
				// 				stateRef: "list-history",
				// 				title: "List",
				// 				name: 'list-history',
				// 				level: 2
				// 			}
				// 		]
				// 	}
				// ],
			},
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