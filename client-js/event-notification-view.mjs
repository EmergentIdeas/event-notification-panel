import { View } from '@webhandle/backbone-view'
import { simpleMessage, progressMessage, cancelMask } from "../views/load-browser-views.js"
import EventEmitter from '@webhandle/minimal-browser-event-emitter'
import NotificationStatus from "./notification-status.mjs"
import init from './init.mjs'

init()

/**
 * @property {EventTarget} notification Fires events on notification lifecycle and can trigger
 * rerendering. Events sent are: initialize, nodeAdd, render, expandMessage, cancel, startRemove, remove
 * It listens for the events: modelUpdate
 */
export default class EventNotificationView extends View {
	/**
	 * 
	 * @param {object} options 
	 * @param {object} options.model Could be anything, but probably a Notification object is best.
	 * @param {boolean} [options.closed] True if the event should start closed (true is default)
	 * @param {boolean} [options.ttl] The time to live in ms before this event is automatically removed
	 * 
	 */
	constructor(options = {}) {
		super(options)
	}

	preinitialize() {
		this.events = {
			'click .expand-message': 'expandMessage',
			'click .cancel-operation': 'cancelOperation',
			'click .remove-notification': 'removeSlowly'
		}
		this.className = 'event-notification-view'
		this.notification = new EventEmitter()
		this.notification.on('modelUpdate', this.modelUpdate.bind(this))
		
		/**
		 * The time by which we can assume that some failure occurred and
		 * this event will not be added.
		 */
		this.failToAddTime = 10000
	}

	initialize() {
		if (this.closed) {
			this.el.classList.add('closed')
		}
		this.notification.emit('initialize', this)
		if(this._isComplete()) {
			// We only want to set up ttl if we're complete
			this._setupWatchNodeInsertion()
		}
	}
	
	modelUpdate() {
		if(this._isProgressType()) {
			this.el.querySelector('.made').style.marginLeft = this.model.progressComplete + '%'
			this.el.querySelector('.numeric').innerText = '' + this.model.progressComplete
		}
	}
	
	_isComplete() {
		if(this.model.status === NotificationStatus.SUCCESS ||
			this.model.status === NotificationStatus.INFO ||
			this.model.status === NotificationStatus.WARNING ||
			this.model.status === NotificationStatus.UNKNOWN ||
			this.model.status === NotificationStatus.ERROR
			) {
				return true
			}
		return false
	}
	_isProgressType() {
		return this.model.progressComplete !== null && this.model.progressComplete !== undefined
	}
	
	/**
	 * 
	 * This is a big mess to listen for the add event for this.el
	 * We need to know when the event is added to be able to remove
	 * it after the ttl. It might be possible just to assume that the creation
	 * time represents the add time, and that's what I'll do if this is
	 * a performance drag. 
	 * 
	 * If not found to be added after 10 seconds, we'll clean up the observer
	 * so as not to leak memory and computation.
	 */
	_setupWatchNodeInsertion() {
		let disconnected = false
		const config = { attributes: false, childList: true, subtree: true };
		const observer = new MutationObserver((mutationList, observer) => {
			let found = false
			allMutations: for (let mutation of mutationList) {
				if (mutation.type === "childList" && mutation.addedNodes && mutation.addedNodes.length > 0) {
					for (let node of mutation.addedNodes.values()) {
						if (node == this.el) {
							found = true
							break allMutations
						}
					}
				}
			}
			if (found) {
				observer.disconnect()
				disconnected = true
				this.notification.emit('nodeAdd', this)
				if(this.ttl) {
					setTimeout(() => {
						this.removeSlowly()
					}, this.ttl)
				}
			}
		})
		observer.observe(document.body, config)
		
		setTimeout(() => {
			if(!disconnected) {
				observer.disconnect()
				disconnected = true
			}
		}, this.failToAddTime)	
	}

	render() {
		let templ
		if(this._isProgressType()) {
			templ = progressMessage
		}
		else {
			templ = simpleMessage
		}

		this.el.innerHTML = templ(this.model)
		this.notification.emit('render', this)
		return this
	}

	/**
	 * Show the additional information message.
	 */
	expandMessage() {
		this.el.classList.remove('closed')
		this.notification.emit('expandMessage', this)
	}

	/**
	 * Emit a 'cancel' event, add a mask that indicates it's being canceled
	 * and remove the cancel button
	 */
	cancelOperation() {
		this.notification.emit('cancel', this)
		this.el.querySelector('.notification').insertAdjacentHTML('beforeend', cancelMask())
		this.el.querySelector('.cancel-operation').remove()
	}
	
	remove() {
		if(this.el.parentElement) {
			this.notification.emit('remove', this)
			super.remove()
		}
	}

	/**
	 * Transition the notification to zero opacity and then remove
	 */
	removeSlowly() {
		this.notification.emit('startRemove', this)
		addEventListener("transitionend", (event) => {
			this.remove()
		})
		this.el.style.opacity = 0
	}
}