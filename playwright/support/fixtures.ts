import { test as base } from '@playwright/test'
import { createOrderLockupActions } from './actions/orderLockupActions'
import { createConfiguratorActions } from './actions/configuratorActions'
import { createCheckoutActions } from './actions/checkoutActions'
import { createCreditAnalysisActions } from './actions/creditAnalysisActions'

type App = {
  orderLockup: ReturnType<typeof createOrderLockupActions>
  configurator: ReturnType<typeof createConfiguratorActions>
  checkout: ReturnType<typeof createCheckoutActions>
  creditAnalysis: ReturnType<typeof createCreditAnalysisActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, provide) => {
    const app: App = {
      orderLockup: createOrderLockupActions(page),
      configurator: createConfiguratorActions(page),
      checkout: createCheckoutActions(page),
      creditAnalysis: createCreditAnalysisActions(page),
    }
    await provide(app)
  },
})

export { expect } from '@playwright/test'
