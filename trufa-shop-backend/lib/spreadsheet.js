const dotenv = require('dotenv').config({ path: '../.env.homologacao' })
const credentials = require('../../credentials.json')
const { v4 } = require('uuid')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const doc = new GoogleSpreadsheet(
  '1Pm59izDw86fzWU9z7QSrNGd_9QXJ_WO8OTqU7Ltuu9M'
)

const saveOrder = async (order) => {
  await doc.useServiceAccountAuth({
    client_email: process.env.EMAIL_GOOGLE_API,
    private_key: credentials.private_key,
  })

  await doc.loadInfo()
  const sheet = await doc.sheetsByIndex[1]
  const orderId = order.id
  const total = order.items.reduce(
    (prev, curr) => prev + curr.price * curr.quantity,
    0
  )
  const rows = order.items.map((item) => {
    const row = {
      Pedido: orderId,
      'Nome Cliente': order.nome,
      'Telefone Cliente': order.telefone,
      Produto: item.name,
      Quantidade: item.quantity,
      'Valor Unitário': item.price,
      Subtotal: item.price * item.quantity,
      'Total do Pedido': total,
      Status: 'Aguardando Pagamento',
      CPF: order.cpf,
    }
    return row
  })

  await sheet.addRows(rows)
}

module.exports = { saveOrder }
