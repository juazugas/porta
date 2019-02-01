// @flow

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { Inputs } from 'Users/components/Inputs'

Enzyme.configure({ adapter: new Adapter() })

function getWrapper ({ name }) {
  return mount(<Inputs name={name} />)
}

let inputs

beforeEach(() => {
  inputs = getWrapper({ name: 'Foo' })
})

afterEach(() => {
  inputs.unmount()
})

it('should render itself', () => {
  expect(inputs.find(Inputs).exists()).toBe(true)
})

it('should have a legend with a name', () => {
  const name = 'Administrative'

  const legend = getWrapper({ name }).find('legend')
  expect(legend.exists()).toBe(true)
  expect(legend.text()).toEqual(name)
})
