angular.module('starter.services', ['ngResource'])

//.constant("baseURL", "https://localhost:3443/")
.constant("baseURL", "http://localhost:3000/")

  .factory('loginFactory', ['$resource', 'baseURL', function($resource, baseURL){
    return {
      getCustomerById : function (index) {
        var customer = $resource(baseURL + "users/register").get({id: index});
        customer.$promise.then(function(result) {
          console.log("Got the customer by Id " + index);
          return result;
        },
        function(error) {
          console.log("Did  not get the customer by Id " + index);
          return null;
        })
      },
      getCustomerByName : function (username) {
        return $resource(baseURL + "customers/" + username).get();
      },

      loginCustomer : function (loginData) {
          return $resource(baseURL + "users/login", null,
          {
            'login': {
              method: 'POST',
              params: {
                "username":loginData.username,
                "password":loginData.password
              }
            }
          });
      },

      createCustomerByName : function (loginData) {
        return $resource(baseURL + "users/register", null,
                {'addMember': {method: 'POST'}}, loginData);
        //return $resource(baseURL + "users/register").save(loginData)
      }
    };
  }])

.factory('directoryFactory', ['$resource', 'baseURL', function($resource, baseURL) {
  return $resource(baseURL + "customers");
}])

.factory('searchFactory', ['$resource', 'baseURL', function($resource, baseURL) {
  return {
    getDefaultProfiles: function(searchString) {
      var url = "";
      url = baseURL + "search/";
      return $resource(url, null,
      {
        'getProfiles':
        {
          method: 'GET', isArray:true,
          headers:
          {
            'x-access-token' : $rootScope.token
          }
        }
      })
    }
  };
}])

.factory('dashFactory', ['$resource', '$rootScope', 'baseURL',
                          function($resource, $rootScope, baseURL) {
  var profileDB = {};

  return {

    getDashName : function(index) {
      switch(index) {
        case '0':
          return "Profile";
          break;
        case '1':
          return "Address";
          break;
        case '2':
          return "E-mail";
          break;
        case '3':
          return "Phone";
          break;
        case '4':
          return "Website";
          break;
        default:
          return "Profile";
          break;
      }
    },
    getProfileResource : function(specific_del, profileId) {
      var url = "";
      if(specific_del) {
        url = baseURL + "profiles/" + profileId;
      } else {
        url = baseURL + "profiles/";
      }
      return $resource(url, null,
                        {
                          'getProfiles':
                          {
                            method: 'GET', isArray:true,
                            headers:
                            {
                              'x-access-token' : $rootScope.token
                            }
                          },
                          'storeProfile':
                          {
                            method: 'POST',
                            headers:
                            {
                              'x-access-token' : $rootScope.token
                            }
                          },
                          'deleteProfile':
                          {
                            method: 'DELETE',
                            headers:
                            {
                              'x-access-token' : $rootScope.token
                            }
                          }
                        }
                      );
    },

    getSearchResource : function(searchString) {
      var url = baseURL + "search";
      return $resource(url, null, {
        'search': {
          method: 'GET', isArray:true,
          params: {
            "search":searchString,
          },
          headers:
          {
            'x-access-token' : $rootScope.token,
          },
        },
      });
    },

    getProfileImageResource : function(profilePicture) {
      var url = baseURL + "profiles/image/" + profilePicture;
      return $resource(url, null,
        {
          'imageUpload': {
            method: 'POST', isArray:true,
            transformRequest: function() {
              var fd = new FormData();
              //fd.append('size', 'original');
              fd.append('file', profilePicture);
              return fd;
            },
            headers:
            {
              'Content-Type': undefined,
              enctype: 'multipart/form-data',
              'x-access-token' : $rootScope.token,
            },
          },
          'imageDelete': {
            method: 'DELETE',
            headers:
            {
              'x-access-token' : $rootScope.token,
            },
          },
          'imageGet': {
            method: 'GET',
            headers:
            {
              'x-access-token' : $rootScope.token,
            },
          }

        }
      );
    },

    getProfileImageLink : function(imageName) {
      return (baseURL + "profiles/image/" + imageName);
    },

    getProfileInfo : function() {
      return this.profileDB;
    },

    setProfileInfo : function(response) {
      this.profileDB = response;
    },

    updateProfileDB : function(response) {
      console.log("updating the profile DB");
      this.getProfileResource(0, 0).getProfiles()
      .$promise.then(
        function(profiles) {
          console.log("Successfully retrieved latest profile db");
          console.log(profiles[0].photos);
          this.profileDB = profiles;
        },
        function(error) {
          console.log("Error retrieving latest profile db");
        }
      )
    },

    addImageToProfile : function(image) {
      this.profileDB[0].photos.push(image);
      console.log(this.profileDB[0].photos);
    },

    delImageFromProfile : function(image) {
      var index = this.profileDB[0].photos.indexOf(image);
      this.profileDB[0].photos.splice(index, 1);
      console.log(this.profileDB[0].photos);
    },

  }
}]);
