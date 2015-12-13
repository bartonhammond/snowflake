# Continuous Integration with Bitrise.io

### This document provides the steps to take your app that was cloned or downloaded from snowflake and build both the iOS and Android applications.

#### First, I'd like to establish what this document does address and maybe, more importantly, what it doesn't.  

#### Assumptions
* Snowflake is a *starter app* so all tutorials are basic in nature
* There are a bizzilion ways of doing any of this - I'm showing one
* There's a number of CI sites, I chose Bitrise.io t
* The build will be done on Bitrise.io - not locally
* Local builds with Bitrise.io CLI is not addressed
* The **only** goal is to get the build to run on Bitrise.io


##### The things addressed
* Introduction to [https://www.bitrise.io/](https://www.bitrise.io/)
  * Overview of what it does for us
  * Overview of the two WorkFlows
	  * iOS 
	  * Android 
* iOS 
	* Configuring XCode
		* AppDelegate.m
		* Signing
		* Version #s
	* App Development Center
	* Generating  Certificates and Provision Profile
	* Download Certifications 
	* Update KeyChain
	* Save .p12
	* Download Provision
	* Load .p12 and provision to Bitrise.io
	* Setup Secret and Env Vars 
	* Import YML
	* Run build
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


