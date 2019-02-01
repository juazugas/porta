// @flow

import * as React from 'react'

import { isServicePermissionsGranted } from 'Users/utils'

type Props = {
  value: string,
  checked?: boolean,
  onChange: string => void,
  children?: React.Node
}

const FeatureAccess = ({ value, checked = false, onChange, children }: Props) => {
  let liClass = `FeatureAccessList-item FeatureAccessList-item--${value} ${checked ? 'is-checked' : 'is-unchecked'}`
  let inputClass = `user_member_permission_ids ${isServicePermissionsGranted(value) ? 'user_member_permission_ids--service' : ''}`

  return (
    <li className={liClass}>
      <label htmlFor={`user_member_permission_ids_${value}`}>
        <input
          className={inputClass}
          name='user[member_permission_ids][]'
          id={`user_member_permission_ids_${value}`}
          value={value}
          type='checkbox'
          checked={checked}
          onChange={() => onChange(value)}
        />
        {children}
      </label>
    </li>
  )
}

export { FeatureAccess }
