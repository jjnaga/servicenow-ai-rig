(function executeRule(current) {
    if (String(current.getValue('u_state')) !== 'draft') return
    var service = new SnAiControlService()
    var enhancement = service.getRecord('u_sn_enhancement', current.getValue('u_enhancement'), 'enhancement')
    enhancement.setValue('u_current_spec', current.getUniqueValue())
    enhancement.setValue('u_gate_1_decision', service.requireChoice('u_sn_enhancement', 'u_gate_1_decision', 'pending'))
    enhancement.setValue('u_phase', service.requireChoice('u_sn_enhancement', 'u_phase', 'spec'))
    if (!enhancement.update()) gs.error('AI control: draft pointer update failed for ' + current.getUniqueValue())
    service.workNote(enhancement.getUniqueValue(), 'draft spec v' + current.getValue('u_version') + ' created')
})(current)
