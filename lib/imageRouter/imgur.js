'use strict'
const config = require('../config')
const logger = require('../logger')

const imgur = require('@hackmd/imgur')
const { URL } = require('url')

exports.uploadImage = function (imagePath, callback) {
  if (!imagePath || typeof imagePath !== 'string') {
    callback(new Error('Image path is missing or wrong'), null)
    return
  }

  if (!callback || typeof callback !== 'function') {
    logger.error('Callback has to be a function')
    return
  }

  imgur.setAPIUrl('https://api.filmot.com/3/')
  imgur.setClientId(config.imgur.clientID)
  imgur.uploadFile(imagePath)
    .then(function (json) {
      if (config.debug) {
        logger.info('SERVER uploadimage success: ' + JSON.stringify(json))
      }
      const link = new URL(json.data.link)
      link.protocol = 'https'
      link.hostname = link.hostname.replace(/\.imgur\.com$/i, '.filmot.com')
      callback(null, link.href)
    }).catch(function (err) {
      callback(new Error(err), null)
    })
}
