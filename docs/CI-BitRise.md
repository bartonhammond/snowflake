Snowflake ![snowflake](https://cloud.githubusercontent.com/assets/1282364/11599365/1a1c39d2-9a8c-11e5-8819-bc1e48b30525.png)
==================================
# Continuous Integration with Bitrise.io

### This document provides the steps to take your app that was cloned or downloaded from snowflake and build both the iOS and Android applications.

# Content

- [Introduction](#introduction)
- [Bitrise Overview](#bitrise-overview)
- [iOS XCode Modifications](#ios-xcode-modifications)
- [Continuous Integration - Bitrise.io](#continuous-integration)  
- [XCode Certs Provision Profiles  App Id](#xcode-certs-provision-profiles-app-id)
- [Create iOS App](#create-ios-app)
- [iOS install](#ios-install)
- [Android Setup](#android-setup)
- [Things not addressed](#things-not-addressed)

----------

##### Introduction 
* **Video 1/7**: [https://youtu.be/EYafslJvXz8](https://youtu.be/EYafslJvXz8)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=EYafslJvXz8"
target="_blank">
<img src="http://img.youtube.com/vi/EYafslJvXz8/0.jpg" 
alt="Introduction" width="240" height="180" border="10"
/></a>

* Snowflake is a *starter app* so all tutorials are basic in nature
* There are a bizzilion ways of doing any of this - I'm showing one
* There's a number of CI sites, I chose Bitrise.io 
* There's a general understanding of why to us a CI
* The build will be done on Bitrise.io - not locally
* The **only** goal is to get the build to run on Bitrise.io
* You can **still** run applications locally with simulators


#####  Bitrise Overview
  * **Video 2/7**:[https://youtu.be/JAHlfNUKoLg](https://youtu.be/JAHlfNUKoLg)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=JAHlfNUKoLg"
target="_blank">
<img src="http://img.youtube.com/vi/JAHlfNUKoLg/0.jpg" 
alt="Bitrise.io Overview" width="240" height="180" border="10"
/></a>

  *  Introduction to Bitrise.io [https://www.bitrise.io/](https://www.bitrise.io/)
  * Overview of what it does for us
  * Overview of the two WorkFlows
	  * iOS 
	  * Android 

##### iOS XCode Modifications
* **Video 3/7**:[https://youtu.be/3y72adWNRSU](https://youtu.be/3y72adWNRSU)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=3y72adWNRSU"
target="_blank">
<img src="http://img.youtube.com/vi/3y72adWNRSU/0.jpg" 
alt="iOS XCode Modifications" width="240" height="180" border="10"
/></a>
  * XCode
	* Icons - Asset Catalog Creator Free - see App Store
	* Bundler ID
	* [ https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringYourApp/ConfiguringYourApp.html](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringYourApp/ConfiguringYourApp.html)
	* AppDelegate.m
	* Versioning
	* [https://developer.apple.com/library/ios/qa/qa1827/_index.html](https://developer.apple.com/library/ios/qa/qa1827/_index.html)
	* Automatic Certificate & Development

##### XCode Certs Provision Profiles App Id
  * **Video 4/7**:
  [https://youtu.be/zJXoHIaJg7Y](https://youtu.be/zJXoHIaJg7Y)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=zJXoHIaJg7Y"
target="_blank">
<img src="http://img.youtube.com/vi/zJXoHIaJg7Y/0.jpg" 
alt="XCode Certs Provision Profiles" width="240" height="180" border="10"
/></a>
* see [https://developer.apple.com/library/ios/qa/qa1814/_index.html](https://developer.apple.com/library/ios/qa/qa1814/_index.html)
* App Development Center
	*  Remove all Certs, App Ids, and Profiles
   * Generating  Certificates and Provision Profile
		* Update XCode appDelegate.m w/ ifconfig value
		* Xcode -> Run with device attached
		* Select option for Xcode to fix signing
	
##### Create iOS App
* **Video 5/7**:
[Bitrise, YML, Profile, P12](https://youtu.be/olfpwEjVlZ4)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=olfpwEjVlZ4"
target="_blank">
<img src="http://img.youtube.com/vi/olfpwEjVlZ4/0.jpg" 
alt="Create iOS App" width="240" height="180" border="10"
/></a>
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
	
##### iOS install
* **Video 6/7**: [https://youtu.be/nQWXJI0ncns](https://youtu.be/nQWXJI0ncns)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=nQWXJI0ncns"
target="_blank">
<img src="http://img.youtube.com/vi/nQWXJI0ncns/0.jpg" 
alt="iOS install from email" width="240" height="180" border="10"
/></a>

* From device, open email app
* Open **letsconnect**
* Follow instructions to load in Safarie
* Follow prompts and enjoy!

##### Android Setup 
* **Video 7/7**: [Android YML, Setup](https://youtu.be/o4RQZodbzIU)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=o4RQZodbzIU"
target="_blank">
<img src="http://img.youtube.com/vi/o4RQZodbzIU/0.jpg" 
alt="Android Setup" width="240" height="180" border="10"/>
</a>

* Settings -> Docker Image
* Secret Variables 
* App/build.gradle
* Setup Secret and Env Vars 
* Import YML
* Run build

##### Things not addressed
* Submission to any store
* Working with other CIs
* Complex setups for either ios or andriod
* Debugging any failures
* Shiny new things
* No local builds with Bitrise CLI
* No local builds with Fastlane
* No tutorial on all the features of Fastlane


