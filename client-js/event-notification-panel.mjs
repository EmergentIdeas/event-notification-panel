import { View } from '@webhandle/backbone-view'
import EventNotificationView from './event-notification-view.mjs';

export default class EventNotificationPanel extends View {
	constructor(options) {
		super(options)
	}

	preinitialize() {
		this.className = 'webhandle-event-notifications'
	}

	render() {
		return this
	}
	
	removeAllNotifications() {
		this.el.innerHTML = ''
	}

	/**
	 * 
	 * @param {object} options 
	 * @param {object} options.model Represents the status data to show. Should be an instance of
	 * @webhandle/event-notification-panel/client-js/notification.js
	 * @param {integer} [options.ttl] The time in milliseconds to wait before removing the message
	 * automatically.
	 * @param {boolean} [options.closed] Controls whether the notification message starts closed. Default is true
	 * @returns An EventNotificationView object
	 */
	addNotification(options) {
		let ev = new EventNotificationView(options)
		ev.render()
		this.el.insertBefore(ev.el, this.el.firstChild)
		return ev
	}
}