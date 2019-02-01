// @flow

import * as React from 'react'

type Props = {
  checked?: boolean,
  onChange: string => void,
  children?: React.Node
}

const value = 'services'

const ServiceFeatureAccess = ({ checked = false, onChange, children }: Props) => {
  const liClass = `FeatureAccessList-item FeatureAccessList-item--${value} FeatureAccessList--noServicePermissionsGranted`

  // if service feature access checkbox is unchecked
  // at least blank service_ids array has to be sent
  const blankServiceIdsInput = checked ? null : <input type='hidden' name='user[member_permission_service_ids][]' />

  return (
    <li className={liClass}>
      <label htmlFor={`user_member_permission_ids_${value}`}>
        <input
          className='user_member_permission_ids'
          name='user[member_permission_service_ids]'
          id={`user_member_permission_ids_${value}`}
          attributes={{ value: '' }} /* TODO: what's this attribute for? */
          type='checkbox'
          checked={checked}
          onChange={() => onChange(value)}
        />
        {children}
      </label>
      {blankServiceIdsInput}
    </li>
  )
}

export { ServiceFeatureAccess }
