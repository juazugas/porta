// @flow

import * as React from 'react'

type Props = {
  showServices?: boolean,
  children?: React.Node
}

const ServiceAccessList = ({ showServices = false, children }: Props) => {
  let olClass = `ServiceAccessList ${showServices ? '' : 'ServiceAccessList--noServicePermissionsGranted'}`

  return (
    <fieldset>
      <ol className={olClass}>
        {children}
      </ol>
    </fieldset>
  )
}

export { ServiceAccessList }
