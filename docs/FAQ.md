## FAQ 

### Why did you use the RestAPI instead of the (JS-sdk | ParseReact)

I looked at it initially and, imo, it had too much magic.  For example, I couldn't see how I was going to isolate my JSX components easily and keep all my "state" in Redux.  ParseReact is right there in the middle of your JSX component which would tie me to a very particular vendor and implementation detail.  If I decided to later move away from ParseReact I'd have to rewrite a lot of code and tests.

Also, it had this statement

> Mutations are dispatched in the manner of Flux Actions, allowing updates to be synchronized between many different components without requiring views to talk to each other

I don't want to deal w/ wrapping my head around Flux Actions and have to monkey-patch or something to get Redux Actions.

In a previous life, I worked with Parse JS SDK and it's based on backbone.js.  So I didn't go that direction either, because, again, I didn't want to have another data model to deal with.  Plus, at the time I was using it, the SDK was buggy and it was difficult to work with. 

With the Parse Rest API, it's simple, can be tested itself from the command line with curl, it's clear, it's succinct and it's easily replaced with something else, an example such as Mongo/Mongoose without much, if any, impact on the code base.
