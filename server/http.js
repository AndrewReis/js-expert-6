import { createServer } from 'node:http'

import { handler } from './routes/index.js'

export default createServer(handler);