// @flow

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { RoleInput } from 'Users/components/RoleInput'

Enzyme.configure({ adapter: new Adapter() })

function getWrapper (children = []) {
  return mount(<RoleInput children={children}/>)
}

let roleInput

beforeEach(() => {
  roleInput = getWrapper()
})

afterEach(() => {
  roleInput.unmount()
})

it('should render itself', () => {
  expect(roleInput.find(RoleInput).exists()).toBe(true)
})

it('should have a radio optional', () => {
  expect(roleInput.find('.radio').exists()).toBe(true)
  expect(roleInput.find('.optional').exists()).toBe(true)
})

it('should render its children', () => {
  const children = ['Spiderman', 'Spiderpork', 'Spider-Noir'].map(opt => <div>{opt}</div>)

  const wrapper = getWrapper(children).find('ol').children()
  expect(wrapper).toHaveLength(children.length)
})
