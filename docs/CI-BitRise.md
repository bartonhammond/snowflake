Snowflake ![snowflake](https://cloud.githubusercontent.com/assets/1282364/11599365/1a1c39d2-9a8c-11e5-8819-bc1e48b30525.png)
==================================
# Continuous Integration with Bitrise.io

### This document provides the steps to take your app that was cloned or downloaded from snowflake and build both the iOS and Android applications.

# Content

- [Introduction](#Introduction)
- [Bitrise Overview](#bitrise-overview)
- [iOS XCode Modifications](ios-xcode-modifications)
- [Continuous Integration - Bitrise.io](#continuous-integration)  
- [XCode Certs Provision Profiles  App Id](xcode-certs-provision-profiles-app-id)
- [Create iOS App](create-ios-app)
- [iOS install](ios-install)
- [Android Setup](android-setup)
- [Things not addressed](things-not-addressed)

----------

##### Introduction
* **Video 1/7**: [Introduction](here)
* Snowflake is a *starter app* so all tutorials are basic in nature
* There are a bizzilion ways of doing any of this - I'm showing one
* There's a number of CI sites, I chose Bitrise.io 
* There's a general understanding of why to us a CI
* The build will be done on Bitrise.io - not locally
* The **only** goal is to get the build to run on Bitrise.io
* You can **still** run applications locally with simulators


<a href="http://www.youtube.com/watch?feature=player_embedded&v=b4eqQUA3O6o" target="_blank"><img src="http://img.youtube.com/vi/b4eqQUA3O6o/0.jpg" 
alt="Snowflake Hot Loading" width="240" height="180" border="10"
/></a>

#####  Bitrise Overview 
  * **Video 2/7**:[ CI - Bitwise walkthrough.mp4] (https://youtu.be/JAHlfNUKoLg)
  *  Introduction to Bitrise.io [https://www.bitrise.io/](https://www.bitrise.io/)
  * Overview of what it does for us
  * Overview of the two WorkFlows
	  * iOS 
	  * Android 

##### iOS XCode Modifications
  * **Video 3/7**:[XCode Modifications.mp4](here)
* XCode
	* Icons - Asset Catalog Creator Free - see App Store
	* Bundler ID
	* [ https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringYourApp/ConfiguringYourApp.html](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringYourApp/ConfiguringYourApp.html)
	* AppDelegate.m
	* Versioning
	* [https://developer.apple.com/library/ios/qa/qa1827/_index.html](https://developer.apple.com/library/ios/qa/qa1827/_index.html)
	* Automatic Certificate & Developement

##### XCode Certs Provision Profiles  App Id
  * **Video 4/7**:  [XCode Certs, Prov Profiles, AppId.mp4](here)
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
<a href="http://www.youtube.com/watch?feature=player_embedded&v=olfpwEjVlZ4" target="_blank"><img src="https://www.youtube.com/upload_thumbnail?v=olfpwEjVlZ4&t=2"
alt="Bitrise, YML, Profile, P12" width="240" height="180" border="10"
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
* **Video 6/7**: [ios Install from Email]()
* From device, open email app
* Open **letsconnect**
* Follow instructions to load in Safarie
* Follow prompts and enjoy!

##### Android Setup 
* **Video 7/7**: [Android YML, Setup](https://youtu.be/o4RQZodbzIU)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=o4RQZodbzIU"
target="_blank">
<img src="https://www.youtube.com/upload_thumbnail?v=o4RQZodbzIU&t=3"
alt="Snowflake Hot Loading" width="240" height="180" border="10"/>
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


