import { logger } from '../log.js'
import config from '../config.js'
import { Controller } from '../controller/index.js'

const controller = new Controller()

async function routes(request, response) {
  const { method, url } = request

  if (method === 'GET' && url === '/') {
    response.writeHead(302, { 'Location': config.location.home })
    return response.end()
  }

  if (method === 'GET' && url === '/home') {
    const { stream, type } = await controller.getFileStream(config.pages.homeHTML)
    
    return stream.pipe(response)
  }

  if (method === 'GET' && url === '/controller') {
    const { stream, type } = await controller.getFileStream(config.pages.controllerHTML)
    
    return stream.pipe(response)
  }

  // files
  if (method === 'GET') {
    const { stream, type } = await controller.getFileStream(url);
    
    if(config.constants.CONTENT_TYPE[type]) {
      response.writeHead(200, {
        'Content-Type': config.constants.CONTENT_TYPE[type]
      })
    }
  
    return stream.pipe(response);
  }

  response.writeHead(404);
  return response.end();
}

function handleError(error, response) {
  if (error.message.includes('ENOENT')) {
    logger.warn(`Asset not found ${error.stack}`)
    response.writeHead(404)
    return response.end()
  }

  logger.error(`Caught error on API ${error.stack}`)
  response.writeHead(500)
  return response.end()
}

export function handler(request, response) {
  return routes(request, response)
    .catch(error => handleError(error, response))
}