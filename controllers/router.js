var app = angular.module("PhotoGallery", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/gallery", {
        templateUrl : "gallery.html"
    })
    .otherwise({
        templateUrl: "index.html"
    });	
});