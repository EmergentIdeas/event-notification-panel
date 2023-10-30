import EventEmitter from '@webhandle/minimal-browser-event-emitter'
import tri from 'tripartite';
import templates from "../views/load-browser-views.js"
import addJsTemplates from './add-js-templates.js';

export default function init() {
	addJsTemplates()
	
}
