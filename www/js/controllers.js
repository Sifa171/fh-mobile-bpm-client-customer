angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicLoading, $ionicSideMenuDelegate, $ionicModal, $timeout) {

  $scope.credentials = function(){
  };

  $scope.closeLogin = function () {
    if($scope.credentials.password && $scope.credentials.username){
      $scope.showSucces();
      // store the credentials to the mobile device
      window.localStorage.setItem("customer_bpm_username", $scope.credentials.username);
      window.localStorage.setItem("customer_bpm_password", $scope.credentials.password);
      $timeout(function() {
          $scope.login.hide();
      }, 1000);
    }else{
      $scope.showFailed();
    }
  };

  $scope.showSucces = function() {
    $ionicLoading.show({
      template: '<div class="ion-checkmark">&nbsp;Success</div>',
      duration: 1000
    });
  };

  $scope.showFailed = function() {
    $ionicLoading.show({
      template: '<div class="ion-minus-circled">&nbsp;Login Failed</div>',
      duration: 1500
    });
  };

    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    // Show loading...
    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };

    // Hide loading...
    $scope.hide = function(){
      $ionicLoading.hide();
    };

    // Load the modal from the given template URL
    $ionicModal.fromTemplateUrl('templates/new-request.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  $scope.modalCancel = function(){
    $scope.modal.hide();
  }

  $scope.case = {
  }

  // Called when the form is submitted
  $scope.createCase = function(){
    $scope.show();
    // check if userInput is defined
    if ($scope.case.firstname && $scope.case.lastname && $scope.case.request) {
      $fh.cloud({
        "path": "/bpm/startProcess",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("customer_bpm_username"),
            "password": window.localStorage.getItem("customer_bpm_password")
          },
          "firstname": $scope.case.firstname,
          "lastname": $scope.case.lastname,
          "request": $scope.case.request,
          // set to show the creator of the request in the employee app
          "username": window.localStorage.getItem("customer_bpm_username")
        },
        "timeout": 25000
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          // Clear loading
          $scope.hide();
        }else if(res == 'Unauthorized'){
          $scope.noticeMessage = 'Authentication Error';
          // Clear loading
          $scope.hide();
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          // Clear loading
          $scope.hide();
        }else{
          $scope.noticeMessage = null;
          // Clear form values
          $scope.case.firstname = '';
          $scope.case.lastname = '';
          $scope.case.request = '';
          // Clear loading
          $scope.hide();
          $scope.modal.hide();
        }
      }, function(msg,err) {
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        // Clear loading
        $scope.hide();
      });
    }else {
      $scope.noticeMessage  = "Please fill out the form";
      // Clear loading
      $scope.hide();
    }
  }

    $scope.getProcess = function(){
      $fh.cloud({
        "path": "/bpm/getProcessInstance",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("customer_bpm_username"),
            "password": window.localStorage.getItem("customer_bpm_password")
          }
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.processName = null;
        }else if(res == 'Unauthorized'){
          $scope.noticeMessage = 'Authentication Error';
          $scope.processName = null;
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.processName = null;
        }else{
          $scope.noticeMessage = null;
          $scope.processName = res.name;
        }
      }, function(msg,err) {
        $scope.processName = null;
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err.message);
      });
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }

    // Load the modal from the given template URL
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(login) {
      $scope.login = login;
    });

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.login.remove();
  });
  // Execute action on hide modal
  $scope.$on('login.hidden', function() {
  });
  // Execute action on remove modal
  $scope.$on('login.removed', function() {
    // Execute action
  });

})

