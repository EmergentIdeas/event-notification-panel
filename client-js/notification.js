import NotificationStatus from "./notification-status.js"

/**
 * @property {string} status One of the values of NotificaitonStatus
 * @property {string} headline
 * @property {string} message
 * @property {integer} progressComplete How much progress has been made as percent. Needed only 
 * if this is supposed to show a progress notification.
 */
export default class Notification {
	constructor(options) {
		Object.assign(this, options)
	}
}