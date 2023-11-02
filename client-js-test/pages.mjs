import not1 from './notification-1.js'
import not2 from './notification-2.js'
import {assert} from 'chai'
import {setup, EventNotificationView, notificationStatus} from "../client-js/index.mjs"


function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function clone(obj) {
	return JSON.parse(JSON.stringify(obj))
}

let watchedEvents = ['initialize', 'nodeAdd', 'render', 'expandMessage', 'cancel', 'startRemove', 'remove']

let ttl = 0
let runTests = false

function watchForEvents(recordedEvents, targetEvents, emmitter) {
	function watch(event) {
		emmitter.on(event, () => {
			recordedEvents.push(event)
		})

	}
	for(let event of targetEvents) {
		watch(event)
	}
}

async function wait(time) {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			resolve()
		}, time)
	})
}


async function go() {
	let panel = setup()
	
	function addView(model) {
		let options = {
			model: model
			, closed: true
			, ttl: ttl || getRandomInt(2000) + 1000
		}
		return panel.addNotification(options)
	}
	if(!runTests) {

		addView(not1)
		addView({ status: notificationStatus.ERROR })
		addView({ status: notificationStatus.WARNING })
		addView({ status: notificationStatus.INFO})
		addView({ status: notificationStatus.WAITING })
		addView({ status: 'adslfkj'})
		let ev = addView(not2)
		
		function addToNot2() {
			ev.model.progressComplete = Math.min(2 + getRandomInt(10) + ev.model.progressComplete, 100)
			ev.notification.emit('modelUpdate')
			if(ev.model.progressComplete < 100) {
				setTimeout(addToNot2, 500)
			}
		}
		setTimeout(addToNot2, 500)
		
		let not22 = clone(not2)
		not22.cancelable = true
		addView(not22)	

	}
	
	// The above is a play and experiment space. Let's do some tests

	if(runTests) {

		panel.removeAllNotifications()
		
		// The panel should be empty now.
		assert.equal(panel.el.innerHTML, '')
		
		
		// Let's add an event
		panel.addNotification({
			model: not1
			, closed: true
		})
		
		assert.equal(panel.el.querySelector('.headline').innerText, not1.headline)
		assert.equal(panel.el.querySelector('.message').innerText, not1.message)
		
		// must wait for browser to apply the styles
		await wait(1)
		let styles = window.getComputedStyle(panel.el.querySelector('.message-holder'))
		assert.equal(styles.maxHeight, '0px')

		panel.el.querySelector('.remove-notification').click()
		
		// Wait for the remove effect to take place
		await wait(1000)
		
		// The panel should be empty now.
		assert.equal(panel.el.innerHTML, '')
		
		
		panel.addNotification({
			model: not1
			, closed: false
		})
		await wait(1)
		assert.equal(panel.el.querySelector('.headline').innerText, not1.headline)
		assert.equal(panel.el.querySelector('.message').innerText, not1.message)
		styles = window.getComputedStyle(panel.el.querySelector('.message-holder'))
		assert.equal(styles.maxHeight, '200px')
		panel.removeAllNotifications()
		

		// Let's see if we're getting events
		let evtView = new EventNotificationView({
			model: not1
			, closed: false
		})
		
		let recordedEvents = []
		watchForEvents(recordedEvents, watchedEvents, evtView.notification)
		
		evtView.render()
		panel.el.insertBefore(evtView.el, panel.el.firstChild)

		// must wait for browser to render
		await wait(100)
		

		panel.el.querySelector('.remove-notification').click()
		
		// Wait for the remove effect to take place
		await wait(2000)
		
		// The panel should be empty now.
		assert.equal(panel.el.innerHTML, '')
		
		assert.isTrue(recordedEvents.includes('render'))
		assert.isTrue(recordedEvents.includes('nodeAdd'))
		assert.isTrue(recordedEvents.includes('startRemove'))
		assert.isTrue(recordedEvents.includes('remove'))
		
		// Testing auto remove
		
		let evt = panel.addNotification({
			model: not1
			, closed: true
			, ttl: 200
		})
		
		recordedEvents = []
		watchForEvents(recordedEvents, watchedEvents, evt.notification)

		// Wait for the remove effect to take place
		await wait(2000)
		
		// The panel should be empty now.
		assert.equal(panel.el.innerHTML, '')
		
		assert.isTrue(recordedEvents.includes('startRemove'))
		assert.isTrue(recordedEvents.includes('remove'))

		let not22 = clone(not2)
		not22.cancelable = true
		evt = addView(not22)	

		recordedEvents = []
		watchForEvents(recordedEvents, watchedEvents, evt.notification)
		
		evt.el.querySelector('.cancel-operation').click()
		await wait(10)
		// Did we put up the cancel mask
		assert.isNotNull(evt.el.querySelector('.cancel-mask'))

		// did we emit the event
		assert.isTrue(recordedEvents.includes('cancel'))
		
		console.log('Looks like all the tests passed.')
	}
	
	
}

if(document.querySelector('#last-el')) {
	console.log('last el found')
}
else {
	console.log('last el missing')

}


if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", go);
}
else {
	go()
}

