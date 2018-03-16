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
						level: 1
					},
					{
						stateRef: "drinks",
						title: "Drinks",
						name: 'drinks',
						level: 1
					},
					{
						stateRef: "garnishs",
						title: "Garnishs",
						name: 'garnishs',
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
					}
				]
			}
		];

		// get data drink categories 
		var staticMenuItems = [];

		// function getDataDrinkCategories() {
		// 	BarLeftService.getDrinkCategories($rootScope.userLogin.token).success(function (res) {
		// 		var _drink_categories = res;
		// 		var _bar = [];

		// 		var _menu = _drink_categories.filter(function (item) {
		// 			return item.level == 0;
		// 		});

		// 		var _menu_1 = _drink_categories.filter(function (item) {
		// 			return item.level == 1;
		// 		});

		// 		_menu.forEach(function (item) {
		// 			var children = _drink_categories.filter(function (child) {
		// 				return child.level == 1 && child.link.indexOf(item.link) === 0;
		// 			});
		// 			item.subMenu = children.length ? children : null;
		// 		});

		// 		_menu_1.forEach(function (item) {
		// 			var children = _drink_categories.filter(function (child) {
		// 				return child.level == 2 && child.link.indexOf(item.link) === 0;
		// 			});
		// 			item.subMenu = children.length ? children : null;
		// 		});

		// 		$scope.menuItems = $scope.menuItems.concat(_menu);
		// 		console.log($scope.menuItems)

		// 	}).error(function (err, status, response) {
		// 		console.log(response);
		// 		toastr.error('', 'Error!');
		// 	});
		// }

		// getDataDrinkCategories();


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