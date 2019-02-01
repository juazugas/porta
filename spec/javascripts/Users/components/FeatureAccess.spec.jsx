// @flow

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { FeatureAccess } from 'Users/components/FeatureAccess'

Enzyme.configure({ adapter: new Adapter() })

let wrapper

function getWrapper (testProps) {
  const defaultProps = { value: '', onChange: jest.fn() }
  const props = { ...defaultProps, ...testProps }

  wrapper = mount(<FeatureAccess {...props} />)
}

beforeEach(() => {
  getWrapper()
})

afterEach(() => {
  wrapper.unmount()
})

it('should render itself', () => {
  expect(wrapper.find(FeatureAccess).exists()).toBe(true)
})

it('should render its children', () => {
  wrapper = mount(<FeatureAccess value='' onChange={jest.fn()}><div id={'child'}></div></FeatureAccess>)
  expect(wrapper.find('div#child').exists()).toBe(true)
})

it('should render a checkbox checked or unchecked', () => {
  wrapper.setProps({ checked: true })
  expect(wrapper.find('input').props().type).toEqual('checkbox')
  expect(wrapper.find('input').props().checked).toBe(true)

  wrapper.setProps({ checked: false })
  expect(wrapper.find('input').props().type).toEqual('checkbox')
  expect(wrapper.find('input').props().checked).toBe(false)
})

it('should have the correct class depending on "value"', () => {
  const value = 'Spider-sense'
  wrapper.setProps({ value })

  expect(wrapper.find('li').hasClass(`FeatureAccessList-item--${value}`)).toBe(true)
})

it('should have the correct label depending on "value"', () => {
  const value = 'Spider-sense'
  wrapper.setProps({ value })

  expect(wrapper.find('label').props().htmlFor).toEqual(`user_member_permission_ids_${value}`)
})

it('should have the correct input name and id', () => {
  const value = 'Spider-sense'
  wrapper.setProps({ value })

  expect(wrapper.find('input').props().name).toEqual('user[member_permission_ids][]')
  expect(wrapper.find('input').props().id).toEqual(`user_member_permission_ids_${value}`)
})

it('should call onChange when clicking on it', () => {
  const value = 'Spider-sense'
  const onChange = jest.fn()
  wrapper.setProps({ value, onChange })

  wrapper.find('input').simulate('change')

  expect(onChange).toHaveBeenCalledWith(value)
})
