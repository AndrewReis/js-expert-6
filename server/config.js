import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))

const root = join(currentDir, '../')
const audioDir = join(root, 'audio')
const publicDir = join(root, 'public')

export default {
  port: process.env.PORT || 3000,
  dir: {
    root,
    publicDir,
    audioDir,
    songsDir: join(audioDir, 'songs'),
    fxDir: join(audioDir, 'fx')
  },
  pages: {
    homeHTML: 'home/index.html',
    controllerHTML: 'controller/index.html'
  },
  location: {
    home: '/home'
  },
  constants: {
    CONTENT_TYPE: {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript'
    }
  }
}