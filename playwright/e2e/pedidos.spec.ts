import { test, expect } from '@playwright/test'

/// AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
  // Test Data
  const order = 'VLO-3EGJD7'

  //Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  //Act
  await page.getByTestId('search-order-id').fill(order)
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()

  //Assert
  const containerPedido = page
    .getByRole('paragraph')
    .filter({ hasText: /^Pedido$/ })
    .locator('..') // Sobe para o elemento pai (a div que agrupa ambos)

  await expect(containerPedido).toContainText(order, { timeout: 10_000 })

  await expect(page.getByText('APROVADO')).toBeVisible()
})

test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
  // Test Data
  const order = 'VLO-ABC123'

  // Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  // Act
  await page.getByTestId('search-order-id').fill(order)
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()

  // Assert
  // Códigos abaixo mantidos como exemplo de estudo
  // const title = page.getByRole('heading', { name: 'Pedido não encontrado', level: 3 })
  // await expect(title).toBeVisible()

  // const message = page.locator('p', { hasText: 'Verifique o número do pedido e tente novamente' })
  // await expect(message).toBeVisible()

  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `)
})
