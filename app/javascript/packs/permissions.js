import { render as renderPermissionsWidget } from 'Users/permissions'
import { PermissionsFormWrapper } from 'Users/components/PermissionsForm'

document.addEventListener('DOMContentLoaded', () => {
  window.PermissionsForm = PermissionsFormWrapper
  window.renderPermissionsWidget = renderPermissionsWidget
})
