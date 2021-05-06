const dotenv = require('dotenv').config({ path: '../.env.homologacao' })
const fs = require('fs')
const credentials = require('../credentials.json')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const doc = new GoogleSpreadsheet(
  '1Pm59izDw86fzWU9z7QSrNGd_9QXJ_WO8OTqU7Ltuu9M'
)

const run = async () => {
  await doc.useServiceAccountAuth({
    client_email: process.env.EMAIL_GOOGLE_API,
    private_key: credentials.private_key,
  })

  await doc.loadInfo()
  const sheet = await doc.sheetsByIndex[1]
  await sheet.addRows([
    {
      Pedido: 123,
      'Nome Cliente': 'Miguel',
      'Telefone Cliente': '55 86 998153359',
      Produto: 'Trufa de Chocolate',
      Quantidade: 10,
      Subtotal: 250.95,
      'Total do Pedido': 500,
      Status: 'Aguardando Pagamento',
    },
  ])
}

run()
