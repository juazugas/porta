import * as React from 'react'

type Props = {
  children?: React.Node
}

const RoleInput = ({ children }: Props) => (
  <li className='radio optional' id='user_role_input'>
    <fieldset>
      <legend className='label'>
        <label>Role</label>
      </legend>
      <ol>{children}</ol>
    </fieldset>
  </li>

)

export { RoleInput }
