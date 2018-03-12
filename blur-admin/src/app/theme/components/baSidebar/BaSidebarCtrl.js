/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.theme.components')
		.controller('BaSidebarCtrl', BaSidebarCtrl);

	/** @ngInject */
	function BaSidebarCtrl($scope, baSidebarService) {

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
				subMenu: [
					{
						stateRef: "list-user",
						title: "List User"
					}
				],
				title: "Manager User"
			}
		];

		console.log($scope.menuItems)
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