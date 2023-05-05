const express = require('express');
require('dotenv').config();
const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const path = require('path');
const ShortUrl = require('./models/url.model');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended : false }));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB , {
    dbName: 'url-shortner'
}).then(()=> {console.log('database connected')}).catch((err)=> {console.log(`database did not connect sucesfully ${err}`)});

const generateRandomString = (length) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };


app.set( 'view engine', 'ejs');

app.get('/', async(req, res, next) => {
    res.render('index')
})

app.post('/', async(req, res, next) => {
    try {
        const { url } = req.body
        
        if(!url){
            throw createHttpError.BadRequest('provide a valid url')
        }
        const urlExists = await ShortUrl.findOne({ url })
        console.log(urlExists)
        if(urlExists === null ){
            const shortUrl = new ShortUrl({url: url, shortId: generateRandomString(6) })
        const result = await shortUrl.save()
        res.render('index', 
        {short_url: `${req.hostname}/${result.shortId }`
    })
       
        }
        if(urlExists) {
            
            res.render('index', 
            {short_url: `${req.hostname}/${urlExists.shortId}`
        })
    }
    

         
    } catch (error) {
        next(error)
    }
})

app.get('/:shortId', async (req, res, next) =>{
    try {
        const { shortId } = req.params
    const result = await ShortUrl.findOne({ shortId })
    if(!result){
        throw createHttpError.NotFound('short url does not exist ')
    }
    res.redirect(result.url)
    } catch (error) {
      next(error)  
    }
    
})

app.use((req, res ,next ) => {
    next(createHttpError.NotFound());
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('index', {error: err.message});
})


app.listen(port, () => console.log(`server is running @ ${port}`));