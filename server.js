const path = require('path');
const express = require('express');

const app = express();
const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));

app.get('/', (request, response) => {
  response.sendFile(path.join(publicPath, 'iframe.html'));
});

app.listen(3000, () => {
  console.log('Running on port 3000')
});
