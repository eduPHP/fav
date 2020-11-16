import memoryCache from 'memory-cache'
import path from 'path'
import fs from 'fs'

interface CacheControlInterface {
  put: (key: string, content: object, duration: number) => Promise<void>
  get: (key: string, def: object | null) => Promise<string | object | null>
}

class MemCache implements CacheControlInterface {
  async put(key: string, content: object, duration = 1): Promise<void> {
    memoryCache.put(
      `__cache${key.replace(/[\/\\]/g, '-')}`,
      content,
      duration * 1000 * 60,
    )
    console.log(`Cache was wrote for '__cache${key.replace(/[\/\\]/g, '-')}'`)
  }

  async get(
    key: string,
    def: object | null = null,
  ): Promise<string | object | null> {
    const content = memoryCache.get(`__cache${key.replace(/[\/\\]/g, '-')}`)

    if (!content) {
      return def
    }

    return content
  }
}

class FileCache implements CacheControlInterface {
  folder: string

  constructor() {
    this.folder = path.join(__dirname, '..', '..', 'cache')
  }

  async get(key: string, def: object | null = null): Promise<object | null> {
    const fileName = path.join(
      this.folder,
      `__cache${key.replace(/[\/\\]/g, '-')}`,
    )

    if (!fs.existsSync(fileName)) {
      return def
    }

    const fileContents = fs.readFileSync(fileName, 'utf8')

    return JSON.parse(fileContents)
  }

  async put(key: string, content: object, duration = 1): Promise<void> {
    try {
      const fileName = path.join(
        this.folder,
        `__cache${key.replace(/[\/\\]/g, '-')}`,
      )
      if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName)
      }
      fs.writeFileSync(fileName, JSON.stringify(content))
      console.log(`Cache was wrote for '__cache${key.replace(/[\/\\]/g, '-')}'`)
    } catch (err) {
      console.log(err)
    }
  }
}

export default function (type: 'memcache' | 'file') {
  switch (type) {
    case 'memcache':
      return new MemCache()
    case 'file':
      return new FileCache()
  }
}
