import init from './init.mjs'
import EventNotificationPanel from './event-notification-panel.mjs';

/**
 * 
 * @param {object} options
 * @param {string} options.notificationHolder The query selector for the holder of the
 * EventNotificationsPanel
 * @returns 
 */
export default function webhandleEnvSetup({notificationHolder = '#event-notifications'} = {}) {
	let webhandle = window.webhandle = window.webhandle || {}

	init()

	let holder = document.querySelector(notificationHolder)
	let panel = webhandle.eventPanel = new EventNotificationPanel()
	panel.appendTo(holder)
	panel.render()

	return panel
}
