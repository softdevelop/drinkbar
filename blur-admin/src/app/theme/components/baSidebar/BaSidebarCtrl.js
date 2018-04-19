/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
 (function () {
 	'use strict';

 	angular.module('BlurAdmin.theme.components')
 	.controller('BaSidebarCtrl', BaSidebarCtrl);

 	/** @ngInject */
 	function BaSidebarCtrl($scope, baSidebarService, BarLeftService, $rootScope, toastr, SettingsService) {

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
			icon: "ion-monitor",
			level: 0,
			name: "tivishow",
			order: 0,
			stateRef: "tivi-showing",
			title: "TV Showing"
		},
		{
			icon: "ion-arrow-graph-up-right",
			level: 0,
			name: "list-fifo",
			order: 0,
			stateRef: "list-fifo",
			title: "FIFO"
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
				title: "Glassware",
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
			title: "Orders"
		},
		{
			icon: "ion-social-reddit-outline",
			name: "list-robot",
			stateRef: "list-robot",
			title: "Robot",
			level: 0,
		},
		{
			icon: "ion-podium",
			name: "stats",
			stateRef: "stats",
			title: "Stats",
			level: 0,
		},
		{
			icon: "ion-ios-world-outline",
			name: "hmi",
			stateRef: "hmi",
			title: "HMI",
			level: 0,
		},
		{
			icon: "ion-ios-gear",
			name: "settings",
			stateRef: "settings",
			title: "Settings",
			level: 0,
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

		// ========= function get data settings ===========
		function getElement() {
			SettingsService.getElement(1, $rootScope.userLogin.token).success(function (res) {
                // res.status = String(res.status);
                // res.status = res.status === 0 ? true : false;
                res.fee_unit = String(res.fee_unit);
                $rootScope.detail_settings = res;
                // $rootScope.robotId = res.id;
            }).error(function (err, status, res) {
            	toastr.error(err.detail);
            })
        }

        getElement();

        var _index = 0;
        $rootScope.changeBarStatus = function(stt){
        	_index ++;
        	if(_index == 2){
        		SettingsService.updated($rootScope.detail_settings, $rootScope.userLogin.token).success(function(res){
        			toastr.success('Change Bar status success!');
        			_index = 0;
        		}).error(function(err, stt, res){
        			toastr.error(err.detail)
        		})
        	}
        }
    }
})();