import express from 'express'
import { getProducts, getProductsdetails } from './api/product.js'
import Redis from 'ioredis'
import { getcacheddata, ratelimiter } from './middleware/redis.js';


const app = express()

// import { createClient } from 'redis';

// const client = createClient({
//     password: 'tUD7EqLJUchiqLJQcLkXA5AKcuZuLksf',
//     socket: {
//         host: 'redis-19346.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
//         port: 19346
//     }
// });

export const redis = new Redis({
    host: "abc", // your redis host
    port:  566,// your reddis port
    password: "abc", //your reddis password
});


redis.on("connect", () => {
    console.log('reddis connected');
})

app.get("/", ratelimiter(360, 60), async (req, res) => {


    res.send(`hello world`)


})

app.get("/products", ratelimiter(5, 20),getcacheddata("products"), async (req, res) => {
    // const isexsist = await redis.exists("products");

    const products = await getProducts();
    await redis.setex("products", 20, JSON.stringify(products.products))
    return res.json({
        products,
    });
})


app.get("/product/:id", async (req, res) => {
    const id = req.params.id;
    const key = `product:${id}`;
    let product = await redis.get(key);
    if (product)

        return res.json({
            product: JSON.stringify(product)
        });
    product = await getProductsdetails(id);
    await redis.set(key, JSON.stringify(product))
    res.json({
        product,
    })

})

app.get("/order/:id", async (req, res) => {
    const productid = req.params.id;
    const key = `product:${productid}`

    await redis.del(key)

    return res.json({
        message: `order place successsfully, product id:${productid} is ordered`
    })
})

app.listen(3000, () => {
    console.log('server is connectedS');
})