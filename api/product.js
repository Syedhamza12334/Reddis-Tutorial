export const getProducts =()=>
     new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({
            products: [
                {
                    id: 1,
                    name: "product 1",
                    price: 100, // corrected typo 'priice' to 'price'
                }
            ]
        });
    }, 2000); 
});



export const getProductsdetails =(id)=>
    new Promise((resolve, reject) => {
   setTimeout(() => {
       resolve({
           products: 
               {
                   id: id,
                   name:`Product ${id}`,
                   price: Math.floor(Math.random()* id * 100), // corrected typo 'priice' to 'price'
               }
           
       });
   }, 2000); 
});
