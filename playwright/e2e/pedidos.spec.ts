import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderDetails } from '../support/actions/orderLockupActions'
import { insertOrder, deleteOrderByNumber } from '../support/database/orderRepository'
import crypto from 'crypto'

test.describe('Consulta de pedido', () => {

  test.beforeEach(async ({ app }) => {
    await app.orderLockup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {
    const order: OrderDetails = {
      number: 'VLO-SE4R01',
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Fernando Papito',
        email: 'papito@velo.dev',
      },
      payment: 'À Vista',
    }

    await deleteOrderByNumber(order.number)

    await insertOrder({
      id: crypto.randomUUID(),
      order_number: order.number,
      color: 'glacier-blue',
      wheel_type: 'aero',
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: '(11) 99999-9999',
      customer_cpf: '780.228.290-05',
      payment_method: 'avista',
      total_price: '40000',
      status: order.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      optionals: [],
    })

    await app.orderLockup.searchOrder(order.number)
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {
    const order: OrderDetails = {
      number: 'VLO-SE4R02',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Van Helsing',
        email: 'alucard@transilvania.com',
      },
      payment: 'À Vista',
    }

    await deleteOrderByNumber(order.number)

    await insertOrder({
      id: crypto.randomUUID(),
      order_number: order.number,
      color: 'midnight-black',
      wheel_type: 'sport',
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: '(11) 99999-9999',
      customer_cpf: '780.228.290-05',
      payment_method: 'avista',
      total_price: '40000',
      status: order.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      optionals: [],
    })

    await app.orderLockup.searchOrder(order.number)
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em análise', async ({ app }) => {
    const order: OrderDetails = {
      number: 'VLO-SE4R03',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Logan Wolverine',
        email: 'carcaju@xmen.com',
      },
      payment: 'À Vista',
    }

    await deleteOrderByNumber(order.number)

    await insertOrder({
      id: crypto.randomUUID(),
      order_number: order.number,
      color: 'lunar-white',
      wheel_type: 'aero',
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: '(11) 99999-9999',
      customer_cpf: '780.228.290-05',
      payment_method: 'avista',
      total_price: '40000',
      status: order.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      optionals: [],
    })

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

  test('deve manter o botão de busca desabilitado com o campo vazio ou apenas espaços', async ({ app, page }) => {
    const button = app.orderLockup.elements.searchButton

    await expect(button).toBeDisabled()

    await app.orderLockup.elements.orderInput.fill('     ')

    await expect(button).toBeDisabled()
  })
})
