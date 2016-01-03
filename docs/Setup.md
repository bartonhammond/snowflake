## Setup

* [Install React-Native](https://facebook.github.io/react-native/docs/getting-started.html#content)

* Clone snowflake:

 ```
 git clone https://github.com/bartonhammond/snowflake.git
 ```

*  cd snowflake
```
npm install
```

*  Copy or move ```src/lib/config.example.js``` to ```src/lib/config.js```.
   * Note: you must select one of three options for the ```backend``` as shown below:

```
  backend: {
    parse: false,
    hapiLocal: false,
    hapiRemote: true
  },
```
   * To run Hapi either locally on remotely on OpenShift, update the below ```src/lib/config.js``` file:

```
  HAPI: {
    local: {
      url: 'http://127.0.0.1:5000'
    },
    remote: {
      url: 'https://mysnowflake-bartonhammond.rhcloud.com'
    }
  }

```

* If you choose Parse.com, create account and app on Parse.com
  * Copy the Parse.com app keys for APP_ID and REST_API_KEY and update ```src/lib/config.js```
  * Update the Apps Settings -> Authentication 
 	  * Allow username and password-based authentication -> Yes
	  * Allow anonymous users -> No
  * Update the Apps Settings -> Email
	  * Verify user emails -> Yes

### To run: 
* On mac, open XCode and load project
* For android, ```react-native run-android``` assuming you have an emulator or device attached.
* To run Jest, ```npm test```
* To debug Jest unit cases, install [node_inspector](https://github.com/node-inspector/node-inspector) and run ```npm run test-chrome```
* Enjoy!
