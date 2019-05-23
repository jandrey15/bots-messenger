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
      handleEvent(event.sender.id, event)
    })
  }

  res.sendStatus(200)
})

const handleEvent = (senderId, event) => {
  if (event.message) {
    if (event.message.quick_reply) {
      handlePostBack(senderId, event.message.quick_reply.payload)
    } else {
      handleMessage(senderId, event.message)
    }
    // handleMessage(senderId, event.message)
  } else if(event.postback) {
    handlePostBack(senderId, event.postback.payload)
  }
}

const handleMessage = (senderId, event) => {
  if (event.text) {
    defaultMessage(senderId)
  } else if (event.attachments) {
    handleAttachments(senderId, event)
  }
}

const defaultMessage = (senderId) => {
  const messageData = {
    'recipient': {
      id: senderId
    },
    'message': {
      text: 'Hola soy un bot de messenger y te invito a utilizar nuestro menu',
      quick_replies: [
        {
          'content_type': 'text',
          'title': '¿Quieres una Pizza?',
          'payload': 'PIZZAS_PAYLOAD'
        },
        {
          'content_type': 'text',
          'title': 'Acerca de',
          'payload': 'ABOUT_PAYLOAD'
        }
      ]
    }
  }

  senderActions(senderId)
  callSendApi(messageData)
}

const handlePostBack = (senderId, payload) => {
  switch (payload) {
    case 'GET_STARTED_PUGPIZZA':
      console.log(payload)
      break
    case 'PIZZAS_PAYLOAD':
      showPizzas(senderId)
      break
    case 'PEPPERONI_PAYLOAD':
      sizePizza(senderId)
      break
    default:
      console.log(payload)
      break
  }
}

const senderActions = (senderId) => {
  const messageData = {
    recipient: {
      id: senderId
    },
    sender_action: 'typing_on'
  }
  callSendApi(messageData)
}

const handleAttachments = (senderId, event) => {
  let attachment_type = event.attachments[0].type
  // console.log(attachment_type)

  switch (attachment_type) {
    case 'image':
      console.log(attachment_type)
      break;
    case 'video':
      console.log(attachment_type)
      break
    case 'audio':
      console.log(attachment_type)
      break
    case 'file':
      console.log(attachment_type)
      break
    default:
      console.log(attachment_type)
      break
  }
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

const showPizzas = (senderId) => {
  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Peperoni',
              subtitle: 'Con todo el sabor del peperoni',
              image_url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir Pepperoni',
                  payload: 'PEPPERONI_PAYLOAD',
                }
              ]
            },
            {
              title: 'Pollo BBQ',
              subtitle: 'Con todo el sabor del BBQ',
              image_url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
              buttons: [
                {
                  type: 'postback',
                  title: 'Elegir Pollo BBQ',
                  payload: 'BBQ_PAYLOAD',
                }
              ]
            }
          ]
        }
      }
    }
  }

  callSendApi(messageData)
}

const sizePizza = (senderId) => {
  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      attachment: {
        'type': 'template',
        'payload': {
          'template_type': 'list',
          'top_element_style': 'compact',
          'elements': [
            {
              'title': 'Individual',
              'image_url': 'https://api-content.prod.pizzahutaustralia.com.au//umbraco/api/Image/Get2?path=assets/products/menu/Meat-Super-Supreme-Pizza-3250-menu.jpg',
              'subtitle': 'Porcion Individual de pizza',
              'buttons': [
                {
                  'type': 'postback',
                  'title': 'Elegir Individual',
                  'payload': 'PERSONAL_SIZE_PAYLOAD',
                }
              ]
            },
            {
              'title': 'Mediana',
              'image_url': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
              'subtitle': 'Porcion Mediana de pizza',
              'buttons': [
                {
                  'type': 'postback',
                  'title': 'Elegir Mediana',
                  'payload': 'MEDIUM_SIZE_PAYLOAD',
                }
              ]
            }
          ] // Se aconceja no tener mas de 4 elements
        }
      }
    }
  }

  callSendApi(messageData);
}

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')} - http://localhost:${app.get('port')}/`)
})
