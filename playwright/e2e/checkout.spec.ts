import { test, expect } from '../support/fixtures'

test.describe('Checkout', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/order')
    await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
  })

  test.describe('Validações de campos obrigatórios', () => {

    test('deve validar obrigatoriedade de todos os campos em branco', async ({ app, page }) => {

      const nameAlert = page.locator('//label[text()="Nome"]/..//p')
      const surnameAlert = page.locator('//label[text()="Sobrenome"]/..//p')
      const emailAlert = page.locator('//label[text()="Email"]/..//p')
      const phoneAlert = page.locator('//label[text()="Telefone"]/..//p')
      const cpfAlert = page.locator('//label[text()="CPF"]/..//p')
      const storeAlert = page.locator('//label[text()="Loja para Retirada"]/..//p')
      const termsAlert = page.locator('//label[@for="terms"]/following-sibling::p')

      await app.checkout.submit()

      await expect(nameAlert).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(surnameAlert).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
      await expect(emailAlert).toHaveText('Email inválido')
      await expect(phoneAlert).toHaveText('Telefone inválido')
      await expect(cpfAlert).toHaveText('CPF inválido')
      await expect(storeAlert).toHaveText('Selecione uma loja')
      await expect(termsAlert).toHaveText('Aceite os termos')
    })

    test('deve validar limite mínimo de caracteres para Nome e Sobrenome', async ({ app, page }) => {

      const nameAlert = page.locator('//label[text()="Nome"]/..//p')
      const surnameAlert = page.locator('//label[text()="Sobrenome"]/..//p')

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

      await expect(nameAlert).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(surnameAlert).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    })

    test('deve exibir erro para e-mail com formato inválido', async ({ app, page }) => {

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

      await expect(page.getByText('Email inválido', { exact: true })).toBeVisible()
    })

    test('deve exibir erro para CPF inválido', async ({ app, page }) => {

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
      await expect(page.getByText('CPF inválido', { exact: true })).toBeVisible()
    })

    test('deve validar obrigatoriedade e dados inválidos', async ({ app, page }) => {

      const termsAlert = page.locator('//label[@for="terms"]/following-sibling::p')

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

      await expect(page.getByText('Aceite os termos', { exact: true })).toBeVisible()
    })

  })
})
