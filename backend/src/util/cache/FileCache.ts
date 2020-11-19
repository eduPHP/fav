import path from 'path'
import fs from 'fs'
import CacheControlInterface from './CacheControllerInterface'

class FileCache implements CacheControlInterface {
  folder: string

  constructor() {
    this.folder = path.join(__dirname, '..', '..', '..', 'cache')
  }

  async get<T>(key: string, def: T | null = null): Promise<T | null> {
    const fileName = path.join(
      this.folder,
      `__cache-${key.replace(/[/\\]/g, '-')}`,
    )

    if (!fs.existsSync(fileName)) {
      return def
    }

    const fileContents = fs.readFileSync(fileName, 'utf8')

    return JSON.parse(fileContents)
  }

  async put<T>(key: string, content: T, _ = 1): Promise<void> {
    try {
      const fileName = path.join(
        this.folder,
        `__cache-${key.replace(/[/\\]/g, '-')}`,
      )
      if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName)
      }
      fs.writeFileSync(fileName, JSON.stringify(content))
      console.log(`Cache was wrote for '__cache-${key.replace(/[/\\]/g, '-')}'`)
    } catch (err) {
      console.log(err)
    }
  }
}

export default FileCache
