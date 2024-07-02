import { redis } from "../app.js";

export const getcacheddata = (key) =>async (req, res, next) => {
    let data = await redis.get("products")
    if (data) {
console.log('get from cache');
        return res.json({
            products: JSON.parse(data)
        }); 
    }

    next();
    
}

export const  ratelimiter = (limit,timer) => async (req, res, next)=>{
    const clientip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
    const key = `${clientip}:request_count`
    const requestcount = await redis.incr(key);
    // const limit = 10;
    // const timer=60

    if (requestcount === 1) {
     await   redis.expire(key,timer)
    }
const timereamining=await redis.ttl(key)

    if (requestcount > limit) {
        return res.status(429).send(`too maany requests please try agin after ${timereamining}`)
    }
    next()
}

// getcacheddata()