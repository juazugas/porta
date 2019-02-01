// @flow

import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { PermissionsForm } from 'Users/components/PermissionsForm'
import { Permissions } from 'Users/components/Permissions'

Enzyme.configure({ adapter: new Adapter() })

function getWrapper (testProps) {
  const defaultProps = { initialState: {}, features: [], services: [] }
  const props = { ...defaultProps, ...testProps }

  wrapper = mount(<PermissionsForm { ...props } />)
}

let wrapper

beforeEach(() => {
  getWrapper()
})

afterEach(() => {
  wrapper.unmount()
})

it('should render itself', () => {
  expect(wrapper.find(PermissionsForm).exists()).toBe(true)
})

it('should do nothing if selecting the same role twice', () => {
  expect(wrapper.state('role')).toEqual('admin')
  wrapper.find('input#user_role_admin').simulate('change')
  expect(wrapper.state('role')).toEqual('admin')
})

it('should be able to change the role', () => {
  expect(wrapper.state('role')).toEqual('admin')
  wrapper.find('input#user_role_member').simulate('change')
  expect(wrapper.state('role')).toEqual('member')
})

describe('when role is "admin"', () => {
  beforeEach(() => {
    wrapper.setState({ role: 'admin' })
  })

  it('should render no permissions', () => {
    expect(wrapper.find(Permissions).exists()).toBe(false)
  })
})

