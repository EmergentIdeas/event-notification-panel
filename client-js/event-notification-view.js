import { View } from '@webhandle/backbone-view'
import { simpleMessage, progressMessage } from "../views/load-browser-views.js"
import EventEmitter from '@webhandle/minimal-browser-event-emitter'
import NotificationStatus from "./notification-status.js"


/**
 * @property {EventTarget} emitter Fires events on notification lifecycle and can trigger
 * rerendering. Events sent are: initialize, nodeAdd, render, expandMessage, startRemove, remove
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
			'click .remove-notification': 'removeSlowly'
		}
		this.className = 'event-notification-view'
		this.emitter = new EventEmitter()
		this.emitter.on('modelUpdate', this.modelUpdate.bind(this))
	}

	initialize() {
		if (this.closed) {
			this.el.classList.add('closed')
		}
		this.emitter.emit('initialize', this)
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
	
	_setupWatchNodeInsertion() {
		// This is a big mess to listen for the add event for this.el
		// We need to know when the event is added to be able to remove
		// it after the ttl. It might be possible just to assume that the creation
		// time represents the add time, and that's what I'll do if this is
		// a performance drag. 
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
				this.emitter.emit('nodeAdd', this)
				if(this.ttl) {
					setTimeout(() => {
						this.removeSlowly()
					}, this.ttl)
				}
			}
		})
		observer.observe(document.body, config)

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
		this.emitter.emit('render', this)
		return this
	}

	expandMessage() {
		this.el.classList.remove('closed')
		this.emitter.emit('expandMessage', this)
	}

	removeSlowly() {
		this.emitter.emit('startRemove', this)
		addEventListener("transitionend", (event) => {
			if(this.el.parentElement) {
				this.remove()
				this.emitter.emit('remove', this)
			}
		})
		this.el.style.opacity = 0
	}


}