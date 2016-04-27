'use strict';

angular.module('conFusion.services', ['ngResource'])
  .constant("baseURL","http://localhost:3000/")

  .service('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {

    this.getPromotions = function(){
      return $resource ( baseURL+"promotions/:id", null, {} );
    };

    this.getDishes = function(){
      return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});

    };

    // implement a function named getPromotion
    // that returns a selected promotion.
    this.getPromotion = function() {
      return   $resource(baseURL+"promotions/:id");;
    }
  }])

  .factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL) {

    var corpfac = {};
    corpfac.getLeaders = function(){
      return $resource ( baseURL+"leadership/:id", null, {} );
    };
    return corpfac;
  }])

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

;
