import { UiPage } from '@servicenow/sdk/core'
import page from '../../client/spec-workbench/index.html'

UiPage({
    $id: Now.ID['ai-control-workbench'], category: 'general', endpoint: 'global_ai_control_workbench.do',
    description: 'Markdown authority workbench for AI development control.', direct: true,
    html: page,
})
