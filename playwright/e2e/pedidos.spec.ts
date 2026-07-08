import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de pedido', () => {
  test.beforeEach(async ({ page }) => {
    //Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {
    // Test Data
    const order = 'VLO-3EGJD7'

    //Act
    await page.getByTestId('search-order-id').fill(order)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    //Assert
    await expect(page.getByTestId(`order-result-${order}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order}
    - img
    - text: APROVADO
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: Glacier Blue
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: sport Wheels
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: Fernando Lopes
    - paragraph: Email
    - paragraph: teste@teste.com
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: À Vista
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
    // Test Data
    const order = generateOrderCode()

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
})
