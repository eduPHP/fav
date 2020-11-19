import memoryCache from 'memory-cache'
import CacheControlInterface from './CacheControllerInterface'

class MemCache implements CacheControlInterface {
  async put<T>(key: string, content: T, duration = 1): Promise<void> {
    memoryCache.put(
      `__cache${key.replace(/[\/\\]/g, '-')}`,
      content,
      duration * 1000 * 60,
    )
    console.log(`Cache was wrote for '__cache${key.replace(/[/\\]/g, '-')}'`)
  }

  async get<T>(key: string, def: T | null = null): Promise<T | null> {
    const content = memoryCache.get(`__cache${key.replace(/[/\\]/g, '-')}`)

    if (!content) {
      return def
    }

    return content
  }
}

export default MemCache
