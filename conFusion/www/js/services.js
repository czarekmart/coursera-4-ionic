'use strict';

angular.module('conFusion.services', ['ngResource'])
  .constant("baseURL","http://localhost:3000/")

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
  .factory('favoriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    var favFac = {};
    var favorites = [];

    favFac.addToFavorites = function (index) {

      if(favorites.some(function(fav){return fav.id == index;})) {
        console.log("Id " + index + " is alread a favorite");
        return;
      }

      console.log("Added " + index + " to dish favorites.");
      favorites.push({id: index});
    };

    favFac.deleteFromFavorites = function (index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id == index) {
          favorites.splice(i, 1);
        }
      }
    }

    favFac.getFavorites = function () {
      return favorites;
    };

    return favFac;
  }])

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
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    }
  }])

;
