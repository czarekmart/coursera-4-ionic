'use strict';

angular.module('conFusion.services', ['ngResource'])
 // .constant("baseURL","http://localhost:3000/")
  .constant("baseURL","http://10.0.1.8:3000/")

  //***********************************************************************************
  // menuFactory
  //***********************************************************************************
  .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource(baseURL + "dishes/:id", null, {
      'update': {
        method: 'PUT'
      }
    });
  }])

  //***********************************************************************************
  // promotionFactory
  //***********************************************************************************
  .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource(baseURL + "promotions/:id");
  }])

  //***********************************************************************************
  // corporateFactory
  //***********************************************************************************
  .factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL) {

    var corpfac = {};
    corpfac.getLeaders = function(){
      return $resource ( baseURL+"leadership/:id", null, {} );
    };
    return corpfac;
  }])

  //***********************************************************************************
  // feedbackFactory
  //***********************************************************************************
  .factory('feedbackFactory', ['$resource', 'baseURL', function($resource, baseURL) {

    var feedfac = {};
    feedfac.getFeedback = function(){
      return $resource ( baseURL+"feedback/:id", null, {} );
    };
    return feedfac;
  }])

  //***********************************************************************************
  // favoriteFactory
  //***********************************************************************************
  .factory('favoriteFactory', ['$localStorage', function ($localStorage) {

    var favFac = {};
    var favorites = $localStorage.getObject("favorites", []);

    favFac.addToFavorites = function (index) {

      if(favorites.some(function(fav){return fav.id == index;})) {
        console.log("Id " + index + " is alread a favorite");
        return;
      }

      favorites.push({id: index});
      $localStorage.storeObject("favorites", favorites);
    };

    favFac.deleteFromFavorites = function (index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id == index) {
          favorites.splice(i, 1);
        }
      }
      $localStorage.storeObject("favorites", favorites);
    }

    favFac.getFavorites = function () {
      return favorites;
    };

    return favFac;
  }])

  //***********************************************************************************
  // $localStorage
  //***********************************************************************************
  .factory('$localStorage', ['$window', function($window) {
    return {
      store: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      storeObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key,defaultValue) {
        var value = $window.localStorage[key];
        if ( value ) {
          return JSON.parse(value);
        }
        else {
          return defaultValue;
        }
      }
    }
  }])

;
