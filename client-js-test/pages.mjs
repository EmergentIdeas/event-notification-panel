import init from '../client-js/index.js'

import EventEmitter from '@webhandle/minimal-browser-event-emitter'
import tri from 'tripartite';
import { simpleMessage } from "../views/load-browser-views.js"
import EventNotificationView from '../client-js/event-notification-view.js';
import notificationStatus from '../client-js/notification-status.js';
import not1 from './notification-1.js'
import not2 from './notification-2.js'

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function go() {
	init()



	let templates = document.querySelector('#templates')
	function addView(model) {
		let options = {
			model: model
			, closed: true
			, ttl: getRandomInt(2000) + 1000
		}
		let ev = new EventNotificationView(options)
		ev.render()
		ev.appendTo(templates)
		return ev
	}
	addView(not1)
	addView({ status: notificationStatus.ERROR })
	addView({ status: notificationStatus.WARNING })
	addView({ status: notificationStatus.INFO})
	addView({ status: notificationStatus.WAITING })
	let ev = addView(not2)
	
	function addToNot2() {
		ev.model.progressComplete = Math.min(2 + getRandomInt(10) + ev.model.progressComplete, 100)
		ev.emitter.emit('modelUpdate')
		if(ev.model.progressComplete < 100) {
			setTimeout(addToNot2, 500)
		}
	}
	setTimeout(addToNot2, 500)


}


if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", go);
}
else {
	go()
}




