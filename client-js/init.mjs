import addJsTemplates from './add-js-templates.mjs';

let initialized = false

export default function init() {

	if(!initialized) {
		initialized = true
		addJsTemplates()
	}
}
