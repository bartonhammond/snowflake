# Continuous Integration with Bitrise.io

### This document provides the steps to take your app that was cloned or downloaded from snowflake and build both the iOS and Android applications.

#### First, I'd like to establish what this document does address and maybe, more importantly, what it doesn't.  

#### Assumptions
* Snowflake is a *starter app* so all tutorials are basic in nature
* There are a bizzilion ways of doing any of this - I'm showing one
* There's a number of CI sites, I chose Bitrise.io 
* There's a general understanding of why to us a CI
* The build will be done on Bitrise.io - not locally
* The **only** goal is to get the build to run on Bitrise.io
* You can **still** run applications locally with simulators
* Video: [CI-Introduction.mp4](here)

##### The things addressed
* Video [ CI - Bitwise walkthrough.mp4] (here) 
	* Introduction to [https://www.bitrise.io/](https://www.bitrise.io/)
  * Overview of what it does for us
  * Overview of the two WorkFlows
	  * iOS 
	  * Android 
* iOS 
	* Video [XCode Modifications.mp4](here)
		* XCode
			* Icons - Asset Catalog Creator Free - see App Store
			* Bundler ID
			* [ https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringYourApp/ConfiguringYourApp.html](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringYourApp/ConfiguringYourApp.html)
		* AppDelegate.m
		* Versioning
			* [https://developer.apple.com/library/ios/qa/qa1827/_index.html](https://developer.apple.com/library/ios/qa/qa1827/_index.html)
		* Automatic Certificate & Developement

	* Video [XCode Certs, Prov Profiles, AppId.mp4](here)
		* see [https://developer.apple.com/library/ios/qa/qa1814/_index.html](https://developer.apple.com/library/ios/qa/qa1814/_index.html)
		* App Development Center
			* Remove all Certs, App Ids, and Profiles
		* Generating  Certificates and Provision Profile
			* Update XCode appDelegate.m w/ ifconfig value
			* Xcode -> Run with device attached
			* Select option for Xcode to fix signing
	* Video [](here)
		* Login/Register Bitrise.io
		* Dashboard
		* Add App 
		* Authenticate GitHub
		* Select repository, branch
		* Import YML
		* Download Certifications 
		* Update KeyChain
		* Save .p12
		* Download Provision
		* Load .p12 and provision to Bitrise.io
		* Setup Secret and Env Vars 
		* Build
* Android
	* App/build.gradle
	* Setup Secret and Env Vars 
	* Import YML
	* Run build

#### Things not addressed
* Submission to any store
* Working with other CIs
* Complex setups for either ios or andriod
* Debugging any failures
* Shiny new things
* No local builds with Bitrise CLI
* No local builds with Fastlane
* No tutorial on all the features of Fastlane


