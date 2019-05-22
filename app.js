'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const access_token = 'EAAFs9lrCGZA0BAOCp6uFj8dVvGR4pbX1QhPxGuqZCuYANOOXnCBS7jAGL3p1ZCeZAb5iBfh6E8ZAzPTJuHoyj5hRdsQvup16ygtfRiwHxnZAeXAQkonLZAaiORZBK3IzXUKW607PRwuaeYk97l2F4OJ59ZCeqeee5OxjxZBVSlmtsPHCL9r2d4jamZB'

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

app.post('/webhook/', (req, res) => {
  const webhook_event = req.body.entry[0]
  if(webhook_event.messaging) {
    webhook_event.messaging.forEach(event => {
      // console.log(event)
      handleMessage(event)
    })
  }

  res.sendStatus(200)
})

const handleMessage = (event) => {
  const senderId = event.sender.id
  const messageText = event.message.text

  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      text: messageText
    }
  }

  callSendApi(messageData)
}

const callSendApi = (response) => {
  request({
    'uri': 'https://graph.facebook.com/v3.3/me/messages',
    'qs': {
      'access_token': access_token
    },
    'method': 'POST',
    'json': response
  }, (err) => {
    if(err) {
      console.log('Ha ocurrido un error')
    } else {
      console.log('Mensaje enviado')
    }
  })
}

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')} - http://localhost:${app.get('port')}/`)
})
