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
    if(ieFolderPath.indexOf('.DS_Store') > 0) {
      continue;
    } else {
      const ieFolders = fs.readdirSync(ieFolderPath);//lee carpetas de ies
      for(var ie = 0; ie < ieFolders.length; ie++) {
        let ejercicioFoldersPath = path.join(ieFolderPath, ieFolders[ie]);
        if(ejercicioFoldersPath.indexOf('.DS_Store') > 0) {
          continue;
        } else {
          const ejercicioFolders = fs.readdirSync(ejercicioFoldersPath);
          for(var archivoEjercicio = 0; archivoEjercicio < ejercicioFolders.length; archivoEjercicio++) {
            let htmlsPath = path.join(ejercicioFoldersPath, ejercicioFolders[archivoEjercicio]);
            if(htmlsPath.indexOf('.DS_Store') > 0) {
              continue;
            } else {
              let datos = fs.readdirSync(htmlsPath).filter(x => !x.endsWith('.js') && !x.endsWith('.css') && !(x.indexOf('.DS_Store') === 0)).map(x => [
                ejercicioFolders[archivoEjercicio],
                oaFolders[oa],
                ieFolders[ie],
                path.join(ejercicioFoldersPath, ejercicioFolders[archivoEjercicio], x)
                        .replace("/Users/user/Documents/Sourcetree/maquina-design/public/", '')
              ]);
              archivos = archivos.concat(datos);
            }
          }
        }
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

app.get('/21Q', (request, response) => {
  let ejerciciosPath = path.join(publicPath, '21Q')
  const ejercicios = fs.readdirSync(ejerciciosPath);//lee carpetas de oas
  let htmlPaths = ejercicios.filter(x => x.endsWith('.html')).map(x => [x.replace('.html',''),`21Q/${x}`])
  response.send({
    draw: 1,
    recordsTotal: htmlPaths.length,
    recordsFiltered: htmlPaths.length,
    data: htmlPaths
  })
});

app.get('/cuestionario', (request, response) => {
  response.sendFile(path.join(publicPath, 'cuestionario.html'));
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
});
