import server from './http.js'
import config from './config.js'
import { logger } from './log.js'



server.listen(config.port)
  .on('listening', 
    () => logger.info(`server running at: http://localhost:${config.port}`))