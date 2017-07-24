(function () {
'use strict';

angular.module('MenuSearchApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('dishesList', DishesListDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function DishesListDirective() {
  var ddo = {
    restrict: 'E',
    templateUrl: 'dishesList.html',
    scope: {
      disheslist: '=masterlist',
      myTitle: '@title',
      badRemove: '=',
      onRemove: '&'
    },
    controller: DishesListDirectiveController,
    controllerAs: 'mastercntr',
    bindToController: true
  };
  return ddo;
}

function DishesListDirectiveController() {
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  menu.getMatchedMenuItems = function (searchString) {
    var promise = MenuSearchService.getMenuDishes();

    promise.then(function (response) {
      menu.alldishes = response.data.menu_items;

      var matching = [];
      if (searchString) {
        var searchstring = searchString.toLowerCase();
        console.log(searchstring)
        for (var i = 0; i < menu.alldishes.length; i++) {
          if (menu.alldishes[i].description.indexOf(searchstring) >= 0) {
            matching.push(menu.alldishes[i]);
          }
        }
        console.log("matching: '"+searchString+"' was "+matching.length+" dishes");
      }
      menu.found = matching;
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });
 };

 menu.removeItem = function (itemIndex) {
//   console.log("'this' is: ", this);
   console.log("Last item removed was " + this.found[itemIndex].name);
   menu.found.splice(itemIndex, 1);
 };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMenuDishes = function () {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
      params: {
      }
    });
    return response;
  };
}

})();
