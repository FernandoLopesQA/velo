import { test, expect } from "@playwright/test"

/// AAA - Arrange, Act, Assert

test("deve consultar um pedido aprovado", async ({ page }) => {
  //Arrange
  await page.goto("http://localhost:5173/")
  await expect(
    page.getByTestId("hero-section").getByRole("heading"),
  ).toContainText("Velô Sprint")

  await page.getByRole("link", { name: "Consultar Pedido" }).click()
  await expect(page.getByRole("heading")).toContainText("Consultar Pedido")

  //Act
  await page.getByTestId("search-order-id").fill("VLO-3EGJD7")
  await page.getByRole("button", { name: "Buscar Pedido" }).click()

  //Assert
  const orderResult = page.getByTestId("order-result-VLO-3EGJD7") //Busca apenas pela DIV e resultado, evitando pegar o valor fora dessa DIV e serve para ambas as validações necessárias

  await expect(orderResult).toBeVisible({ timeout: 10000 })
  await expect(orderResult.getByText("VLO-3EGJD7")).toBeVisible()

  await expect(orderResult.getByText("APROVADO")).toBeVisible()
});
