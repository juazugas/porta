// @flow

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ServiceAccessList } from 'Users/components/ServiceAccessList'

Enzyme.configure({ adapter: new Adapter() })

let wrapper

function getWrapper (testProps) {
  const defaultProps = {}
  const props = { ...defaultProps, ...testProps }

  wrapper = mount(<ServiceAccessList {...props} />)
}

beforeEach(() => {
  getWrapper()
})

afterEach(() => {
  wrapper.unmount()
})

it('should render itself', () => {
  expect(wrapper.find(ServiceAccessList).exists()).toBe(true)
})

it('should render its children', () => {
  wrapper = mount(<ServiceAccessList><li id={'child'}></li></ServiceAccessList>)
  expect(wrapper.find('ol > li#child').exists()).toBe(true)
})

it('should have a list with class "ServiceAccessList--noServicePermissionsGranted" when permissions are not granted', () => {
  wrapper.setProps({ servicePermissionsGranted: false })
  expect(wrapper.find('ol.ServiceAccessList--noServicePermissionsGranted').exists()).toBe(true)
})
