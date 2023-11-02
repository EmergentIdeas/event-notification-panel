import path from 'path'
let initialized = false

export default function setup(webhanle) {
	if(!initialized) {
		initialized = true
		webhandle.addStaticDir(path.join(webhandle.projectRoot, 'node_modules/@webhandle/event-notification-panel/public'), 
		{urlPrefix: '/@webhandle/event-notification-panel/resources'})
	}
}