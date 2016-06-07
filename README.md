# What is 'fh-mobile-bpm-client-employee'?
This mobile frontend is part of a demo which communicates with an instance of Red Hat's BPM Suite via REST.
It gives you the ability to interact with BPM tasks.

# What is part of the demo?
The demo is separated in four parts. Two client-side parts and two server-side parts.

    Client-side:
    1) The 'fh-mobile-bpm-client-employee' https://github.com/Sifa91/fh-mobile-bpm-client-employee
    2) The 'fh-mobile-bpm-client-customer' https://github.com/Sifa91/fh-mobile-bpm-client-customer

    Server-side:
    3) The 'fh-mobile-bpm-cloudapp' https://github.com/sebastianfaulhaber/fh-mobile-bpm-cloudapp
    4) The 'fh-connector-bpm' https://github.com/Sifa91/fh-connector-bpm

# How to setup the demo
First of all you need a running BPM Suite instance. You can run it local or remote. It's your decision.

## Then you have to start the mBaas 'fh-connector-bpm'.
    -> Navigate to the mBaaS directory via commandline
    -> enter 'grunt serve:local' and fire the command
    (ATTENTION: Grunt is required! If you haven't installed grunt yet, look here: http://gruntjs.com/installing-grunt)
## Now it is time to start the cloud app. 'fh-mobile-bpm-cloudapp'
    -> Navigate to the cloud app directory via commandline
    -> enter 'grunt serve:local' and fire the command
    (ATTENTION: Grunt is required! If you haven't installed grunt yet, look here: http://gruntjs.com/installing-grunt)

## Choose the frontend which you would like to run
    -> Navigate to the frontend directory via commandline
    -> enter 'ionic' and fire the command
    (ATTENTION: Ionic is required! If you haven't installed ionic yet, look here: http://ionicframework.com/getting-started)
