const https = require('https')
const axios = require('axios')
const fs = require('fs')
//require('dotenv').config({ path: '../.env.homologacao' })

const apiProduction = 'https://api-pix.gerencianet.com.br'
const apiStagin = 'https://api-pix-h.gerencianet.com.br'

const baseUrl = process.env.GN_ENV === 'producao' ? apiProduction : apiStagin

const getToken = async () => {
  const certificado = fs.readFileSync('../' + process.env.GN_CERTIFICADO)
  const credenciais = {
    client_id: process.env.GN_CLIENT_ID,
    client_secret: process.env.GN_CLIENT_SECRET,
  }

  const data = JSON.stringify({ grant_type: 'client_credentials' })
  const data_credenciais =
    credenciais.client_id + ':' + credenciais.client_secret
  const auth = Buffer.from(data_credenciais).toString('base64')
  const agent = new https.Agent({
    pfx: certificado,
    passphrase: '',
  })

  const config = {
    method: 'POST',
    url: baseUrl + '/oauth/token',
    headers: {
      Authorization: 'Basic ' + auth,
      'Content-type': 'application/json',
    },
    httpsAgent: agent,
    data: data,
  }
  const result = await axios(config)
  return result.data
}

const createCharge = async (accessToken, chargeData) => {
  const certificado = fs.readFileSync('../' + process.env.GN_CERTIFICADO)
  const data = JSON.stringify(chargeData)
  const agent = new https.Agent({
    pfx: certificado,
    passphrase: '',
  })

  const config = {
    method: 'POST',
    url: baseUrl + '/v2/cob',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-type': 'application/json',
    },
    httpsAgent: agent,
    data: data,
  }
  const result = await axios(config)
  return result.data
}

const getLoc = async (accessToken, LocId) => {
  const certificado = fs.readFileSync('../' + process.env.GN_CERTIFICADO)
  const agent = new https.Agent({
    pfx: certificado,
    passphrase: '',
  })

  const config = {
    method: 'GET',
    url: baseUrl + '/v2/loc/' + LocId + '/qrcode',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-type': 'application/json',
    },
    httpsAgent: agent,
  }
  const result = await axios(config)
  return result.data
}

const createPixCharge = async (order) => {
  const chave = process.env.CHAVE_PIX
  const token = await getToken()
  const accessToken = token.access_token
  const total = order.items.reduce(
    (prev, curr) => prev + curr.price * curr.quantity,
    0
  )

  const cob = {
    calendario: {
      expiracao: 3600,
    },
    devedor: {
      cpf: order.cpf,
      nome: order.nome,
    },
    valor: {
      original: total.toFixed(2),
    },
    chave,
    solicitacaoPagador: 'Cobran??a por ' + order.items.length + ' trufas.',
  }
  console.log(order)
  const cobranca = await createCharge(accessToken, cob)
  const qrcode = await getLoc(accessToken, cobranca.loc.id)
  return { qrcode, cobranca }
}

const createWebhook = async () => {
  const chave = process.env.CHAVE_PIX
  const token = await getToken()
  const accessToken = token.access_token

  const certificado = fs.readFileSync('../' + process.env.GN_CERTIFICADO)
  const data = JSON.stringify({
    webhookUrl: 'https://trufashop.cloudns.cl/webhook/pix',
  })
  const agent = new https.Agent({
    pfx: certificado,
    passphrase: '',
  })

  const config = {
    method: 'PUT',
    url: baseUrl + '/v2/webhook/' + chave,
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-type': 'application/json',
    },
    httpsAgent: agent,
    data: data,
  }
  const result = await axios(config)
  return result.data
}

module.exports = { createPixCharge, createWebhook }
