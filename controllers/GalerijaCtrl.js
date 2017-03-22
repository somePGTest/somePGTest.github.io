var app = angular.module("PhotoGallery", []); 
app.controller("GalerijaCtrl", function($scope) {
    
	//ako je vec prije ulazio treba otvoriti app odma (procitati iz kesa ?)
    $scope.goToDropbox = function () {

            /*var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status === 200) {

                    alert("ok");
                }
                else {
                    
                    alert(xhr.response);
                }
            };
            xhr.open('GET', 'https://www.dropbox.com/1/oauth2/authorize');
            //xhr.setRequestHeader('Authorization', 'Bearer ' + '9xDxW8zeW8AAAAAAAAAAuUDfRaODVvcFgOS8A2S6FbpEiDcT412hPSm4yzsHzD6S');
            //xhr.setRequestHeader("Content-type", 'application/json');
            var data = '{ "response_type": "token", "client_id": "hardcode", "redirect_uri": "file:///C:/Users/Fifi/Desktop/appl/index.html#/" }';
            xhr.send(data);*/
			
			
			
			$.ajaxPrefilter( function (options) {
			  if (options.crossDomain && jQuery.support.cors) {
				var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
				options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
				//options.url = "http://cors.corsproxy.io/url=" + options.url;
			  }
			});

			$.get(
				'http://en.wikipedia.org/wiki/Cross-origin_resource_sharing',
				function (response) {
					console.log("> ", response);
					$("#viewer").html(response);
});
			
			
        };
	
});