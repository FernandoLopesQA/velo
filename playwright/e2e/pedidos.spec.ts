import { test, expect } from '@playwright/test'

/// AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
  //Arrange
  await page.goto('http://localhost:5173/')
  await expect(
    page.getByTestId('hero-section').getByRole('heading'),
  ).toContainText('Velô Sprint')

  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  //Act
  await page.getByTestId('search-order-id').fill('VLO-3EGJD7')
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()

  //Assert
  const containerPedido = page
    .getByRole('paragraph')
    .filter({ hasText: /^Pedido$/ })
    .locator('..') // Sobe para o elemento pai (a div que agrupa ambos)

  await expect(containerPedido).toContainText('VLO-3EGJD7', { timeout: 10_000 })

  await expect(page.getByText('APROVADO')).toBeVisible()
})
