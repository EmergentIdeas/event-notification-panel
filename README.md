# Webhandle Event Notification Panel

A panel to display notifications to users on the screen. It's got the basic options
you'd need including message types, auto-disappearing mesages, user based removal
of messages, progress of ongoing processes, and user cancelation of ongoing
processes.

## Install

```bash
npm install @webhandle/event-notification-panel
```


## Usage

### As part of an application

#### HTML placement
```html
<div id="event-notifications"></div>
```

#### To include the styles

```less
@import "../node_modules/@webhandle/event-notification-panel/less/components.less";
```

or
```scss
@import "../node_modules/@webhandle/event-notification-panel/public/css/event-notification-panel.css";
```

#### In the client side js bundle:

```js
import {setup} from '@webhandle/event-notification-panel'
// or
// const setup = require('@webhandle/event-notification-panel').setup
let panel = setup({
	notificationHolder: '#event-notifications' /* Optional. The selector of the element to which the
												  panel should be added. */
})
panel.addNotification({
	model: {
		status: 'success',
		headline: 'message 1'
	}
})
```



## Options

### Panel Options

You can pass options to `EventNotificationPanel` which modify how the underlying `View` component work.
However, there are no creation options specific to the panel.

Options are available for the `addNotification` method.

```js
let eventView = panel.addNotification({
	model: notification /* the data to notify */
	, ttl: 2000 /* The time in milliseconds before the notification is automatically removed */
	, closed: true /* Determines whether the notification details are initially shown. Default is true */
})
```

### Notification options

The notification itself has some required data elements and many optional. Ideally you'd use `client-js/notification.mjs`
but that's not required.

```js
let eventView = panel.addNotification({
	model: {
		status: 'success' /* Required. Should be one of 'success', 'info', 'error', 'warning', 'waiting', or 'performing'.
							 Values 'waiting' and 'performing' are special in that they indicate a notification which should
							 NOT be automatically removed, even if a time to live (ttl) is specified. These types
							 indicate either an event where the code isn't able to offer information on when it will 
							 be complete (waiting), or an event where a progress bar should be shown to update the
							 user about progress (performing). */
		, headline: "Copy complete" 	/* Required. The main message to show the user */
		, message: "Copied file /a/b/c"	/* Optional. A detailed message which the user may or may not see. */
		, progressComplete: 0			/* Optional. An integer from 0 to 100 which indicates how much progress has been
										   made on this task. Update this value to change how much progress is shown
										   on the bar. The panel is told to update the html by triggering an event.*/
		, cancelable: true				/* Optional. If true, the event will show a cancel button which will allow the
										   user to cancel this task. */
	}
})
```


## Events

Events are available from the `EventNotificationView` object returned by the `addNotification` method.


```js
let eventView = panel.addNotification({
	model: {
		status: 'performing'
		, headline: "Copying file"
		, cancelable: true
	}
})

let emitter = eventView.notification
```

The `notification` object is a browser `EventTarget` extended with the `on` and `emit` methods familiar from
Node's `EventEmitter` class.

To indcate that the panel should update based on changed information in the model:

```js
emitter.emit('modelUpdate')
```

There are lifecycle events that code can listner for. All of the events have the pattern:

```js
emitter.on('eventName', function(eventNotificationViewObject) {
	// User's code
})
```

### Emitted Events

* initialize: The view's initialize method is being run
* nodeAdd: The view's root node is added to the DOM. This is an important internal event for calculating ttl.
* render: When the view is rendered
* expandMessage: The user has chosen to expand the notification to see the details
* cancel: The user has asked to cancel the operation
* startRemove: The panel has started visual effects to indicate that the event is being removed.
* remove: When the view's root element is being removed from the DOM. This does NOT delete the DOM fragment.


## Usage as a dynamically loaded component

This can also be used just by itself without being built into an application. This is not my primary current
use case, so I'm putting the documentation farther down so as not to crowd out the meat at the top, but it
works perfectly.

### On the server side

If you're using [webhandle](https://www.npmjs.com/package/webhandle) you can set everything up like:

```js
const webhandle = require('webhandle')
import('@webhandle/event-notification-panel').then(mod => {
	mod.default(webhandle)
})
```

Otherwise what you'll need to do is make the content from the module in `@webhandle/event-notification-panel/public`
available to the browser via the server. For this example that content is available at 
`/@webhandle/event-notification-panel/resources`



### HTML placement
```html
<div id="event-notifications"></div>
```

### Styles

```html
<link href="/@webhandle/event-notification-panel/resources/css/event-notification-panel.css" rel="stylesheet">
```

### Client side js
```html
<script type="module">
	import {setup} from '/@webhandle/event-notification-panel/resources/js/event-notification-panel.js'
	let panel = setup()
	panel.addNotification({
		model: {
			status: 'success',
			headline: 'message 1'
		}
	})
</script>
```

