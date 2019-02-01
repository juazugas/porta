// @flow

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ServiceFeatureAccess } from 'Users/components/ServiceFeatureAccess'

Enzyme.configure({ adapter: new Adapter() })

let wrapper

function getWrapper (testProps) {
  const defaultProps = { value: '', onChange: jest.fn() }
  const props = { ...defaultProps, ...testProps }

  wrapper = mount(<ServiceFeatureAccess {...props} />)
}

beforeEach(() => {
  getWrapper()
})

afterEach(() => {
  wrapper.unmount()
})

it('should render itself', () => {
  expect(wrapper.find(ServiceFeatureAccess).exists()).toBe(true)
})

it('should render its children', () => {
  wrapper = mount(<ServiceFeatureAccess value='' onChange={jest.fn()}><div id={'child'}></div></ServiceFeatureAccess>)
  expect(wrapper.find('div#child').exists()).toBe(true)
})

it('should render only one checkbox when checked', () => {
  wrapper.setProps({ checked: true })

  const input = wrapper.find('input')
  expect(input).toHaveLength(1)
  expect(input.props().type).toEqual('checkbox')
  expect(input.props().checked).toBe(true)
})

it('should render a hidden input when checkbox unchecked', () => {
  wrapper.setProps({ checked: false })

  const inputs = wrapper.find('input')
  expect(inputs).toHaveLength(2)
  expect(inputs.last().props().type).toEqual('hidden')
  expect(inputs.last().props().name).toEqual('user[member_permission_service_ids][]')
})

it('should have the correct class', () => {
  expect(wrapper.find('li').hasClass(`FeatureAccessList-item--services`)).toBe(true)
})

it('should have the correct label', () => {
  expect(wrapper.find('label').props().htmlFor).toEqual(`user_member_permission_ids_services`)
})

it('should have proper name and id', () => {
  wrapper.setProps({ checked: true })

  const input = wrapper.find('input')
  expect(input.props().name).toEqual('user[member_permission_service_ids]')
  expect(input.props().id).toEqual(`user_member_permission_ids_services`)
})

it('should call onChange when clicking on it', () => {
  const onChange = jest.fn()
  wrapper.setProps({ checked: true, onChange })

  wrapper.find('input').simulate('change')

  expect(onChange).toHaveBeenCalledWith('services')
})
