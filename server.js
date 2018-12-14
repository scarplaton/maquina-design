const path = require('path');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const app = express();
const publicPath = path.join(__dirname, 'public');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(publicPath));

app.get('/', (request, response) => {
  response.sendFile(path.join(publicPath, 'iframe.html'));
});

app.get('/prueba', (request, response) => {
  response.sendFile(path.join(publicPath, 'test.html'));
});

app.get('/archivos', (request, response) => {
  fs.readdir(publicPath, (err, files) => {
    response.send(files);
  })
});

app.listen(port, () => {
  console.log('Running on port 3000')
});
