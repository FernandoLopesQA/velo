import { test, expect } from '../support/fixtures'
import { deleteOrderByEmail } from '../support/database/orderRepository'

test.describe('Checkout', () => {

  test.describe('Validações de campos obrigatórios', () => {

    let alerts: any

    test.beforeEach(async ({ app, page }) => {
      await page.goto('/order')
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
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
        phone: '(11) 99999-9999'
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
        phone: '(11) 99999-9999'
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
        phone: '(11) 99999-9999'
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
        phone: '(11) 99999-9999'
      }

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')

      await expect(app.checkout.elements.terms).not.toBeChecked()

      await app.checkout.submit()

      await expect(alerts.terms).toHaveText('Aceite os termos')
    })

  })

  test.describe('Pagamento e confirmação de pedido', () => {

    test('deve criar um pedido com sucesso pagamento à vista', async ({ app, page }) => {
      const customer = {
        name: 'João',
        lastName: 'Silva',
        email: 'joao.silva@teste.com',
        document: '45678912345',
        phone: '(11) 98765-4321',
        store: 'Velô Paulista',
        paymentMethod: 'À Vista',
        totalPrice: 'R$ 40.000,00'
      }

      await deleteOrderByEmail(customer.email)

      await page.goto('/')
      await page.getByRole('link', { name: /Configure Agora/i }).click()

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
      await expect(page).toHaveURL(/\/success/)
      await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible()
    })
  })
})
