// @flow

import React from 'react'

import type { Role } from 'Users/types'

type Props = {
  role: Role,
  label: string,
  checked: boolean,
  onChange: (role: Role) => void
}

const UserRole = ({ role, label, checked, onChange }: Props) => (
  <li>
    <label htmlFor={`user_role_${role}`}>
      <input
        className='roles_ids'
        name='user[role]'
        type='radio'
        id={`user_role_${role}`}
        checked={checked}
        value={role}
        onChange={({ currentTarget: { value } }) => onChange(value)}
      />
      {label}
    </label>
  </li>

)

export { UserRole }
