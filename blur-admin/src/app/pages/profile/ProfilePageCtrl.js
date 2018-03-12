/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
 (function () {
     'use strict';

     angular.module('BlurAdmin.pages.profile')
     .controller('ProfilePageCtrl', ProfilePageCtrl);

     /** @ngInject */
     function ProfilePageCtrl($window, $scope, fileReader, $filter, $uibModal, ProfileService) {
      $scope.picture = $filter('profilePicture')('Nasta');


      $scope.data_profile = {};
      $scope.isChangePassword = false;
      $scope.isConfirmPassword = true;
      $scope.errorMsg = '';
      $scope.isChangeAvatar = false;

      getUser();

      function getUser() {
       ProfileService.getUser($scope.currentUser).success(function (res) {
        $scope.data_profile = res;
        $scope.birthday = new Date(res.birthday);
        $scope.last_login = new Date(res.last_login);
        $scope.date_joined = new Date(res.date_joined);
    })
   }

		//===========  updateProfile ================================
		$scope.updateProfile = function(field, value){
			$scope.data_profile[field] = value;
		}

		$scope.changeBirthday = function(value){
			$scope.birthday = value;
			$scope.data_profile.birthday = value;
		}

		$scope.confirmPassword = function(password, res_password){
			if(res_password !== password){
				$scope.isConfirmPassword = false;
				$scope.old_password = $scope.new_password = $scope.res_password = '';
				$scope.errorMsg = 'Error password!';
			}
		}

		// submit Profile
		$scope.submitProfile = function(){
			$scope.data_profile.token = $scope.currentUser.token;
            // if(isChangeAvatar){
            //     $scope.data_profile.avatar = $scope.
            // }
            console.log($scope.data_profile)
			ProfileService.submitProfile($scope.data_profile).success(function(res){
				$scope.data_profile = res;
				$scope.birthday = new Date(res.birthday);
				$scope.last_login = new Date(res.last_login);
				$scope.date_joined = new Date(res.date_joined);
                $window.localStorage['currentUser'] = JSON.stringify(res);
            })
		}

		// ========================= datepicker=========================
		$scope.today = function () {
			$scope.birthday = new Date();
		};
		$scope.today();

		$scope.clear = function () {
			$scope.birthday = null;
		};

		$scope.inlineOptions = {
			customClass: getDayClass,
			minDate: new Date(),
			showWeeks: true
		};

		$scope.dateOptions = {
			dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(2020, 5, 22),
			minDate: new Date(),
			startingDay: 1
		};

		// Disable weekend selection
		function disabled(data) {
			var date = data.date,
            mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function () {
           $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
           $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
       };

       $scope.toggleMin();

       $scope.openDatePicker = function (name) {
           name === 'birthday' ? $scope.popupDatePicker.openBirthday = true : (name === 'lastLogin' ? $scope.popupDatePicker.openLastLogin = true
            : $scope.popupDatePicker.openDateJoined = true);
			// $scope.popupDatePicker.opened = true;
		};


		$scope.setDate = function (year, month, day) {
			$scope.birthday = new Date(year, month, day);
		};

		$scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		$scope.altInputFormats = ['M!/d!/yyyy'];

		$scope.popupDatePicker = {
			openBirthday: false,
			openLastLogin: false,
			openDateJoined: false
		};


		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		var afterTomorrow = new Date();
		afterTomorrow.setDate(tomorrow.getDate() + 1);
		$scope.events = [
       {
        date: tomorrow,
        status: 'full'
    },
    {
        date: afterTomorrow,
        status: 'partially'
    }
    ];

    function getDayClass(data) {
       var date = data.date,
       mode = data.mode;
       if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < $scope.events.length; i++) {
         var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

         if (dayToCheck === currentDay) {
          return $scope.events[i].status;
      }
  }
}

return '';
}
		// ==========================================================================





		$scope.removePicture = function () {
			$scope.picture = $filter('appImage')('theme/no-photo.png');
			$scope.noPicture = true;
		};

		$scope.uploadPicture = function () {
            console.log('==========> uploadPicture')
            var fileInput = document.getElementById('uploadFile');
            console.log(fileInput)
            fileInput.click();

        };

        $scope.socialProfiles = [
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/akveo/',
            icon: 'socicon-facebook'
        },
        {
            name: 'Twitter',
            href: 'https://twitter.com/akveo_inc',
            icon: 'socicon-twitter'
        },
        {
            name: 'Google',
            icon: 'socicon-google'
        },
        {
            name: 'LinkedIn',
            href: 'https://www.linkedin.com/company/akveo',
            icon: 'socicon-linkedin'
        },
        {
            name: 'GitHub',
            href: 'https://github.com/akveo',
            icon: 'socicon-github'
        },
        {
            name: 'StackOverflow',
            icon: 'socicon-stackoverflow'
        },
        {
            name: 'Dribbble',
            icon: 'socicon-dribble'
        },
        {
            name: 'Behance',
            icon: 'socicon-behace'
        }
        ];

        $scope.unconnect = function (item) {
           item.href = undefined;
       };

       $scope.showModal = function (item) {
        $uibModal.open({
            animation: false,
            controller: 'ProfileModalCtrl',
            templateUrl: 'app/pages/profile/profileModal.html'
        }).result.then(function (link) {
            item.href = link;
        });
    };

    $scope.getFile = function () {
        console.log($scope.file)
        console.log($scope.data_profile.file)
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function (result) {
            $scope.data_profile.picture = result;
        });
    };

    $scope.file = '';
    $scope.onFileSelect = function($file){
        console.log('=======> onFileSelect')
        console.log($file)
    }

    $scope.changeAvatar = function(){
        console.log('====> changeAvatar')
        console.log($scope.file)
    }

    $scope.switches = [true, true, false, true, true, false];

    $scope.stepsModel = [];

    $scope.imageUpload = function(event){
        var files = event.target.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded; 
            reader.readAsDataURL(file);
        }
    }

    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
            console.log(e)
            $scope.stepsModel.push(e.target.result);
            $scope.data_profile.avatar = e.target.result;
            $scope.isChangeAvatar = true;
        });
    }
}

})();