describe('when role is "member"', () => {
  beforeEach(() => {
    wrapper.setState({ role: 'member' })
  })

  it('should render a hidden input alongside Features', () => {
    expect(wrapper.containsMatchingElement(
      <input type={'hidden'} name={'user[member_permission_ids][]'} />
    )).toBe(true)
  })

  it('should render the given features', () => {
    wrapper.setProps({ features: ['portal', 'finance', 'settings'] })

    // $FlowFixMe: waiting for https://github.com/facebook/flow/pull/7298 to be merged
    expect(wrapper.containsAllMatchingElements([
      <input id={'user_member_permission_ids_portal'} />,
      <input id={'user_member_permission_ids_finance'} />,
      <input id={'user_member_permission_ids_settings'} />
    ])).toBe(true)

    // $FlowFixMe: waiting for https://github.com/facebook/flow/pull/7298 to be merged
    expect(wrapper.containsAllMatchingElements([
      <input id={'user_member_permission_ids_partners'} />,
      <input id={'user_member_permission_ids_monitoring'} />,
      <input id={'user_member_permission_ids_plans'} />
    ])).not.toBe(true)

    wrapper.setProps({ features: ['partners', 'monitoring', 'plans'] })

    // $FlowFixMe: waiting for https://github.com/facebook/flow/pull/7298 to be merged
    expect(wrapper.containsAllMatchingElements([
      <input id={'user_member_permission_ids_partners'} />,
      <input id={'user_member_permission_ids_monitoring'} />,
      <input id={'user_member_permission_ids_plans'} />
    ])).toBe(true)

    // $FlowFixMe: waiting for https://github.com/facebook/flow/pull/7298 to be merged
    expect(wrapper.containsAllMatchingElements([
      <input id={'user_member_permission_ids_portal'} />,
      <input id={'user_member_permission_ids_finance'} />,
      <input id={'user_member_permission_ids_settings'} />
    ])).not.toBe(true)
  })

  /* TODO: Not sure if should throw an error */
  it('should throw an error if a feature is not known', () => {
    const test = () => wrapper.setProps({ features: ['Some Random Feature'] })
    expect(test).toThrowError()
  })

  it('should have no checked features by default', () => {
    const features = ['portal', 'finance', 'settings']
    wrapper.setProps({ features })
    expect(wrapper.state('checkedFeatures')).toEqual([])

    expect(wrapper.find('.user_member_permission_ids').length).toBeGreaterThan(0)
    expect(wrapper.find('.user_member_permission_ids').some('[checked="true"]')).toBe(false)
  })

  it('should be able to select features', () => {
    const features = ['portal', 'finance', 'settings']
    wrapper.setProps({ features })
    wrapper.setState({ checkedFeatures: [] })

    wrapper.find('.user_member_permission_ids').first().simulate('change')
    expect(wrapper.state('checkedFeatures')).toHaveLength(1)

    wrapper.find('.user_member_permission_ids').first().simulate('change')
    expect(wrapper.state('checkedFeatures')).toHaveLength(0)

    wrapper.find('.user_member_permission_ids').at(1).simulate('change')
    expect(wrapper.state('checkedFeatures')).toHaveLength(1)
    wrapper.find('.user_member_permission_ids').at(2).simulate('change')
    expect(wrapper.state('checkedFeatures')).toHaveLength(2)
    wrapper.find('.user_member_permission_ids').at(3).simulate('change')
    expect(wrapper.state('checkedFeatures')).toHaveLength(3)
  })

  it.skip('should render a ServiceFeatureAccess if any feature granting service access is checked', () => {
    // TODO: implement this spec
    // Features granting services access
    wrapper.setState({ checkedFeatures: ['partners'] })
    expect(wrapper.find('ServiceFeatureAccess')/* is visible */).toBe(false)

    wrapper.setState({ checkedFeatures: ['monitoring'] })
    expect(wrapper.find('ServiceFeatureAccess')/* is visible */).toBe(false)

    wrapper.setState({ checkedFeatures: ['plans'] })
    expect(wrapper.find('ServiceFeatureAccess')/* is visible */).toBe(false)

    // Features NOT granting services access
    wrapper.setState({ checkedFeatures: ['portal'] })
    expect(wrapper.find('ServiceFeatureAccess')/* is visible */).toBe(true)

    wrapper.setState({ checkedFeatures: ['finance'] })
    expect(wrapper.find('ServiceFeatureAccess')/* is visible */).toBe(true)

    wrapper.setState({ checkedFeatures: ['settings'] })
    expect(wrapper.find('ServiceFeatureAccess')/* is visible */).toBe(true)
  })

  it('should render a list of services if any feature granting service access is checked', () => {
    // Features granting services access
    wrapper.setState({ checkedFeatures: ['partners'] })
    expect(wrapper.find('.ServiceAccessList--noServicePermissionsGranted').exists()).toBe(false)

    wrapper.setState({ checkedFeatures: ['monitoring'] })
    expect(wrapper.find('.ServiceAccessList--noServicePermissionsGranted').exists()).toBe(false)

    wrapper.setState({ checkedFeatures: ['plans'] })
    expect(wrapper.find('.ServiceAccessList--noServicePermissionsGranted').exists()).toBe(false)

    // Features NOT granting services access
    wrapper.setState({ checkedFeatures: ['portal'] })
    expect(wrapper.find('.ServiceAccessList--noServicePermissionsGranted').exists()).toBe(true)

    wrapper.setState({ checkedFeatures: ['finance'] })
    expect(wrapper.find('.ServiceAccessList--noServicePermissionsGranted').exists()).toBe(true)

    wrapper.setState({ checkedFeatures: ['settings'] })
    expect(wrapper.find('.ServiceAccessList--noServicePermissionsGranted').exists()).toBe(true)
  })

  const services = [{ id: 0, name: 'The Super API' }, { id: 1, name: 'Cool Villains' }]

  describe('when "service" is a NOT selected feature', () => {
    beforeEach(() => {
      wrapper.setProps({ services })
      wrapper.setState({ checkedFeatures: [] })
    })

    it('should render all services checked and disabled', () => {
      const inputs = wrapper.find('ServiceAccess').find('input')
      expect(inputs).toHaveLength(services.length)
      expect(inputs.everyWhere(n => n.prop('checked'))).toBe(true)
      expect(inputs.everyWhere(n => n.prop('checked'))).toBe(true)
    })

    it('should render ServiceFeatureAccess checked', () => {
      expect(wrapper.find('ServiceFeatureAccess').prop('checked')).toBe(true)
    })
  })

  describe('when "service" is a selected feature', () => {
    beforeEach(() => {
      wrapper.setProps({ services })
      wrapper.setState({ checkedFeatures: ['services'] })
    })

    it('should render all services enabled', () => {
      const inputs = wrapper.find('ServiceAccess').find('input')
      expect(inputs).toHaveLength(services.length)
      expect(inputs.everyWhere(n => !n.prop('disabled'))).toBe(true)
    })

    it('should render ServiceFeatureAccess unchecked', () => {
      expect(wrapper.find('ServiceFeatureAccess').prop('checked')).toBe(false)
    })

    it('should render all services included in "checkedServicesIds" checked', () => {
      wrapper.setState({ checkedFeatures: ['services'], checkedServicesIds: [0] })

      expect(wrapper.find(`input#user_member_permission_service_ids_${0}`).prop('checked')).toBe(true)
      expect(wrapper.find(`input#user_member_permission_service_ids_${1}`).prop('checked')).toBe(false)
    })

    it('should check and uncheck services when clicked', () => {
      expect(wrapper.find(`input#user_member_permission_service_ids_${0}`).prop('checked')).toBe(false)
      expect(wrapper.find(`input#user_member_permission_service_ids_${1}`).prop('checked')).toBe(false)

      wrapper.find(`input#user_member_permission_service_ids_${0}`).simulate('change')

      expect(wrapper.state('checkedServicesIds')).toEqual([0])
      expect(wrapper.find(`input#user_member_permission_service_ids_${0}`).prop('checked')).toBe(true)
      expect(wrapper.find(`input#user_member_permission_service_ids_${1}`).prop('checked')).toBe(false)

      wrapper.find(`input#user_member_permission_service_ids_${1}`).simulate('change')

      expect(wrapper.state('checkedServicesIds')).toEqual([0, 1])
      expect(wrapper.find(`input#user_member_permission_service_ids_${0}`).prop('checked')).toBe(true)
      expect(wrapper.find(`input#user_member_permission_service_ids_${1}`).prop('checked')).toBe(true)

      wrapper.find(`input#user_member_permission_service_ids_${0}`).simulate('change')

      expect(wrapper.state('checkedServicesIds')).toEqual([1])
      expect(wrapper.find(`input#user_member_permission_service_ids_${0}`).prop('checked')).toBe(false)
      expect(wrapper.find(`input#user_member_permission_service_ids_${1}`).prop('checked')).toBe(true)
    })
  })
})
