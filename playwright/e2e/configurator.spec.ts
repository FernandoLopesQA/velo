import { test, expect } from '@playwright/test'

test.describe('CT02 - Configuração do veículo (Cores e Rodas)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/configure')
  })

  test('deve atualizar o preço ao alternar entre Aero e Sport Wheels', async ({ page }) => {
    const priceElement = page.getByTestId('total-price')
    await expect(priceElement).toBeVisible()
    await expect(priceElement).toHaveText('R$ 40.000,00')

    await page.getByRole('button', { name: 'Midnight Black' }).click()
    await expect(priceElement).toHaveText('R$ 40.000,00')

    await page.getByRole('button', { name: /Sport Wheels/ }).click()
    await expect(priceElement).toHaveText('R$ 42.000,00')

    await page.getByRole('button', { name: /Aero Wheels/ }).click()
    await expect(priceElement).toHaveText('R$ 40.000,00')
  })
})
