var app = angular.module("RouterApp", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider.when("/", {
    templateUrl: "templates/top.html"
  })
  $routeProvider.when("/search", {
    templateUrl: "templates/search.html"
  })
});

app.controller("TopCtrl", function($scope, $http) {
  // THE OLD WAY
  // $.ajax({
  //   method: "GET",
  //   url: "...some url",
  //   success: handleResponse
  // })
  // THE NEW WAY
  $scope.articles = [];
  $http({
    method: "GET",
    url: "https://api.nytimes.com/svc/topstories/v2/opinion.json" +
     "?api-key=6c1830c231564612bbf5484ce7933e27"
  }).then(function(response) {
    $scope.articles = response.data.results;
    console.log(response.data.results);
  });
});

app.controller("SearchCtrl", function($scope) {
  $scope.searchTerm = "";
  $scope.search = function() {
    console.log("search clicked");
    // Code for search here.
  };
});