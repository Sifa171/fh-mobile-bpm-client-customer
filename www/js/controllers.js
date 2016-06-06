angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicLoading) {

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

    $scope.getProcess = function(){
      $fh.cloud({
        "path": "/bpm/getProcessInstance",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("bpm_username"),
            "password": window.localStorage.getItem("bpm_password"),
            "ip": window.localStorage.getItem("bpm_ip"),
            "port": window.localStorage.getItem("bpm_port")
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
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
      });
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }
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
              "username": window.localStorage.getItem("bpm_username"),
              "password": window.localStorage.getItem("bpm_password"),
              "ip": window.localStorage.getItem("bpm_ip"),
              "port": window.localStorage.getItem("bpm_port")
            },
            "firstname": $scope.case.firstname,
            "lastname": $scope.case.lastname,
            "request": $scope.case.request,
            "decision": $scope.case.decision,
            "decisioncomment": $scope.case.decisioncomment
          },
          "timeout": 25000
        }, function(res) {
          if(res.code == 'ECONNREFUSED'){
            $scope.noticeMessage = 'Connection to mBaaS refused';
            $scope.processName = null;
            // Clear loading
            $scope.hide();
          }else if(res == 'Unauthorized'){
            $scope.noticeMessage = 'Authentication Error';
            $scope.processName = null;
            // Clear loading
            $scope.hide();
          }else if(res.error != null){
            $scope.noticeMessage = 'Connection to BPM refused'
            $scope.processName = null;
            // Clear loading
            $scope.hide();
          }else{
            $scope.noticeMessage = null;
            // Clear form values
            $scope.case.firstname = '';
            $scope.case.lastname = '';
            $scope.case.request = '';
            $scope.case.decision = '';
            $scope.case.decisioncomment = '';
            // Clear loading
            $scope.hide();
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
})

.controller('AccountCtrl', function($scope, $ionicLoading) {
  var message = '';
  // Show loading...
  $scope.show = function() {
    $ionicLoading.show({
      template: '<div class="ion-checkmark">&nbsp;'+message+'</div>',
      duration: 1000
    });
  };

  // Hide loading...
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.settings = {
    enablePush: true
  };

  $scope.login = {
  }

  $scope.setLoginCredentials = function(){
        message = 'Success';
        $scope.show();
        // store the credentials to the mobile device
        window.localStorage.setItem("bpm_username", $scope.login.username);
        window.localStorage.setItem("bpm_password", $scope.login.password);
        window.localStorage.setItem("bpm_ip", $scope.login.ip);
        window.localStorage.setItem("bpm_port", $scope.login.port);
  };

  $scope.initCredentials = function() {
      if(window.localStorage.getItem("bpm_username") != undefined){
        $scope.login.username = window.localStorage.getItem("bpm_username");
      }
      if(window.localStorage.getItem("bpm_password") != undefined){
        $scope.login.password = window.localStorage.getItem("bpm_password");
      }
      if(window.localStorage.getItem("bpm_ip") != undefined){
        $scope.login.ip = window.localStorage.getItem("bpm_ip");
      }
      if(window.localStorage.getItem("bpm_port") != undefined){
        $scope.login.port = window.localStorage.getItem("bpm_port");
      }
    };
})
