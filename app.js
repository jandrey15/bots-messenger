'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', 5000)
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Welcome my friend')
})

app.get('/webhook', (req, res) => {
  // El token no se debe mostrar a nadie tener en cuenta eso
  if (req.query['hub.verify_token'] === 'pugpizza_token') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Pug Pizza no tienes permisos')
  }
})

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')} - http://localhost:${app.get('port')}/`)
})
