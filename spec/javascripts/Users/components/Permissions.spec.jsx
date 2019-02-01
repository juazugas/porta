// @flow

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { Permissions } from 'Users/components/Permissions'

Enzyme.configure({ adapter: new Adapter() })

let wrapper

function getWrapper (testProps) {
  const defaultProps = { role: '', context: {} }
  const props = { ...defaultProps, ...testProps }

  wrapper = mount(<Permissions {...props} />)
}

beforeEach(() => {
  getWrapper({})
})

afterEach(() => {
  wrapper.unmount()
})

it('should render itself', () => {
  expect(wrapper.find(Permissions).exists()).toBe(true)
})
