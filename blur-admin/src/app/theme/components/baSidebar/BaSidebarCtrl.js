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
			// {
			// 	icon: "ion-gear-a",
			// 	level: 0,
			// 	name: "components",
			// 	order: 100,
			// 	stateRef: "components",
			// 	subMenu: [
			// 		{
			// 			icon: "ion-person-add",
			// 			level: 1,
			// 			name: "components.mail",
			// 			order: 0,
			// 			stateRef: "components.mail",
			// 			title: "Mail"
			// 		},
			// 		{
			// 			icon: "ion-ios-pulse",
			// 			level: 1,
			// 			name: "components.timeline",
			// 			order: 100,
			// 			stateRef: "components.timeline",
			// 			title: "Timeline"
			// 		},
			// 	],
			// 	title: "Components"
			// },
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
			}
		];

		// get data drink categories 
		var staticMenuItems = [];

		function getDataDrinkCategories() {
			BarLeftService.getDrinkCategories($rootScope.userLogin.token).success(function (res) {
				var _drink_categories = res;
				var _bar = [];

				var _menu = _drink_categories.filter(function (item) {
					return item.level == 0;
				});

				var _menu_1 = _drink_categories.filter(function (item) {
					return item.level == 1;
				});

				_menu.forEach(function (item) {
					var children = _drink_categories.filter(function (child) {
						return child.level == 1 && child.link.indexOf(item.link) === 0;
					});
					item.subMenu = children.length ? children : null;
				});

				_menu_1.forEach(function (item) {
					var children = _drink_categories.filter(function (child) {
						return child.level == 2 && child.link.indexOf(item.link) === 0;
					});
					item.subMenu = children.length ? children : null;
				});

				$scope.menuItems = $scope.menuItems.concat(_menu);
				console.log($scope.menuItems)

			}).error(function (err, status, response) {
				console.log(response);
				toastr.error('', 'Error!');
			});
		}

		getDataDrinkCategories();


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