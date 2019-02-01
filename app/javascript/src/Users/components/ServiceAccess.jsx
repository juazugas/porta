// @flow

import React from 'react'

import { AdminSection } from 'Users/components/AdminSection'

import type { Service } from 'Types'

type Props = {
  service?: Service,
  checkedFeatures: string[],
  checked?: boolean,
  disabled?: boolean,
  onChange: number => void
}

const ServiceAccess = ({ service = {}, checkedFeatures, checked = false, disabled = false, onChange }: Props) => {
  const { id, name } = service

  return (
    <li className='ServiceAccessList-item'>
      <label className='ServiceAccessList-label is-checked' htmlFor={`user_member_permission_service_ids_${id}`}>
        <input
          className='user_member_permission_service_ids'
          id={`user_member_permission_service_ids_${id}`}
          name='user[member_permission_service_ids][]'
          type='checkbox'
          value={id}
          checked={checked}
          disabled={disabled}
          onChange={() => onChange(id)}
        />
        <span className='ServiceAccessList-labelText'>{name/* TODO: add extra space before */}</span>
      </label>
      <ul className='ServiceAccessList-sections'>
        <AdminSection name='plans' available={checkedFeatures.includes('plans')}>Integration & Application Plans</AdminSection>
        <AdminSection name='monitoring' available={checkedFeatures.includes('monitoring')}>Analytics</AdminSection>
        <AdminSection name='partners' available={checkedFeatures.includes('partners')}>Applications</AdminSection>
      </ul>
    </li>
  )
}

export { ServiceAccess }
