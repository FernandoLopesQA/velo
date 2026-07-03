import { test, expect } from "@playwright/test";

/// AAA - Arrange, Act, Assert

test("deve consultar um pedido aprovado", async ({ page }) => {
  //Arrange
  await page.goto("http://localhost:5173/");
  await expect(
    page.getByTestId("hero-section").getByRole("heading"),
  ).toContainText("Velô Sprint");

  await page.getByRole("link", { name: "Consultar Pedido" }).click();
  await expect(page.getByRole("heading")).toContainText("Consultar Pedido");

  //Act
  await page.getByTestId("search-order-id").fill("VLO-3EGJD7");
  await page.getByRole("button", { name: "Buscar Pedido" }).click();

  //Assert
  const orderCode = "VLO-3EGJD7"
  const expectedStatus = "APROVADO"
  const orderInfo = page.getByText(orderCode, { exact: true }).locator("..")

  await expect(orderInfo).toContainText("Pedido")
  await expect(orderInfo).toContainText(orderCode)

  const orderHeader = orderInfo.locator("..").locator("..")

  await expect(orderHeader).toContainText(expectedStatus)
});
