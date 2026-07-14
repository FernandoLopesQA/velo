import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'
import { OrderLockupPage, OrderDetails } from '../support/pages/OrderLockupPage'

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
    const order: OrderDetails = {
      number: 'VLO-3EGJD7',
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'sport Wheels',
      customer: {
        name: 'Fernando Lopes',
        email: 'teste@teste.com',
      },
      payment: 'À Vista',
    }

    // Act
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetails(order)

    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ page }) => {
    // Test Data
    const order: OrderDetails = {
      number: 'VLO-4E2T5C',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Van Helsing',
        email: 'alucard@transilvania.com',
      },
      payment: 'À Vista',
    }

    // Act
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetails(order)

    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em análise', async ({ page }) => {
    // Test Data
    const order: OrderDetails = {
      number: 'VLO-KOFFJ2',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Logan Wolverine',
        email: 'carcaju@xmen.com',
      },
      payment: 'À Vista',
    }

    // Act
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetails(order)

    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
    // Test Data
    const order = generateOrderCode()

    // Act
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order)

    // Assert
    // Códigos abaixo mantidos como exemplo de estudo
    // const title = page.getByRole('heading', { name: 'Pedido não encontrado', level: 3 })
    // await expect(title).toBeVisible()

    // const message = page.locator('p', { hasText: 'Verifique o número do pedido e tente novamente' })
    // await expect(message).toBeVisible()

    await orderLockupPage.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o pedido em qualquer formato não é encontrado', async ({ page }) => {

    // Act
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder('ABC123')

    // Assert
    await orderLockupPage.validateOrderNotFound()
  })
})
