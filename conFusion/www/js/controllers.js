angular.module('conFusion.controllers', [])

  //================================================================
  // AppCtrl
  //================================================================
  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
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
  })

  //================================================================
  // MenuController
  //================================================================
  .controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', function($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate) {

      $scope.baseURL = baseURL;
    //====================================================================
    // menu.html controllers
    //====================================================================

    $scope.showDetails = false;

    $scope.showMenu = false;
    $scope.message = "Loading ...";
    menuFactory.getDishes().query(
      function(response) {
        $scope.dishes = response;
        $scope.showMenu = true;
      },
      function(response) {
        $scope.message = formatError(response);
      });

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
  .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicLoading', '$ionicModal', '$timeout',
    function($scope, $stateParams, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicLoading, $ionicModal, $timeout) {

      $scope.baseURL = baseURL;
      $scope.showDish = false;
      $scope.message="Loading ...";

      menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
        .$promise.then(
        function(response){
          $scope.dish = response;
          $scope.showDish = true;
        },
        function(response) {
          $scope.message = formatError(response);
        }
      );

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
        menuFactory.getDishes().update({id:$scope.dish.id}, $scope.dish);

        $scope.closeDishComment();
        $scope.comment = resetComment();
      };

  }])

  //================================================================
  // IndexController
  //================================================================
  .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function($scope, menuFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;

    $scope.showDish = false;
    $scope.message="Loading ...";
    menuFactory.getDishes().get({id:0})
      .$promise.then(
      function(response){
        $scope.dish = response;
        $scope.showDish = true;
      },
      function(response) {
        $scope.message = formatError(response);
      }
    );

    $scope.showPromotion = false;
    $scope.promotionMessage="Loading ...";
    menuFactory.getPromotions().get({id:0})
      .$promise.then(
      function(response){
        $scope.promotion = response;
        $scope.showPromotion = true;
      },
      function(response) {
        $scope.promotionMessage = formatError(response, 'Cannot read promotion information from the server.');
      }
    );

    $scope.showLeader = false;
    $scope.leaderMessage="Loading ...";
    corporateFactory.getLeaders().get({id:3})
      .$promise.then(
      function(response){
        $scope.leader = response;
        $scope.showLeader = true;
      },
      function(response) {
        $scope.leaderMessage = formatError(response, 'Cannot read leadership information from the server.');
      }
    );
  }])

  //================================================================
  // AboutController
  //================================================================
  .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function($scope, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.showLeaders = false;
    $scope.message="Loading ...";
    corporateFactory.getLeaders().query(
      function(response) {
        $scope.leaders = response;
        $scope.showLeaders = true;
      },
      function(response) {
        $scope.message = formatError(response, 'Cannot read leadership information from the server.');
      });

  }])

  //================================================================
  // FavoritesController
  //================================================================
  .controller('FavoritesController', [
    '$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout',
    function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

      $scope.baseURL = baseURL;
      $scope.shouldShowDelete = false;

      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Loading...'
      });

      $scope.favorites = favoriteFactory.getFavorites();

      $scope.dishes = menuFactory.getDishes().query(
        function (response) {
          $scope.dishes = response;
          $timeout(function () {
            $ionicLoading.hide();
          }, 1000);
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
          $timeout(function () {
            $ionicLoading.hide();
          }, 1000);
        });
      console.log($scope.dishes, $scope.favorites);

      $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
      };

      $scope.deleteFavorite = function (index) {

        favoriteFactory.deleteFromFavorites(index);
        $scope.shouldShowDelete = false;

      };

      $scope.deleteFavorite = function (index) {

        $ionicPopup.confirm({
          title: 'Confirm Delete',
          template: 'Are you sure you want to delete this item?'
        }).then(function (res) {
          if (res) {
            console.log('Ok to delete');
            favoriteFactory.deleteFromFavorites(index);
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

