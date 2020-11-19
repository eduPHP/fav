import CacheControlInterface from './CacheControllerInterface'
import MemCache from './MemCache'
import FileCache from './FileCache'

export default function (type: 'memcache' | 'file'): CacheControlInterface {
  switch (type) {
    case 'memcache':
      return new MemCache()
    case 'file':
      return new FileCache()
    default:
      return new FileCache()
  }
}
