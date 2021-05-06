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
  const maxRows = sheet.rowCount
  await sheet.loadCells('A1:A' + maxRows)
  await sheet.loadCells('H1:H' + maxRows)

  const orderId = 2
  const status = 'Pago com Pix'

  const validIndex = [...Array(maxRows - 1).keys()]
  for await (const i of validIndex) {
    const cell = await sheet.getCell(i + 1, 0)
    if (cell.value) {
      if (cell.value == orderId) {
        console.log(cell.value)
        const statusCell = await sheet.getCell(i + 1, 7)
        statusCell.value = status
      }
    } else {
      break
    }
  }
  await sheet.saveUpdatedCells()
}

run()
