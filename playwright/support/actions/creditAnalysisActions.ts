import type { Page } from '@playwright/test'

export function createCreditAnalysisActions(page: Page) {
  return {
    async mockScore(score: number) {
      await page.route('**/functions/v1/credit-analysis', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'Done',
            score,
          }),
        })
      })
    },
  }
}
