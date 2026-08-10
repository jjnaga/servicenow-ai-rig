import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'ai-control-active-enhancements': {
                        table: 'sys_ux_list'
                        id: '2d2c633cb3ca483689e1fbc11954037d'
                    }
                    'ai-control-active-enhancements-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '7aff29f0d817498d9ba3f1a494ec015e'
                    }
                    'ai-control-active-jobs': {
                        table: 'sys_ux_list'
                        id: '4988bc49f02d44dca8da72ff4fa4a9e0'
                        deleted: true
                    }
                    'ai-control-active-jobs-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '53e60039a4664df7a4f678bbced0cce6'
                        deleted: true
                    }
                    'ai-control-api': {
                        table: 'sys_ws_definition'
                        id: 'a8a04fa443824371ae764dc4adccc952'
                    }
                    'ai-control-api-approve': {
                        table: 'sys_ws_operation'
                        id: 'c5bbb17b5cce41fdb9ab2246d2ffc7ca'
                    }
                    'ai-control-api-approve-token': {
                        table: 'sys_ws_header'
                        id: '7c90c46f268f495f8669b8c39327f5dd'
                    }
                    'ai-control-api-cancel': {
                        table: 'sys_ws_operation'
                        id: '7afaddc4ce5b4858af68c817320c1355'
                        deleted: true
                    }
                    'ai-control-api-cancel-token': {
                        table: 'sys_ws_header'
                        id: 'a61f8819dbf74376ac6817f830be5829'
                        deleted: true
                    }
                    'ai-control-api-changes-token': {
                        table: 'sys_ws_header'
                        id: 'e7379320203f4cb69cb79f5f948eda68'
                    }
                    'ai-control-api-claim': {
                        table: 'sys_ws_operation'
                        id: '16f6ccee22e5407bb10c9f615bf49957'
                    }
                    'ai-control-api-context': {
                        table: 'sys_ws_operation'
                        id: 'd332ebdb241147498b6feab2825e0230'
                    }
                    'ai-control-api-context-token': {
                        table: 'sys_ws_header'
                        id: '4cdf0c3f6183466eb7718925818f2d46'
                    }
                    'ai-control-api-execute': {
                        table: 'sys_security_acl'
                        id: 'b28be800ad0e4d558f289414bca420da'
                    }
                    'ai-control-api-finish': {
                        table: 'sys_ws_operation'
                        id: 'afa656d6bb1d4793b755a34faac3df58'
                    }
                    'ai-control-api-jobs': {
                        table: 'sys_ws_operation'
                        id: '52a37974d2c24f28902771689a7ce8a4'
                        deleted: true
                    }
                    'ai-control-api-jobs-token': {
                        table: 'sys_ws_header'
                        id: '423778c94ac041d8bff312f531e40ed3'
                        deleted: true
                    }
                    'ai-control-api-new-version': {
                        table: 'sys_ws_operation'
                        id: 'b88f917458ac484ab2fdab52e42c3ce3'
                    }
                    'ai-control-api-reject': {
                        table: 'sys_ws_operation'
                        id: '83a53fb217374a00a95be252e79a0ed4'
                    }
                    'ai-control-api-reject-token': {
                        table: 'sys_ws_header'
                        id: 'a522d953cac049b8beab13fe3901e184'
                    }
                    'ai-control-api-request-changes': {
                        table: 'sys_ws_operation'
                        id: '6d23d1696eb04d16b60b45ceef537bd2'
                    }
                    'ai-control-api-request-draft': {
                        table: 'sys_ws_operation'
                        id: '65a049397ffe452fa9bf3cf3097874fc'
                    }
                    'ai-control-api-request-draft-token': {
                        table: 'sys_ws_header'
                        id: '41c8ef03729a4f98875e24ddd39561fd'
                    }
                    'ai-control-api-retry': {
                        table: 'sys_ws_operation'
                        id: '3d24fbab0b504493a7f45b192b31754e'
                        deleted: true
                    }
                    'ai-control-api-retry-build': {
                        table: 'sys_ws_operation'
                        id: 'd0edaf308c46473693fbabf7df7e65df'
                    }
                    'ai-control-api-retry-build-token': {
                        table: 'sys_ws_header'
                        id: '200745cbe6d44ea486aa2bf701405fae'
                    }
                    'ai-control-api-retry-token': {
                        table: 'sys_ws_header'
                        id: '50e3e54b1959409b8692b62ed1b5451d'
                        deleted: true
                    }
                    'ai-control-api-save': {
                        table: 'sys_ws_operation'
                        id: '3718b93222bf4da58e7414c3d8163ca7'
                    }
                    'ai-control-api-save-token': {
                        table: 'sys_ws_header'
                        id: '9bc507d7462b4af3a3270421973dbcbf'
                    }
                    'ai-control-api-submit': {
                        table: 'sys_ws_operation'
                        id: 'afd1b86474304269abc8828f9a7d0865'
                    }
                    'ai-control-api-submit-token': {
                        table: 'sys_ws_header'
                        id: '98adb03e70f34a06bb406b2fbbb340d0'
                    }
                    'ai-control-api-token': {
                        table: 'sys_ws_header'
                        id: '12f20f4c43924c58b288bc076815e6c9'
                        deleted: true
                    }
                    'ai-control-api-v1': {
                        table: 'sys_ws_version'
                        id: '3b8e9e3c7edd45e0807b21d9bd3ecc01'
                    }
                    'ai-control-api-version-token': {
                        table: 'sys_ws_header'
                        id: '77343e5522e5498499fd2eb919c437d4'
                    }
                    'ai-control-approve-action': {
                        table: 'sys_ui_action'
                        id: '697cfa469c4444178242b6590a56e4d1'
                    }
                    'ai-control-approved-specs': {
                        table: 'sys_ux_list'
                        id: 'b52fa0a1ab174eb68e3d74bc6741eafc'
                    }
                    'ai-control-approved-specs-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '4a1e76feb42e407390b387f9423f109f'
                    }
                    'ai-control-attention-builds': {
                        table: 'sys_ux_list'
                        id: 'c79521dde2d64140abcc2db6e1daa747'
                    }
                    'ai-control-attention-builds-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'c28a786a5f074916a9dbf3c6cf302e78'
                    }
                    'ai-control-authority-bad': {
                        table: 'sys_atf_test'
                        id: '2878e1f965434e89b467b34044e90720'
                    }
                    'ai-control-authority-bad-script': {
                        table: 'sys_atf_step'
                        id: '4dc0dbdf4519479c9212404d97c06870'
                    }
                    'ai-control-authority-happy': {
                        table: 'sys_atf_test'
                        id: '22d99c5c10434e4a9255473b2c1fc7d3'
                    }
                    'ai-control-authority-happy-script': {
                        table: 'sys_atf_step'
                        id: '0a9365df59f34d8086302610cc70dcbe'
                    }
                    'ai-control-cancel-action': {
                        table: 'sys_ui_action'
                        id: 'ccedf52eb29d4a0fbaec562e2e6cdd8f'
                        deleted: true
                    }
                    'ai-control-changes-specs': {
                        table: 'sys_ux_list'
                        id: 'be5a191550624e11892d4540dd0785b8'
                    }
                    'ai-control-changes-specs-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'c178eeb1c9be475082954e4a6ef826eb'
                    }
                    'ai-control-claim-clock': {
                        table: 'sys_atf_test'
                        id: '2743398f4e6d48f08d16d5776e460995'
                    }
                    'ai-control-claim-clock-script': {
                        table: 'sys_atf_step'
                        id: '9acf98611c064f91aed8a55d40add8eb'
                    }
                    'ai-control-completed-jobs': {
                        table: 'sys_ux_list'
                        id: '54660ce7840247e9a3a29a2e12ab07cd'
                        deleted: true
                    }
                    'ai-control-completed-jobs-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '4edb841a526d474e990c3fe7147b55bc'
                        deleted: true
                    }
                    'ai-control-dashboard': {
                        table: 'par_dashboard'
                        id: '6e1193365b6d41f79cb63acac0edce1a'
                    }
                    'ai-control-dashboard-overview': {
                        table: 'par_dashboard_tab'
                        id: '5461a20f1e9e4e9786f1fb1f308556fe'
                    }
                    'ai-control-draft-spec-action': {
                        table: 'sys_ui_action'
                        id: '6572ca48a5b9435b9103fc31a13bb93a'
                    }
                    'ai-control-draft-specs': {
                        table: 'sys_ux_list'
                        id: '6021662988e84920bca6ad26952289fe'
                    }
                    'ai-control-draft-specs-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: 'e87491c003e64699ae3371bfe7803286'
                    }
                    'ai-control-enhancement-evidence-write': {
                        table: 'sys_security_acl'
                        id: 'f6419eda68a8406093a1b3d318525a14'
                    }
                    'ai-control-enhancement-gate-one-write': {
                        table: 'sys_security_acl'
                        id: '0351026339554754a421f0fe72abfe0d'
                    }
                    'ai-control-enhancement-gate-two-write': {
                        table: 'sys_security_acl'
                        id: 'c949143623584541bad9b7a958ae694b'
                    }
                    'ai-control-enhancement-phase-write': {
                        table: 'sys_security_acl'
                        id: 'f1b208fdc7d14964a2e476047779c347'
                    }
                    'ai-control-enhancement-read': {
                        table: 'sys_security_acl'
                        id: '7475e779874647ccba1c2aa808d55bc6'
                    }
                    'ai-control-enhancement-work-end-write': {
                        table: 'sys_security_acl'
                        id: '4ee67748a2854e89a08365e67adf3121'
                    }
                    'ai-control-enhancement-work-start-write': {
                        table: 'sys_security_acl'
                        id: '0134530cca834c108128c81b9ddaa316'
                    }
                    'ai-control-enhancement-write': {
                        table: 'sys_security_acl'
                        id: 'b554beafe1ee4acea24ba2d36a08f4d5'
                    }
                    'ai-control-event-build-attention': {
                        table: 'sysevent_register'
                        id: '6daaa76b1ce1466e83480d0de26f0518'
                    }
                    'ai-control-event-changes-requested': {
                        table: 'sysevent_register'
                        id: 'aac3ddeee85148dc8118d1384f5ce416'
                    }
                    'ai-control-event-job-failed': {
                        table: 'sysevent_register'
                        id: '1f8688cbe6d64dad8d9daa736927c220'
                        deleted: true
                    }
                    'ai-control-event-job-succeeded': {
                        table: 'sysevent_register'
                        id: 'e8d99bd85b3045ef933190b61d0ce31e'
                        deleted: true
                    }
                    'ai-control-event-review-needed': {
                        table: 'sysevent_register'
                        id: 'd123ebf0f56d4d019942067f035b9746'
                    }
                    'ai-control-event-stale-claim': {
                        table: 'sysevent_register'
                        id: '855d7cfd667c4ce7bf4c35d40fcf6ed4'
                        deleted: true
                    }
                    'ai-control-evidence-indicator': {
                        table: 'par_dashboard_widget'
                        id: 'fab2ecb8fa574474bcf468347aa5cea8'
                    }
                    'ai-control-execution-category': {
                        table: 'sys_ux_list_category'
                        id: '5fcf2f4720dd49cfa4ebd507d45b528e'
                    }
                    'ai-control-failed-indicator': {
                        table: 'par_dashboard_widget'
                        id: 'f22439975c8942829a6472186b5c78f3'
                    }
                    'ai-control-failed-jobs': {
                        table: 'sys_ux_list'
                        id: 'd564f7d9cf1449e8aa18b8ee12e7cccd'
                        deleted: true
                    }
                    'ai-control-failed-jobs-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '4a726e396e4944d3b8c00ecf5015394d'
                        deleted: true
                    }
                    'ai-control-heartbeat-control': {
                        table: 'sys_atf_test'
                        id: 'fe82519e4cae42acb26d3a48da5a8b8c'
                        deleted: true
                    }
                    'ai-control-heartbeat-control-script': {
                        table: 'sys_atf_step'
                        id: '1f34b09077f045d0ab858c429fd1c072'
                        deleted: true
                    }
                    'ai-control-immutable-bad': {
                        table: 'sys_atf_test'
                        id: 'ffedafdf694940e38e4a6dd6556167b2'
                        deleted: true
                    }
                    'ai-control-immutable-bad-script': {
                        table: 'sys_atf_step'
                        id: 'b1395ab6e47b4a09a21b3e5356bf4d0d'
                        deleted: true
                    }
                    'ai-control-intake-category': {
                        table: 'sys_ux_list_category'
                        id: 'aab0ecbaf45447768090d28c328429d1'
                    }
                    'ai-control-job-artifact-write': {
                        table: 'sys_security_acl'
                        id: '0d6de77ef32e44debcf415e212e4a021'
                        deleted: true
                    }
                    'ai-control-job-cancel-write': {
                        table: 'sys_security_acl'
                        id: '451784f7bda340069c910c01a2dcc66f'
                        deleted: true
                    }
                    'ai-control-job-commit-write': {
                        table: 'sys_security_acl'
                        id: '84bfac76cedf48daa8705d6347ac2086'
                        deleted: true
                    }
                    'ai-control-job-create': {
                        table: 'sys_security_acl'
                        id: '64bd7d6b152b43b7baefaa6f1cd054de'
                        deleted: true
                    }
                    'ai-control-job-error-write': {
                        table: 'sys_security_acl'
                        id: '3819b3a8dfb74c98b9cf9dfbd18cbfcf'
                        deleted: true
                    }
                    'ai-control-job-fields-write': {
                        table: 'sys_security_acl'
                        id: '2cb093b63e814165b3f46cc9ae19d88f'
                        deleted: true
                    }
                    'ai-control-job-finished-write': {
                        table: 'sys_security_acl'
                        id: '5c20b76b179044e68f5d49956fe0f880'
                        deleted: true
                    }
                    'ai-control-job-heartbeat-write': {
                        table: 'sys_security_acl'
                        id: '48e7bba7081a4996a0ab8b1e72541a2d'
                        deleted: true
                    }
                    'ai-control-job-lease-write': {
                        table: 'sys_security_acl'
                        id: 'a2baf9b113344cbcaa5ee792fc48c9cb'
                        deleted: true
                    }
                    'ai-control-job-notify': {
                        table: 'sys_script'
                        id: 'ec8d0dce1df14ccdb1ba8d4438f689ee'
                        deleted: true
                    }
                    'ai-control-job-read': {
                        table: 'sys_security_acl'
                        id: 'a48b7d6408f94cf1ad85cc8f0c2f246d'
                        deleted: true
                    }
                    'ai-control-job-result-write': {
                        table: 'sys_security_acl'
                        id: '682203b493334d8c96e4525075c2b316'
                        deleted: true
                    }
                    'ai-control-job-source-write': {
                        table: 'sys_security_acl'
                        id: '80084dcf4c8541d784a36482357c0b39'
                        deleted: true
                    }
                    'ai-control-job-started-write': {
                        table: 'sys_security_acl'
                        id: 'cf54d1f7b8c044c1bfd048f1baf54e37'
                        deleted: true
                    }
                    'ai-control-job-state-write': {
                        table: 'sys_security_acl'
                        id: '5e48411211794e508a15cc2df0ac5d4f'
                        deleted: true
                    }
                    'ai-control-job-step-write': {
                        table: 'sys_security_acl'
                        id: 'e5fd5057b6f1436c822f678fac46876e'
                        deleted: true
                    }
                    'ai-control-job-token-write': {
                        table: 'sys_security_acl'
                        id: 'd31c5f039c174b80952f0f1b47b713c5'
                        deleted: true
                    }
                    'ai-control-job-transition-guard': {
                        table: 'sys_script'
                        id: '7d6df6c831ec494ab83c9fcdda0a599c'
                        deleted: true
                    }
                    'ai-control-job-update-set-write': {
                        table: 'sys_security_acl'
                        id: 'f9a66368d6e145dfa3ba6c4e4b9744c5'
                        deleted: true
                    }
                    'ai-control-job-worker-write': {
                        table: 'sys_security_acl'
                        id: '6b9770c330df4a0fa78f4593981125cd'
                        deleted: true
                    }
                    'ai-control-job-write': {
                        table: 'sys_security_acl'
                        id: 'fd4edb73469e4acebbddfbf974e40285'
                        deleted: true
                    }
                    'ai-control-layout-approve': {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'c5e4550b7b274672be7a0060650495f8'
                    }
                    'ai-control-layout-cancel': {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'cae3068f9955496f830f6eedafa58602'
                        deleted: true
                    }
                    'ai-control-layout-changes': {
                        table: 'sys_ux_form_action_layout_item'
                        id: '22f3548018994600bb90451725b85dd9'
                    }
                    'ai-control-layout-draft': {
                        table: 'sys_ux_form_action_layout_item'
                        id: '82dfb23e5d3946bf91fbfac26f499a10'
                    }
                    'ai-control-layout-package': {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'edd978939a6e49379c8d0589ba87fa87'
                        deleted: true
                    }
                    'ai-control-layout-reject': {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'd3fd906ae72045d4b90fb64944a15c5a'
                    }
                    'ai-control-layout-retry': {
                        table: 'sys_ux_form_action_layout_item'
                        id: '569f8b9224e44567bf0f830f739ed7b1'
                        deleted: true
                    }
                    'ai-control-layout-retry-build': {
                        table: 'sys_ux_form_action_layout_item'
                        id: '78c6dd70cf9b4734b91dcc0667e7ac8d'
                    }
                    'ai-control-layout-verify': {
                        table: 'sys_ux_form_action_layout_item'
                        id: '3906a5d7b293426180f3958878df984b'
                        deleted: true
                    }
                    'ai-control-layout-version': {
                        table: 'sys_ux_form_action_layout_item'
                        id: 'b312bf87db5f4c1694de47fd87ab74b0'
                    }
                    'ai-control-lifecycle-control': {
                        table: 'sys_atf_test'
                        id: 'b3d5decbf083432b8ba42542e66ecd14'
                    }
                    'ai-control-lifecycle-control-script': {
                        table: 'sys_atf_step'
                        id: 'd409fa1926ac4bf5aceb2fe5f27b15d9'
                    }
                    'ai-control-list-menu': {
                        table: 'sys_ux_list_menu_config'
                        id: 'e840adeb6d7a45a68dacb9cae90426c2'
                    }
                    'ai-control-motion-indicator': {
                        table: 'par_dashboard_widget'
                        id: 'a3a321add9174a7e996da7b378d6481d'
                    }
                    'ai-control-my-enhancements': {
                        table: 'sys_ux_list'
                        id: '10c5a556d6344e6481dbecefd89f04fa'
                    }
                    'ai-control-my-enhancements-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '1df479610eaf454bbeba87da44178b3e'
                    }
                    'ai-control-new-version-action': {
                        table: 'sys_ui_action'
                        id: 'f8d1541d7fdd4c17a47eb5d1190bd301'
                    }
                    'ai-control-notify-build-attention': {
                        table: 'sysevent_email_action'
                        id: '4ee197d5140148d7a1dc5694a9ad05f1'
                    }
                    'ai-control-notify-changes': {
                        table: 'sysevent_email_action'
                        id: '0747c34e016242f29668cac1699d0e3c'
                    }
                    'ai-control-notify-failed': {
                        table: 'sysevent_email_action'
                        id: '5c66103a23b0495f96bcc702122b07ae'
                        deleted: true
                    }
                    'ai-control-notify-review': {
                        table: 'sysevent_email_action'
                        id: '8846a67df5a14f13b70852fec65c5aaa'
                    }
                    'ai-control-notify-stale': {
                        table: 'sysevent_email_action'
                        id: '41639491de9842e6ad6e77efaf06a824'
                        deleted: true
                    }
                    'ai-control-notify-succeeded': {
                        table: 'sysevent_email_action'
                        id: '6af59dfd3d2c4c109bb9ba662aca1788'
                        deleted: true
                    }
                    'ai-control-package-action': {
                        table: 'sys_ui_action'
                        id: '51540300fcdc4c90b6db118346a4a0d3'
                        deleted: true
                    }
                    'ai-control-pipeline-indicator': {
                        table: 'par_dashboard_widget'
                        id: '700c7b103db94c3891f2986e899404a3'
                    }
                    'ai-control-reject-action': {
                        table: 'sys_ui_action'
                        id: 'e7dc0e57bb52459683a514323a76f45a'
                    }
                    'ai-control-request-changes-action': {
                        table: 'sys_ui_action'
                        id: '966078c76fe34787bf88148e82de2887'
                    }
                    'ai-control-retry-action': {
                        table: 'sys_ui_action'
                        id: '0c4fdf4248424d8595198a9d55d6c22c'
                        deleted: true
                    }
                    'ai-control-retry-build-action': {
                        table: 'sys_ui_action'
                        id: '54525730ad4e44cea09120c7155e6f1b'
                    }
                    'ai-control-review-category': {
                        table: 'sys_ux_list_category'
                        id: '0ed933039ac9463c8c8960a2917a7b69'
                    }
                    'ai-control-review-indicator': {
                        table: 'par_dashboard_widget'
                        id: '65b24a3423964d6ead3b4fe801c3feb4'
                    }
                    'ai-control-review-specs': {
                        table: 'sys_ux_list'
                        id: '0811413b03384d59b337c0cbc977bca8'
                    }
                    'ai-control-review-specs-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '6c81be331aab418d92feb73c8e5f9370'
                    }
                    'ai-control-runner-decision-deny': {
                        table: 'sys_security_acl'
                        id: '113a1e71566847e2b66222a12859e3fa'
                    }
                    'ai-control-runner-decision-time-deny': {
                        table: 'sys_security_acl'
                        id: 'ca220a4ab4d84802a50bd279c6fad72f'
                    }
                    'ai-control-runner-gate-one-deny': {
                        table: 'sys_security_acl'
                        id: '465e5c04e32448a38ce08a7409bbea6b'
                    }
                    'ai-control-runner-gate-two-deny': {
                        table: 'sys_security_acl'
                        id: 'a82cb46d9871422cbfa5bd1ff0e7aef3'
                    }
                    'ai-control-runner-job-heartbeat-write': {
                        table: 'sys_security_acl'
                        id: '733637b58de64e469f237796fe77e7ed'
                        deleted: true
                    }
                    'ai-control-runner-job-machine-write': {
                        table: 'sys_security_acl'
                        id: '1d1906da52d54973bfb8b9ed033ed2e0'
                        deleted: true
                    }
                    'ai-control-runner-job-result-write': {
                        table: 'sys_security_acl'
                        id: '021c8fe8ffc14093870402e54713906c'
                        deleted: true
                    }
                    'ai-control-runner-job-token-write': {
                        table: 'sys_security_acl'
                        id: '24b6cd95b5af4914bffcfd8b0e4d837b'
                        deleted: true
                    }
                    'ai-control-running-builds': {
                        table: 'sys_ux_list'
                        id: 'b39ef8e4d9144acc910451c724ac981e'
                    }
                    'ai-control-running-builds-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '6eae670e08ce4c96a2e0d86e5a5a2067'
                    }
                    'ai-control-security-admin': {
                        table: 'sys_atf_step'
                        id: '2d3e0881cf9d47d8925cb4ab5f2fc2d6'
                    }
                    'ai-control-security-boundary': {
                        table: 'sys_atf_test'
                        id: '2b65f87d0ff2464f8821c92b6524f702'
                    }
                    'ai-control-security-claim-valid': {
                        table: 'sys_atf_step'
                        id: '432e0054cb4642fc8010aa7e46cc2c8c'
                    }
                    'ai-control-security-enhancement': {
                        table: 'sys_atf_step'
                        id: '4b23440190f94a158b0e193158bf93f9'
                    }
                    'ai-control-security-enhancement-delete': {
                        table: 'sys_atf_step'
                        id: '37514d4fcee64394882ea1534361e0f0'
                    }
                    'ai-control-security-job': {
                        table: 'sys_atf_step'
                        id: '994cedd6b73e4d7cb4a05060ec6d842e'
                        deleted: true
                    }
                    'ai-control-security-job-delete': {
                        table: 'sys_atf_step'
                        id: 'c89086fd17724b4292d05f76d077be7b'
                        deleted: true
                    }
                    'ai-control-security-key': {
                        table: 'sys_atf_step'
                        id: '36f84b856a3346a688c8a991716c264c'
                        deleted: true
                    }
                    'ai-control-security-runner': {
                        table: 'sys_atf_step'
                        id: '91b9124150004fadb393159a0f7d3f45'
                    }
                    'ai-control-security-runner-claim': {
                        table: 'sys_atf_step'
                        id: 'fc398d1bffff41a88a5c983bc21a053a'
                    }
                    'ai-control-security-runner-gate-denied': {
                        table: 'sys_atf_step'
                        id: '4b29499b99a74f82a4ee5bb379072e3f'
                    }
                    'ai-control-security-spec': {
                        table: 'sys_atf_step'
                        id: '1ec1d8fd0e4f4299931b97629fc9cc7c'
                    }
                    'ai-control-security-spec-delete': {
                        table: 'sys_atf_step'
                        id: '9b05686322d34d258600d03f10b9870b'
                    }
                    'ai-control-security-user': {
                        table: 'sys_atf_step'
                        id: 'f0a9f219dfa04a15a55654d2fc830081'
                    }
                    'ai-control-security-user-denied': {
                        table: 'sys_atf_step'
                        id: '94202fb2777146909c3f72230878d1df'
                    }
                    'ai-control-security-user-service-denied': {
                        table: 'sys_atf_step'
                        id: '202030f145464cd6b20662dec3b17cc6'
                    }
                    'ai-control-service': {
                        table: 'sys_script_include'
                        id: '3bfdf0b5b219413f94be08d0e0e49a78'
                    }
                    'ai-control-spec-create': {
                        table: 'sys_security_acl'
                        id: '13a42f75021848e98c0e12f968400b8e'
                    }
                    'ai-control-spec-decided-at-write': {
                        table: 'sys_security_acl'
                        id: '793c8bb781fc4956ac768e4e33af5e80'
                    }
                    'ai-control-spec-decided-by-write': {
                        table: 'sys_security_acl'
                        id: 'aa726872285a483eb1caf9700fbdfe78'
                    }
                    'ai-control-spec-draft-pointer': {
                        table: 'sys_script'
                        id: 'a4f92cda578943a2a54e4bb165b567c2'
                    }
                    'ai-control-spec-fields-write': {
                        table: 'sys_security_acl'
                        id: '45b99fb5211d441488d83ebd26461876'
                    }
                    'ai-control-spec-hash-write': {
                        table: 'sys_security_acl'
                        id: '75f1091dd66148fdb5c22e6ccd9842d8'
                    }
                    'ai-control-spec-immutable-guard': {
                        table: 'sys_script'
                        id: '55767cb2f835448db20c8ead235834e4'
                    }
                    'ai-control-spec-read': {
                        table: 'sys_security_acl'
                        id: 'b3b18cf3ecf4425382e69e4c26ab8f7c'
                    }
                    'ai-control-spec-review-notes-write': {
                        table: 'sys_security_acl'
                        id: '5aa7955f5de44440910db9a5185ba219'
                    }
                    'ai-control-spec-state-write': {
                        table: 'sys_security_acl'
                        id: 'a53412e7c3c64bf6a7977e307da72370'
                    }
                    'ai-control-spec-submitted-at-write': {
                        table: 'sys_security_acl'
                        id: '5a962b8ed4ca4ba1939699ef41abf080'
                    }
                    'ai-control-spec-submitted-by-write': {
                        table: 'sys_security_acl'
                        id: '97d7883959924685bdba3c4a269aad0d'
                    }
                    'ai-control-spec-write': {
                        table: 'sys_security_acl'
                        id: '2e23189897dc4d0fa2196ab8047e5cce'
                    }
                    'ai-control-stale-build-sweeper': {
                        table: 'sysauto_script'
                        id: '819fbdc3bd0e4cb09c8c32919e8b34ed'
                    }
                    'ai-control-submit-happy': {
                        table: 'sys_atf_test'
                        id: '6afcca60af8a468bb9f62b2483d1a7c1'
                        deleted: true
                    }
                    'ai-control-submit-happy-script': {
                        table: 'sys_atf_step'
                        id: 'f9070425a8854c618dc0189116b38ac7'
                        deleted: true
                    }
                    'ai-control-transition-contract': {
                        table: 'sys_atf_test'
                        id: '9a0562bffc2c4951aecf872fc8f017b6'
                        deleted: true
                    }
                    'ai-control-transition-contract-log': {
                        table: 'sys_atf_step'
                        id: '08277a7dc71949199f833a51899cd56f'
                        deleted: true
                    }
                    'ai-control-verify-action': {
                        table: 'sys_ui_action'
                        id: '4a69c94278fd434eb2f509164b71415b'
                        deleted: true
                    }
                    'ai-control-waiting-builds': {
                        table: 'sys_ux_list'
                        id: 'faaf9e1a1b4d4fb3ae58e1344f47b45f'
                    }
                    'ai-control-waiting-builds-audience': {
                        table: 'sys_ux_applicability_m2m_list'
                        id: '3b5ec21879b94bdeb4e24562ad3c74a3'
                    }
                    'ai-control-workspace': {
                        table: 'sys_ux_page_registry'
                        id: '46d590b621624a7d8b4dd747de951ef6'
                    }
                    'ai-control-workspace_sys_ux_app_config_workspace': {
                        table: 'sys_ux_app_config'
                        id: '60dfda253e034fe6a1e9aa645501e1a6'
                    }
                    'ai-control-workspace_sys_ux_app_route_home': {
                        table: 'sys_ux_app_route'
                        id: '69b739e8f4cb466e89ffac566aa999b2'
                    }
                    'ai-control-workspace_sys_ux_app_route_list': {
                        table: 'sys_ux_app_route'
                        id: 'ac632da831b141399f67ec028382425a'
                    }
                    'ai-control-workspace_sys_ux_app_route_record': {
                        table: 'sys_ux_app_route'
                        id: '60ec8b27e18e4b49b7f941603f03a9fe'
                    }
                    'ai-control-workspace_sys_ux_app_route_simple-list': {
                        table: 'sys_ux_app_route'
                        id: '77564cf53a6c42b183b687d04c73c83d'
                    }
                    'ai-control-workspace_sys_ux_macroponent_record': {
                        table: 'sys_ux_macroponent'
                        id: '4c1220dc79f64862ae85bace14cca06a'
                    }
                    'ai-control-workspace_sys_ux_page_property_chrome_footer': {
                        table: 'sys_ux_page_property'
                        id: '42335d9fbd4243fead5e6dd7e654da00'
                    }
                    'ai-control-workspace_sys_ux_page_property_chrome_header': {
                        table: 'sys_ux_page_property'
                        id: '4323371a9a184c2aacbbf1e6d171679e'
                    }
                    'ai-control-workspace_sys_ux_page_property_chrome_tab': {
                        table: 'sys_ux_page_property'
                        id: '0f0bb591e8de4066953287c849857705'
                    }
                    'ai-control-workspace_sys_ux_page_property_chrome_toolbar': {
                        table: 'sys_ux_page_property'
                        id: 'eb250cb2d0e442fea517933ed0aa58ef'
                    }
                    'ai-control-workspace_sys_ux_page_property_listConfigId': {
                        table: 'sys_ux_page_property'
                        id: '6ce0e47caec14f118b4c919500ff795d'
                    }
                    'ai-control-workspace_sys_ux_page_property_view': {
                        table: 'sys_ux_page_property'
                        id: 'dfd4b16f8e5744b09faf4e84b324b6b8'
                    }
                    'ai-control-workspace_sys_ux_page_property_wbApplicabilityConfigId': {
                        table: 'sys_ux_page_property'
                        id: 'b2028f4db1564dc9bce9c3451711ce5f'
                    }
                    'ai-control-workspace_sys_ux_registry_m2m_category_unifiedNav': {
                        table: 'sys_ux_registry_m2m_category'
                        id: 'ffe2429ad9a3468bb4de800577b49493'
                    }
                    'ai-control-workspace_sys_ux_screen_home': {
                        table: 'sys_ux_screen'
                        id: 'b41806c8dbba422fb7edcfea25cef31e'
                    }
                    'ai-control-workspace_sys_ux_screen_list': {
                        table: 'sys_ux_screen'
                        id: 'f710419b70e54c2c83ae8b292e43ff04'
                    }
                    'ai-control-workspace_sys_ux_screen_record': {
                        table: 'sys_ux_screen'
                        id: '8ca5a3a7a0874d1e86c542c18cdfb68e'
                    }
                    'ai-control-workspace_sys_ux_screen_simple-list': {
                        table: 'sys_ux_screen'
                        id: '553cc4f2a28e4953988a38cd4a36853d'
                    }
                    'ai-control-workspace_sys_ux_screen_type_home': {
                        table: 'sys_ux_screen_type'
                        id: 'e8e2aa9f66a246159a85fda7a43c9f89'
                    }
                    'ai-control-workspace_sys_ux_screen_type_list': {
                        table: 'sys_ux_screen_type'
                        id: 'c1aed0080d2f474fbbdb45a074d4c4a5'
                    }
                    'ai-control-workspace_sys_ux_screen_type_record': {
                        table: 'sys_ux_screen_type'
                        id: '62e504301bd6489ea3eae44db92e0e50'
                    }
                    'ai-control-workspace_sys_ux_screen_type_simple-list': {
                        table: 'sys_ux_screen_type'
                        id: 'fce3595b98a84f71ba2bbce3768d4de0'
                    }
                    'ai-control-workspace-audience': {
                        table: 'sys_ux_applicability'
                        id: '29b6a8ed6f6a4958b9e2158a084267ce'
                    }
                    'ai-control-workspace-route': {
                        table: 'sys_security_acl'
                        id: '26b545f2ebcf444c98ad245d41da143d'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '5fd99d68b39d46f6a90eccc8acbb5918'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '863a3ff4652d4dacb10ae73dea1e25b6'
                    }
                    'src_server_atf_authority-bad_server_js': {
                        table: 'sys_module'
                        id: '2cbeb5194ca24c9abc4a4d9b8600a76d'
                    }
                    'src_server_atf_authority-happy_server_js': {
                        table: 'sys_module'
                        id: '3a52484a351c4ce58c91fed7f935a5c9'
                    }
                    'src_server_atf_claim-clock_server_js': {
                        table: 'sys_module'
                        id: 'a51c871b3ed5408281eaaad8327bbe08'
                    }
                    'src_server_atf_lifecycle-control_server_js': {
                        table: 'sys_module'
                        id: 'bb2c93e4645b4a68944417ff44afaffd'
                    }
                    'src_server_business-rules_job-guard_server_js': {
                        table: 'sys_module'
                        id: 'bd8d40cd08fe414692f7dca2f6055233'
                        deleted: true
                    }
                    'src_server_business-rules_job-notify_server_js': {
                        table: 'sys_module'
                        id: '7f9adc35f307449e964ecd424b1a8879'
                        deleted: true
                    }
                    'src_server_business-rules_spec-draft-pointer_server_js': {
                        table: 'sys_module'
                        id: '5c9f5b96070c405da541dcefbef9fa27'
                    }
                    'src_server_business-rules_spec-guard_server_js': {
                        table: 'sys_module'
                        id: 'c830b2e9a3f2420d866453b01af8393a'
                    }
                    'src_server_script-includes_sn-ai-control-service_server_js': {
                        table: 'sys_module'
                        id: '3cd509d827704ce99dea370aa259fa3a'
                    }
                }
                composite: [
                    {
                        table: 'sys_documentation'
                        id: '00c71912b7fc4ba3b350c4d8dab8ff02'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_enhancement'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '02744ee573544e158b43a682ef621a13'
                        key: {
                            name: 'u_sn_enhancement'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0552cb32aea946d3b9e3e3ba35dc0e3f'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_heartbeat_at'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '05939584aa774554a309d3831d622c1f'
                        deleted: true
                        key: {
                            web_service_operation: '6d23d1696eb04d16b60b45ceef537bd2'
                            web_service_header: '12f20f4c43924c58b288bc076815e6c9'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '05e06233aaf2448281ddeed7930b2ddc'
                        deleted: true
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_17a72288df60220062fe6c7a4df26397'
                            id: '94202fb2777146909c3f72230878d1df'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '05f894cb772c487186be949b8249386b'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_state'
                            value: 'draft'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '06651c297ca24f10a915d27b6179882d'
                        deleted: true
                        key: {
                            sys_security_acl: '5e48411211794e508a15cc2df0ac5d4f'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '06df7fc7c068459a92820a60d9f245e6'
                        deleted: true
                        key: {
                            sys_security_acl: 'd31c5f039c174b80952f0f1b47b713c5'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '0762ab88da1a4c78a7d2408fd0b6ad21'
                        key: {
                            document_key: '4b23440190f94a158b0e193158bf93f9'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '08a12ebbd3fd4196bd61f3ef5adea40b'
                        deleted: true
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_17a72288df60220062fe6c7a4df26397'
                            id: 'fc398d1bffff41a88a5c983bc21a053a'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '09a1aa02a1cf4446b63c6ab2cc184710'
                        key: {
                            document_key: 'f0a9f219dfa04a15a55654d2fc830081'
                            variable: '8c07aba5ff6033008d3f5d9ad53bf13b'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0abaa845ee4d46aba1286ceb6397b17c'
                        key: {
                            sys_security_acl: 'ca220a4ab4d84802a50bd279c6fad72f'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0ac35b80b75d4f3eb45b712f3006a2fe'
                        key: {
                            sys_security_acl: '75f1091dd66148fdb5c22e6ccd9842d8'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0af83869f4ab40609ca59f8851b239ee'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_content_sha256'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '0b1479d78e2f4d0496467a3462fa9db3'
                        deleted: true
                        key: {
                            document_key: 'fc398d1bffff41a88a5c983bc21a053a'
                            variable: '501c8f535320220002c6435723dc34da'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0b4c2e26dc4f4ac591f0b8112b5bc677'
                        deleted: true
                        key: {
                            sys_security_acl: '5c20b76b179044e68f5d49956fe0f880'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0b4d197c28554a5bb10f857b9ef33378'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_priority'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '0c2d23b4e01e4746b2ee677e4c47153f'
                        deleted: true
                        key: {
                            name: 'global/spec-workbench/index.js.map'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0d3aaa38f42347e9bdb701b49be4a56c'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_decided_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0d54163cdec742448203d7acb40a7613'
                        deleted: true
                        key: {
                            sys_security_acl: 'fd4edb73469e4acebbddfbf974e40285'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '0dff91b092e84ccab0d457f06f9d364f'
                        deleted: true
                        key: {
                            document_key: '994cedd6b73e4d7cb4a05060ec6d842e'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0f9add64d7914a4f8d49ddf0f20fc2e1'
                        key: {
                            sys_security_acl: 'f1b208fdc7d14964a2e476047779c347'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '10216dd5c32c48adb93e4a31d3ac4389'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_finished_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'par_dashboard_canvas'
                        id: '10372f1c973545119b144014cd288fb3'
                        key: {
                            dashboard: '6e1193365b6d41f79cb63acac0edce1a'
                            dashboard_tab: '5461a20f1e9e4e9786f1fb1f308556fe'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '10862282c93241c4936a1f659bc9ec55'
                        key: {
                            sys_security_acl: '4ee67748a2854e89a08365e67adf3121'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '11f4b42ad82140aa8bbf0244d33644d9'
                        key: {
                            sys_security_acl: 'c949143623584541bad9b7a958ae694b'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '13aa1e82f6b24e07881475d44d32ab21'
                        deleted: true
                        key: {
                            web_service_operation: '83a53fb217374a00a95be252e79a0ed4'
                            web_service_header: '12f20f4c43924c58b288bc076815e6c9'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '14a2c10f30e7419a94bb1eb4da422434'
                        key: {
                            name: 'global_ai_control_workbench'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1507d0a82e864ef6a5840efe83b87b0f'
                        key: {
                            document_key: '4b29499b99a74f82a4ee5bb379072e3f'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '15c04784440a4bc29ac867181175b488'
                        key: {
                            sys_security_acl: 'f6419eda68a8406093a1b3d318525a14'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '15f6a2f673a44e6e87220fcb315462fa'
                        deleted: true
                        key: {
                            sys_security_acl: 'a48b7d6408f94cf1ad85cc8f0c2f246d'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '15f74b648f7c432ba0571072aa73fc61'
                        key: {
                            name: 'u_sn_enhancement'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '164063ff0e974ad8b888ac2d98cf3ebd'
                        deleted: true
                        key: {
                            document_key: 'c89086fd17724b4292d05f76d077be7b'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '17e6b613673745fe8870aafd811c3891'
                        key: {
                            sys_security_acl: '7475e779874647ccba1c2aa808d55bc6'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '18cfbcf8f12e46b6acb41bd460387af6'
                        deleted: true
                        key: {
                            sys_security_acl: '021c8fe8ffc14093870402e54713906c'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '19a425fd2fe848efb71f552c6a159bf9'
                        key: {
                            sys_security_acl: 'f1b208fdc7d14964a2e476047779c347'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1ab0a26f9a5a439dbfd72d237f8bd235'
                        deleted: true
                        key: {
                            sys_security_acl: '0d6de77ef32e44debcf415e212e4a021'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1cbbd160a3984c56929cb0694749d325'
                        deleted: true
                        key: {
                            sys_security_acl: '64bd7d6b152b43b7baefaa6f1cd054de'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1ce1c291455d4726bff98a8aeafff3da'
                        deleted: true
                        key: {
                            sys_security_acl: '48e7bba7081a4996a0ab8b1e72541a2d'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_index'
                        id: '1d6e61a817fa483b9325fe3504f92cf5'
                        key: {
                            logical_table_name: 'u_sn_spec_version'
                            col_name_string: 'u_enhancement,u_state,sys_created_on'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1dad7f89731a429d945ef2c527066f5f'
                        deleted: true
                        key: {
                            sys_security_acl: '733637b58de64e469f237796fe77e7ed'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1de5fccd3ec642b1aa07cb6c9eae2501'
                        key: {
                            sys_security_acl: '4ee67748a2854e89a08365e67adf3121'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1ea6c704051b4bd5b3be9266759e00fe'
                        key: {
                            document_key: '9b05686322d34d258600d03f10b9870b'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '1fe8c5430c9b4a5b960e378dae829e32'
                        key: {
                            application_file: '57aef7f3e0244040b715cb01dcd9a037'
                            source_artifact: 'c1525f9caba34a1d9eee9a70ec1ee1aa'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1ff376cb2bb84d4faa423392bd89fdf6'
                        deleted: true
                        key: {
                            document_key: '4b29499b99a74f82a4ee5bb379072e3f'
                            variable: 'bc4c43935320220002c6435723dc34a2'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2207ec94c0a445bdb6d4d076a89b503f'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_error_detail'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '26845fc5579545cea36ea8ea09c3d5ca'
                        key: {
                            name: 'u_sn_enhancement'
                            element: 'u_current_spec'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '27ca6f612bde48bb982fe284941ff843'
                        key: {
                            document_key: '1ec1d8fd0e4f4299931b97629fc9cc7c'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2801a3cc8b624dd0a14a1f1eceafece2'
                        key: {
                            document_key: '432e0054cb4642fc8010aa7e46cc2c8c'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '280d96b733634b1190c5a5fbb95c143d'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_content_sha256'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '2821c15f5f804e63bf40d199b2449515'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_state'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '282eae3155b047a2860369a45948a389'
                        key: {
                            document_key: '9acf98611c064f91aed8a55d40add8eb'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '291269fd059e4831967a2a70c9129620'
                        key: {
                            document_key: '4b23440190f94a158b0e193158bf93f9'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2d5564578f704bc482b27507d609baa8'
                        key: {
                            sys_security_acl: '2e23189897dc4d0fa2196ab8047e5cce'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2ddfaf080c434211b114e10ae392d358'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_priority'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2e848723bd394474ae960ea67c8ada01'
                        key: {
                            document_key: 'd409fa1926ac4bf5aceb2fe5f27b15d9'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2f3d7f4d77d84d87a5a5c38a344edbd1'
                        key: {
                            document_key: '432e0054cb4642fc8010aa7e46cc2c8c'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '30651de17e474b15b6218af35fda9464'
                        key: {
                            sys_security_acl: '13a42f75021848e98c0e12f968400b8e'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '30aaa935ab774a9e94ede03684133c95'
                        key: {
                            document_key: '91b9124150004fadb393159a0f7d3f45'
                            variable: '8c07aba5ff6033008d3f5d9ad53bf13b'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '31930b5ff8b24d3e8fbdf799f5e64595'
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            id: '37514d4fcee64394882ea1534361e0f0'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '31fd1721e4e5491d816874c125cc44d6'
                        deleted: true
                        key: {
                            ui_action: '4a69c94278fd434eb2f509164b71415b'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '321ab32f83fa49df85e40a80eeb62e19'
                        deleted: true
                        key: {
                            web_service_operation: 'b88f917458ac484ab2fdab52e42c3ce3'
                            web_service_header: '12f20f4c43924c58b288bc076815e6c9'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '32dc9c34bfab4cc69b29ccc167ecf2bb'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_state'
                            value: 'changes_requested'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '331b79a6aee64d19a1b5b789c6610ef5'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '34c2d10917d84738bbe1d2b4d43333a1'
                        key: {
                            sys_security_acl: '13a42f75021848e98c0e12f968400b8e'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '34f1287d4f344d75a00c52de4b6b1c91'
                        key: {
                            sys_security_acl: '0134530cca834c108128c81b9ddaa316'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '35c142206b434e64b905592cbac4d30f'
                        deleted: true
                        key: {
                            sys_ui_action: '4a69c94278fd434eb2f509164b71415b'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '362646b93dd44b528d9c346901a83a5c'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_error_detail'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '374f7a7005304233921fc9d572399868'
                        key: {
                            sys_security_acl: '5a962b8ed4ca4ba1939699ef41abf080'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '38b9f83278224e0994eb69dea00fe6b4'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_enhancement'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '39aab34050fd4a31af8b954a068cec53'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_commit_sha'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '3a966e8c02f54b559747974ab4bdf439'
                        key: {
                            sys_ui_action: '966078c76fe34787bf88148e82de2887'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '3b26d6a883f34cb99c4a9ca3da374ae1'
                        key: {
                            web_service_operation: 'afd1b86474304269abc8828f9a7d0865'
                            web_service_header: '98adb03e70f34a06bb406b2fbbb340d0'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '3b2d052ef6444dd2a7c25e56dfc5df12'
                        deleted: true
                        key: {
                            name: 'global/spec-workbench/index'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '3ca4a64d42934e7a9cf108573eded9c2'
                        key: {
                            sys_ui_action: '6572ca48a5b9435b9103fc31a13bb93a'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3cbb0c4f3e6e41cf97fe507b91ed3c92'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_review_notes'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3d01e5feb31c460a9868ccd16bc27f34'
                        deleted: true
                        key: {
                            document_key: '994cedd6b73e4d7cb4a05060ec6d842e'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '3d38c8f6d3fc41d293760e52c4c1c5d8'
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            id: '9b05686322d34d258600d03f10b9870b'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3ed3dbdd65dd47909d3da3b6a1593378'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_action'
                            value: 'verify'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '407c04d6d8124e2aa69f132d2aef8f05'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_submitted_at'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4141db197f9c410cb9a2dba1caba73b4'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_action'
                            value: 'build'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4237c9cb6774442ca3dc5162f9dee630'
                        deleted: true
                        key: {
                            document_key: 'fc398d1bffff41a88a5c983bc21a053a'
                            variable: '46dbcb535320220002c6435723dc3409'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '434f8ba30a124ca3a1c5ee4cd5a9c2d9'
                        key: {
                            document_key: '202030f145464cd6b20662dec3b17cc6'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '435f7721f7624806b5b25341f2c17e5f'
                        key: {
                            sys_security_acl: '97d7883959924685bdba3c4a269aad0d'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4542746b9ebf4068a004aa5c61ece44d'
                        key: {
                            name: 'u_sn_enhancement'
                            element: 'u_current_spec'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4656abc03bbf4762900af29b7b780747'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_action'
                            value: 'package_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '468ba3a2abd24d139972bfaaad755055'
                        key: {
                            name: 'u_sn_spec_version'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '485c7a177a664d49a7985a4469895e7c'
                        key: {
                            field: 'field_values'
                            table: 'var__m_atf_input_variable_14872288df60220062fe6c7a4df26319'
                            id: '1ec1d8fd0e4f4299931b97629fc9cc7c'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '48bedc891f064bdd8408b2665dab74cd'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_review_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '490d448eb20b41d8ab5a1d129e97b84b'
                        key: {
                            sys_security_acl: 'b554beafe1ee4acea24ba2d36a08f4d5'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '49a6aebddfe74937866381fd0bfac793'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4bdbc8e6134c4088b2a88723fa6b2e03'
                        deleted: true
                        key: {
                            sys_security_acl: 'e5fd5057b6f1436c822f678fac46876e'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '4ce015213b1842c5988c10fc869dd841'
                        key: {
                            name: 'global.ai_control_runner'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4dca026370f2410897b40174372c73c7'
                        deleted: true
                        key: {
                            sys_security_acl: 'cf54d1f7b8c044c1bfd048f1baf54e37'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4e7506a935744025b8c092330f9c4861'
                        key: {
                            document_key: '4dc0dbdf4519479c9212404d97c06870'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4ed6cab786f74e1f8fabcd18b47038b0'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_requested_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '508f2b05fb3a4f5286d8f65e9f3c112b'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_update_set_sys_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '519647b36c0b420fb1bd9c62248c4db8'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_spec_version'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '52667530d1104d9f8a8ddf1b38534b9e'
                        key: {
                            web_service_operation: '6d23d1696eb04d16b60b45ceef537bd2'
                            web_service_header: 'e7379320203f4cb69cb79f5f948eda68'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '52702aa9dfb94986a6b85c977edb8cfb'
                        key: {
                            document_key: '91b9124150004fadb393159a0f7d3f45'
                            variable: '98c44875ffa033008d3f5d9ad53bf1fa'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '535f7b1a7a5f44828e40b565ffad4d40'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_decided_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '53f2846eaa75474a9034c766ca5df9f2'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_commit_sha'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '5406710435d2420a832612d1760fa70e'
                        key: {
                            name: 'global/spec-workbench/main'
                        }
                    },
                    {
                        table: 'par_dashboard_visibility'
                        id: '54e60c05654041cead6b994060d24138'
                        key: {
                            dashboard: '6e1193365b6d41f79cb63acac0edce1a'
                            experience: '46d590b621624a7d8b4dd747de951ef6'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '55a4f84b1268492fa50f9bf82ae46d67'
                        key: {
                            document_key: '4b29499b99a74f82a4ee5bb379072e3f'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '55c37cce086947f2b9124b6f19a154a5'
                        deleted: true
                        key: {
                            sys_security_acl: 'fd4edb73469e4acebbddfbf974e40285'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5790c7912a83455586e59d0adf67782a'
                        key: {
                            document_key: '37514d4fcee64394882ea1534361e0f0'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '57aef7f3e0244040b715cb01dcd9a037'
                        key: {
                            name: 'global/spec-workbench/main.js.map'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '586bad7882cd4176a9dc728bd21c9547'
                        key: {
                            sys_security_acl: 'a53412e7c3c64bf6a7977e307da72370'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '58ad6f1bcec8455c8cff85c5bb0a36da'
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            id: '432e0054cb4642fc8010aa7e46cc2c8c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '597816484daa4ec2a5cd9ee00c0cdd25'
                        key: {
                            document_key: 'f0a9f219dfa04a15a55654d2fc830081'
                            variable: 'b27b2b29ff6033008d3f5d9ad53bf164'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: '5bfa5338e1a9408dac02042df419ba70'
                        key: {
                            logical_table_name: 'u_sn_spec_version'
                            col_name_string: 'u_enhancement,u_version'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '5c1bb7acd9ce44de9874f4f4c424547f'
                        key: {
                            web_service_operation: '83a53fb217374a00a95be252e79a0ed4'
                            web_service_header: 'a522d953cac049b8beab13fe3901e184'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5c9b3cc403894f03837ebcfb28df8c3f'
                        key: {
                            sys_security_acl: '26b545f2ebcf444c98ad245d41da143d'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5da16674fe63454e9477c48e3585c736'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_markdown'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5e041287e1d5414b94ff4fb543e45096'
                        deleted: true
                        key: {
                            document_key: '94202fb2777146909c3f72230878d1df'
                            variable: '501c8f535320220002c6435723dc34da'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '5e15b9f4a19847baa9900d4cc71ff2cc'
                        deleted: true
                        key: {
                            web_service_operation: '7afaddc4ce5b4858af68c817320c1355'
                            web_service_header: '12f20f4c43924c58b288bc076815e6c9'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5ede5de223c7476e867530eab3653fcd'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_commit_sha'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '604857d0948b41f4ba522b1c1e4fd5d3'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_state'
                            value: 'succeeded'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '60e211d9199f4fe6860924fd604b1257'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_state'
                            value: 'claimed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '62754dd3b58f46c48350b25c97b5e2ff'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_worker_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '627ea4b1649b4ffea69677503a4b7378'
                        deleted: true
                        key: {
                            document_key: '4b29499b99a74f82a4ee5bb379072e3f'
                            variable: '334b7bb7675003007ba405225685ef72'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '62916f5bf1564a37b46779be8e40f5f9'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_decided_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '630214ad35fc47eba369ccbc0ef20272'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_idempotency_key'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: '6356a5bfc93e41a58b0443196d23a287'
                        key: {
                            role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                            contains: '8536f54bc713330072b211d4d8c26080'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '64395b809b1048daa2e3e9c6860b5cfd'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_state'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '6497812e0871405b8dac54b7cb9d15f5'
                        key: {
                            ui_action: 'e7dc0e57bb52459683a514323a76f45a'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '66e13869114745418c4e8fe766b6ad3b'
                        key: {
                            document_key: '94202fb2777146909c3f72230878d1df'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '686bf2589a24423b96b31378ba2d87f3'
                        key: {
                            document_key: '37514d4fcee64394882ea1534361e0f0'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '696599729a204bce965aceffbd586f64'
                        key: {
                            application_file: '5406710435d2420a832612d1760fa70e'
                            source_artifact: 'c1525f9caba34a1d9eee9a70ec1ee1aa'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '6a1cfa6fe128467a94450609b6cc7a2a'
                        key: {
                            sys_ui_action: '54525730ad4e44cea09120c7155e6f1b'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6b4e74ce90d34baaa999f2b6309cc690'
                        key: {
                            document_key: '0a9365df59f34d8086302610cc70dcbe'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '6db61df7cf164a6aad110406b2e742a9'
                        key: {
                            sys_ui_action: 'f8d1541d7fdd4c17a47eb5d1190bd301'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '6dd868e6dd8642d1a516873c681a64fb'
                        deleted: true
                        key: {
                            sys_ui_action: '0c4fdf4248424d8595198a9d55d6c22c'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6de7a6f56821465cb8e971f849e2f309'
                        deleted: true
                        key: {
                            document_key: '1f34b09077f045d0ab858c429fd1c072'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '6dfa9070dcf2461ea310e8a80d777359'
                        deleted: true
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_17a72288df60220062fe6c7a4df26397'
                            id: '4b29499b99a74f82a4ee5bb379072e3f'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: '6ecab9cc67c240b2bcb02243b93cc7ce'
                        key: {
                            sys_ui_action: '697cfa469c4444178242b6590a56e4d1'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'par_dashboard_permission'
                        id: '6fcb02e2373a4fb1b10631b2deef1cf0'
                        key: {
                            dashboard: '6e1193365b6d41f79cb63acac0edce1a'
                            user: 'NULL'
                            group: 'NULL'
                            role: 'global.ai_control_user'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '719b45b556ad4d5fb06e2fac7a29fbb5'
                        deleted: true
                        key: {
                            ui_action: 'ccedf52eb29d4a0fbaec562e2e6cdd8f'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '71fe2f18b96342fea97eafbe1252ef1f'
                        key: {
                            document_key: '1ec1d8fd0e4f4299931b97629fc9cc7c'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '724f12b20ea94b4fba4f75b6452135c3'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_state'
                            value: 'superseded'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '72d8d370f5f847a484eeb056fd2daa34'
                        deleted: true
                        key: {
                            sys_security_acl: '451784f7bda340069c910c01a2dcc66f'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '75e588e216a346568a58749a868ab277'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_lease_until'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '76cf01b91c4c409cb3681436868a3b09'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_authored_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '76ddad15aa734483bc56edd854689de8'
                        key: {
                            document_key: '432e0054cb4642fc8010aa7e46cc2c8c'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '76e85fad721e4f51bae56c57b0c9fef1'
                        deleted: true
                        key: {
                            document_key: '994cedd6b73e4d7cb4a05060ec6d842e'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '77bef6a9967e45fbafb4c350e6091a1a'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_state'
                            value: 'running'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '789b7339dc9f4d4586e42ea12a17cd09'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_started_at'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7a6a1db10860486f8aca59dbd2dde3e2'
                        deleted: true
                        key: {
                            sys_security_acl: '2cb093b63e814165b3f46cc9ae19d88f'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7b11faa9708c4565a0dfe7f848b2bac8'
                        key: {
                            document_key: '91b9124150004fadb393159a0f7d3f45'
                            variable: 'b27b2b29ff6033008d3f5d9ad53bf164'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7c69a5447d4b43ffbe011a53a05edd51'
                        key: {
                            document_key: '9b05686322d34d258600d03f10b9870b'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7cf4f504adb14a7db5aa52987f39b482'
                        key: {
                            sys_security_acl: '2e23189897dc4d0fa2196ab8047e5cce'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7dfa17ef00e346e9b1141e29a26efbf9'
                        deleted: true
                        key: {
                            sys_security_acl: '3819b3a8dfb74c98b9cf9dfbd18cbfcf'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7ec8b32f8af34f41b2514dcd6155bbfd'
                        deleted: true
                        key: {
                            sys_security_acl: '5e48411211794e508a15cc2df0ac5d4f'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7f659f57f8314c0085687af38f28c3fa'
                        key: {
                            document_key: 'fc398d1bffff41a88a5c983bc21a053a'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8048ff908afa456ca4c92d94874012d3'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_repo_path'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '809c74b1a47a45f1832fc21534e40288'
                        deleted: true
                        key: {
                            document_key: '94202fb2777146909c3f72230878d1df'
                            variable: 'bc4c43935320220002c6435723dc34a2'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '821e706e63ca46819e78085aa6380653'
                        deleted: true
                        key: {
                            ui_action: '51540300fcdc4c90b6db118346a4a0d3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '824e3531306a46dfae7aeb4eca436ed6'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_decided_by'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '8320bfab5d31445e81b12e49027ffd1b'
                        key: {
                            ui_action: '966078c76fe34787bf88148e82de2887'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '83c2e30108454bde86e6b9a3c2dbef5a'
                        key: {
                            sys_security_acl: '45b99fb5211d441488d83ebd26461876'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8728c31ba360456c9e171236ed88387a'
                        key: {
                            document_key: '2d3e0881cf9d47d8925cb4ab5f2fc2d6'
                            variable: '586e2c4253e0220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '872b7f116ade465596196cbb77aa6707'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_heartbeat_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '87c9ee46cdfb4d4d97f634ee623993a7'
                        key: {
                            sys_security_acl: 'b3b18cf3ecf4425382e69e4c26ab8f7c'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8846a14008b041a9ab16874291c78620'
                        deleted: true
                        key: {
                            sys_security_acl: '24b6cd95b5af4914bffcfd8b0e4d837b'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '88e47d46fbd3486cada209a3a54b4101'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_state'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '88fc659c05fb4cf6a092acd6e3823b75'
                        deleted: true
                        key: {
                            document_key: 'c89086fd17724b4292d05f76d077be7b'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8b27dd1410854d1a9191740e6bdb1d98'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_enhancement'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '8b79fe93032244debbdc857b7481c624'
                        key: {
                            web_service_operation: 'c5bbb17b5cce41fdb9ab2246d2ffc7ca'
                            web_service_header: '7c90c46f268f495f8669b8c39327f5dd'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '8e6edabc55bc4f578534bdbd0578e243'
                        key: {
                            web_service_operation: '3718b93222bf4da58e7414c3d8163ca7'
                            web_service_header: '9bc507d7462b4af3a3270421973dbcbf'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8fc8f7586d5e4d8cbf571a3c26ff0ac6'
                        key: {
                            document_key: 'd409fa1926ac4bf5aceb2fe5f27b15d9'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8fd68c1370634a4e9e481a489fecf4c2'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_lease_until'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9012c1ef71e54c1ca83df07cb8cf6c4f'
                        deleted: true
                        key: {
                            document_key: '94202fb2777146909c3f72230878d1df'
                            variable: '53fb0f535320220002c6435723dc34ec'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '90177575ac414a18bb55f04f16119bc9'
                        deleted: true
                        key: {
                            sys_security_acl: 'b28be800ad0e4d558f289414bca420da'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '905e1e2da27146f18fb712ab4aea8274'
                        deleted: true
                        key: {
                            document_key: '4b29499b99a74f82a4ee5bb379072e3f'
                            variable: '46dbcb535320220002c6435723dc3409'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '9105be90dd7a4d01959e15be95e63273'
                        key: {
                            web_service_operation: 'b88f917458ac484ab2fdab52e42c3ce3'
                            web_service_header: '77343e5522e5498499fd2eb919c437d4'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '910dc73e46d140e29376c0efa8c1edaa'
                        key: {
                            sys_security_acl: '13a42f75021848e98c0e12f968400b8e'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '917b7c80c4eb4bf0b30cff11e3a862f0'
                        key: {
                            sys_security_acl: '465e5c04e32448a38ce08a7409bbea6b'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '93c45b41a55d496cb7c552de9bff405c'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '945274b7f76f4b7cbb9d40bab2fd8052'
                        deleted: true
                        key: {
                            document_key: 'b1395ab6e47b4a09a21b3e5356bf4d0d'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9652aaf467cc4495b8395bfd8a6c7e76'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_worker_id'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '97477bc9f8b24ee9872dc0e6d124021e'
                        deleted: true
                        key: {
                            sys_security_acl: 'f9a66368d6e145dfa3ba6c4e4b9744c5'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '976c4156bc564420a50d7c92e2165956'
                        deleted: true
                        key: {
                            sys_security_acl: 'a48b7d6408f94cf1ad85cc8f0c2f246d'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '992c20a254a2488fb4edafcc55d2e135'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_requested_by'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '994f296cf8b445879da60d1ce511248f'
                        key: {
                            sys_security_acl: '0134530cca834c108128c81b9ddaa316'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9959f8b206764b61af047c2adeeeaf5f'
                        key: {
                            document_key: '94202fb2777146909c3f72230878d1df'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '995f03b8ee874887af77a0fb57018e10'
                        key: {
                            sys_security_acl: '793c8bb781fc4956ac768e4e33af5e80'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9a1133a1bbb143dcbfae73cdd6579cfe'
                        key: {
                            document_key: '0a9365df59f34d8086302610cc70dcbe'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: '9b1bd868094c49f5b0d7c26d9f3171c4'
                        key: {
                            ui_action: 'f8d1541d7fdd4c17a47eb5d1190bd301'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9b385995b1b24e228f794028591144da'
                        key: {
                            document_key: 'f0a9f219dfa04a15a55654d2fc830081'
                            variable: 'ff06ab840f20101091d0f00c97767e6d'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9c0e6913deed42529b09e859e7cdc16e'
                        key: {
                            document_key: '91b9124150004fadb393159a0f7d3f45'
                            variable: '1778a7480f20101091d0f00c97767e03'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9c377bd2176b4824b140dbc0c94d831a'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_retry_of'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9c591c1f3d054da6be10baf6dd20a026'
                        deleted: true
                        key: {
                            sys_security_acl: '6b9770c330df4a0fa78f4593981125cd'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9c79b4cb5c4b46b89cc72b910f140fce'
                        deleted: true
                        key: {
                            document_key: '4b29499b99a74f82a4ee5bb379072e3f'
                            variable: '53fb0f535320220002c6435723dc34ec'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9da4b4c66f944cb1b68e337ada42eb02'
                        deleted: true
                        key: {
                            document_key: '1f34b09077f045d0ab858c429fd1c072'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9e10837f5d5e43ea8f7bb07f3e0ec4d3'
                        key: {
                            sys_security_acl: 'b3b18cf3ecf4425382e69e4c26ab8f7c'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9e62a6bcecf34337a73e64b5db854646'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '9e89834f8db94de4a0db7628d731cf58'
                        key: {
                            name: 'u_sn_spec_version'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9e9973036c594aee9c1984e52bd8644c'
                        deleted: true
                        key: {
                            document_key: '36f84b856a3346a688c8a991716c264c'
                            variable: '594393e4c3123300eaac11fe81d3aef0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9ea7b3697c494ad9b956dd169b40149b'
                        key: {
                            document_key: '1ec1d8fd0e4f4299931b97629fc9cc7c'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '9ea881c0ef87483fab9a110e847373d8'
                        deleted: true
                        key: {
                            web_service_operation: '52a37974d2c24f28902771689a7ce8a4'
                            web_service_header: '12f20f4c43924c58b288bc076815e6c9'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '9f304694999f49fea4b0977a939de9bf'
                        deleted: true
                        key: {
                            web_service_operation: '3d24fbab0b504493a7f45b192b31754e'
                            web_service_header: '50e3e54b1959409b8692b62ed1b5451d'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9f319b85b6b44196ab5bf91afa033928'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_source_digest'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: '9facde23ac134e1ab220cf627bda2814'
                        key: {
                            web_service_operation: 'd0edaf308c46473693fbabf7df7e65df'
                            web_service_header: '200745cbe6d44ea486aa2bf701405fae'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'a07038095f7a43c0aebcc553686b38c6'
                        deleted: true
                        key: {
                            field: 'field_values'
                            table: 'var__m_atf_input_variable_14872288df60220062fe6c7a4df26319'
                            id: '994cedd6b73e4d7cb4a05060ec6d842e'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a0efba1692df4aa089736183cd214897'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_state'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a294f1096094473584d72442f34578d5'
                        key: {
                            sys_security_acl: '26b545f2ebcf444c98ad245d41da143d'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a2c6d23bd2b2404daab7de5db6349291'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_source_digest'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: 'a3100750bf1e4185b6ab734710233877'
                        deleted: true
                        key: {
                            role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                            contains: {
                                id: '964315856a994c96b12355f17cf0264f'
                                key: {
                                    name: '8536f54bc713330072b211d4d8c26080'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a34b8f31e8a3401ea685164b56a8ec94'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_result_summary'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a556c5c7d4154ab5a281cd79cbdd65e9'
                        deleted: true
                        key: {
                            sys_security_acl: '2e23189897dc4d0fa2196ab8047e5cce'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a5f38b6c85e24d0b90b86fa05c71a7ca'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_claim_token'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a7a732dcd4194997a98bba51a2318446'
                        key: {
                            document_key: 'f0a9f219dfa04a15a55654d2fc830081'
                            variable: '1778a7480f20101091d0f00c97767e03'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a7cbd7e50eed43aca10b008b65fa971f'
                        deleted: true
                        key: {
                            document_key: 'b1395ab6e47b4a09a21b3e5356bf4d0d'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a848a4a1e3f64d5092a027f3eeeae55e'
                        key: {
                            sys_security_acl: 'b554beafe1ee4acea24ba2d36a08f4d5'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ab1d36e1ee0b4b30a37b9b021e198719'
                        key: {
                            name: 'u_sn_enhancement'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: 'ab3f55670797454f8a2a5f8fe1c82d12'
                        key: {
                            ui_action: '54525730ad4e44cea09120c7155e6f1b'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'ab961f3bcda34ae1a5d31487be83aff3'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'abfecce70ad84b69bcc8d595c01834aa'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_action'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: 'ac763195d21f4b94bceb23be092ec6ef'
                        deleted: true
                        key: {
                            web_service_operation: '7afaddc4ce5b4858af68c817320c1355'
                            web_service_header: 'a61f8819dbf74376ac6817f830be5829'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ad972ce19a1b4437a23f05678dc61e49'
                        key: {
                            sys_security_acl: 'a82cb46d9871422cbfa5bd1ff0e7aef3'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'adb57832db204153b37fb8594eaeccdd'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'aeb6ab925abd4a8c88936d881745dc93'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'af3d7639eb6c470a83792ab3816c1d8a'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_current_step'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'af9ccaf9f609454495356e6b3feaca2c'
                        key: {
                            document_key: '37514d4fcee64394882ea1534361e0f0'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'afe3365b2a4e47f2b565e1d285066899'
                        deleted: true
                        key: {
                            sys_ui_action: '51540300fcdc4c90b6db118346a4a0d3'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b0f1dfc046254083ad47850b032f8ced'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_requested_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b1958a8bdcac4978b89e72c1cdaafc65'
                        deleted: true
                        key: {
                            sys_security_acl: 'a2baf9b113344cbcaa5ee792fc48c9cb'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b2df10ba748546f4bb6fb10f741b33fb'
                        deleted: true
                        key: {
                            sys_security_acl: '682203b493334d8c96e4525075c2b316'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: 'b47924752a4947a790fe25aaa366ba80'
                        key: {
                            ui_action: '6572ca48a5b9435b9103fc31a13bb93a'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b52b9ee29bef47dd807302647d36f26d'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_title'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b594cdb344db4d20b4f4c983376eaa1d'
                        deleted: true
                        key: {
                            document_key: 'f9070425a8854c618dc0189116b38ac7'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b5b4096c328645e7b66cf44e63ba1ece'
                        deleted: true
                        key: {
                            document_key: '94202fb2777146909c3f72230878d1df'
                            variable: '334b7bb7675003007ba405225685ef72'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b6003ac52d304f5d8ad20cfe3d1290c2'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_enhancement'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b605b038df944659be17fba5bbfb8149'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_action'
                            value: 'revise_spec'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: 'b6464f7f76e145b9b736544feb93d875'
                        deleted: true
                        key: {
                            web_service_operation: 'c5bbb17b5cce41fdb9ab2246d2ffc7ca'
                            web_service_header: '12f20f4c43924c58b288bc076815e6c9'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b6d9cee5b17a40548af5ebc1a567e910'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_cancel_requested'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b785330af9e44e2e945cd7fd6e6b8d78'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_action'
                            value: 'draft_spec'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b8dcf066de434777b5d08046ca912bed'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_action'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: 'b9ad99968dcc4e2ca9d0ee2a9f90086b'
                        deleted: true
                        key: {
                            logical_table_name: 'u_sn_agent_job'
                            col_name_string: 'u_state,u_priority,u_requested_at'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b9c7ecb297e443b19b926f1ab54105f4'
                        key: {
                            sys_security_acl: 'f6419eda68a8406093a1b3d318525a14'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b9c924fa1d5a42fe95152c2c19d5d13c'
                        key: {
                            document_key: '432e0054cb4642fc8010aa7e46cc2c8c'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ba377cd159ae42bba5bf4739baf9e12a'
                        key: {
                            document_key: 'f0a9f219dfa04a15a55654d2fc830081'
                            variable: '1985e0ceff2433008d3f5d9ad53bf1ba'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: 'ba4fc2988b0b41afb62d7f3b6ce14231'
                        key: {
                            role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                            contains: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'bb4d94cb7e554cc5b0ac2a6b5c4fd9a8'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_action'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bb7e567bcbd24aec9c8dc6cefeb3dbad'
                        key: {
                            document_key: '9b05686322d34d258600d03f10b9870b'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bd6f3562584d4a9fa5b3f59ce377c124'
                        key: {
                            document_key: '1ec1d8fd0e4f4299931b97629fc9cc7c'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'befbad2e15f2447b894f9c00634f5703'
                        key: {
                            document_key: '202030f145464cd6b20662dec3b17cc6'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c05c99b3634441fd858b2a8d7cb47221'
                        deleted: true
                        key: {
                            sys_security_acl: '2cb093b63e814165b3f46cc9ae19d88f'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: 'c1525f9caba34a1d9eee9a70ec1ee1aa'
                        key: {
                            name: 'global_ai_control_workbench.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c163c10136854c0d83638523b310d798'
                        deleted: true
                        key: {
                            sys_security_acl: '451784f7bda340069c910c01a2dcc66f'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c24d98e969f842bfb1575baee9150c41'
                        deleted: true
                        key: {
                            sys_security_acl: '80084dcf4c8541d784a36482357c0b39'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c27b9ee1403142d69280a719d9f7c3e1'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_idempotency_key'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c2f6ea6dfed24b6698b933813094c63c'
                        key: {
                            sys_security_acl: '5aa7955f5de44440910db9a5185ba219'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c36def41758e4852840d7a4e3523b990'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_spec_version'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c39031de53f647dbb75c2fc35b674dcc'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_cancel_requested'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'c480a108c96241ad8caa1ec6818ee7a3'
                        key: {
                            sys_ui_action: 'e7dc0e57bb52459683a514323a76f45a'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c5def235de3c4a82806f549d31ea985e'
                        key: {
                            sys_security_acl: 'b28be800ad0e4d558f289414bca420da'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c66e67cf8b8f49c18758d472354fc340'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_update_set_sys_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c695e749b08c4c9ebb628c173511af78'
                        key: {
                            document_key: '9b05686322d34d258600d03f10b9870b'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c6dcecfd40d849268331e179f3b0d487'
                        key: {
                            document_key: '37514d4fcee64394882ea1534361e0f0'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c791c1b069094f838a2379e09f20c94e'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_state'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c7dd6cea3afc46dfa6bb2214894e3e12'
                        deleted: true
                        key: {
                            document_key: 'c89086fd17724b4292d05f76d077be7b'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c80aea6a5b6648619341bb5958f7a966'
                        key: {
                            document_key: 'fc398d1bffff41a88a5c983bc21a053a'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c90a900f5bd84ffca04908dcb579fc99'
                        key: {
                            document_key: '91b9124150004fadb393159a0f7d3f45'
                            variable: '6f69fc4aff6433008d3f5d9ad53bf18c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c976fcb7411d4fa48aa475ec3b3d87fe'
                        deleted: true
                        key: {
                            document_key: 'f9070425a8854c618dc0189116b38ac7'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c9ccdf37625c4c9a9189d0e766ad50d8'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_markdown'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c9fe1189b8f04c96b0dc5ef6af30eb0b'
                        deleted: true
                        key: {
                            document_key: '4b29499b99a74f82a4ee5bb379072e3f'
                            variable: '501c8f535320220002c6435723dc34da'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ca00762c99074525b3227266579e352f'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ca23f0cc6a5e4c7aafadd29e264c1191'
                        key: {
                            document_key: '91b9124150004fadb393159a0f7d3f45'
                            variable: 'ff06ab840f20101091d0f00c97767e6d'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ca44b3682e2e4edbaadf043a2c8d2ff3'
                        key: {
                            sys_security_acl: '45b99fb5211d441488d83ebd26461876'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cbfd08a903b04e0f91c391bfc5347421'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_requested_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cc31bdf5307c48e7b36d047863ec4eee'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_commit_sha'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ccca8b4a9d964350b5b5cfd8df620160'
                        key: {
                            sys_security_acl: 'aa726872285a483eb1caf9700fbdfe78'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'cd2b32eae5eb4e6aa0ea286bce20db8b'
                        deleted: true
                        key: {
                            sys_security_acl: '451784f7bda340069c910c01a2dcc66f'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'cd97966462494bcfae0c3c8d1c8f7769'
                        deleted: true
                        key: {
                            document_key: '94202fb2777146909c3f72230878d1df'
                            variable: '46dbcb535320220002c6435723dc3409'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'cfe8d53459324ef880e5c768d9fe50f6'
                        key: {
                            sys_security_acl: 'b28be800ad0e4d558f289414bca420da'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'cff1b1dafced4ef58dbf73b17a3e0cab'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_state'
                            value: 'failed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd03be2fa80984e8ba0debe5a7d9650fa'
                        key: {
                            sys_security_acl: 'f6419eda68a8406093a1b3d318525a14'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd17bb8ff880f492fa03bd9d5ef322678'
                        key: {
                            sys_security_acl: '0351026339554754a421f0fe72abfe0d'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd1fde441997a44d9a9f8d6ec9b2039a5'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_submitted_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'd2d8666876844fbfa3742e069385f4b4'
                        deleted: true
                        key: {
                            field: 'record_id'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            id: 'c89086fd17724b4292d05f76d077be7b'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd34ce05f1b704861bdae02fe92e0d25f'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_state'
                            value: 'queued'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: 'd39566e6138042108d2f632ee35d2b93'
                        deleted: true
                        key: {
                            web_service_operation: 'afd1b86474304269abc8828f9a7d0865'
                            web_service_header: '12f20f4c43924c58b288bc076815e6c9'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd4cd426fc73741c897d16a03cb47990a'
                        key: {
                            sys_security_acl: 'b3b18cf3ecf4425382e69e4c26ab8f7c'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd50ff45888644464b7aae0a9b862c12e'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_current_step'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd57cd240e99a467a8e8c47ebc9966789'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_authored_by'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: 'd75a1ee16a23435781fbbca7081a8e80'
                        deleted: true
                        key: {
                            web_service_operation: '3d24fbab0b504493a7f45b192b31754e'
                            web_service_header: '12f20f4c43924c58b288bc076815e6c9'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd7eb61d61a20411bb56b0cc1bbbfa6dc'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_started_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd7f4510f280246a28aac02ab61a541b2'
                        deleted: true
                        key: {
                            sys_security_acl: 'a48b7d6408f94cf1ad85cc8f0c2f246d'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd8979ce40e96497db305ff9eddb6154e'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_state'
                            value: 'approved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd94ede515b5847d28773c570d25be317'
                        key: {
                            document_key: '4b23440190f94a158b0e193158bf93f9'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'da1b4a8972764bc587b86937be0391f8'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_artifact_path'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'db7ebe8a9399454997f831ca23c5d4fa'
                        key: {
                            document_key: '432e0054cb4642fc8010aa7e46cc2c8c'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dc31bad6ac8a4268a8e27a541f4a9844'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_artifact_path'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dc503f6674b64328b63754a4faf65d32'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_submitted_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                        key: {
                            name: 'global.ai_control_reviewer'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'dcfb32a477224bb294c104758d51fca4'
                        deleted: true
                        key: {
                            sys_security_acl: '84bfac76cedf48daa8705d6347ac2086'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'de063caad6694b07a4fef1d634a74368'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_steering_note'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'de7922903ffb4127abfcc5b28e7616f8'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_finished_at'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'deedfdeb5415428f97eccf386e3849a5'
                        deleted: true
                        key: {
                            document_key: '08277a7dc71949199f833a51899cd56f'
                            variable: '523c79985f30220012b44adb7f46663a'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'df0468b46dc54e53867689ef3b2c808d'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_submitted_by'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'df237eaa39494c0dbce61d2d238d9103'
                        key: {
                            document_key: '4dc0dbdf4519479c9212404d97c06870'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'dfabec7cec8f42aba1bd91c4f4c78e46'
                        key: {
                            document_key: '9acf98611c064f91aed8a55d40add8eb'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e10654b13cee4ae9b975ac24dea9a9cb'
                        deleted: true
                        key: {
                            document_key: 'c89086fd17724b4292d05f76d077be7b'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e127e6a025c84958a1b1fdc78c954a16'
                        deleted: true
                        key: {
                            sys_security_acl: '64bd7d6b152b43b7baefaa6f1cd054de'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e1c806bb00fe4e9882ad662a75a0a5cd'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_repo_path'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e2341641f17043eaa4ae8f59822166a2'
                        deleted: true
                        key: {
                            document_key: 'fc398d1bffff41a88a5c983bc21a053a'
                            variable: 'bc4c43935320220002c6435723dc34a2'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e2faf33519ca47169fec657550872d73'
                        key: {
                            sys_security_acl: 'f1b208fdc7d14964a2e476047779c347'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: 'e391b25b88c4473e89d1af2ff7669074'
                        deleted: true
                        key: {
                            ui_action: '0c4fdf4248424d8595198a9d55d6c22c'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e5c40eb1b6fc4f3dab6e1c168c912531'
                        key: {
                            sys_security_acl: '7475e779874647ccba1c2aa808d55bc6'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: 'e5d4d3a8026640c88e100402498c58b2'
                        key: {
                            web_service_operation: 'd332ebdb241147498b6feab2825e0230'
                            web_service_header: '4cdf0c3f6183466eb7718925818f2d46'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e5e9f2a944184986843be526fa43180d'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_state'
                            value: 'in_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_action_role'
                        id: 'e6861ed59edc4c8fa3c18b94abb41813'
                        deleted: true
                        key: {
                            sys_ui_action: 'ccedf52eb29d4a0fbaec562e2e6cdd8f'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e6ef2405ac3944bcac151fc78bf45c7f'
                        key: {
                            sys_security_acl: '7475e779874647ccba1c2aa808d55bc6'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e73c3f74eea048c587c218dd2b05e7ff'
                        deleted: true
                        key: {
                            name: 'u_sn_enhancement'
                            element: 'u_current_job'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e771e3aeb43d4598bf22c7191373678c'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_state'
                            value: 'cancelled'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e7f9e336c98d4c4aae22c3252518c3a8'
                        key: {
                            document_key: 'f0a9f219dfa04a15a55654d2fc830081'
                            variable: '6f69fc4aff6433008d3f5d9ad53bf18c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ea3c459c6e45402cb80af432add2c815'
                        deleted: true
                        key: {
                            document_key: 'fc398d1bffff41a88a5c983bc21a053a'
                            variable: '334b7bb7675003007ba405225685ef72'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'eb00dbe7d5d246f48c1d813b119c67c2'
                        key: {
                            application_file: '14a2c10f30e7419a94bb1eb4da422434'
                            source_artifact: 'c1525f9caba34a1d9eee9a70ec1ee1aa'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: 'eb05a85a6fa14fcc9bbe7851c025dcd4'
                        deleted: true
                        key: {
                            role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                            contains: {
                                id: 'c0297fbb34454e87993af000a117400b'
                                key: {
                                    name: 'canvas_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ebe0230ffff94bc6bf9087b64b4c8fbb'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_steering_note'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ec077e1e62ff4da4a6c8c0f9775f79f1'
                        key: {
                            document_key: 'f0a9f219dfa04a15a55654d2fc830081'
                            variable: '98c44875ffa033008d3f5d9ad53bf1fa'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ec70afb1e3ef4c88ae8296604d21a5c6'
                        deleted: true
                        key: {
                            sys_security_acl: '1d1906da52d54973bfb8b9ed033ed2e0'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ee463e75dc54470495b566215d441f74'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_result_summary'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ef74e3d177f14c16a4410d08a292f868'
                        deleted: true
                        key: {
                            sys_security_acl: '5e48411211794e508a15cc2df0ac5d4f'
                            sys_user_role: {
                                id: 'dc8b51ad5dfd4872b1c61614ab72e5aa'
                                key: {
                                    name: 'global.ai_control_reviewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'efae7b5023cf47b38257835e8e50eaff'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f0648f07a229476882cbfb79bf16e96b'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_retry_of'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f0ac3a2e2e724aefa5b84f96edbcecde'
                        deleted: true
                        key: {
                            name: 'u_sn_agent_job'
                            element: 'u_claim_token'
                        }
                    },
                    {
                        table: 'sys_ux_form_action'
                        id: 'f13f449912e342fcb0508ba3df7ad6f1'
                        key: {
                            ui_action: '697cfa469c4444178242b6590a56e4d1'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f255b3769ab94b1a9ec1b8551a8cd53a'
                        key: {
                            document_key: '4b23440190f94a158b0e193158bf93f9'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f2a33a4faba043bb944d9ce790e4b159'
                        key: {
                            sys_security_acl: 'b554beafe1ee4acea24ba2d36a08f4d5'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f32d8fea990745749ae72253e03e0bdd'
                        deleted: true
                        key: {
                            document_key: 'fc398d1bffff41a88a5c983bc21a053a'
                            variable: '53fb0f535320220002c6435723dc34ec'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f3b7c3484bb44af083b5a53a01bf7ef9'
                        key: {
                            sys_security_acl: '0134530cca834c108128c81b9ddaa316'
                            sys_user_role: {
                                id: 'fac07573d39848088ad5e2f59ff67f27'
                                key: {
                                    name: 'global.ai_control_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: 'f666ae2fc29c4fc4b97427e26edde44e'
                        key: {
                            web_service_operation: '65a049397ffe452fa9bf3cf3097874fc'
                            web_service_header: '41c8ef03729a4f98875e24ddd39561fd'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f725d42de75b4740a6d75e65ea0f29d6'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_version'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: 'f8551cf98d4d4167910daed49d9c02b1'
                        deleted: true
                        key: {
                            logical_table_name: 'u_sn_agent_job'
                            col_name_string: 'u_idempotency_key'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fa8493950f0a43d3b0e61841142cb0bc'
                        deleted: true
                        key: {
                            name: 'u_sn_enhancement'
                            element: 'u_current_job'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'fac07573d39848088ad5e2f59ff67f27'
                        key: {
                            name: 'global.ai_control_user'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: 'fafe93a2a3c64756a3ce982c294b9a66'
                        deleted: true
                        key: {
                            logical_table_name: 'u_sn_agent_job'
                            col_name_string: 'u_enhancement,u_state'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'fc0e3dfa14884e7b863eb831e8e93dc5'
                        key: {
                            sys_security_acl: '4ee67748a2854e89a08365e67adf3121'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fc59fc24ab03463ba1e3f721bc645083'
                        key: {
                            document_key: '91b9124150004fadb393159a0f7d3f45'
                            variable: '1985e0ceff2433008d3f5d9ad53bf1ba'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fcce1836b908466a945f4d9f21383cf3'
                        deleted: true
                        key: {
                            document_key: '994cedd6b73e4d7cb4a05060ec6d842e'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_ws_header_map'
                        id: 'fd42e05fecbd4365a2983c44a3df417a'
                        deleted: true
                        key: {
                            web_service_operation: '52a37974d2c24f28902771689a7ce8a4'
                            web_service_header: '423778c94ac041d8bff312f531e40ed3'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'fdab3f7a0d9247fa940ae0fa9efd357a'
                        deleted: true
                        key: {
                            sys_security_acl: '64bd7d6b152b43b7baefaa6f1cd054de'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'fe02d96bbf384d6ca829038caae88a51'
                        deleted: true
                        key: {
                            sys_security_acl: 'fd4edb73469e4acebbddfbf974e40285'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'fe3ad94c8e7f473b9e4ac07592f37c3d'
                        key: {
                            sys_security_acl: '113a1e71566847e2b66222a12859e3fa'
                            sys_user_role: {
                                id: '4ce015213b1842c5988c10fc869dd841'
                                key: {
                                    name: 'global.ai_control_runner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ffc645b2fc98414091b47382bdc00667'
                        key: {
                            name: 'u_sn_spec_version'
                            element: 'u_version'
                            language: 'en'
                        }
                    },
                ]
            }
        }
    }
}
