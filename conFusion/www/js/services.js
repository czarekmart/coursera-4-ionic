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

;
