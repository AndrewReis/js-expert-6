import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import { extname, join } from 'node:path'
import config from '../config.js'

export class Service {
  createFileStream(fileName) {
     return fs.createReadStream(fileName)
  }

  async getFileInfo(file) {
    const fullFilePath = join(config.dir.publicDir, file)
    await fsPromises.access(fullFilePath)
    const fileType = extname(fullFilePath)

    return {
      type: fileType,
      name: fullFilePath
    }
  }

  async getFileStream(file) {
    const { name, type } = await this.getFileInfo(file);

    return {
      stream: this.createFileStream(name),
      type
    }
  }
}