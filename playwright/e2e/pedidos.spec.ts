import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderDetails } from '../support/actions/orderLockupActions'

test.describe('Consulta de pedido', () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLockup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {
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

    await app.orderLockup.searchOrder(order.number)
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {
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

    await app.orderLockup.searchOrder(order.number)
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em análise', async ({ app }) => {
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

    await app.orderLockup.searchOrder(order.number)
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {
    const order = generateOrderCode()
    await app.orderLockup.searchOrder(order)
    await app.orderLockup.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o pedido em qualquer formato não é encontrado', async ({ app }) => {
    const orderCode = 'ABC1234'
    await app.orderLockup.searchOrder(orderCode)
    await app.orderLockup.validateOrderNotFound()
  })
})
