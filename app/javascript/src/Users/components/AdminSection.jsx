// @flow

import * as React from 'react'

type Props = {
  name: string,
  available?: boolean,
  children?: React.Node
}

const AdminSection = ({ name, available = false, children }: Props) => {
  let adminSection = `ServiceAccessList-sectionItem ServiceAccessList-sectionItem--${name} ${available ? '' : 'is-unavailable'}`

  return (
    <li className={adminSection}>
      { children }
    </li>
  )
}

export { AdminSection }
