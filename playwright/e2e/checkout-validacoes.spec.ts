import { test, expect } from '@playwright/test'

test.describe.only('Checkout - Validações', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/order')
    await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
  })

  test('deve validar obrigatoriedade de todos os campos em branco', async ({ page }) => {
    const submit = page.getByRole('button', { name: 'Confirmar Pedido' })

    const nameAlert = page.locator('//label[text()="Nome"]/..//p')
    const surnameAlert = page.locator('//label[text()="Sobrenome"]/..//p')
    const emailAlert = page.locator('//label[text()="Email"]/..//p')
    const phoneAlert = page.locator('//label[text()="Telefone"]/..//p')
    const cpfAlert = page.locator('//label[text()="CPF"]/..//p')
    const storeAlert = page.locator('//label[text()="Loja para Retirada"]/..//p')
    const termsAlert = page.locator('//label[@for="terms"]/following-sibling::p')

    await submit.click()

    await expect(nameAlert).toHaveText('Nome deve ter pelo menos 2 caracteres')
    await expect(surnameAlert).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    await expect(emailAlert).toHaveText('Email inválido')
    await expect(phoneAlert).toHaveText('Telefone inválido')
    await expect(cpfAlert).toHaveText('CPF inválido')
    await expect(storeAlert).toHaveText('Selecione uma loja')
    await expect(termsAlert).toHaveText('Aceite os termos')
  })

  test('deve validar limite mínimo de caracteres para Nome e Sobrenome', async ({ page }) => {
    const nome = page.getByTestId('checkout-name')
    const sobrenome = page.getByTestId('checkout-surname')
    const submit = page.getByRole('button', { name: 'Confirmar Pedido' })

    const nameAlert = page.locator('//label[text()="Nome"]/..//p')
    const surnameAlert = page.locator('//label[text()="Sobrenome"]/..//p')

    await nome.fill('A')
    await sobrenome.fill('B')

    await submit.click()

    await expect(page.getByText('Nome deve ter pelo menos 2 caracteres', { exact: true })).toBeVisible()
    await expect(page.getByText('Sobrenome deve ter pelo menos 2 caracteres', { exact: true })).toBeVisible()
  })

  test('deve exibir erro para e-mail com formato inválido', async ({ page }) => {
    const nome = page.getByTestId('checkout-name')
    const sobrenome = page.getByTestId('checkout-surname')
    const email = page.getByTestId('checkout-email')
    const submit = page.getByRole('button', { name: 'Confirmar Pedido' })

    const emailAlert = page.locator('//label[text()="Email"]/..//p')

    await nome.fill('João')
    await sobrenome.fill('Silva')
    await email.fill('cliente@com')

    await submit.click()

    await expect(page.getByText('Email inválido', { exact: true })).toBeVisible()
  })

  test('deve exibir erro para CPF inválido', async ({ page }) => {
    const cpf = page.getByTestId('checkout-cpf')
    const submit = page.getByRole('button', { name: 'Confirmar Pedido' })

    const cpfAlert = page.locator('//label[text()="CPF"]/..//p')

    await cpf.fill('')
    await submit.click()
    await expect(page.getByText('CPF inválido', { exact: true })).toBeVisible()
  })

  test('deve validar obrigatoriedade e dados inválidos', async ({ page }) => {
    const email = page.getByTestId('checkout-email')
    const telefone = page.getByTestId('checkout-phone')
    const cpf = page.getByTestId('checkout-cpf')
    const loja = page.getByTestId('checkout-store')
    const termos = page.getByTestId('checkout-terms')
    const submit = page.getByRole('button', { name: 'Confirmar Pedido' })

    const termsAlert = page.locator('//label[@for="terms"]/following-sibling::p')

    await email.fill('joao.silva@email.com')
    await telefone.fill('(11) 99999-9999')
    await cpf.fill('529.982.247-25')
    await loja.click()
    await page.getByRole('option', { name: /Velô Paulista/i }).click()

    await expect(termos).not.toBeChecked()

    await submit.click()

    await expect(page.getByText('Aceite os termos', { exact: true })).toBeVisible()
  })
})
