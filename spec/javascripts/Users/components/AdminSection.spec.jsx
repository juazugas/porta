// @flow

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { AdminSection } from 'Users/components/AdminSection'

Enzyme.configure({ adapter: new Adapter() })

let wrapper

function getWrapper (testProps) {
  const defaultProps = { name: '' }
  const props = { ...defaultProps, ...testProps }

  wrapper = mount(<AdminSection {...props} />)
}

beforeEach(() => {
  getWrapper()
})

afterEach(() => {
  wrapper.unmount()
})

it('should render itself', () => {
  expect(wrapper.find(AdminSection).exists()).toBe(true)
})

it('should render its children', () => {
  wrapper = mount(<AdminSection name={''} ><div id={'child'}></div></AdminSection>)
  expect(wrapper.find('li > div#child').exists()).toBe(true)
})

it('should render with the proper class depending on its name', () => {
  const name = 'Spidey'
  wrapper.setProps({ name })

  expect(wrapper.find('li').hasClass(`ServiceAccessList-sectionItem--${name}`)).toBe(true)
})

it('should render available or unavailable', () => {
  wrapper.setProps({ available: false })
  expect(wrapper.find('li').hasClass('is-unavailable')).toBe(true)

  wrapper.setProps({ available: true })
  expect(wrapper.find('li').hasClass('is-unavailable')).toBe(false)
})
