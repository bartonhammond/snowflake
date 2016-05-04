# Task Group [![Build Status](https://secure.travis-ci.org/bevry/taskgroup.png?branch=master)](http://travis-ci.org/bevry/taskgroup)
Group together synchronous and asynchronous tasks and execute them in either serial or parallel



## Install

### Backend

1. [Install Node.js](http://bevry.me/node/install)
2. `npm install --save taskgroup`

### Frontend

1. [See Browserify](http://browserify.org/)



## Usage

``` coffeescript
# Import
TaskGroup = require('taskgroup')

# Add tasks to the group and fire them in parallel
tasks = new TaskGroup (err,lastResult,results) -> console.log(err,lastResult,results)
tasks.push (complete) ->
	someAsyncFunction(arg1, arg2, complete)
tasks.push ->
	someSyncFunction(arg1, arg2)
tasks.run()  # can also use tasks.run('parallel')

# Add tasks to the group and fire them in serial
tasks = new TaskGroup (err,lastResult,results) -> console.log(err,lastResult,results)
tasks.push (complete) ->
	someAsyncFunction(arg1, arg2, complete)
tasks.push ->
	someSyncFunction(arg1, arg2)
tasks.run('serial')
```


## History
You can discover the history inside the [History.md](https://github.com/bevry/taskgroup/blob/master/History.md#files) file



## License
Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://creativecommons.org/licenses/MIT/)
<br/>Copyright © 2013+ [Bevry Pty Ltd](http://bevry.me)
<br/>Copyright © 2011-2012 [Benjamin Arthur Lupton](http://balupton.com)
