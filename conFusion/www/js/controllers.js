angular.module('conFusion.controllers', [])

  //================================================================
  // AppCtrl
  //================================================================
  .controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    //-------------------------------------------------
    // LOGIN FORM
    //-------------------------------------------------
    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo',{});
    $scope.registration = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.loginModal = modal;
    });

    //$ionicModal.fromTemplateUrl('templates/error-modal.html', {
    //  scope: $scope
    //}).then(function(modal) {
    //  $scope.errorModal = modal;
    //});

    var showLoginError = function(errorMessage) {
      $ionicPopup.alert({
        subTitle: errorMessage,
        okText: 'Retry',
        okType: 'button-assertive'
      });
      //$scope.errorMessage = errorMessage;
      //$scope.errorModal.show();
    }

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.loginModal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.loginModal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {

      var loginData = $localStorage.getObject('userinfo');

      if ( !loginData || !loginData.username || !loginData.password ) {

        // First time login. Write to local storage
        $localStorage.storeObject('userinfo', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
          $scope.closeLogin();
        }, 1000);
      }
      else if ($scope.loginData.username != loginData.username ) {

        showLoginError('Invalid Username');
      }
      else if ( $scope.loginData.password != loginData.password) {
        showLoginError('Invalid Password');
      }
      else {
        $scope.closeLogin();
      }
    };


    //-------------------------------------------------
    // RESERVATION FORM
    //-------------------------------------------------
    $scope.reservation = {};
    $scope.reservation.numGuests = 2;

    // Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.reserveform = modal;
    });

    // Triggered in the reserve modal to close it
    $scope.closeReserve = function() {
      $scope.reserveform.hide();
    };

    // Open the reserve modal
    $scope.reserve = function() {
      $scope.reserveform.show();
    };

    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function() {
      console.log('Doing reservation', $scope.reservation);

      // Simulate a reservation delay. Remove this and replace with your reservation
      // code if using a server system
      $timeout(function() {
        $scope.closeReserve();
      }, 1000);
    };

    //-----------------------------------------------------
    // REGISTRATION
    //-----------------------------------------------------
    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
      $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
      $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
      // Simulate a registration delay. Remove this and replace with your registration
      // code if using a registration system
      $timeout(function () {
        $scope.closeRegister();
      }, 1000);
    };

    $ionicPlatform.ready(function() {
      //--- Camera ----------------------
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };
      $scope.takePicture = function() {
        $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
        }, function(err) {
          console.log("$scope.takePicture error:", err);
        });

        $scope.registerform.show();

      };

      //--- Image picker -------------------------
      var imgPickerOptions = {
        maximumImagesCount: 1,
        width: 100,
        height: 100,
        quality: 50
      };
      $scope.pickImage = function() {
        $cordovaImagePicker.getPictures(imgPickerOptions)
          .then(function (results) {
            if ( results.length > 0 ) {
              $scope.registration.imgSrc = results[0];
            }
          }, function(err) {
            console.log("$scope.pickImage error:", err);
          });
      };

    });

  })

  //================================================================
  // MenuController
  //================================================================
  .controller('MenuController',
  ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
    function($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

      $scope.baseURL = baseURL;
      //====================================================================
      // menu.html controllers
      //====================================================================

      $scope.showDetails = false;
      $scope.dishes = dishes;

      $scope.menus = [
        { filtText: "", name: "The Menu" },
        { filtText: "appetizer", name: "Appetizers" },
        { filtText: "mains", name: "Mains" },
        { filtText: "dessert", name: "Deserts" },
      ];

      $scope.select = function(menu) {
        $scope.selectedMenu = menu;
        $scope.filtText = menu.filtText;
      };

      $scope.isSelected = function (menu) {
        return ($scope.selectedMenu === menu);
      };

      $scope.select($scope.menus[0]);

      $scope.toggleDetails = function() {
        $scope.showDetails = !$scope.showDetails;
      };

      $scope.addFavorite = function (index) {
        favoriteFactory.addToFavorites(index);
        // we need it to close the button
        $ionicListDelegate.closeOptionButtons();

        // Notify the user
        $ionicPlatform.ready(function () {
          $cordovaLocalNotification.schedule({
            id: 1,
            title: "Added Favorite",
            text: $scope.dishes[index].name
          }).then(function () {
              console.log('Added Favorite '+$scope.dishes[index].name);
            },
            function () {
              console.log('Failed to add Notification ');
            });

          $cordovaToast
            .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        });

      }

    }])

  //================================================================
  // ContactController
  //================================================================
  .controller('ContactController', ['$scope', function($scope) {

    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
    var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
    $scope.channels = channels;
    $scope.invalidChannelSelection = false;
  }])

  //================================================================
  // FeedbackController
  //================================================================
  .controller('FeedbackController', ['$scope','feedbackFactory', function($scope, feedbackFactory) {

    $scope.sendFeedback = function() {
      if ($scope.feedback.agree && ($scope.feedback.mychannel == "")&& !$scope.feedback.mychannel) {
        $scope.invalidChannelSelection = true;
      }
      else {

        $scope.feedback.id = 0; // to force the id to be integer, rather than guid.

        var useMethod = 1;
        if ( useMethod == 1 ) {
          // Method 1.
          feedbackFactory.getFeedback().save($scope.feedback);
        }
        else {
          // Method 2.
          var feedbackResource = feedbackFactory.getFeedback();
          var newFeedback = new feedbackResource($scope.feedback);
          newFeedback.$save();
        }

        $scope.invalidChannelSelection = false;
        $scope.feedback = {mychannel:"", firstName:"", lastName:"",
          agree:false, email:"" };
        $scope.feedback.mychannel="";

        $scope.feedbackForm.$setPristine();
      }
    };
  }])

  //================================================================
  // DishDetailController
  //================================================================
  .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
    function($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

      $scope.baseURL = baseURL;
      $scope.dish = dish;

      //--------------------------------------------------------
      // Dish popover
      //--------------------------------------------------------
      $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });

      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
      // Execute action on hide popover
      $scope.$on('popover.hidden', function() {
        // Execute action
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function() {
        // Execute action
      });

      $scope.addFavorite = function () {
        console.log("Adding dish + " + $scope.dish.id + " to favorites.");
        favoriteFactory.addToFavorites($scope.dish.id);
        $scope.popover.hide();

        // Notify the user
        $ionicPlatform.ready(function () {
          $cordovaLocalNotification.schedule({
            id: $scope.dish.id,
            title: "Added Favorite",
            text: $scope.dish.name
          }).then(function () {
              console.log('Added Favorite '+$scope.dish.name);
            },
            function () {
              console.log('Failed to add Notification ');
            });

          $cordovaToast
            .show('Added Favorite '+$scope.dish.name, 'long', 'bottom')
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        });

      }

      //------------------------------------------------------------------
      // Dish comment form
      //------------------------------------------------------------------

      var resetComment = function() {
        return { rating: 5, author:"", comment:"" };
      }

      $scope.comment = resetComment();

      $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.dishCommentForm = modal;
      });

      // Triggered in the dishComment modal to close it
      $scope.closeDishComment = function() {
        $scope.dishCommentForm.hide();
      };

      // Open the dishComment modal
      $scope.addCommentForm = function() {
        $scope.popover.hide();
        $scope.dishCommentForm.show();
      };

      // Perform the action when the user submits the dishComment form
      $scope.submitDishComment = function() {

        $scope.comment.date = new Date().toISOString();
        $scope.dish.comments.push($scope.comment);
        menuFactory.update({id:$scope.dish.id}, $scope.dish);

        $scope.closeDishComment();
        $scope.comment = resetComment();
      };

  }])

  //================================================================
  // IndexController
  //================================================================
  .controller('IndexController', ['$scope', 'dish', 'promotion', 'leader', 'baseURL', function($scope, dish, promotion, leader, baseURL) {

    $scope.baseURL = baseURL;

    $scope.dish = dish;

    $scope.promotion = promotion;

    $scope.leader = leader;

  }])

  //================================================================
  // AboutController
  //================================================================
  .controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leaders = leaders;

  }])

  //================================================================
  // FavoritesController
  //================================================================
  .controller('FavoritesController', [
    '$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaVibration', '$ionicPlatform',
    function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $cordovaVibration, $ionicPlatform) {

      $scope.baseURL = baseURL;
      $scope.shouldShowDelete = false;

      $scope.favorites = favorites;

      $scope.dishes = dishes;

      $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
      };

      $scope.deleteFavorite = function (index) {

        $ionicPopup.confirm({
          title: 'Confirm Delete',
          template: 'Are you sure you want to delete this item?'
        }).then(function (res) {
          if (res) {
            favoriteFactory.deleteFromFavorites(index);
            $ionicPlatform.ready(function() {
              $cordovaVibration.vibrate(100);
            });
          } else {
            console.log('Canceled delete');
          }
        });

        $scope.shouldShowDelete = false;

      }

    }])


  //================================================================
  // favoriteFilter
  //================================================================
  .filter('favoriteFilter', function () {
    return function (dishes, favorites) {
      var out = dishes.filter(function(dish){
        return favorites.some(function(fav) {return fav.id == dish.id;});
      });
      return out;
    }})
;