.controller('ProcessCtrl', function($scope, $ionicLoading) {

    // Show loading...
    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };

    // Hide loading...
    $scope.hide = function(){
      $ionicLoading.hide();
    };

    $scope.processInstances = [];

      $scope.loadProcessInstances = function(){
        $scope.show();
        allProcessInstances();
      }

      function allProcessInstances(){
          $fh.cloud({
            "path": "/bpm/getProcessInstanceList",
            "method": "POST",
            "contentType": "application/json",
            "data": {
              "params": {
                "username": window.localStorage.getItem("customer_bpm_username"),
                "password": window.localStorage.getItem("customer_bpm_password")
              }
            }
          }, function(res) {
            if(res.code == 'ECONNREFUSED'){
              $scope.noticeMessage = 'Connection to mBaaS refused';
              $scope.processInstances = null;
              $scope.hide();
            }else if(res.error != null){
              $scope.noticeMessage = 'Connection to BPM refused'
              $scope.processInstances = null;
              $scope.hide();
            }else{
              $scope.noticeMessage = null;
              $scope.processInstances = res.processInstanceInfoList;
              if(res.processInstanceInfoList.length == 0){
                $scope.noticeMessage  = 'No more requests are open';
              }else{
                for (i = 0; i < res.processInstanceInfoList.length; i++) {
                  if(res.processInstanceInfoList[i]['process-instance']['state'] == 1){
                    res.processInstanceInfoList[i]['process-instance']['state'] = 'Active';
                  }else if(res.processInstanceInfoList[i]['process-instance']['state'] == 2){
                    res.processInstanceInfoList[i]['process-instance']['state'] = 'Completed';
                  }
                }
                $scope.processInstances = res.processInstanceInfoList;
              }
              $scope.hide();
            }
          }, function(msg,err) {
            $scope.processInstances = null;
            $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
            // Clear loading
            $scope.hide();
          });
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');

      };

})

.controller('ProcessDetailCtrl', function($scope, $ionicLoading, $stateParams) {

    // Show loading...
    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };

    // Hide loading...
    $scope.hide = function(){
      $ionicLoading.hide();
    };


    $scope.getProcessContent = function(){
    $scope.show();
    loadProcessContent();
  }

  function loadProcessContent(){
    $fh.cloud({
      "path": "/bpm/loadProcessContent",
      "method": "POST",
      "contentType": "application/json",
      "data": {
        "params": {
          "username": window.localStorage.getItem("customer_bpm_username"),
          "password": window.localStorage.getItem("customer_bpm_password")
        },
        "processId": $stateParams.processId
      }
    }, function(res) {
      if(res.code == 'ECONNREFUSED'){
        $scope.noticeMessage = 'Connection to mBaaS refused';
        $scope.processContentList = null;
        $scope.hide();
      }else if(res.error != null){
        $scope.noticeMessage = 'Connection to BPM refused'
        $scope.processContentList = null;
        $scope.hide();
      }else{
        $scope.noticeMessage = null;
        $scope.processContentList = res.processInstanceInfoList;
        for (i = 0; i < res.processInstanceInfoList.length; i++) {
          if(res.processInstanceInfoList[i]['process-instance']['id'] == $stateParams.processId){
            for(x = 0; x < res.processInstanceInfoList[i]['variables'].length; x++){
              if(res.processInstanceInfoList[i]['variables'][x]['name'] == 'firstname'){
                  $scope.firstname = res.processInstanceInfoList[i]['variables'][x]['value']['value']
              }else if(res.processInstanceInfoList[i]['variables'][x]['name'] == 'lastname'){
                  $scope.lastname = res.processInstanceInfoList[i]['variables'][x]['value']['value']
              }else if(res.processInstanceInfoList[i]['variables'][x]['name'] == 'request'){
                  $scope.request = res.processInstanceInfoList[i]['variables'][x]['value']['value']
              }else if(res.processInstanceInfoList[i]['variables'][x]['name'] == 'decision'){
                  $scope.decision = res.processInstanceInfoList[i]['variables'][x]['value']['value']
              }else if(res.processInstanceInfoList[i]['variables'][x]['name'] == 'decisioncomment'){
                  $scope.comment = res.processInstanceInfoList[i]['variables'][x]['value']['value']
              }
            }
          }
        }
        $scope.hide();
      }
    }, function(msg,err) {
      $scope.processContentList = null;
      $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
      $scope.hide();
    });
    // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  };
})

.controller('AccountCtrl', function($scope, $ionicLoading) {
  // Hide loading...
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.settings = {
    enablePush: true
  };
})
