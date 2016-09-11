angular.module('starter.controllers', [])

/*
  Controller to manage the Dashboard. This would show all the active profiles
  that the user has. The user can add and delete the profiles from the dashboard
 */

 .controller('SearchCtrl', ['$rootScope', '$scope', '$ionicModal', '$ionicPopup',
               '$window', '$stateParams', '$state', 'dashFactory', '$ionicListDelegate',
               function($rootScope, $scope, $ionicModal, $ionicPopup, $window, $stateParams,
               $state, dashFactory, $ionicListDelegate) {
  }])

 .controller('ImageCtrl', ['$rootScope', '$scope', '$ionicModal', '$ionicPopup',
               '$window', '$stateParams', '$state', 'dashFactory', '$ionicListDelegate',
               function($rootScope, $scope, $ionicModal, $ionicPopup, $window, $stateParams,
               $state, dashFactory, $ionicListDelegate) {
  $scope.profileDB = dashFactory.getProfileInfo();

  console.log(JSON.stringify($scope.profileDB ))

  $scope.getImageLink = function(pic) {
    return dashFactory.getProfileImageLink(pic);
  }

  $scope.$on('$ionicView.enter', function() {
        console.log("Entering the view");
    });

  $scope.deleteProfileImage = function(photo) {
    console.log("Delete a profile image " + photo);
    $ionicListDelegate.closeOptionButtons();
    dashFactory.getProfileImageResource(photo).imageDelete()
    .$promise.then(
      function (res) {
        console.log("Deleted image correctly " + photo);
        //dashFactory.updateProfileDB();
        //$scope.profileDB = dashFactory.getProfileInfo();
        //$state.go($state.current, {}, {reload: true});
        dashFactory.delImageFromProfile(photo);
      },
      function (err) {
        console.log("Error deleting the image");
      }
    )
  }

  $scope.chooseProfileImage = function(profile) {
      console.log("I have clicked the pic");
      var picSel = document.createElement('input');
        picSel.setAttribute("type", "file");
        picSel.setAttribute("id", "picSelect");
        picSel.onchange = function() {
          console.log("Selected pic");
          var file = picSel.files[0];
          dashFactory.getProfileImageResource(file).imageUpload()
          .$promise.then(
            function(resp) {
              console.log("Successfully uploade image");
              //dashFactory.updateProfileDB();
              //$scope.profileDB = dashFactory.getProfileInfo();
              //$state.go($state.current, {}, {reload: true});
              console.log("Adding file " + resp[0].filename);
              dashFactory.addImageToProfile(resp[0].filename);
            },
            function (err) {
              console.log("Error uploading the image");
            }
          )
        }
        picSel.click();
        console.log("I am done");
        return false;
  }


}])

