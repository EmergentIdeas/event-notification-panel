import tri from 'tripartite';

let init = false

let icons = {
	success: 'done'
	, error: 'error'
	, warning: 'warning'
	, info: 'info'
	, waiting: 'pending'
	, performing: 'swap_horiz'
	, unknown: 'question_mark'
}

export default function addJsTemplates() {
	
	if(!init) {
		init = true
		tri.addTemplate('@webhandle/event-notification-panel/utils/iconForStatus', (status) => {
			if(status in icons) {
				return icons[status]
			}
			if(!status) {
				return status
			}
			return icons.info
		})
	}

}