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
const notification = require('@webhandle/event-notification-panel')
let panel = notification.setup()
panel.addNotification({
	model: {
		status: 'success',
		headline: 'message 1'
	}
})
```
or

```js
import {setup} from '@webhandle/event-notification-panel'
let panel = setup()
panel.addNotification({
	model: {
		status: 'success',
		headline: 'message 1'
	}
})
```


### As a dynamically loaded component

#### On the server side

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



#### HTML placement
```html
<div id="event-notifications"></div>
```

#### Styles

```html
<link href="/@webhandle/event-notification-panel/resources/css/event-notification-panel.css" rel="stylesheet">
```

#### Client side js
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



