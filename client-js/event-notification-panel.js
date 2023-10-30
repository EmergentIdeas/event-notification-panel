import { View } from '@webhandle/backbone-view'
import tri from 'tripartite'
import {test1, test2} from "../views/load-browser-views.js"

export default class EventNotificationPanel extends View {
	constructor(options) {
		super(options)
	}

	preinitialize() {
		this.events = {
			'click .one': 'oneClicked',
			'click .': function (evt) {
				console.log(`${this.model} it got clicked`)
			}
		}
	}

	render() {
		this.el.innerHTML = "$" + `<span id="${this.id}one" class="one"><span id="${this.id}two" class="two">${parseFloat(this.model)}</span></span>`
		return this
	}

	oneClicked(evt, selected) {
		console.log(`one clicked ${selected.id}`)
	}


}