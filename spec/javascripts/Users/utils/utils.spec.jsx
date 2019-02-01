import { isServicePermissionsGranted } from 'Users/utils'

describe('isServicePermissionsGranted', () => {
  it('should return whether or not service permissions are available', () => {
    // ['portal', 'finance', 'settings', 'partners', 'monitoring', 'plans']

    expect(isServicePermissionsGranted('portal')).toBe(false)
    expect(isServicePermissionsGranted('finance')).toBe(false)
    expect(isServicePermissionsGranted('settings')).toBe(false)

    expect(isServicePermissionsGranted('partners')).toBe(true)
    expect(isServicePermissionsGranted('monitoring')).toBe(true)
    expect(isServicePermissionsGranted('plans')).toBe(true)

    expect(isServicePermissionsGranted(['portal', 'finance', 'settings'])).toBe(false)

    expect(isServicePermissionsGranted(['portal', 'partners'])).toBe(true)
    expect(isServicePermissionsGranted(['plans', 'partners'])).toBe(true)
  })
})
