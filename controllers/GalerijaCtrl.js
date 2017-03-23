var app = angular.module("PhotoGallery", []); 
app.controller("GalerijaCtrl", function($scope) {
	
	//nemoj slucajno da ostavljas alerte, umjesto toga stavi console.log()
	
    var paths = [];
        var tmpPic = 0;
        var numOfPic = 0;
		
		var dropboxToken = "qlcoiIliLZAAAAAAAAAAG1xwUQY5ZPycWJGSPb29yjCXRLb6-uGicDETKwL44WAc";
		
        $scope.downloadFilePaths = function () {

            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status === 200) {

                    obj = JSON.parse(xhr.response);
					paths = [];
					titles = [];
                    for (i = 0; i < obj.entries.length; i++) {
                        paths.push(obj.entries[i].path_lower);
						titles.push(obj.entries[i].path_lower.substring(1, obj.entries[i].path_lower.length));
                    }
                    numOfPic = obj.entries.length;
					//ako je broj slika 0 ili 1
					
					
                    if (numOfPic > 0)
					{
						$scope.downloadFiles();
						//prikazati listu slika, galeriju i naslov
						document.getElementById('photoView').style.display = 'block';
						document.getElementById('listPhoto').style.display = 'block';
						var tmp = "Gallery (" + numOfPic + " photo";
						tmp += (numOfPic > 1) ?  "s)" : ")";
						document.getElementById("galleryTitle").innerHTML = tmp;
					}                        
					else
					{
						//sakriti listu slika, galeriju i naslov
						document.getElementById('photoView').style.display = 'none';
						document.getElementById('listPhoto').style.display = 'none';
						document.getElementById("galleryTitle").innerHTML = "Your gallery is empty!";
					}

                    var myJsonString = JSON.parse(JSON.stringify(titles));
                    $scope.lista_titleova = myJsonString;
                    $scope.$apply();//da se renda :D
					
                }
                else {
                    var errorMessage = xhr.response || 'Unable to download file';
                    //alert(xhr.response);//TEST
                }
            };
            xhr.open('POST', 'https://api.dropboxapi.com/2/files/list_folder');
            xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
            xhr.setRequestHeader("Content-type", 'application/json');
            var data = '{ "path": "", "recursive": false, "include_media_info": false, "include_deleted": false, "include_has_explicit_shared_members": false }';
            xhr.send(data);			
        };
        $scope.downloadFilePaths();

        $scope.downloadFiles = function () {

            var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';

            xhr.onload = function () {
                if (xhr.status === 200) {

                    var blob = new Blob([xhr.response], { type: 'application/octet-stream' });
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL(blob);
                    document.getElementById("slikaId").src = imageUrl;
                    var naslov = paths[tmpPic].substring(1, paths[tmpPic].length);
                    document.getElementById("picTitle").innerHTML = naslov.charAt(0).toUpperCase() + naslov.slice(1);
					seekDisabled = false;
                }
                else {
                    var errorMessage = xhr.response || 'Unable to download file';
                    //alert(errorMessage); //Test
                    $scope.nextPic();
                }
            };

            xhr.open('POST', 'https://content.dropboxapi.com/2/files/download');
            xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
            xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
                path: paths[tmpPic]
            }));
            xhr.send();

        };
		var seekDisabled = false;
		//optimizovat
        $scope.nextPic = function () {
			
			if(seekDisabled == true || numOfPic < 2)
				return;
			
			tmpPic = (tmpPic >= numOfPic-1) ? 0 : tmpPic + 1;

            $scope.downloadFiles();
			document.getElementById("picTitle").innerHTML = "loading...";
			seekDisabled = true;
        };
		
        $scope.previousPic = function () {
			
			if(seekDisabled == true || numOfPic < 2)
				return;
			
			tmpPic = (tmpPic <= 0) ? numOfPic-1 : tmpPic - 1;

            $scope.downloadFiles();
			document.getElementById("picTitle").innerHTML = "loading...";
			seekDisabled = true;
        };

		
		
		////////////////////////////////////////////////////UPLOAD////////////////////////////////////////////
		
		
		
		
        var numberOfUploads = 0;
        var uploading = false;

        $scope.refresh = function () {
            if (uploading)
                return;
            document.getElementById("procenat").innerHTML = "";
            document.getElementById("slikeZaUpload").value = "";
            document.getElementById("uploadFile").value = "";
        };

        $scope.uploadImage = function () {
            if (uploading)
                return;
            var listOfFiles = document.getElementById("slikeZaUpload").files;
            var odabrano = "";
            for (i = 0; i < listOfFiles.length; i++) {
                odabrano = odabrano + listOfFiles[i].name + ",   ";
            }
            document.getElementById("uploadFile").value = odabrano.substring(0, odabrano.length - 4);
        };


        $scope.uploadFiles = function () {

            if (uploading)
                return;

            var pom = document.getElementById("slikeZaUpload").value;
            if (pom == null || pom == "") {
                document.getElementById("procenat").innerHTML = "No files selected!";
                return;
            }

            uploading = true;

            var listOfFiles = document.getElementById("slikeZaUpload").files;

            for (i = 0; i < listOfFiles.length; i++) {

                var file = listOfFiles[i];

                var xhr = new XMLHttpRequest();

                xhr.upload.onprogress = function (evt) {
                    var percentComplete = parseInt(100.0 * evt.loaded / evt.total);
                    var procenat = "" + percentComplete + "%";
                    document.getElementById("procenat").innerHTML = procenat;
                };

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var fileInfo = JSON.parse(xhr.response);

                        numberOfUploads++;

                        if (numberOfUploads == listOfFiles.length) {
                            document.getElementById("procenat").innerHTML = "Completed!";
                            document.getElementById("slikeZaUpload").value = "";
                            numberOfUploads = 0;
                            uploading = false;
                            document.getElementById("uploadFile").value = "";
							//$scope.downloadFilesPaths();
							$scope.downloadFilePaths();
                        }
                    }
                    else {
                        var errorMessage = xhr.response || 'Unable to upload file';

                        numberOfUploads++;

                        if (numberOfUploads == listOfFiles.length) {
                            document.getElementById("procenat").innerHTML = "Upload failed!";
                            document.getElementById("slikeZaUpload").value = "";
                            numberOfUploads = 0;
                            uploading = false;
                            document.getElementById("uploadFile").value = "";
                            //$scope.downloadFilesPaths();
							$scope.downloadFilePaths();
                        }
                    }
                };

                xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload');
                xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
                xhr.setRequestHeader('Content-Type', 'application/octet-stream');
                xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
                    path: '/' + file.name,
                    mode: 'add',
                    autorename: true,
                    mute: false
                }));
                xhr.send(file);
            }
        };

        $scope.deleteFun = function (title) {
			
			if(titles[tmpPic] == title)
				$scope.previousPic();
			
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status === 200) {

					$scope.downloadFilePaths();
					console.log("izbrisano i zatrazena nova lista");
					
                }
                else {
                    var errorMessage = xhr.response || 'Unable to download file';
                    //alert(xhr.response);//TEST
                }
            };
            xhr.open('POST', 'https://api.dropboxapi.com/2/files/delete');
            xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
            xhr.setRequestHeader("Content-type", 'application/json');
            var data = '{ "path": "/' + title + '" }';
            xhr.send(data);

        };
		
		$scope.account_info = function () {
			
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status === 200) {

					obj = JSON.parse(xhr.response);
					document.getElementById("userName").innerHTML = obj.display_name;
					document.getElementById("userProfile").href = obj.referral_link;
					
                }
                else {
                    var errorMessage = xhr.response || 'Unable to download file';
                    //alert(xhr.response);//TEST
                }
            };
            xhr.open('GET', 'https://api.dropboxapi.com/1/account/info');
            xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
            xhr.setRequestHeader("Content-type", 'application/json');
            xhr.send();

        };
		$scope.account_info();
});