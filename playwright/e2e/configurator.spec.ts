import { test, expect } from '../support/fixtures'

test.describe('Configuração do veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('deve atualizar a imagem e manter o preço base ao trocar a cor do veículo', async ({ app }) => {
    // Valida o preço base
    await app.configurator.expectPrice('R$ 40.000,00')

    // Seleciona a cor e valida que o preço é atualizado (ou mantido, neste caso)
    await app.configurator.selectColor('Midnight Black')
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/midnight-black-aero-wheels.png')
  })

  test('deve atualizar o preço e a imagem ao alterar as rodas, e restaurar os valores padrão', async ({ app }) => {
    // Valida o preço base
    await app.configurator.expectPrice('R$ 40.000,00')

    // Seleciona a opção de rodas "Sport Wheels" e valida o acréscimo no valor
    await app.configurator.selectWheels(/Sport Wheels/)
    await app.configurator.expectPrice('R$ 42.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-sport-wheels.png')

    // Retorna para "Aero Wheels" e valida o retorno ao preço original
    await app.configurator.selectWheels(/Aero Wheels/)
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-aero-wheels.png')
  })

  test('deve atualizar o preço com opcionais e persistir no checkout', async ({page, app}) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.toggleOptional('Precision Park')
    await app.configurator.expectPrice('R$ 45.500,00')

    await app.configurator.toggleOptional('Flux Capacitor')
    await app.configurator.expectPrice('R$ 50.500,00')

    await app.configurator.toggleOptional('Precision Park')
    await app.configurator.toggleOptional('Flux Capacitor')
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.finishConfigurator()
    await app.checkout.expectLoaded()
    await app.checkout.expectSummaryTotal('R$ 40.000,00')
  })
})
