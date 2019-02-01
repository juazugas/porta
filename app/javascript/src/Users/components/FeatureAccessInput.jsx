// @flow

import * as React from 'react'

type Props = {
  showServices?: boolean,
  children?: React.Node
}

const FeatureAccessInput = ({ showServices = false, children }: Props) => {
  const olClass = `FeatureAccessList ${showServices ? '' : 'FeatureAccessList--noServicePermissionsGranted'}`

  return (
    <fieldset>
      <legend className='label'><label>This user can access</label></legend>
      <ol className={olClass}>
        {children}
      </ol>
    </fieldset>
  )
}

export { FeatureAccessInput }
