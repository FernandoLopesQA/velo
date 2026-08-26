import { test, expect } from '@playwright/test'

test.describe('Checkout - Validações (CT04)', () => {
  test('deve validar obrigatoriedade e dados inválidos', async ({ page }) => {
    // Arrange
    await page.goto('/order')
    await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()

    const submit = page.getByRole('button', { name: 'Confirmar Pedido' })
    const nome = page.getByTestId('checkout-name')
    const sobrenome = page.getByTestId('checkout-surname')
    const email = page.getByTestId('checkout-email')
    const telefone = page.getByTestId('checkout-phone')
    const cpf = page.getByTestId('checkout-cpf')
    const loja = page.getByTestId('checkout-store')
    const termos = page.getByTestId('checkout-terms')

    const nameAlert = page.locator('//label[text()="Nome"]/..//p')
    const surnameAlert = page.locator('//label[text()="Sobrenome"]/..//p')
    const emailAlert = page.locator('//label[text()="Email"]/..//p')
    const phoneAlert = page.locator('//label[text()="Telefone"]/..//p')
    const cpfAlert = page.locator('//label[text()="CPF"]/..//p')
    const storeAlert = page.locator('//label[text()="Loja para Retirada"]/..//p')
    const termsAlert = page.locator('//label[@for="terms"]/following-sibling::p')

    // Passo 1: Tudo em branco
    await submit.click()

    await expect(nameAlert).toHaveText('Nome deve ter pelo menos 2 caracteres')
    await expect(surnameAlert).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    await expect(emailAlert).toHaveText('Email inválido')
    await expect(phoneAlert).toHaveText('Telefone inválido')
    await expect(cpfAlert).toHaveText('CPF inválido')
    await expect(storeAlert).toHaveText('Selecione uma loja')
    await expect(termsAlert).toHaveText('Aceite os termos')

    // Passo 2: Nome/Sobrenome com 1 letra
    await nome.fill('A')
    await sobrenome.fill('B')
    await submit.click()
    await expect(page.getByText('Nome deve ter pelo menos 2 caracteres', { exact: true })).toBeVisible()
    await expect(page.getByText('Sobrenome deve ter pelo menos 2 caracteres', { exact: true })).toBeVisible()

    // Passo 3: E-mail inválido
    await nome.fill('João')
    await sobrenome.fill('Silva')
    await email.fill('cliente@com')
    await submit.click()
    await expect(page.getByText('Email inválido', { exact: true })).toBeVisible()

    // Passo 4: CPF inválido
    await cpf.fill('')
    await submit.click()
    await expect(page.getByText('CPF inválido', { exact: true })).toBeVisible()

    // Passo 5: Tudo correto, sem aceitar os termos
    await email.fill('joao.silva@email.com')
    await telefone.fill('(11) 99999-9999')
    await cpf.fill('52998224725')
    await loja.click()
    await page.getByRole('option', { name: /Velô Paulista/i }).click()
    await expect(termos).not.toBeChecked()
    await submit.click()
    await expect(page.getByText('Aceite os termos', { exact: true })).toBeVisible()
  })
})
