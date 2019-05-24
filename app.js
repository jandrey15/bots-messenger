'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

// Debe ser secreto sin rastraer por git
const access_token = 'EAAFs9lrCGZA0BAOCp6uFj8dVvGR4pbX1QhPxGuqZCuYANOOXnCBS7jAGL3p1ZCeZAb5iBfh6E8ZAzPTJuHoyj5hRdsQvup16ygtfRiwHxnZAeXAQkonLZAaiORZBK3IzXUKW607PRwuaeYk97l2F4OJ59ZCeqeee5OxjxZBVSlmtsPHCL9r2d4jamZB'

const app = express()

app.set('port', process.env.PORT || 5000)
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Welcome my friend')
})

app.get('/webhook', (req, res) => {
  // El token no se debe mostrar a nadie tener en cuenta eso sin rastraer por git
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
    // defaultMessage(senderId)
    // messageImage(senderId)
    // contactSuppport(senderId)
    // showLocations(senderId)
    // receipt(senderId)
    getLocation(senderId)
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
    case "location":
      console.log(JSON.stringify(event))
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

  senderActions(senderId)
  callSendApi(messageData)
}

const messageImage = (senderId) => {
  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      attachment: {
        type: 'image',
        payload: {
          url: 'https://media.giphy.com/media/1dOIvm5ynwYolB2Xlh/giphy.gif' // Deben ser urls with https
        }
      }
    }
  }

  senderActions(senderId)
  callSendApi(messageData)
}

const contactSuppport = (senderId) => {
  const messageData = {
    'recipient': {
      'id': senderId
    },
    'message': {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'button',
          'text': 'Hola este es el canal de soporte, ¿quieres llamarnos?',
          'buttons': [
            {
              'type': 'phone_number',
              'title': 'Llamar a un asesor',
              'payload': '+571231231231'
            }
          ]
        }
      }
    }
  }

  senderActions(senderId)
  callSendApi(messageData)
}

const showLocations = (senderId) => {
  const messageData = {
    'recipient': {
      'id': senderId
    },
    'message': {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'list',
          'top_element_style': 'large',
          'elements': [
            {
              'title': 'Sucursal Mexico',
              'image_url': 'https://img.peru21.pe/files/ec_article_multimedia_gallery/uploads/2018/07/13/5b48b600bc667.png',
              'subtitle': 'Direccion bonita #555',
              'buttons': [
                {
                  'title': 'Ver en el mapa',
                  'type': 'web_url',
                  'url': 'https://goo.gl/maps/GCCpWmZep1t',
                  'webview_height_ratio': 'full'
                }
              ]
            },
            {
              'title': 'Sucursal Colombia',
              'image_url': 'https://img.peru21.pe/files/ec_article_multimedia_gallery/uploads/2018/07/13/5b48b600bc667.png',
              'subtitle': 'Direccion muy lejana #333',
              'buttons': [
                {
                  'title': 'Ver en el mapa',
                  'type': 'web_url',
                  'url': 'https://goo.gl/maps/GCCpWmZep1t',
                  'webview_height_ratio': 'tall'
                }
              ]
            }
          ]
        }
      }
    }
  }

  senderActions(senderId)
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

  senderActions(senderId)
  callSendApi(messageData)
}

const receipt = (senderId) => {
  const messageData = {
    'recipient': {
      'id': senderId
    },
    'message': {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'receipt',
          'recipient_name': 'Oscar Barajas',
          'order_number': '123123',
          'currency': 'MXN',
          'payment_method': 'Efectivo',
          'order_url': 'https://platzi.com/order/123',
          'timestamp': '123123123',
          'address': {
            'street_1': 'Platzi HQ',
            'street_2': '---',
            'city': 'Mexico',
            'postal_code': '543135',
            'state': 'Mexico',
            'country': 'Mexico'
          },
          'summary': {
            'subtotal': 12.00,
            'shipping_cost': 2.00,
            'total_tax': 1.00,
            'total_cost': 15.00
          },
          'adjustments': [
            {
              'name': 'Descuento frecuent',
              'amount': 1.00
            }
          ],
          'elements': [
            {
              'title': 'Pizza Pepperoni',
              'subtitle': 'La mejor pizza de pepperoni',
              'quantity': 1,
              'price': 10,
              'currency': 'MXN',
              'image_url': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
            },
            {
              'title': 'Bebida',
              'subtitle': 'Jugo de Tamarindo',
              'quantity': 1,
              'price': 2,
              'currency': 'MXN',
              'image_url': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
            }
          ]
        }
      }
    }
  }

  senderActions(senderId)
  callSendApi(messageData)
}

const getLocation = (senderId) => {
  const messageData = {
    'recipient': {
      'id': senderId
    },
    'message': {
      'text': 'Ahora ¿Puedes proporcionarnos tu ubicación?',
      'quick_replies': [
        {
          'content_type': 'location'
        }
      ]
    }
  }

  senderActions(senderId)
  callSendApi(messageData)
}

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')} - http://localhost:${app.get('port')}/`)
})
