import { test, expect } from '@playwright/test';

test('deve consultar um pedido aprovado', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  //Checkpoint 1: Verificar se a página de landing está carregada
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

  //Checkpoint 2: Navegar para a página de consulta de pedidos
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  //Checkpoint 3: Preencher o campo de busca com o número do pedido
  await page.getByTestId('search-order-id').click();
  await page.getByTestId('search-order-id').fill('VLO-3EGJD7');

  //Checkpoint 4: Clicar no botão de busca
  await page.getByTestId('search-order-button').click();
  await expect(page.getByTestId('order-result-id')).toBeVisible();
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-3EGJD7');

  //Checkpoint 5: Verificar se o pedido foi encontrado e está aprovado
  await expect(page.getByTestId('order-result-status')).toBeVisible();
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');
});