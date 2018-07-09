const express = require('express');
const request = require('request');
const recUrl = "http://api.walmartlabs.com/v1/nbp?itemId="
const apiKeyQP = "&apiKey="
const app = express();

app.get('/api/recommendProduct/:productId/:apiKey', (req, res) => {
    if(req.params && req.params.productId && req.params.apiKey){
        request(`${recUrl}${req.params.productId}${apiKeyQP}${req.params.apiKey}`, (error, response, body) => {
            if(!error && response.statusCode == 200){
                let jsonBody = JSON.parse(body);
                if(jsonBody.errors && jsonBody.errors.length > 0){
                    if(jsonBody.errors[0].code === 4022){
                        res.json([]); // sending empty response to handle on client, for no recommended products
                    } else{
                        res.json(jsonBody); 
                    }    
                } else{
                    res.json(jsonBody);
                }
            } else{
                res.status(response.statusCode).json({ error: "API call failed"})
            }
        })
    } else{
        res.status(422).json({error: "Bad request made"});
    }
})

app.listen(3000, () => console.log('API Server listening'))

