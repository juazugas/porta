// @flow

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { UserRole } from 'Users/components/UserRole'

Enzyme.configure({ adapter: new Adapter() })

let wrapper

function getWrapper (testProps) {
  const defaultProps = { role: '', label: '', checked: false, onChange: ev => {} }
  const props = { ...defaultProps, ...testProps }

  wrapper = mount(<UserRole {...props} />)
}

beforeEach(() => {
  getWrapper({})
})

afterEach(() => {
  wrapper.unmount()
})

it('should render itself', () => {
  expect(wrapper.find(UserRole).exists()).toBe(true)
})

it('should render a radio button', () => {
  expect(wrapper.find('input').exists()).toBe(true)
  expect(wrapper.find('input').props().type).toBe('radio')
})

it('should render a label', () => {
  const label = 'Spidey'
  getWrapper({ label })

  expect(wrapper.find('label').exists()).toBe(true)
  expect(wrapper.find('label').text()).toEqual(label)
})

it('should render a radio button checked', () => {
  getWrapper({ checked: true })

  expect(wrapper.find('input').props().checked).toBe(true)
})

it('should call onChanged event with the proper value', () => {
  const role = 'superhero'
  const onChange = jest.fn()
  getWrapper({ role, onChange })

  wrapper.find('input').simulate('change')

  expect(onChange).toHaveBeenCalledWith(role)
})
