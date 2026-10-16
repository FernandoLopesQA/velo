import { expect, type Page } from '@playwright/test'

type ConfirmationStatus = 'APROVADO' | 'EM_ANALISE' | 'REPROVADO'

export function createConfirmationActions(page: Page) {
  const headings = {
    APROVADO: /Pedido Aprovado!/i,
    EM_ANALISE: /Pedido em Análise!/i,
    REPROVADO: /Crédito Reprovado/i,
  }

  return {
    async expectStatus(status: ConfirmationStatus) {
      await expect(page).toHaveURL(/\/success/)
      await expect(page.getByRole('heading', { name: headings[status] })).toBeVisible()
    },
  }
}
