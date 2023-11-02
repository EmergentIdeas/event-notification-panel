import NotificationStatus from "./notification-status.mjs"

/**
 * @property {string} status One of the values of NotificaitonStatus
 * @property {string} headline
 * @property {string} message
 * @property {integer} progressComplete How much progress has been made as percent. Needed only 
 * if this is supposed to show a progress notification.
 * @param {boolean} [options.cancelable] True if the operation can be canceled and a cancel button should
 * be shown. The default is false. This will only effect notifcations which are not complete.
 */
export default class Notification {
	constructor(options) {
		Object.assign(this, options)
	}
}