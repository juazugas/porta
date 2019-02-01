// @flow

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ServiceAccess } from 'Users/components/ServiceAccess'

Enzyme.configure({ adapter: new Adapter() })

let wrapper

function getWrapper (testProps) {
  const defaultProps = { checkedFeatures: [], onChange: jest.fn() }
  const props = { ...defaultProps, ...testProps }

  wrapper = mount(<ServiceAccess {...props} />)
}

const service = { id: 0, name: 'Superheroes API', link: '' }
const ADMIN_SECTIONS = ['plans', 'monitoring', 'partners']

beforeEach(() => {
  getWrapper({ service })
})

afterEach(() => {
  wrapper.unmount()
})

it('should render itself', () => {
  expect(wrapper.find(ServiceAccess).exists()).toBe(true)
})

it('should render its service name', () => {
  expect(wrapper.find('.ServiceAccessList-labelText').text()).toEqual(service.name)
})

it('should render a checkbox input', () => {
  const input = wrapper.find('input')
  expect(input.exists()).toBe(true)
  expect(input.props().type).toEqual('checkbox')
  expect(input.props().name).toEqual('user[member_permission_service_ids][]')
  expect(input.props().value).toEqual(service.id)
  expect(input.props().id).toEqual(`user_member_permission_service_ids_${service.id}`)
})

it('should call onChange with the service id when being checked', () => {
  const onChange = jest.fn()
  wrapper.setProps({ service, onChange })

  wrapper.find('input').simulate('change')

  expect(onChange).toHaveBeenCalledWith(service.id)
})

it('should render a list of admin sections, unavailable by default', () => {
  const sections = wrapper.find('AdminSection')
  expect(sections).toHaveLength(ADMIN_SECTIONS.length)
  expect(sections.everyWhere(n => !n.prop('available'))).toBe(true)
})

it('should render an admin section available if the feature is checked', () => {
  const feature = ADMIN_SECTIONS[0]

  wrapper.setProps({ checkedFeatures: [feature] })
  expect(wrapper.find(`AdminSection[name="${feature}"]`).prop('available')).toBe(true)

  wrapper.setProps({ checkedFeatures: [] })
  expect(wrapper.find(`AdminSection[name="${feature}"]`).prop('available')).toBe(false)
})
