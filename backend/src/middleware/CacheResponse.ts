import {Request, Response, NextFunction} from "express";
import memoryCache from 'memory-cache'
import {Send} from "express-serve-static-core";

declare global {
    namespace Express {
        export interface Response {
            jsonResponse: Send<any>;
        }
    }
}


const cached = (duration: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET') {
            return res.status(500).json({message: 'Only GET requests should be cached.'})
        }
        const key = `__cache.${req.originalUrl || req.url}`
        const cachedBody = memoryCache.get(key)
        if (cachedBody) {
            return res.json(cachedBody)
        }

        res.jsonResponse = res.json
        res.json = body => {
            memoryCache.put(key, body, duration * 1000 * 60)
            return res.jsonResponse(body)
        }
        next()
    }
}

export default cached
