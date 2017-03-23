var app = angular.module("PhotoGallery", []); 
app.controller("HomeCtrl", function($scope) {
	
	var CLIENT_ID = 'sbr5of2sbx8zzvg';//app key
    var dbx = new Dropbox({ clientId: CLIENT_ID });
    var authUrl = dbx.getAuthenticationUrl('https://somepgtest.github.io/gallery.html');
	
	$scope.goToDropbox = function () {
			
			window.open(authUrl,"_self");

        };
	
});