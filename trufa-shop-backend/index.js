require('dotenv').config({ path: '../.env.producao' })
const { createWebhook } = require('./lib/pix')
const https = require('https')
const fs = require('fs')
const app = require('./app')

const options = {
  //tls
  key: fs.readFileSync(process.env.PRIVATE_KEY),
  cert: fs.readFileSync(process.env.FULL_CHAIN_KEY),
  //mtls
  ca: fs.readFileSync('./ca-gerencianet.crt'), // GerenciaNet
  minVersion: 'TLSv1.2',
  requestCert: true,
  rejectUnauthorized: false,
}

const server = https.createServer(options, app)
server.listen(443, () => {
  console.log(
    'This server is running... \n\tPort: 443\n\tTo Access: https://trufashop.cloudns.cl'
  )
  console.log('creating webhook for pix')
  createWebhook().then(() => {
    console.log('Webhook created!')
  })
})