.controller('DashCtrl', ['$rootScope', '$scope', '$ionicModal', '$ionicPopup',
              '$stateParams', '$state', 'dashFactory', 'dashInfo',
              function($rootScope, $scope, $ionicModal, $ionicPopup, $stateParams,
              $state, dashFactory, dashInfo) {

  $scope.addData = {};
  $scope.phoneData = {};
  $scope.webData = {};
  $scope.emailData = {};
  $scope.profileData = {};
  $scope.profileDB = {};
  $scope.isProfileEdit = false;
  $scope.previewImage = null;

  $scope.dashName = "Profiles";
  //$scope.profileDB = JSON.parse(JSON.stringify(dashInfo));
  $scope.profileDB = dashFactory.getProfileInfo();
  $scope.profileData.address = [];
  console.log(JSON.stringify($scope.profileDB));

  ionic.Platform.ready(function() {
		//console.log("ready get camera types");
		if (!navigator.camera)
		{
			// error handling
      console.log("Camera is not ready");
			return;
		}
		//pictureSource=navigator.camera.PictureSourceType.PHOTOLIBRARY;
		$scope.pictureSource=navigator.camera.PictureSourceType.PHOTOLIBRARY;
		$scope.destinationType=navigator.camera.DestinationType.FILE_URI;
	});


  /*Form for creating a new profile*/
  $ionicModal.fromTemplateUrl('templates/new-profile.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.profileModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/new-address.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.addressModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/new-phone.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.phoneModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/new-web.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.webModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/new-email.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.emailModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/profile-preview.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.profilePreviewModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/profile-edit.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.profileEditModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/pic-sel.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.profilePictureModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/image-upload.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.imageUploadModal = modal;
  });

  $scope.clearProfileData = function() {
    $scope.profileData = {};
    $scope.profileData.address = [];
    $scope.profileData.phone = [];
    $scope.profileData.email = [];
    $scope.profileData.web = [];

  }

  /*This function is called to update the profle database of the user and
    keep it current after any operation such as add/delete/edit of a profile
  */
  $scope.updateProfileDB= function() {
    dashFactory.getProfileResource(0, 0).getProfiles()
    .$promise.then(
      function(profiles) {
        console.log("Successfully retrieved latest profile db");
        $scope.profileDB = profiles;
      },
      function(error) {
        console.log("Error retrieving latest profile db");
      }
    )
  }


  $scope.getImageLink = function(pic) {
    return dashFactory.getProfileImageLink(pic);
  }

  $scope.updateProfileImage = function() {
    $scope.addNewProfileForm(5);
  }

  $scope.selectUploadedImage = function(picName) {
    $scope.profileData.profilePicture = picName;
    console.log($scope.profileData.profilePicture);
    $scope.closeNewProfileForm(5);
    var profilePic = document.getElementById('profilePicture');
    profilePic.src = $scope.getImageLink($scope.profileData.profilePicture);
  }



  $scope.addNewProfileImage = function() {
    console.log("Adding an image for profile");
    if(!$scope.uploadFile) {
      console.log("No image selected");
      return;
    }
    dashFactory.getProfileImageResource($scope.uploadFile).imageUpload()
    .$promise.then(
      function (res) {
        console.log("Uploaded image correctly " + JSON.stringify(res[0].filename));
        $scope.selectUploadedImage(res[0].filename);
      },
      function (err) {
        console.log("Error uploading the image");
      }
    )
  }

  $scope.chooseProfileImage = function(profile) {
      console.log("I have clicked the pic");
      var picSel = document.createElement('input');
        picSel.setAttribute("type", "file");
        picSel.setAttribute("id", "picSelect");
        picSel.onchange = function() {
          var file = picSel.files[0];
          var path = URL.createObjectURL(file);
          $scope.previewImage = path;
          $scope.uploadFile = file;
          $scope.addNewProfileForm(6);
        }
        picSel.click();
        console.log("I am done");
        return false;
  }

  $scope.deleteProfileImage = function(photo) {
    console.log("Delete a profile image " + photo);
    dashFactory.getProfileImageResource(photo).imageDelete()
    .$promise.then(
      function (res) {
        console.log("Deleted image correctly " + photo);
        $scope.updateProfileDB();
        //$scope.closeNewProfileForm(5);
      },
      function (err) {
        console.log("Error deleting the image");
      }
    )
  }


  /*Function to store a new profile in the database*/
  $scope.addNewProfile = function() {
    console.log("Request to add a new profile")
    $scope.profileModal.hide();
    console.log($scope.profileData);
    $scope.isProfileCreate = false;
    $scope.addNewProfileImage();
    dashFactory.getProfileResource(0, 0).storeProfile($scope.profileData)
    .$promise.then(
      function(response) {
        console.log("Successfully stored the profile");
        $scope.updateProfileDB();
      },
      function(error) {
        console.log("Error in storing the profile");
      }
    );
  }

  /*Function to delete a profile*/
  $scope.deleteProfile = function(profileId) {
    console.log("Delete a profile");
    dashFactory.getProfileResource(1,profileId).deleteProfile()
    .$promise.then(
      function(resp) {
        console.log("Successfully deleted profile");
        $scope.updateProfileDB();
      },
      function(error) {
        console.log("Error deleting profile");
      }
    );
  }

  $scope.updateProfile = function() {
    console.log("Updating profile: " + $scope.profileData);
    dashFactory.getProfileResource(0, 0).storeProfile($scope.profileData)
    .$promise.then(
      function(response) {
        console.log("Successfully updated the profile");
        $scope.updateProfileDB();
      },
      function(error) {
        console.log("Error in updating the profile");
      }
    );
  }

  /*Function to display the new profile form based on form type*/
  $scope.addNewProfileForm = function(formType) {
    console.log("Form to add new profile");
    switch(formType) {
      case 0:
      default:
        $scope.clearProfileData();
        $scope.isProfileCreate = true;
        $scope.isProfileEdit = false;
        $scope.profileModal.show();
        break;
      case 1:
        $scope.addressModal.show();
        break;
      case 2:
        $scope.phoneModal.show();
        break;
      case 3:
        $scope.webModal.show();
        break;
      case 4:
        $scope.emailModal.show();
        break;
      case 5:
        $scope.previewImage = null;
        $scope.profilePictureModal.show();
        break;
      case 6:
        $scope.imageUploadModal.show();
        var node = document.getElementById('previewImageNode');
        node.src = $scope.previewImage;
      break;
    }
  }

  /*Function to close the new profile form based on form type and reset variables*/
  $scope.closeNewProfileForm = function(formType) {
    console.log("Close new profile form");
    switch(formType) {
      case 0:
      default:
        $scope.clearProfileData();
        $scope.isProfileCreate = false;
        $scope.profileModal.hide();
        break;
      case 1:
        $scope.addData = {};
        $scope.addressModal.hide();
        $scope.profileModal.show();
        break;
      case 2:
        $scope.phoneData = {};
        $scope.phoneModal.hide();
        $scope.profileModal.show();
        break;
      case 3:
        $scope.webData = {};
        $scope.webModal.hide();
        $scope.profileModal.show();
        break;
      case 4:
        $scope.emailData = {};
        $scope.emailModal.hide();
        $scope.profileModal.show();
        break;
      case 5:
        $scope.profilePictureModal.hide();
        break;
      case 6:
        var node = document.getElementById('previewImageNode');
        node.src = null;
        $scope.previewImage = null;
        $scope.imageUploadModal.hide();
        break;
    }
  }


  $scope.openProfileView = function(profile) {
      $scope.profileData = profile;
      $scope.profileModal.hide();
      $scope.profilePreviewModal.show();
  }

  $scope.closeProfilePreview = function() {
      $scope.profilePreviewModal.hide();
      if($scope.isProfileCreate) {
        $scope.profileModal.show();
      }
  }

  $scope.editProfile = function(profile) {
    $scope.profileData = profile;
    $scope.isProfileEdit = true;
    $scope.profileEditModal.show();
  }

  $scope.closeEditProfile = function() {
    $scope.profileEditModal.hide();
    $scope.updateProfileDB();
    $scope.isProfileEdit = false;

  }


  $scope.saveEditProfile = function() {
    $scope.profileEditModal.hide();
    $scope.updateProfile();
    $scope.updateProfileDB();
    $scope.profilePreviewModal.show();
  }

  $scope.openEditProfileNameInfo = function() {
    $scope.profileEditModal.hide();
    $scope.isProfileEdit = true;
    $scope.profileModal.show();
  }

  /*This closes the ProfileName window on an edit mode*/
  $scope.closeEditProfileNameInfo = function() {
    $scope.profileModal.hide();
    $scope.profileEditModal.show();
    $scope.isProfileEdit = false;
  }


  $scope.openNewPhoneForm = function(edit) {
    $scope.profileModal.hide();
    $scope.phoneData = {};
    if(edit) {
      $scope.isPhoneEdit = true;
    }
    $scope.addNewProfileForm(2);
  }

  $scope.addNewPhone = function() {
    $scope.profileData.phone.push($scope.phoneData);
    console.log(JSON.stringify($scope.profileData));
    $scope.phoneModal.hide();
    if($scope.isPhoneEdit) {
      $scope.profileEditModal.show();
      $scope.isPhoneEdit = false;
    } else {
      $scope.profileModal.show();
    }
  }

  $scope.openEditPhoneInfo = function(data) {
    $scope.profileEditModal.hide();
    $scope.phoneData.name = data.name;
    $scope.phoneData.number = data.number;
    $scope.phoneEditIndex = $scope.profileData.phone.indexOf(data);
    $scope.isProfileEdit = true;
    $scope.phoneModal.show();
  }

  $scope.closeEditPhoneInfo = function() {
    $scope.phoneModal.hide();
    $scope.profileData.phone[$scope.phoneEditIndex] = $scope.phoneData;
    $scope.isProfileEdit = false;
    $scope.profileEditModal.show();
  }

  $scope.deletePhoneInfo = function(phone) {
    $scope.phoneEditIndex = $scope.profileData.phone.indexOf(phone);
    $scope.profileData.phone.splice($scope.phoneEditIndex, 1);
  }

  $scope.openNewEmailForm = function(edit) {
    $scope.profileModal.hide();
    $scope.emailData = {};
    if(edit) {
      $scope.isEmailEdit = true;
    }
    $scope.addNewProfileForm(4);
  }

  $scope.addNewEmail = function() {
    $scope.profileData.email.push($scope.emailData);
    console.log(JSON.stringify($scope.profileData));
    $scope.emailModal.hide();
    if($scope.isEmailEdit) {
      $scope.isEmailEdit = false;
      $scope.profileEditModal.show();
    } else {
      $scope.profileModal.show();
    }
  }

  $scope.openEditEmailInfo = function(data) {
    $scope.profileEditModal.hide();
    $scope.emailData.name = data.name;
    $scope.emailData.email = data.email;
    $scope.emailEditIndex = $scope.profileData.email.indexOf(data);
    $scope.isProfileEdit = true;
    $scope.emailModal.show();
  }

  $scope.closeEditEmailInfo = function() {
    $scope.emailModal.hide();
    $scope.profileData.email[$scope.emailEditIndex] = $scope.emailData;
    $scope.isProfileEdit = false;
    $scope.profileEditModal.show();
  }

  $scope.deleteEmailInfo = function(email) {
    $scope.emailEditIndex = $scope.profileData.email.indexOf(email);
    $scope.profileData.email.splice($scope.emailEditIndex, 1);
  }

  $scope.openNewWebForm = function(edit) {
    $scope.profileModal.hide();
    $scope.webData = {};
    if(edit) {
      $scope.isWebEdit = true;
    }
    $scope.addNewProfileForm(3);
  }

  $scope.addNewWeb = function() {
    $scope.profileData.web.push($scope.webData);
    console.log(JSON.stringify($scope.profileData));
    $scope.webModal.hide();
    if($scope.isWebEdit) {
      $scope.isWebEdit = false;
      $scope.profileEditModal.show();
    } else {
      $scope.profileModal.show();
    }
  }

  $scope.openEditWebInfo = function(data) {
    $scope.profileEditModal.hide();
    $scope.webData.name = data.name;
    $scope.webData.email = data.link;
    $scope.webEditIndex = $scope.profileData.web.indexOf(data);
    $scope.isProfileEdit = true;
    $scope.webModal.show();
  }

  $scope.closeEditWebInfo = function() {
    $scope.webModal.hide();
    $scope.profileData.web[$scope.webEditIndex] = $scope.webData;
    $scope.isProfileEdit = false;
    $scope.profileEditModal.show();
  }

  $scope.deleteWebInfo = function(web) {
    $scope.webEditIndex = $scope.profileData.web.indexOf(web);
    $scope.profileData.web.splice($scope.webEditIndex, 1);
  }

  $scope.openNewAddressForm = function(edit) {
    $scope.profileModal.hide();
    $scope.addData = {};
    if(edit) {
      $scope.isAddressEdit = true;
    }
    $scope.addNewProfileForm(1);
  }

  $scope.addNewAddress = function() {
    $scope.profileData.address.push($scope.addData);
    console.log(JSON.stringify($scope.profileData));
    $scope.addressModal.hide();
    if($scope.isAddressEdit) {
      $scope.profileEditModal.show();
      $scope.isAddressEdit = false;
    } else {
      $scope.profileModal.show();
    }
  }

  $scope.openEditAddressInfo = function(data) {
    $scope.profileEditModal.hide();
    $scope.addData = data;
    $scope.addEditIndex = $scope.profileData.address.indexOf(data);
    $scope.isProfileEdit = true;
    $scope.addressModal.show();
  }

  $scope.closeEditAddressInfo = function() {
    $scope.addressModal.hide();
    $scope.profileData.address[$scope.addEditIndex] = $scope.addData;
    $scope.isProfileEdit = false;
    $scope.profileEditModal.show();
  }

  $scope.deleteAddressInfo = function(add) {
    $scope.addEditIndex = $scope.profileData.address.indexOf(add);
    $scope.profileData.address.splice($scope.addEditIndex, 1);
  }

  $scope.selectProfileImage = function() {
    var options =   {
    			quality: 50,
    			destinationType: $scope.destinationType,
    			sourceType: $scope.pictureSource,
    			encodingType: 0
    			};
    if (!navigator.camera)
    {
        console.log("Failed to initialize camera");
    			// error handling
    		return;
    }
    console.log("Ready to get image");
    navigator.camera.getPicture(function (imageURI) {
        console.log("got camera success ", imageURI);
    	  $scope.profileData.profilePicture = imageURI;
      },
      function (err) {
    	   console.log("got camera error ", err);
         $scope.profilePicture = null;
    	},
    	options);
  }



  $scope.showDefaultProfilePopupConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: "Public Profile Setting",
      template: "Are you sure you want to make this a public profile?"
    });
    confirmPopup.then(function(res) {
      if(res) {
        //Send data to server
        $scope.profileData.defaultProfile =  true;
        console.log("Setting public profile");
      } else {
        //Not sending create to server
        console.log("Did not set public profile");

      }
    });
  }

  $scope.publicProfileCfgChange = function() {
    if($scope.profileData.defaultProfile) {
      $scope.showDefaultProfilePopupConfirm();
    } else {
      $scope.profileData.defaultProfile = false;
    }
  }

  $scope.getProfilePublicStatus = function() {
    return $scope.profileData.defaultProfile;
  }

  $scope.setProfileDefault = function() {
    $scope.showDefaultProfilePopupConfirm();
  }

  $scope.closeInfo = function() {
    $state.go('tab.info');
  }


}])

