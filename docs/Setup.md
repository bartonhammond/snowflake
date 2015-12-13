## Setup

1. [Install React-Native](https://facebook.github.io/react-native/docs/getting-started.html#content)
1. ```git clone https://github.com/bartonhammond/snowflake.git```
1. cd snowflake
1. npm install
1. Copy or move ```src/lib/config.example.js``` to ```src/lib/config.js```.
1. Create account and app on Parse.com
  1. Copy the Parse.com app keys for APP_ID and REST_API_KEY and update ```src/lib/config.js```
  1. Update the Apps Settings -> Authentication 
 	  1. Allow username and password-based authentication -> Yes
	  1. Allow anonymous users -> No
  1. Update the Apps Settings -> Email
	  1. Verify user emails -> Yes
1. On mac, open XCode and load project
1. For android, ```react-native run-android``` assuming you have an emulator or device attached.
1. To run Jest, ```npm test```
1. To debug Jest unit cases, install [node_inspector](https://github.com/node-inspector/node-inspector) and run ```npm run test-chrome```
1. Enjoy!
