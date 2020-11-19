export default interface CacheControlInterface {
  put<T>(key: string, content: T, duration: number): Promise<void>
  get<T>(key: string, def: T | null): Promise<T | null>
}