.controller('InfoCtrl', function($scope, $state) {

  $scope.addInfo = function(index) {
    console.log("Adding info for index " + index);
    //$state.go('tab.account');
    $state.go('tab.dash');
  }

})

.controller('DirCtrl', function($scope, directoryFactory, directory) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.directory = directory;
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl',
                function($rootScope, $scope, loginFactory, $ionicModal,
                          $state, $ionicPopup) {

  $scope.settings = {
    enableFriends: true
  };
  $rootScope.isValidLogin = false;
  $scope.loginData = {};
  $scope.loginData.name = "Placeholder"
  $scope.createAccountFlag = false;
  //$scope.customerFound = loginFactory.query();

  //console.log($scope.customerFound[0].name);

  $ionicModal.fromTemplateUrl('templates/tab-login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.getIsValidLogin = function() {
    return $rootScope.isValidLogin;
  };

  $scope.doSignIn = function() {
    console.log("Show login modal");
    $scope.modal.show();
  };

  $scope.doNewAccount = function() {
    console.log("New account modal");
    $scope.createAccountFlag = true;
    $scope.modal.show();
  };

  $scope.showFailedLoginAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: "Login Failed",
      template: "Invalid Login. Login Failed!"
    });
  };

  $scope.showCreateAccountPopupConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: "Create Account",
      template: "Are you sure you want to create a new account?"
    });
    confirmPopup.then(function(res) {
      if(res) {
        //Send data to server
        $scope.loginData.name=  $scope.loginData.firstname + " " + $scope.loginData.lastname;
        console.log("Create a new account");
        cust = loginFactory.createCustomerByName();
        cust.addMember({"username":$scope.loginData.username,
          "password": $scope.loginData.password});
      } else {
        //Not sending create to server
        console.log("Do not create a new account");

      }
    });
  };

  $scope.submitLogin = function() {
    $scope.modal.hide();
    $scope.loginData.username = $scope.loginData.username.toLowerCase();
    var loginInfo = loginFactory.loginCustomer($scope.loginData).login();
    loginInfo.$promise.then(
      function(customer) {
        console.log("Found the customer " + customer.token);
        $rootScope.token = customer.token;
        $rootScope.isValidLogin = true;
        console.log("isValidLogin is " + $scope.isValidLogin);
        $state.go('tab.dash');
      },
      function(error) {
        console.log("Could not find the customer");
        $scope.showFailedLoginAlert();

      }
    )
  };

  $scope.closeLogin = function() {
    $scope.modal.hide();
    $scope.createAccountFlag = false;
  };

  $scope.createAccount = function() {
    console.log("Create a new account");
    var user = loginFactory.getCustomerByName($scope.loginData.username);
    user.$promise.then(
      function(customer) {
        console.log("Found the customer " + customer.name )
        $rootScope.isValidLogin = false;
        $scope.createAccountFlag = false;
      },
      function(error) {
        console.log("Could not find the customer");
        $scope.showCreateAccountPopupConfirm();
        $scope.createAccountFlag = false;
      }
    )
  }



});
