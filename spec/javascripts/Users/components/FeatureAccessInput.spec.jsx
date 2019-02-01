// @flow

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { FeatureAccessInput } from 'Users/components/FeatureAccessInput'

Enzyme.configure({ adapter: new Adapter() })

let wrapper

function getWrapper (testProps) {
  const defaultProps = {}
  const props = { ...defaultProps, ...testProps }

  wrapper = mount(<FeatureAccessInput {...props} />)
}

beforeEach(() => {
  getWrapper()
})

afterEach(() => {
  wrapper.unmount()
})

it('should render itself', () => {
  expect(wrapper.find(FeatureAccessInput).exists()).toBe(true)
})

it('should have noServicePermissionsGranted class when permission is not granted', () => {
  wrapper.setProps({ showServices: false })
  expect(wrapper.find('.FeatureAccessList--noServicePermissionsGranted').exists()).toBe(true)

  wrapper.setProps({ showServices: true })
  expect(wrapper.find('.FeatureAccessList--noServicePermissionsGranted').exists()).toBe(false)
})

it('should render its children', () => {
  wrapper = mount(<FeatureAccessInput><li id='child'></li></FeatureAccessInput>)
  expect(wrapper.find('ol > li#child').exists()).toBe(true)
})
