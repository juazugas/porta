// @flow

import * as React from 'react'

type Props = {
  children?: React.Node
}

const Permissions = ({ hide, children }: Props) => (
  <li className='radio optional' id='user_member_permissions_input'>
    {children}
  </li>
)

export { Permissions }
