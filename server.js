const path = require('path');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000;

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
  let archivos = [];
  const ejerciciosPath = path.join(publicPath, 'EJERCICIOS');
  const oaFolders = fs.readdirSync(ejerciciosPath);//lee carpetas de oas
  for(var oa = 0; oa < oaFolders.length; oa++) {
    let ieFolderPath = path.join(ejerciciosPath, oaFolders[oa]);
    const ieFolders = fs.readdirSync(ieFolderPath);//lee carpetas de ies
    for(var ie = 0; ie < ieFolders.length; ie++) {
      let ejercicioFoldersPath = path.join(ieFolderPath, ieFolders[ie]);
      const ejercicioFolders = fs.readdirSync(ejercicioFoldersPath);
      for(var archivoEjercicio = 0; archivoEjercicio < ejercicioFolders.length; archivoEjercicio++) {
        let htmlsPath = path.join(ejercicioFoldersPath, ejercicioFolders[archivoEjercicio]);
        let datos = fs.readdirSync(htmlsPath).filter(x => !x.endsWith('.js') && !x.endsWith('.css')).map(x => [
          ejercicioFolders[archivoEjercicio],
          oaFolders[oa],
          ieFolders[ie],
          path.join(ejercicioFoldersPath, ejercicioFolders[archivoEjercicio], x)
                  .replace('C:\\Users\\Usuario\\Desktop\\maquina-design\\public\\', '')
                  .replace(/\\/g, '/')
        ]);
        archivos = archivos.concat(datos);
      }
    }
  }
  response.send({
    draw: 1,
    recordsTotal: archivos.length,
    recordsFiltered: archivos.length,
    data: archivos
  });
});

app.listen(port, () => {
  console.log(`Running on port ${port}`)
});
