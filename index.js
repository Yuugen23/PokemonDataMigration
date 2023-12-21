const csv = require('csv-parser');
const fs = require('fs');

const results = [];

fs.createReadStream('pokemon-data.csv')
    .pipe(csv({}))
    .on('data', (data) => results.push(data))
    .on('end', () => console.log(results[18].Type))

// const express = require('express');

// const app = express();

// app.use('/', (req,res,next) => {
//     res.send('<h3>home</h3>')
// })

// app.listen(3030);