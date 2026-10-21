import { test, expect } from '../support/fixtures'
import { deleteOrderByEmail } from '../support/database/orderRepository'
import type { createCheckoutActions } from '../support/actions/checkoutActions'

test.describe('Checkout', () => {
  test.describe('Validações de campos obrigatórios', () => {
    let alerts: ReturnType<typeof createCheckoutActions>['elements']['alerts']

    test.beforeEach(async ({ app, page }) => {
      await page.goto('/order')
      await app.checkout.expectLoaded()
      alerts = app.checkout.elements.alerts
    })

    test('deve validar obrigatoriedade de todos os campos em branco', async ({ app }) => {
      await app.checkout.submit()

      await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(alerts.lastName).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
      await expect(alerts.email).toHaveText('Email inválido')
      await expect(alerts.phone).toHaveText('Telefone inválido')
      await expect(alerts.document).toHaveText('CPF inválido')
      await expect(alerts.store).toHaveText('Selecione uma loja')
      await expect(alerts.terms).toHaveText('Aceite os termos')
    })

    test('deve validar limite mínimo de caracteres para Nome e Sobrenome', async ({ app }) => {
      const customer = {
        name: 'A',
        lastName: 'B',
        email: 'papito@teste.com',
        document: '00000014141',
        phone: '(11) 99999-9999',
      }

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      await app.checkout.submit()

      await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(alerts.lastName).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    })

    test('deve exibir erro para e-mail com formato inválido', async ({ app }) => {
      const customer = {
        name: 'Fernando',
        lastName: 'Papito',
        email: '',
        document: '00000014141',
        phone: '(11) 99999-9999',
      }

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      await app.checkout.submit()

      await expect(alerts.email).toHaveText('Email inválido')
    })

    test('deve exibir erro para CPF inválido', async ({ app }) => {
      const customer = {
        name: 'Fernando',
        lastName: 'Papito',
        email: 'papito@test.com',
        document: '',
        phone: '(11) 99999-9999',
      }

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      await app.checkout.submit()
      await expect(alerts.document).toHaveText('CPF inválido')
    })

    test('deve validar obrigatoriedade e dados inválidos', async ({ app }) => {
      const customer = {
        name: 'Fernando',
        lastName: 'Papito',
        email: 'papito@test.com',
        document: '00000014199',
        phone: '(11) 99999-9999',
      }

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')

      await expect(app.checkout.elements.terms).not.toBeChecked()

      await app.checkout.submit()

      await expect(alerts.terms).toHaveText('Aceite os termos')
    })
  })

  test.describe('Pagamento e confirmação de pedido', () => {

    test.beforeEach(async ({ app }) => {
      await app.hero.open()
    })

    test('deve criar um pedido com sucesso pagamento à vista', async ({ app }) => {
      const customer = {
        name: 'João',
        lastName: 'Silva',
        email: 'joao.silva@teste.com',
        document: '45678912345',
        phone: '(11) 98765-4321',
        store: 'Velô Paulista',
        paymentMethod: 'À Vista',
        totalPrice: 'R$ 40.000,00',
      }

      await deleteOrderByEmail(customer.email)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.expectSummaryTotal(customer.totalPrice)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      // Assert: Confirmação
      await app.checkout.expectResult('Pedido Aprovado!')
    })

    test('deve aprovar automáticamente o crédito quando o score do CPF for maior que 700 no financiamento.', async ({
      app,
    }) => {
      const customer = {
        name: 'Steve',
        lastName: 'Woz',
        email: 'woz@velo.dev',
        document: '65493881047',
        phone: '(11) 98765-4321',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(710)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      // await app.checkout.expectSummaryTotal(customer.totalPrice)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      // Assert: Confirmação
      await app.checkout.expectResult('Pedido Aprovado!')
    })

    test('deve encaminhar para análise de crédito quando o score do CPF for entre 501 e 700 no financiamento.', async ({
      app,
    }) => {
      const customer = {
        name: 'Tony',
        lastName: 'Stark',
        email: 'tony@stark.com',
        document: '74690251037',
        phone: '(11) 98765-4321',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(600)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      // Assert: Confirmação e Validação do Status
      await app.checkout.expectResult('Pedido em Análise!')
    })

    test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento sem entrada.', async ({
      app,
    }) => {
      const customer = {
        name: 'Clark',
        lastName: 'Kent',
        email: 'clark@dailyplanet.com',
        document: '52998224725',
        phone: '(11) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(500)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      // Assert: Confirmação e Validação do Status
      await app.checkout.expectResult('Pedido Reprovado!')
    })

    test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada menor que 50%.', async ({
      app,
    }) => {
      const customer = {
        name: 'Diana',
        lastName: 'Prince',
        email: 'diana@themyscira.com',
        document: '11144477735',
        phone: '(11) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
        downPayment: '10000',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(500)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.fillDownPayment(customer.downPayment)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      // Assert: Confirmação e Validação do Status
      await app.checkout.expectResult('Pedido Reprovado!')
    })

    test('deve aprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada igual a 50%.', async ({
      app,
    }) => {
      const customer = {
        name: 'Peter',
        lastName: 'Parker',
        email: 'cabecadeteia@spiderman.com',
        document: '39434745004',
        phone: '(11) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
        downPayment: '20000',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(450)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.fillDownPayment(customer.downPayment)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      // Assert: Confirmação e Validação do Status
      await app.checkout.expectResult('Pedido Aprovado!')
    })

    test('deve aprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada maior que 50%.', async ({
      app,
    }) => {
      const customer = {
        name: 'Axel',
        lastName: 'Rose',
        email: 'axel@gnr.com',
        document: '79327557000',
        phone: '(11) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
        downPayment: '30000',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(300)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.fillDownPayment(customer.downPayment)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      // Assert: Confirmação e Validação do Status
      await app.checkout.expectResult('Pedido Aprovado!')
    })
  })
})
