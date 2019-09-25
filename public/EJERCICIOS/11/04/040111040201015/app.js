//datos ejercicio
var contenidoBody = JSON.parse(document.body.getAttribute('data-content').replace(/\'/g, '\"'));
var versionBody = JSON.parse(document.body.getAttribute('data-version').replace(/\'/g, '\"'));
var svgGlosa = []

$(document).ready(function () {
  dibujaHtml();
  print();
});

function imagenEnTexto(imgsrc, alto, ancho) {
  return `<img src="${imgsrc.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../')}" height="${alto}" width="${ancho}"/>`
}

function repeticiones(cantidad, numero, signo) {
  cantidad = Number(cantidad);
  let con = "";
  for (let i = 0; i < cantidad; i++) {
    con += i + 1 === cantidad ? ` ${numero} ` : ` ${numero} ${signo} `;
  }
  return con;
}

function repeticionesImg(cantidad, imgsrc, alto, ancho, signo) {
  cantidad = Number(cantidad);
  let con = "";
  for (let i = 0; i < cantidad; i++) {
    con += i + 1 === cantidad ? ` <img src="${imgsrc.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../')}" height="${alto}" width="${ancho}"/> ` : `<img src="${imgsrc.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../')}" height="${alto}" width="${ancho}"/> ${signo} `;
  }
  return con;

}

function injectHtml(elemento, texto, styles) {
  return `<${elemento} style="${styles}">${texto}</${elemento}>`;
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function shuffle(arr, t = 10) {
  for (let i = 0; i < t; i++) {
    arr = arr.sort(() => (.5 - Math.random()));
  };
  return arr
}

function replace(texto, variables) {
  var result = texto.toString().replace(/\$[a-z]/g, function (coincidencia) { //coincidencia => '$a'
    for (var indexVar = 0; indexVar < variables.length; indexVar++) {
      if (variables[indexVar].var == coincidencia[1]) {
        return variables[indexVar].var;
      }
    }
  });
  return result;
}

function regex(theInput, theVariables, isTutorial) {
  var result = theInput.toString().replace(/\$[a-z]/g, function (coincidencia) { //coincidencia => '$a'
    for (var indexVar = 0; indexVar < theVariables.length; indexVar++) {
      if (theVariables[indexVar].var == coincidencia[1]) {
        return isTutorial ? theVariables[indexVar].vt : theVariables[indexVar].val;
      }
    }
  });
  return result;
}

function repeticiones(cantidad, numero, proceso) {
  cantidad = Number(cantidad);

  let con = "";
  for (let i = 0; i < cantidad; i++) {
    con += i + 1 === cantidad ? ` ${numero} ` : ` ${numero} ${proceso} `;
  }
  return con;
}

function numeroAPartitivo(numero, plural) {
  let s = plural === 'si' ? 's' : ''
  switch (numero) {
    case '2':
      return `medio${s}`
    case '3':
      return `tercio${s}`
    case '4':
      return `cuarto${s}`
    case '5':
      return `quinto${s}`
    case '6':
      return `sexto${s}`
    case '7':
      return `séptimo${s}`
    case '8':
      return `octavo${s}`
    case '9':
      return `noveno${s}`
    case '10':
      return `décimo${s}`
    case '11':
      return `onceavo${s}`
    case '12':
      return `doceavo${s}`
    default:
      return `[[[hay que agregar el partitivo]]]`
  }
}



function regexFunctions(text) {
  var result = text.replace(/\/\[.*?\/\]/g, function (coincidencia) { //coincidencia => '{funcion()}' o '[latex]'
    var final = coincidencia.length - 4;
    var funcion = coincidencia.substr(2, final).replace(/&gt;/g, '>').replace(/&lt;/, '<');
    try {
      return eval(funcion)
    } catch (error) {
      /*console.log(error);
      console.log(funcion)*/
      return coincidencia;
    }
  })
  return result;
}

function espacioMilesRegex(texto) {
  return texto.replace(/\d{1,}(\.\d{1,})?/g, function (coincidencia) { //coincidencia => 2000
    let entero = coincidencia.split('.')[0]
    let decimal = coincidencia.split('.')[1]
    let enteroEspaciado = entero.length >= 4 ? '' : entero
    if (entero.length >= 4) {
      let enteroReverse = entero.split('').reverse()
      let count = 1
      enteroReverse.forEach(function (numero) {
        if (count === 3) {
          enteroEspaciado = '&nbsp;' + numero + enteroEspaciado
          count = 1
        } else {
          enteroEspaciado = numero + enteroEspaciado
          count++;
        }
      })
    }
    return `${enteroEspaciado}${decimal ? ',' : ''}${decimal ? decimal : ''}`
  })
}
function espacioMilesRegexx(texto) {
  return texto.replace(/\d{1,}(\.\d{1,})?/g, function (coincidencia) { //coincidencia => 2000
    let entero = coincidencia.split('.')[0]
    let decimal = coincidencia.split('.')[1]
    let enteroEspaciado = entero.length >= 4 ? '' : entero
    if (entero.length >= 4) {
      let enteroReverse = entero.split('').reverse()
      let count = 1
      enteroReverse.forEach(function (numero) {
        if (count === 3) {
          enteroEspaciado = ' ' + numero + enteroEspaciado
          count = 1
        } else {
          enteroEspaciado = numero + enteroEspaciado
          count++;
        }
      })
    }
    return `${enteroEspaciado}${decimal ? ',' : ''}${decimal ? decimal : ''}`
  })
}

function cargaImagen(src) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.src = src;
    img.onload = function () {
      resolve(img);
    }
    img.onerror = function () {
      reject('no pasa nada');
    }
  });
}

function cargaFuente(nombre, src) {
  return new Promise(function (resolve, reject) {
    var font = new FontFace(nombre, `url('${src}')`, {});
    font.load().then(function (loadedFont) {
      document.fonts.add(loadedFont);
      loadedFont.load();
      loadedFont.loaded.then(() => {
        ////console.log('fuente ', nombre, ' cargada');
      }).catch(error => {
        ////console.log('errror al cargar imagen => ', error);
      });
      document.fonts.ready.then((fontFaceSet) => {
        ////console.log(fontFaceSet.size, 'FontFaces loaded.');
        resolve(nombre);
      })
    }).catch(function (error) {
      reject(error);
    });
  });
}

// ---INICIO--- funciones para modificar texto en texto
function fraccion(entero, numerador, denominador) {
  return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline" mathcolor="teal" mathbackground="yellow" mathsize="big">
	${entero > 0 ? `<mn>${Number(entero)}</mn>` : ''}
	<mrow>
		<mfrac>
				<mrow>
					 <mn>${Number(numerador)}</mn>
				</mrow>
				<mrow> 
					 <mn>${Number(denominador)}</mn> 
				</mrow>
		 </mfrac>
	</mrow>
</math>`;
}

function espacioMiles(stringNumero) {
  if (stringNumero.length >= 4) {
    var arrayReverse = String(stringNumero).split("").reverse();
    for (var i = 0, count = 0, valor = ''; i < arrayReverse.length; i++) {
      count++;
      if (count === 3 && arrayReverse[i + 1]) {
        valor = ' ' + arrayReverse[i] + valor;
        count = 0;
      } else {
        valor = arrayReverse[i] + valor;
      }
    }
    return valor;
  } else {
    return stringNumero;
  }
}
// ---FIN--- funciones para modificar texto en texto

const FUNCIONES = [
  {
    name: 'General', tag: 'general', fns: [
      { id: 'Insertar Texto', action: insertarTexto },
      { id: 'Insertar Input', action: insertarInput },
      { id: 'Insertar Input Fraccion', action: insertarInputFraccion },
      { id: 'Insertar Tabla', action: insertarTabla },
      { id: 'Insertar Imagen', action: insertarImagen }
    ]
  }, {
    name: 'SVG', tag: 'svg', fns: [
      { id: 'Recta', action: recta },
      { id: 'Tabla Posicional V2', action: tabPos }
    ]
  }, {
    name: 'Numeracion', tag: 'numeracion', fns: [
      { id: 'Recta Numérica', action: rectNumFn },
      { id: 'Tabla Posicional', action: tablaPosicional },
      { id: 'Valor Posicional', action: valorPosicional },
      { id: 'Repetición Pictóricos', action: repeticionPic },
      { id: 'Repeticion Bidimensional', action: repeticionBidimensional },
      { id: 'Multiplicacion Pictoricos', action: multiplicacionPic },
      { id: 'Abaco', action: abaco },
      { id: 'Multiplicacion Elementos', action: multiplicacionElem },
      { id: 'Repetición Pictóricos V2', action: repeticionPicV2 }
    ]
  }, {
    name: 'Medicion', tag: 'medicion', fns: [
    ]
  }
]

function print() { //Dibujar ejercicios
  var h = ['e', 'r', 'g'];
  h.forEach(n => {
    contenidoBody[n].forEach((m, i) => {
      for (var oaIndex = 0; oaIndex < FUNCIONES.length; oaIndex++) {

        if (FUNCIONES[oaIndex].tag === m.tag) {

          for (var funcionIndex = 0; funcionIndex < FUNCIONES[oaIndex].fns.length; funcionIndex++) {

            if (FUNCIONES[oaIndex].fns[funcionIndex].id === m.name) {

              FUNCIONES[oaIndex].fns[funcionIndex].action({
                container: document.getElementById(`container-${n}${i}`),
                params: m.params,
                versions: versionBody.vars,
                vt: false
              }, m.tag == 'svg' ? n : undefined);

              break;
            }
          }
          break;
        }
      }
    })
  })
  if (window.MathJax) {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, function () {
      if (document.querySelectorAll('#respuesta script').length > 0) {
        var respuestas = document.querySelectorAll('#respuesta .radio-div');
        var altoRespuestas = [];
        for (var i = 0; i < respuestas.length; i++) {
          altoRespuestas.push(respuestas[i].offsetHeight);
        }
        var maximo = Math.max(...altoRespuestas);
        for (var i = 0; i < respuestas.length; i++) {
          if (respuestas[i].offsetHeight != maximo) {
            respuestas[i].style.height = maximo + 'px';
          }
        }
      }
    }]);
  }
}

function dibujaHtml() {
  // INICIO ENUNCIADO
  var contenidoDiv = document.getElementById('enunciado');
  var contenidoHtml = '';
  contenidoBody['e'].forEach((m, i) => {
    contenidoHtml += `<div class="col-md-${m.width.md} col-sm-${m.width.sm} col-${m.width.xs} tag">`
    if (m.tag != 'general') {
      if (m.tag == 'svg') {
        contenidoHtml += `<svg id="container-e${i}" class="img-fluid mx-auto d-block"></svg>`
      } else {
        contenidoHtml += `<canvas id="container-e${i}" class="img-fluid mx-auto d-block"></canvas>`
      }
    } else {
      contenidoHtml += `<div id="container-e${i}" class="general"></div>`
    }
    contenidoHtml += '</div>'
  });
  contenidoDiv.innerHTML = contenidoHtml;
  // INICIO RESPUESTA
  var respuestaDiv = document.getElementById('respuesta');
  var respuestaHtml = '';

  var contenidoRespuestas = contenidoBody['r'].filter((item) => { //respuestas que deben estar en forma de imagen seleccionable
    if (item.tag != 'general') {
      return true;
    } else {
      return item.name === 'Insertar Imagen' || item.name === 'Insertar Tabla';
    }
  });
  if (contenidoRespuestas.length > 0) {
    contenidoRespuestas = shuffle(contenidoBody['r']);
    contenidoRespuestas.forEach(function (item, index) {
      var dataContent = {
        feedback: espacioMilesRegex(regexFunctions(regex(item.params.feed, versionBody.vars, false))),
        respuesta: `Opción ${index + 1}`,
        errFrec: item.params.errFrec === '' ? null : item.params.errFrec
      };
      let textoOpcion = item.params.textoOpcion ? regex(item.params.textoOpcion, versionBody.vars, false) : `Opción ${index + 1}`
      respuestaHtml += `<div class="col-md-${item.params.colmd} col-sm-${item.params.colsm} col-${item.params.col}">
          <div class="radio-div" onclick="seleccionaImagenRadio(event, 'label${index}')">
            <input id="rbtn${index}" name="answer" value="${textoOpcion}" type="radio" data-content='${JSON.stringify(dataContent)}' onchange="cambiaRadioImagen(event)"/>
            <label for="rbtn${index}" id="label${index}">${textoOpcion}</label>
						${
        item.tag != 'general' ?
          item.tag == 'svg' ?
            `<svg id="container-r${index}" class="img-fluid"></svg>` :
            `<canvas class="img-fluid" id="container-r${index}"></canvas>` :
          `<div id="container-r${index}" class="general"></div>`
        }
					</div>
				</div>`;
    });
  } else {
    contenidoBody['r'].forEach(function (item, index) {
      respuestaHtml += `<div class="col-md-${item.width.md} col-sm-${item.width.sm} col-xs-${item.width.xs} tag">`
      if (item.tag != 'general') {
        if (m.tag == 'svg') {
          contenidoHtml += `<svg id="container-r${index}" class="img-fluid mx-auto d-block"></svg>`
        } else {
          contenidoHtml += `<canvas id="container-r${index}" class="img-fluid mx-auto d-block"></canvas>`
        }
      } else {
        respuestaHtml += `<div id="container-r${index}" class="general"></div>`
      }
      respuestaHtml += '</div>'
    });
  }

  respuestaDiv.innerHTML = respuestaHtml;
  // INICIO GLOSA
  var glosaDiv = document.getElementById('glosa');
  var glosaHtml = '';
  contenidoBody['g'].forEach((m, i) => {
    glosaHtml += `<div class="col-md-${m.width.md} col-sm-${m.width.sm} col-xs-${m.width.xs} tag">`
    if (m.tag != 'general') {
      if (m.tag == 'svg') {
        glosaHtml += `<svg id="container-g${i}" class="img-fluid mx-auto d-block"></svg>`
      } else {
        glosaHtml += `<canvas id="container-g${i}" class="img-fluid mx-auto d-block"></canvas>`
      }
    } else {
      glosaHtml += `<div id="container-g${i}" class="general"></div>`
    }
    glosaHtml += '</div>'
  });
  glosaDiv.innerHTML = glosaHtml;
}

function insertarTexto(config) {
  const { container, params, variables, versions, vt } = config
  if (container) {
    let vars = vt ? variables : versions;
    var texto = regex(params.content, vars, vt);
    texto = regexFunctions(texto, true);
    texto = espacioMilesRegex(texto, true);
    container.innerHTML = texto;
  }
}
function insertarImagen(config) {
  const { container, params, variables, versions, vt } = config;
  const { src, display, height, width, col, colsm, colmd, offsetsm, offsetmd, errFrec, feed } = params;
  var source;
  try {
    var vars = vt ? variables : versions;
    var relativePath = src.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../');
    source = regex(relativePath, vars, vt);
  } catch (e) {
    //console.log(e);
  }
  cargaImagen(source).then(img => {
    if (display === 'alto exacto') {
      img.width = height * img.width / img.height;
      img.height = height;
      container.className = "text-center"
    } else if (display === 'ancho exacto') {
      img.height = width * img.height / img.width;
      img.width = width;
      container.className = "text-center"
    } else if (display === 'alto y ancho exacto') {
      img.width = width;
      img.height = height;
      container.className = "text-center"
    } else {
      img.className = "img-fluid";
      //si errfrec y feed estan seteados es una respuesta este grid se ocupa en el col de la pregunta
      container.className = (errFrec || feed) ? '' : `col-${col} col-sm-${colsm} offset-sm-${offsetsm} col-md-${colmd} offset-sm-${offsetmd}`;
    }
    container.innerHTML = "";
    container.appendChild(img);
  }).catch(error => {
    var img = document.createElement('img');
    img.src = "/notfound";
    img.alt = "Error al cargar imagen";
    container.appendChild(img);
    //console.log(error);
  });
}
function insertarInput(config) {
  const { container, params, variables, versions, vt } = config,
    { tipoInput, maxLength, inputSize, placeholder, anchoInput,
      error0, error2, error3, error4, defaultError,
      feed0, feed1, feed2, feed3, feed4, defaultFeed,
      value1, value2, value3, value4, inputType, colmd, colsm, col } = params
  var vars = vt ? variables : versions;
  let r = '', n = '', valoresReemplazados = '';
  var feedGenerico = espacioMilesRegex(regexFunctions(regex(feed0, vars, vt)));
  //console.log(feedGenerico)
  var answers = [{
    respuesta: espacioMilesRegex(regexFunctions(regex(value1, vars, vt))),
    feedback: espacioMilesRegex(regexFunctions(regex(feed1, vars, vt))),
    errFrec: null
  }];
  if (inputSize > 1) {
    answers[1] = {
      respuesta: espacioMilesRegex(regexFunctions(regex(value2, vars, vt))),
      feedback: feed0 === '' ? espacioMilesRegex(regexFunctions(regex(feed2, vars, vt))) : feedGenerico,
      errFrec: error0 === '' ? error2 : error0
    }
  }
  if (inputSize > 2) {
    answers[2] = {
      respuesta: espacioMilesRegex(regexFunctions(regex(value3, vars, vt))),
      feedback: feed0 === '' ? espacioMilesRegex(regexFunctions(regex(feed3, vars, vt))) : feedGenerico,
      errFrec: error0 === '' ? error3 : error0
    }
  }
  if (inputSize > 3) {
    answers[3] = {
      respuesta: espacioMilesRegex(regexFunctions(regex(value4, vars, vt))),
      feedback: feed0 === '' ? espacioMilesRegex(regexFunctions(regex(feed4, vars, vt))) : feedGenerico,
      errFrec: error0 === '' ? error4 : error0
    }
  }
  //console.log(answers)
  if (container) {
    switch (inputType) {
      case 'input':
        var dataContent = {
          tipoInput,
          answers,
          feedbackDefecto: feed0 === '' ? regexFunctions(regex(defaultFeed, vars, vt)) : feedGenerico,
          errFrecDefecto: error0 === '' ? defaultError : error0
        };
        container.innerHTML = '';
        switch (tipoInput) {
          case 'texto':
            container.innerHTML = `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" class="inputTexto" style="width:${anchoInput};" placeholder="${placeholder}" data-content='${utf8_to_b64(JSON.stringify(dataContent))}' onkeypress="cambiaInputTexto(event)" onkeyup="checkTexts()"/> `;
            break;
          case 'numero':
            container.innerHTML = `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" class="inputTexto" style="width:${anchoInput};" placeholder="${placeholder}" data-content='${utf8_to_b64(JSON.stringify(dataContent))}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />`;
            break;
          case 'texto-numerico':
            container.innerHTML = `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" class="inputTexto" style="width:${anchoInput};" placeholder="${placeholder}" data-content='${utf8_to_b64(JSON.stringify(dataContent))}' onkeypress="cambiaInputTexto(event)" onkeyup="checkTexts()"/>`;
            break;
        }
        break;
      case 'radio':
        container.innerHTML = '';
        container.className = 'row justify-content-center';
        answers = shuffle(answers);
        answers.forEach((m, i) => {
          var lmnt = document.createElement('div');
          lmnt.className = `col-${col} col-sm-${colsm} col-md-${colmd}`;
          lmnt.innerHTML = `<div class="opcionradio">
	<span></span>
	<input type="radio" id="radio-${i}" name="answer" value="${m.respuesta}" onchange="cambiaRadios(event)" data-content='${JSON.stringify(m)}'>
	<label for="radio-${i}">${m.respuesta}</label>
</div>`;
          lmnt.style.marginBottom = '5px';
          container.appendChild(lmnt);
        });
        break;
      case 'checkbox':
        arr.forEach((m, i) => {
          valoresReemplazados = replace(m, vars, vt);
          try {
            n = eval(valoresReemplazados)
            r += `<li key="${i}"><input name="answer" value="${n}" type="checkbox"/><label>${n}</label></li>`
          } catch (e) {
            r += `<li key="${i}"><input name="answer" value="${valoresReemplazados}" type="checkbox"/><label>${valoresReemplazados}</label></li>`
          }
        });
        container.innerHTML = r
        break;
      case 'textarea': container.innerHTML = '<textarea placeholder="Respuesta"></textarea>';
        break;
    }
  }
}

function insertarInputFraccion(config) {
  const { container, params, variables, versions, vt } = config;
  const { enteroMaxLen, numeradorMaxLen, denominadorMaxLen, validaciones, enteroCorrecta, numeradorCorrecta, denominadorCorrecta } = params
  let vars = vt ? variables : versions
  //console.log(regexFunctions(regex(b64_to_utf8(validaciones), vars, vt)))
  _VALIDACIONES_INPUT_TABLA_ = JSON.parse(regex(b64_to_utf8(validaciones), vars, vt));
  let inputFraccion = `<table class="mx-auto d-block">
	<tbody>
		<tr>
			<td rowspan="2">
				<input type="text" id="input1" name="answer" autocomplete="off" class="input-numerador" maxlength="${enteroMaxLen}" data-content='${JSON.stringify({ correctas: utf8_to_b64(regex(enteroCorrecta, vars, vt)), tipoInput: 'numero' })}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />
			</td>
			<td style="border-bottom: 2px solid black;">
				<input type="text" id="input2" name="answer" autocomplete="off" class="input-num-y-den" maxlength="${numeradorMaxLen}" data-content='${JSON.stringify({ correctas: utf8_to_b64(regex(numeradorCorrecta, vars, vt)), tipoInput: 'numero' })}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)"/>
			</td>
		</tr>
		<tr>
			<td>
				<input type="text" id="input3" name="answer" autocomplete="off" class="input-num-y-den" maxlength="${denominadorMaxLen}" data-content='${JSON.stringify({ correctas: utf8_to_b64(regex(denominadorCorrecta, vars, vt)), tipoInput: 'numero' })}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)"/>
			</td>
		</tr>
	</tbody>
</table>`
  container.innerHTML = inputFraccion;
}

function insertarTabla(config) {
  const { container, params, variables, versions, vt } = config,
    { table, cssclases, encabezado, lineasHorizontales, estiloLineaHorizontal, destacado, estiloFondoTD, anchoCols, tituloTabla, widthTabla, validaciones } = params,
    vars = vt ? variables : versions;
  if (validaciones) {
    //console.log(regex(b64_to_utf8(validaciones), vars, vt))
    _VALIDACIONES_INPUT_TABLA_ = JSON.parse(regex(b64_to_utf8(validaciones), vars, vt));
  }
  //_VALIDACIONES_INPUT_TABLA_ = validaciones != '' && JSON.parse(regex(validaciones, vars, vt));
  var marcasEnTd = destacado !== '' ? String(destacado).split(';') : false;
  function debeMarcarse(tr, td) {
    var encontrado = false;
    marcasEnTd.forEach(function (marca) {
      if (marca[0] == (tr + 1) && marca[2] == (td + 1)) {
        encontrado = true;
        return;
      }
    });
    return encontrado;
  }
  var marcasEnTd2 = lineasHorizontales !== '' ? String(lineasHorizontales).split(';') : false;

  function debeDelinearse(tr, td) {

    var encontrado = false;

    marcasEnTd2.forEach(function (linea) {

      if (linea[0] == (tr + 1) && linea[2] == (td + 1)) {
        encontrado = true;
        return;
      }
    });
    return encontrado;
  }

  let ancho = widthTabla !== '100%' ? `style="width: ${widthTabla};"` : "";
  if (container) {
    let r = `<table class="tabla ${cssclases}" ${ancho}><tbody>`;
    if (anchoCols) {
      var anchoColumnas = String(anchoCols).split(',');
      anchoColumnas.forEach(function (ancho) {
        r += `<col width="${ancho}%"/>`;
      });
    }

    for (var row = 0; row < table.length; row++) {
      r += '<tr>';
      for (var col = 0; col < table[row].length; col++) {
        if (destacado === '' && lineasHorizontales === '') {
          r += '<td>';
        } else if (destacado !== '' && lineasHorizontales === '') {
          if (debeMarcarse(row, col)) {
            r += `<td style="background:${estiloFondoTD};">`;
          } else { r += '<td>'; }
        } else if (destacado === '' && lineasHorizontales !== '') {
          if (debeDelinearse(row, col)) {
            r += `<td style="border-bottom: ${estiloLineaHorizontal};">`;
          } else { r += '<td>'; }
        } else if (destacado !== '' && lineasHorizontales !== '') {
          if (debeDelinearse(row, col)) {
            r += `<td style="border-bottom: ${estiloLineaHorizontal};">`;
            if (debeMarcarse(row, col)) {
              r += `<td style="background:${estiloFondoTD};">`;
            }
          } else if (debeMarcarse(row, col)) {
            r += `<td style="background:${estiloFondoTD};">`;
          } else {
            r += '<td>';
          }
        }

        switch (table[row][col].type) {
          case 'text':
            if (table[row][col].value.tachar) {
              var tachado = regexFunctions(regex(table[row][col].value.tachar, vars, vt)) === 'si' ? `class="strikethrough"` : '';
            } else {
              var tachado = ''
            }
            if (encabezado === 'arriba' && row === 0) {
              r += `<p ${tachado}><b>${espacioMilesRegex(regexFunctions(regex(table[row][col].value.text, vars, vt)))}</b></p>`;
            } else if (encabezado === 'izquierda' && col === 0) {
              r += `<p ${tachado}><b>${espacioMilesRegex(regexFunctions(regex(table[row][col].value.text, vars, vt)))}</b></p>`;
            } else {
              r += `<p ${tachado}>${espacioMilesRegex(regexFunctions(regex(table[row][col].value.text, vars, vt)))}</p>`;
            }
            break;
          case 'image':
            var relativePath = table[row][col].value.url.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../');
            r += `<img src=${regex(relativePath, vars, vt)} height=${table[row][col].value.height} width=${table[row][col].value.width}/>`;
            break;
          case 'input':
            var { anchoInput, correctas, idInput, maxLength, placeholder, tipoInput } = table[row][col].value;
            var dataContent = {
              correctas: utf8_to_b64(regex(correctas, vars, vt)),
              tipoInput
            }
            switch (tipoInput) {
              case 'text':
                r += `<input type="text" id="${idInput}" name="answer" maxlength="${maxLength}" placeholder="${placeholder}" style="width:${anchoInput};" autocomplete="off" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputTexto(event)" />`;
                break;
              case 'numero':
                r += `<input type="text" id="${idInput}" name="answer" maxlength="${maxLength}" placeholder="${placeholder}" style="width:${anchoInput};" autocomplete="off" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />`;
                break;
              case 'alfanumerico':
                r += `<input type="text" id="${idInput}" name="answer" maxlength="${maxLength}" placeholder="${placeholder}" style="width:${anchoInput};" autocomplete="off" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputAlfanumerico(event)"/>`;
                break;
            }
            break;
          case 'text-input':
            var { text, tipoInput, maxLength, error0, error2, error3, error4, defaultError,
              feed0, feed1, feed2, feed3, feed4, defaultFeed,
              value1, value2, value3, value4 } = table[row][col].value;
            var p = regex(text, vars, vt);
            var feedGenerico = regex(feed0, vars, vt);
            var answers = [{
              respuesta: regex(value1, vars, vt),
              feedback: regex(feed1, vars, vt),
              errFrec: null
            }];
            if (value2 !== '') {
              answers[1] = {
                respuesta: regex(value2, vars, vt),
                feedback: feed0 === '' ? regexFunctions(regex(feed2, vars, vt)) : feedGenerico,
                errFrec: error0 === '' ? error2 : error0
              }
            }
            if (value3 !== '') {
              answers[2] = {
                respuesta: regex(value3, vars, vt),
                feedback: feed0 === '' ? regexFunctions(regex(feed3, vars, vt)) : feedGenerico,
                errFrec: error0 === '' ? error3 : error0
              }
            }
            if (value4 !== '') {
              answers[3] = {
                respuesta: regex(value4, vars, vt),
                feedback: feed0 === '' ? regexFunctions(regex(feed4, vars, vt)) : feedGenerico,
                errFrec: error0 === '' ? error4 : error0
              }
            }
            var dataContent = {
              tipoInput,
              answers,
              feedbackDefecto: feed0 === '' ? regexFunctions(regex(defaultFeed, vars, vt)) : feedGenerico,
              errFrecDefecto: error0 === '' ? defaultError : error0
            };
            var input;
            switch (tipoInput) {
              case 'text':
                input = `<input type="text" name="answer" maxlength="${maxLength}" placeholder="${placeholder}" style="width:${anchoInput};" autocomplete="off" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputTexto(event)" />`;
                break;
              case 'numero':
                input = `<input type="text" name="answer" maxlength="${maxLength}" placeholder="${placeholder}" style="width:${anchoInput};" autocomplete="off" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />`;
                break;
              case 'alfanumerico':
                input = `<input type="text" name="answer" maxlength="${maxLength}" placeholder="${placeholder}" style="width:${anchoInput};" autocomplete="off" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputAlfanumerico(event)"/>`;
                break;
            }
            r += `<p>${p.replace('{input}', input)}</p>`;
            break;
          case 'text-image':
            var p = regex(table[row][col].value.text, vars, vt);
            var relativePath = table[row][col].value.url.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../');
            var img = `<img src=${regex(relativePath, vars, vt)} height=${table[row][col].value.height} width=${table[row][col].value.width}/>`;

            p = `<p>${p.replace(/\{imagen\}/g, img)}</p>`
            r += regexFunctions(p)
            break;
        }
        r += '</td>';
      }
      r += '</tr>'
    }
    r += '</tbody></table>';
    container.classList.add("table-responsive");
    container.innerHTML = r;
    if (tituloTabla !== '') {
      container.parentElement.querySelectorAll('span').forEach(e => e.parentNode.removeChild(e));
      var titulo = document.createElement('span');
      titulo.innerText = regexFunctions(regex(tituloTabla, vars, vt));
      titulo.style.fontSize = '18px';
      titulo.style.fontWeight = '600';
      titulo.style.color = 'black';
      container.parentNode.insertBefore(titulo, container);
    }
  }
}
//inicio rect num
async function rectNumFn(config) {
  const { container, params, variables, versions, vt } = config
  let rectFontType = 'OpenSansRegular';
  await cargaFuente(rectFontType, '../../../../fonts/OpenSans-Regular-webfont.woff');
  const {
    // General
    rectType, decimalScale, height, width, /*background,*/
    // Borde
    /* borderWidth, borderColor, borderStyle, borderRadius, */
    // Títulos
    titleValue, titleColor, titleSize, titleWeight,
    // Padding
    canvasPadding, containerPadding, chartPadding,
    // Escala
    scaleValue, scaleDivisions, scaleWidth, scaleLength, scaleColor,
    // Valor
    initValue, valuesSeparator,
    // Mostrar
    showFirstValue, showExValues, showAllValues, selectValuesToShow, showPointValue,
    wichPointValue, showFigValue, wichFigValues,
    showArcs, initArcPt, endArcPt, showConstant,
    //mostrar figuras
    srcFig1, altoFig1, ubicacionFig1, mostrarNum1, mostrarMar1, posicionesFig1,
    srcFig2, altoFig2, ubicacionFig2, mostrarNum2, mostrarMar2, posicionesFig2,
    srcFig3, altoFig3, ubicacionFig3, mostrarNum3, mostrarMar3, posicionesFig3,
    srcFig4, altoFig4, ubicacionFig4, mostrarNum4, mostrarMar4, posicionesFig4,
    // Tramo LLave
    showTramoLlave, tramoInicio, tramoFin, tramoTexto, tramoAltoTexto, tramoMostrarNumero, tramoColor, tramoForma, tramoAltura,
    // Mini Escala
    showMiniScale, showMiniTheValue, showMiniExValues, showMiniAllValues,
    showMiniPointValue, showMiniFig, wichMiniFigValues, showMiniArcs,
    initArcPtMini, endArcPtMini, showMiniGuides, showLens, alignLens,
    // Ejes
    axisColor, withArrows, axisWidth,
    // Fuente
    fontColor, fontSize, fontFamily, fontWeight,
  } = params

  let canvasPaddingAux = {}, containerPaddingAux = {}, chartPaddingAux = {}/*, innerChartPaddingAux = {}*/
  canvasPaddingAux.top = eval(canvasPadding.split(',')[0])
  canvasPaddingAux.right = eval(canvasPadding.split(',')[1])
  canvasPaddingAux.bottom = eval(canvasPadding.split(',')[2])
  canvasPaddingAux.left = eval(canvasPadding.split(',')[3])
  containerPaddingAux.top = eval(containerPadding.split(',')[0])
  containerPaddingAux.right = eval(containerPadding.split(',')[1])
  containerPaddingAux.bottom = eval(containerPadding.split(',')[2])
  containerPaddingAux.left = eval(containerPadding.split(',')[3])
  chartPaddingAux.top = eval(chartPadding.split(',')[0])
  chartPaddingAux.right = eval(chartPadding.split(',')[1])
  chartPaddingAux.bottom = eval(chartPadding.split(',')[2])
  chartPaddingAux.left = eval(chartPadding.split(',')[3])
  //innerChartPaddingAux = eval(innerChartPadding)

  container.width = width
  container.height = height

  let c = container
  let vars = vt ? variables : versions

  let state = {}
  state.ctx = c.getContext('2d')
  state.typeRect = rectType
  state.scale = {
    decimalScale: decimalScale === 'si' ? true : false,
    divisions: Number(regex(scaleDivisions, vars, vt)),//eval(rectValuesDec) !== undefined ? eval(scaleDivisions) > eval(rectValuesDec) ? eval(scaleDivisions) + 1 : eval(rectValuesDec) + 2 : eval(scaleDivisions) + 1,
    value: /*state.typeRect !== 'enteros' ? 1 : */ eval(regex(scaleValue, vars, vt)) === 0 ? 1 : eval(regex(scaleValue, vars, vt)),
    width: c.width < 500 ? eval(scaleWidth) * 0.6 : eval(scaleWidth),
    color: scaleColor,
    length: c.width < 500 ? eval(scaleLength) * 0.7 : eval(scaleLength)
  }
  state.show = {
    extValues: showExValues === 'si' ? true : false,
    firstValue: showFirstValue === 'si' ? true : false,
    allValues: {
      show: showAllValues !== 'no' ? showAllValues : false,
      values: regex(selectValuesToShow, vars, vt)
    },
    points: {
      show: showPointValue !== 'no' ? true : false,
      values: wichPointValue
    },
    figures: {
      show: showFigValue === 'no' ? false : showFigValue,
      values: wichFigValues,
      imagenes: []
    },
    arcs: {
      show: showArcs !== 'no' ? showArcs : false,
      values: {
        init: regex(initArcPt, vars, vt),
        end: regex(endArcPt, vars, vt),
        constant: showConstant === 'si' ? true : false
      }
    },
    tramoLLave: {
      mostrar: showTramoLlave === 'si' ? true : false,
      inicio: regex(tramoInicio, vars, vt),
      fin: regex(tramoFin, vars, vt),
      texto: regex(tramoTexto, vars, vt),
      alto: Number(tramoAltoTexto),
      color: tramoColor,
      forma: tramoForma,
      altura: Number(tramoAltura)
    },
    miniScale: {
      show: (rectType !== 'enteros' && rectType !== 'mixta') && showMiniScale === 'si' ? true : false,
      extValues: showMiniExValues === 'si' ? true : false,
      allValues: showMiniAllValues === 'si' ? true : false,
      theValue: showMiniTheValue,
      point: showMiniPointValue === 'si' ? true : false,
      figure: {
        show: showMiniFig === 'no' ? false : showMiniFig,
        values: wichMiniFigValues
      },
      arcs: {
        show: showMiniArcs !== 'no' ? showMiniArcs : false,
        init: initArcPtMini,
        end: endArcPtMini
      },
      guides: showMiniGuides === 'si' ? true : false,
      lens: {
        show: showLens === 'si' ? true : false,
        align: alignLens === 'punto' ? true : false
      }
    }
  }
  state.font = {
    family: fontFamily,
    weight: fontWeight,
    size: c.width < 500 ? eval(fontSize) * 0.6 : eval(fontSize),
    color: fontColor,
    align: 'left' // end, right, center, start, left
  }
  state.titles = {
    mainTitle: {
      title: titleValue,
      alignX: 'center',
      alignY: 'top',
      font: {
        family: fontFamily,
        weight: titleWeight,
        color: titleColor,
        size: eval(titleSize)
      },
      color: titleColor,
      move: { moveY: 0, moveX: 0 }
    }
  }
  state.canvas = {
    height: c.height,
    width: c.width,
    padding: {
      top: c.height * (canvasPaddingAux.top / 1000),
      right: c.width * (canvasPaddingAux.right / 1000),
      bottom: c.height * (canvasPaddingAux.bottom / 1000),
      left: c.width * (canvasPaddingAux.left / 1000)
    }
  }
  state.canvas.position = {
    x0: state.canvas.padding.left,
    y0: state.canvas.padding.top,
    x1: c.width - (state.canvas.padding.right),
    y1: c.height - (state.canvas.padding.bottom)
  }
  state.container = {
    padding: {
      top: c.height * (containerPaddingAux.top / 1000),
      right: c.width * (containerPaddingAux.right / 1000),
      bottom: c.height * (containerPaddingAux.bottom / 1000),
      left: c.width * (containerPaddingAux.left / 1000)
    }
  }
  state.container.position = {
    x0: state.canvas.position.x0 + state.container.padding.left,
    y0: state.canvas.position.y0 + state.container.padding.top + state.titles.mainTitle.font.size,
    x1: state.canvas.position.x1 - state.container.padding.right,
    y1: state.canvas.position.y1 - state.container.padding.bottom
  }
  state.chart = {
    padding: {
      top: c.height * (chartPaddingAux.top / 1000),
      right: c.width * (chartPaddingAux.right / 1000),
      bottom: c.height * (chartPaddingAux.bottom / 1000),
      left: c.width * (chartPaddingAux.left / 1000)
    },
    axis: {
      width: c.width < 500 ? eval(axisWidth) * 0.6 : eval(axisWidth),
      color: axisColor,
      arrows: withArrows == 'si' ? true : false,
      arrowColor: axisColor
    },
    image: {
      //showLens: showLens === 'si' ? true : false,
      lupa: 'https://contenedoradapt.adaptativamente.cl/frontejercicios/imagenes_front/recta_numerica/lupa_recta.svg',
      pictoImg: 'https://contenedoradapt.adaptativamente.cl/frontejercicios/imagenes_front/recta_numerica/rombo_recta.svg'
    },
    values: {
      initValue: regex(initValue, vars, vt),
      valuesSeparator: valuesSeparator == 'coma' ? ',' : '.'
    }
  }
  state.chart.position = {
    x0: state.container.position.x0 + state.chart.padding.left,
    y0: state.container.position.y0 + state.chart.padding.top,
    x1: state.container.position.x1 - state.chart.padding.right,
    y1: state.container.position.y1 - state.chart.padding.bottom
  }

  state.show.figures.imagenes[0] = srcFig1 != '' ? {
    src: srcFig1.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
    alto: Number(altoFig1),
    ubicacion: ubicacionFig1,
    posiciones: regex(posicionesFig1, vars, vt),
    mostrarNumero: mostrarNum1 == 'si' ? true : false,
    mostrarMarca: mostrarMar1 == 'si' ? true : false
  } : undefined;

  state.show.figures.imagenes[1] = srcFig2 != '' ? {
    src: srcFig2.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
    alto: Number(altoFig2),
    ubicacion: ubicacionFig2,
    posiciones: regex(posicionesFig2, vars, vt),
    mostrarNumero: mostrarNum2 == 'si' ? true : false,
    mostrarMarca: mostrarMar2 == 'si' ? true : false
  } : undefined;
  state.show.figures.imagenes[2] = srcFig3 != '' ? {
    src: srcFig3.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
    alto: Number(altoFig3),
    ubicacion: ubicacionFig3,
    posiciones: regex(posicionesFig3, vars, vt),
    mostrarNumero: mostrarNum3 == 'si' ? true : false,
    mostrarMarca: mostrarMar3 == 'si' ? true : false
  } : undefined
  state.show.figures.imagenes[3] = srcFig4 != '' ? {
    src: srcFig4.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
    alto: Number(altoFig4),
    ubicacion: ubicacionFig4,
    posiciones: regex(posicionesFig4, vars, vt),
    mostrarNumero: mostrarNum4 == 'si' ? true : false,
    mostrarMarca: mostrarMar4 == 'si' ? true : false
  } : undefined;

  let mainData = {
    pointsData: ptosPrincipales(state),
    pointsDataMini: ptosPrincipalesMini(state)
  }
  // dibujarBordes(state, state.canvas, 'red') // Canvas
  // dibujarBordes(state, state.container, 'blue') // Container
  // dibujarBordes(state, state.chart, 'green') // Chart

  init(state, mainData)

  function ptosPrincipales(state) {
    const { typeRect, chart, show, scale } = state
    const { x0, y0, x1, y1 } = chart.position
    let centroY = (y1 - y0) / 2 + y0
    if (show.miniScale.show && !(typeRect === 'centesimal' || typeRect === 'mixta centesimal')) {
      centroY = (y1 - y0) / 4 + y0
    }
    let segmento = (x1 - x0) / (scale.divisions + 2)
    let divisiones = scale.divisions
    let escalaValor = scale.value
    let xIni = x0 + segmento
    let xFin = x1 - segmento
    return {
      eje: {
        xIni: x0,
        xFin: x1,
        centroY,
        segmento,
        divisiones
      },
      recta: {
        xIni,
        xFin,
        centroY,
        segmento,
        divisiones,
        escalaValor
      }
    }
  }

  function ptosPrincipalesMini(state) {
    const { chart } = state
    const { x0, y0, x1, y1 } = chart.position
    let divisiones = 10
    let escalaValor = 1
    let contenedorAncho = x1 - x0
    let margenEje = contenedorAncho / 8
    let xIniEje = x0 + margenEje
    let xFinEje = x1 - margenEje
    let ejeAncho = xFinEje - xIniEje
    let segmento = ejeAncho / (divisiones + 2)
    let xIniRecta = xIniEje + segmento
    let xFinRecta = xFinEje - segmento

    let centroY = (y1 - y0) * 3 / 4 + y0
    return {
      eje: {
        xIni: xIniEje,
        xFin: xFinEje,
        centroY,
        segmento,
        divisiones
      },
      recta: {
        xIni: xIniRecta,
        xFin: xFinRecta,
        centroY,
        segmento,
        divisiones,
        escalaValor
      }
    }
  }

  // Inicializa la graficación de la recta
  function init(state, mainData) {
    const { show, typeRect } = state
    insertarTitPrinc(state)
    ejePrincipal(state, mainData.pointsData)
    const { guides, lens } = show.miniScale
    if (show.miniScale.show && !(typeRect === 'centesimal' || typeRect === 'mixta centesimal')) {
      ejeSecundario(state, mainData.pointsDataMini)
      if (guides || lens.show) {
        dibujarGuiasLente(state, mainData)
      }
    }
    function dibujarGuiasLente(state, mainData) {
      const { typeRect, show, scale, chart, font } = state
      const { theValue, guides } = show.miniScale
      const { pointsData } = mainData
      let iniVal = Number(chart.values.initValue)
      let miniVal = Number(theValue)
      let valMin, valMax, miniValMin, /*miniValMax,*/ puntoXIni, puntoXFin

      let posIniGuia, posFinGuia
      if (typeRect === 'decimal' || typeRect === 'mixta decimal') {
        if (iniVal.toFixed(2).split('.')[1][0]) {
          valMin = Number(`${iniVal.toFixed(2).split('.')[0]}.${iniVal.toFixed(2).split('.')[1][0]}`)
          valMax = valMin + 1
          if (miniVal.toFixed(2).split('.')[1][0]) {
            miniValMin = Number(`${miniVal.toFixed(2).split('.')[0]}.${miniVal.toFixed(2).split('.')[1][0]}`)
            // miniValMax = miniValMin + 0.1
            posIniGuia = Number(((miniValMin - valMin) * 10).toFixed(0))
            posFinGuia = posIniGuia + 1
          }
        }
      }
      if (miniVal >= valMin && miniVal <= valMax) {
        puntoXIni = pointsData.recta.xIni + pointsData.recta.segmento * posIniGuia
        puntoXFin = pointsData.recta.xIni + pointsData.recta.segmento * posFinGuia
      }



      let miniPuntoXIni = mainData.pointsDataMini.recta.xIni
      let miniPuntoXFin = mainData.pointsDataMini.recta.xFin
      let miniPuntoY = mainData.pointsDataMini.recta.centroY
      let delta = scale.length * 2
      let puntoY = miniPuntoY - mainData.pointsData.recta.centroY - scale.length * 2 - font.size * 2.3
      guides && dibujarLinea(state, miniPuntoXIni, miniPuntoXFin, miniPuntoY, puntoXIni, puntoXFin, puntoY, delta)
      lens.show && dibujarLente(state, puntoXIni, puntoXFin, puntoY, pointsData.recta.segmento)
      // xIni, xFin, centroY, segmento
      function dibujarLinea(state, miniPuntoXIni, miniPuntoXFin, miniPuntoY, puntoXIni, puntoXFin, puntoY, delta) {
        const { ctx, scale, font } = state
        ctx.lineWidth = scale.width * 2 / 3
        ctx.strokeStyle = font.color
        ctx.fillStyle = font.color
        // let delta = scale.length*2
        ctx.beginPath()
        ctx.moveTo(miniPuntoXIni, miniPuntoY - delta)
        ctx.lineTo(puntoXIni, miniPuntoY - puntoY)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(miniPuntoXFin, miniPuntoY - delta)
        ctx.lineTo(puntoXFin, miniPuntoY - puntoY)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
      }
      function dibujarLente(state, puntoXIni, puntoXFin, puntoY, imgWidth) {
        const { ctx, chart } = state
        const { lupa } = chart.image
        ctx.save()
        let img = new Image()
        img.src = lupa
        let factorImg = (129 / 191)
        let imageWidth = imgWidth * 2.2
        let imageHeight = imageWidth * factorImg
        let centerX, centerY
        centerY = puntoY - imageHeight * 0.38
        centerX = puntoXIni - imgWidth / 2.2
        img.onload = function () {
          // img.width = imgWidth
          // img.height = imgWidth*factorImg
          ctx.translate(centerX + imageWidth / 2, centerY + imageHeight / 2)
          ctx.rotate(60 * Math.PI / 180)
          ctx.drawImage(img, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight)
        }
        ctx.restore()
        ctx.save()

      }
    }
  }

  // Main Title
  function insertarTitPrinc(state) {
    const { ctx, canvas } = state
    const { mainTitle } = state.titles
    if (mainTitle.title !== '') {
      ctx.save()
      let x = (canvas.position.x1) / 2 + mainTitle.move.moveX + canvas.position.x0
      let y = 0 + canvas.position.y0 + mainTitle.move.moveY
      ctx.translate(x, y)
      ctx.fillStyle = mainTitle.color
      ctx.textAlign = mainTitle.alignX
      ctx.textBaseline = mainTitle.alignY
      ctx.font = mainTitle.font.weight + ' ' + mainTitle.font.size + 'px ' + rectFontType;
      ctx.fillText(mainTitle.title, 0, 0)
      ctx.restore()
      ctx.save()
    }
  }

  /*-------------------------------- Begin Eje Principal --------------------------------*/

  function ejePrincipal(state, data) {
    const { scale, typeRect, chart } = state
    generarEje(state, data.eje)
    generarEscala(state, data.recta)
    if (typeRect === 'enteros' || typeRect === 'enteros con decimales' || typeRect === 'decimal' || typeRect === 'mixta' || typeRect === 'mixta decimal') {
      scale.decimalScale && generarEscalaDec(state, data.recta)
    }
    if (chart.values.initValue) {
      mostrarDatos(state, data.recta)
    }
  }

  function ejeSecundario(state, data) {
    generarEje(state, data.eje)
    generarEscala(state, data.recta)
    mostrarDatosEjeSec(state, data.recta)
  }

  /*-------------------------------- End Eje Principal --------------------------------*/

  /* -------------------------------- Begin Eje Genérico -------------------------------- */
  function generarEje(state, dataEje) {
    const { xIni, xFin, centroY } = dataEje
    const { ctx, chart, scale } = state
    ctx.save()
    ctx.lineWidth = chart.axis.width
    ctx.strokeStyle = chart.axis.color
    let arrowsLenght = scale.length * 0.7
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (chart.axis.arrows) {
      ctx.beginPath()
      ctx.moveTo(xIni + arrowsLenght, centroY - arrowsLenght)
      ctx.lineTo(xIni, centroY)
      ctx.lineTo(xIni + arrowsLenght, centroY + arrowsLenght)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(xFin - arrowsLenght, centroY - arrowsLenght)
      ctx.lineTo(xFin, centroY)
      ctx.lineTo(xFin - arrowsLenght, centroY + arrowsLenght)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.lineWidth = chart.axis.width
    ctx.moveTo(xIni, centroY)
    ctx.lineTo(xFin, centroY)
    ctx.stroke()
    //ctx.closePath()
    ctx.restore()
    ctx.save()
  }

  function generarEscala(state, dataRecta) {
    const { ctx, scale } = state
    const { xIni, centroY, segmento, divisiones } = dataRecta
    ctx.save()
    let bordersScales = scale.length
    ctx.strokeStyle = scale.color
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = scale.width
    for (let i = 0; i <= divisiones; i++) {
      let xPos = xIni + segmento * i
      ctx.beginPath()
      ctx.moveTo(xPos, centroY - bordersScales)
      ctx.lineTo(xPos, centroY + bordersScales)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.restore()
    ctx.save()
  }

  function generarEscalaDec(state, dataRecta) {
    const { xIni, centroY, segmento, divisiones } = dataRecta
    const { ctx, scale, typeRect } = state
    ctx.save()
    ctx.strokeStyle = scale.color
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (let i = 0; i < divisiones; i++) {
      ctx.lineWidth = scale.width
      let bordersScales = scale.length
      if (typeRect !== 'enteros' || typeRect !== 'mixta') {
        for (let j = 1; j < 10; j++) {
          let extraLarge = j === 5 ? bordersScales * 0.2 : 0
          let xPos = xIni + segmento * i + segmento / 10 * j
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(xPos, centroY - bordersScales * 0.7 - extraLarge)
          ctx.lineTo(xPos, centroY + bordersScales * 0.7 + extraLarge)
          ctx.stroke()
          ctx.closePath()
        }
      }
    }
    ctx.restore()
    ctx.save()
  }
  /* -------------------------------- End Eje Genérico -------------------------------- */

  /*-------------------------------- Eje Secundario --------------------------------*/


  function mostrarDatos(state, dataRecta) {
    const { show } = state
    const { extValues, firstValue, allValues, points, figures, arcs, tramoLLave } = show
    const { xIni, centroY, segmento, divisiones } = dataRecta
    let valores = [];
    for (let i = 0; i <= divisiones; i++) {
      let xPos = xIni + segmento * i
      let valor = numeroValidacion(state, i)
      // Mostrar valores externos
      if (i === 0 || i === divisiones) {
        extValues && mostrarValorExterno(state, xPos, centroY, i, valor);
        (i === 0 && firstValue) && mostrarValorExterno(state, xPos, centroY, i, valor);
      } else {
        let arrValoresAll = arrNumerosValidacion(state, allValues.values)
        allValues.show && mostrarValor(state, xPos, centroY, i, valor, arrValoresAll)
      }
      let arrValoresPoints = arrNumerosValidacion(state, points.values)
      points.show && mostrarPunto(state, dataRecta, xPos, centroY, i, valor, arrValoresPoints)
      let arrValoresFig = arrNumerosValidacion(state, figures.values)
      figures.show && mostrarFigura(state, dataRecta, xPos, centroY, i, valor, arrValoresFig)
      let arrValoresArcInit = arrNumerosValidacion(state, arcs.values.init)
      let arrValoresArcEnd = arrNumerosValidacion(state, arcs.values.end)
      arcs.show && mostrarArco(state, dataRecta, xPos, centroY, i, valor, arrValoresArcInit, arrValoresArcEnd, arcs.values.constant)
      valores.push({ valor, xPos });
    }
    if (tramoLLave.mostrar) {
      mostrarTramoLlave(state, valores, tramoLLave, dataRecta);
    }
    if (figures.show) {
      mostrarImagenesEnPosicion(state, valores, dataRecta);
    }
  }

  function mostrarImagenesEnPosicion(state, valores, dataRecta) {
    const { ctx, show, scale, font, chart } = state;
    const { initValue } = chart.values
    const { figures } = show;
    const { xIni, centroY, segmento, escalaValor } = dataRecta;
    Promise.all(figures.imagenes.map(x => x ? cargaImagen(x.src) : null)).then((imagen) => {
      imagen.forEach((imagen, index) => {
        if (!figures.imagenes[index]) {
          return;
        }
        figures.imagenes[index].imagenRecta = imagen;
      });
      return figures.imagenes;
    }).then(imagenes => {
      let xInicio = xIni - segmento;
      let valorInicial = Number(initValue) - escalaValor;
      //console.log(imagenes);
      imagenes.forEach(img => {
        if (!img) {
          return;
        }
        const { alto, ubicacion, posiciones, imagenRecta, mostrarNumero, mostrarMarca } = img;
        let posicionesImagen = posiciones.split(',');
        let yImagen = ubicacion === 'arriba' ?
          centroY - scale.length * 1.7 - alto :
          centroY + scale.length * 1.7;
        let widthImagen = imagenRecta.width * alto / imagenRecta.height;
        posicionesImagen.forEach((posicion, index) => {
          let datosPosicion = valores.find(x => x.valor === posicion);
          let xCentro;
          if (datosPosicion) {
            xCentro = datosPosicion.xPos;
            let xImagen = xCentro - widthImagen / 2;
            ctx.drawImage(imagenRecta, xImagen, yImagen, widthImagen, alto);
          } else {
            let diferenciaEnEscala = (posicion - valorInicial) / escalaValor;
            xCentro = xInicio + segmento * diferenciaEnEscala;
            let xImagen = xCentro - widthImagen / 2;
            ctx.drawImage(imagenRecta, xImagen, yImagen, widthImagen, alto);
          }
          if (mostrarNumero) {
            let yNumero = ubicacion === 'arriba' ? centroY : centroY - (scale.length * 1.7) * 2 - font.size;
            mostrarValor(state, xCentro, yNumero, 0, posicion, [posicion]);
          }
          if (mostrarMarca) {
            ctx.save()
            let bordersScales = scale.length
            ctx.strokeStyle = scale.color
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.lineWidth = scale.width
            ctx.beginPath()
            ctx.moveTo(xCentro, centroY - bordersScales)
            ctx.lineTo(xCentro, centroY + bordersScales)
            ctx.stroke()
            ctx.closePath()
            ctx.restore()
            ctx.save()
          }
        });
      });
    }).catch(error => {
      //console.log(error);
    });
  }

  function mostrarTramoLlave(state, valores, tramoLLave, dataRecta) {
    const { ctx, canvas, scale, chart, font } = state
    const { inicio, fin, color, alto, texto, forma, altura } = tramoLLave;
    const { initValue } = chart.values
    const { xIni, centroY, segmento, escalaValor } = dataRecta;

    let radio = 15;
    let datosInicio = valores.find(x => x.valor === inicio);
    let datosFin = valores.find(x => x.valor === fin);
    let xInicio, xFin;
    if (datosInicio && datosFin) {
      xInicio = forma === 'igual' ? datosInicio.xPos : forma === 'incluido' ? datosInicio.xPos - 5 : datosInicio.xPos + 5;
      xFin = forma === 'igual' ? datosFin.xPos : forma === 'incluido' ? datosFin.xPos + 5 : datosFin.xPos - 5;
    } else {
      let xInicioRect = xIni - segmento;
      let valorInicial = Number(initValue) - escalaValor;
      let diferenciaEscalaInicio = (Number(inicio) - valorInicial) / escalaValor;
      let diferenciaEscalaFin = (Number(fin) - valorInicial) / escalaValor;
      xInicio = xInicioRect + segmento * diferenciaEscalaInicio;
      xFin = xInicioRect + segmento * diferenciaEscalaFin;
      xInicio = forma === 'igual' ? xInicio : forma === 'incluido' ? xInicio - 5 : xInicio + 5;
      xFin = forma === 'igual' ? xFin : forma === 'incluido' ? xFin - 5 : xFin + 5;
    }
    let xMitad = (xInicio + xFin) / 2;
    let yTramo = canvas.height / 2 - scale.length - altura;
    let yTramoInicio = yTramo + radio;
    let yTramoFin = yTramo - radio;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    ctx.arc(xInicio + radio, yTramoInicio, radio, Math.PI, 1.5 * Math.PI)

    ctx.lineTo(xMitad - radio, yTramo);

    ctx.arc(xMitad - radio, yTramoFin, radio, 0.5 * Math.PI, 0, true);
    ctx.arc(xMitad + radio, yTramoFin, radio, Math.PI, 0.5 * Math.PI, true);

    ctx.lineTo(xFin - radio, yTramo);

    ctx.arc(xFin - radio, yTramoInicio, radio, 1.5 * Math.PI, 0);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.font = `${alto}px OpenSansRegular`;
    ctx.fillStyle = font.color;
    ctx.fillText(texto, xMitad, yTramoFin - 5);

    ctx.restore();
  }

  function mostrarDatosEjeSec(state, dataRecta) {
    const { show, scale } = state
    const { miniScale } = show
    const { theValue, extValues, allValues, point, figure, arcs } = miniScale
    const { xIni, centroY, segmento } = dataRecta

    ////console.log(miniScale)
    let centroYNum = centroY + scale.length * 1.7
    let valor = Number(theValue)
    for (let i = 0; i <= 10; i++) {
      let xPos = xIni + segmento * i
      if (i === 0 || i === 10) {
        extValues && valorExternoEjeSec(state, xPos, centroYNum, valor, i, 1.7)
      } else {
        allValues && valoresEjeSec(state, xPos, centroYNum, valor, i, 1.4)
        point && puntoEjeSec(state, xPos, centroY, valor, i)
        figure.show && figuraEjeSec(state, xPos, centroY, valor, i)
      }
      if (i < 10) {
        let desde = arcs.init, hasta = arcs.end
        arcs.show && arcosEjeSec(state, xPos, centroY, valor, i, desde, hasta, segmento)
      }
    }

    function arcosEjeSec(state, x, y, valor, posicion, desde, hasta, segmento) {
      valor = Number(`${valor.toFixed(2).split('.')[0]}.${valor.toFixed(2).split('.')[1][0]}${posicion}`)
      let valorDesde = Number(desde)
      let valorHasta = Number(hasta)
      if (valor >= valorDesde && valor < valorHasta) {
        let arcoRadio = segmento / 2
        dibujarArco(state, x + arcoRadio, y - arcoRadio / 2, arcoRadio, true)
      }
    }
    function figuraEjeSec(state, x, y, valor, posicion) {
      const { typeRect } = state
      let figura
      if (typeRect === 'decimal' || typeRect === 'mixta decimal') {
        figura = valor.toFixed(2).split('.')[1][1]
      }
      figura = Number(figura)
      if (figura === posicion) {
        dibujarRomboEjeSec(state, x, y, false)
      }
      function dibujarRomboEjeSec(state, x, y, grande) {
        const { ctx, scale, font } = state
        const { figure, allValues } = state.show.miniScale
        const xPos = x, centroY = y
        ctx.save()
        let diamondSize = grande ? font.size * 1.4 : font.size * 1.2
        let diamondW = diamondSize
        let diamondH = diamondW * 1.3
        let yDist = scale.length * 1.5
        if (figure.show !== 'abajo') {
          yDist -= (scale.length * 1.5 * 2 + diamondH)
        } else {
          if (allValues) {
            yDist += (typeRect === 'mixta' || typeRect === 'mixta decimal' || typeRect === 'mixta centesimal') ? font.size * 2.3 : font.size * 2
          }
        }
        ctx.strokeStyle = scale.color
        ctx.fillStyle = font.color
        ctx.fillStyle = '#dbac04'
        ctx.strokeStyle = '#dbac04'
        ctx.beginPath()
        ctx.moveTo(xPos, centroY + yDist)
        ctx.lineTo(xPos + diamondW / 2, centroY + diamondH / 2 + yDist)
        ctx.lineTo(xPos, centroY + diamondH + yDist)
        ctx.lineTo(xPos - diamondW / 2, centroY + diamondH / 2 + yDist)
        ctx.lineTo(xPos, centroY + yDist)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
        ctx.save()
      }
    }
    function puntoEjeSec(state, x, y, valor, posicion) {
      const { typeRect } = state
      let punto
      if (typeRect === 'decimal' || typeRect === 'mixta decimal') {
        punto = valor.toFixed(2).split('.')[1][1]
      }
      punto = Number(punto)
      if (punto === posicion) {
        dibujarPunto(state, x, y, true)
      }
    }
    function valoresEjeSec(state, x, y, valor, posicion, size) {
      const { typeRect } = state
      if (typeRect === 'decimal' || typeRect === 'mixta decimal') {
        valor = Number(`${valor.toFixed(2).split('.')[0]}.${valor.toFixed(2).split('.')[1][0]}${posicion}`)
        valor = valor.toFixed(2)
        if (typeRect === 'decimal') {
          numeroCentesimal(state, x, y, valor, size)
        } else {
          numeroMixtoCentesimal(state, x, y, valor, size)
        }
      }

    }
    function valorExternoEjeSec(state, x, y, valor, posicion, size) {
      const { typeRect } = state
      if (typeRect === 'decimal' || typeRect === 'mixta decimal') {
        if (posicion === 0) {
          valor -= Number(`0.0${valor.toFixed(2).split('.')[1][1]}`)
        } else {
          valor += 0.1 - Number(`0.0${valor.toFixed(2).split('.')[1][1]}`)
        }
        valor = valor.toFixed(1)
        if (typeRect === 'decimal') {
          numeroDecimal(state, x, y, valor, size)
        } else {
          numeroMixtoDecimal(state, x, y, valor, size)
        }
      }
    }
  }

  function arrNumerosValidacion(state, arr) {
    const { typeRect } = state
    let arrValores = arr
    switch (typeRect) {
      case 'enteros':
        arrValores = arr.split(',') ? arr.split(',') : arr.split('')
        break;
      case 'enteros con decimales':
        arrValores = arr.split(',') ? arr.split(',') : arr.split('')
        break;
      case 'decimal':
        arrValores = arr.split(',') ? arr.split(',') : arr.split('')
        break;
      case 'centesimal':
        arrValores = arr.split(',') ? arr.split(',') : arr.split('')
        break;
      case 'mixta':
        arrValores = arr.split(',') ? arr.split(',') : arr.split('')
        break;
      case 'mixta decimal':
        arrValores = arr.split(',') ? arr.split(',') : arr.split('')
        break;
      case 'mixta centesimal':
        arrValores = arr.split(',') ? arr.split(',') : arr.split('')
        break;
      default:
        break;
    }
    return arrValores
  }

  function numeroValidacion(state, index) {
    const { typeRect, scale, chart } = state
    const { initValue } = chart.values
    let valor = initValue
    switch (typeRect) {
      case 'enteros':
        valor = eval(valor) + index * scale.value
        valor = valor.toString()
        valor = valor.split('.') ? valor.split('.')[0] : valor
        break;
      case 'enteros con decimales':
        valor = eval(valor) + index * scale.value
        valor = valor.toFixed(2), valor = valor.toString()
        if (valor.split('.')[1].toString()) {
          valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0, 1)}`
        } else {
          valor = `${valor.split('.')[0]}.0`
        }
        break;
      case 'decimal':
        valor = eval(valor) + index * scale.value / 10
        valor = valor.toString()
        if (valor.split('.')[1]) {
          valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0, 1)}`
        } else {
          valor = `${valor.split('.')[0]}.0`
        }
        break;
      case 'centesimal':
        valor = (eval(valor) + index * scale.value / 100).toFixed(2)
        valor = valor.toString()
        valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0, 2)}`
        break;
      case 'mixta':
        valor = eval(valor) + index * scale.value / 10
        valor = valor.toFixed(2), valor = valor.toString()
        if (valor.split('.')[1]) {
          valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0, 1)}`
        } else {
          valor = `${valor.split('.')[0]}.0`
        }
        break;
      case 'mixta decimal':
        valor = eval(valor) + index * scale.value / 10
        valor = valor.toFixed(2), valor = valor.toString()
        if (valor.split('.')[1]) {
          valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0, 2)}`
        } else {
          valor = `${valor.split('.')[0]}.00`
        }
        break;
      case 'mixta centesimal':
        valor = (eval(valor) + index * scale.value / 100).toFixed(2)
        valor = valor.toString()
        valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0, 2)}`
        break;
    }
    return valor
  }

  /* ------------------------ MOSTRAR DATOS  ------------------------- */

  function mostrarValorExterno(state, x, y, index, valor) {
    const { typeRect, scale } = state
    y += (typeRect === 'mixta' || typeRect === 'mixta decimal' || typeRect === 'mixta centesimal') ? scale.length * 2 : scale.length * 1.7
    switch (typeRect) {
      case 'enteros':
        numeroEntero(state, x, y, valor, 2)
        break;
      case 'enteros con decimales':
        numeroEnteroDecimal(state, x, y, valor, 2)
        break;
      case 'decimal':
        numeroDecimal(state, x, y, valor, 2)
        break;
      case 'centesimal':
        numeroCentesimal(state, x, y, valor, 1.8)
        break;
      case 'mixta':
        numeroMixto(state, x, y, valor, 2, index)
        break;
      case 'mixta decimal':
        numeroMixtoDecimal(state, x, y, valor, 2, index)
        break;
      case 'mixta centesimal':
        numeroMixtoCentesimal(state, x, y, valor, 1.8, index)
        break;
    }
  }

  function mostrarValor(state, x, y, index, valor, arrValores) {
    const { typeRect, show, scale } = state
    y += (typeRect === 'mixta' || typeRect === 'mixta decimal' || typeRect === 'mixta centesimal') ? scale.length * 2 : scale.length * 1.7
    let mostrar = false
    if (show.allValues.show === 'todos') {
      mostrar = true
    } else if (show.allValues.show === 'mostrar') {
      if (arrValores.includes(valor)) {
        mostrar = true
      }
    } else if (show.allValues.show === 'ocultar') {
      if (!arrValores.includes(valor)) {
        mostrar = true
      }
    }
    switch (typeRect) {
      case 'enteros':
        mostrar && numeroEntero(state, x, y, valor, 1.5)
        break;
      case 'enteros con decimales':
        mostrar && numeroEnteroDecimal(state, x, y, valor, 1.5)
        break;
      case 'decimal':
        mostrar && numeroDecimal(state, x, y, valor, 1.5)
        break;
      case 'centesimal':
        mostrar && numeroCentesimal(state, x, y, valor, 1.4)
        break;
      case 'mixta':
        mostrar && numeroMixto(state, x, y, valor, 1.5, index)
        break;
      case 'mixta decimal':
        mostrar = false
        let valAux = `${valor.split('.')[0]}.${valor.split('.')[1][0]}`
        if (show.allValues.show === 'todos') {
          numeroMixtoDecimal(state, x, y, valor, 1.5, index)
        } else if (show.allValues.show === 'mostrar') {
          if (arrValores.includes(valAux)) {
            numeroMixtoDecimal(state, x, y, valor, 1.5, index)
          }
        } else if (show.allValues.show === 'ocultar') {
          if (!arrValores.includes(valAux)) {
            numeroMixtoDecimal(state, x, y, valor, 1.5, index)
          }
        }
        break;
      case 'mixta centesimal':
        mostrar && numeroMixtoCentesimal(state, x, y, valor, 1.4, index)
        break;
    }
  }

  function mostrarPunto(state, dataRecta, x, y, index, valor, arrValores) {
    const { typeRect } = state
    const { segmento } = dataRecta
    //valor = valor.toString()
    if (typeRect === 'decimal' || typeRect === 'mixta decimal') {
      let valorAuxIni = `${valor.split('.')[0]}.${valor.split('.')[1][0]}`
      let valorAuxFin = eval(valor.split('.')[1][0]) === 9 ? `${eval(valor.split('.')[0]) + 1}.0` : `${valor.split('.')[0]}.${eval(valor.split('.')[1][0]) + 1}`
      if (arrValores[0] !== '') {
        arrValores.forEach(el => {
          if (eval(el) !== NaN && el.split('.')[1]) {
            valor = eval(valor), valorAuxIni = eval(valorAuxIni), valorAuxFin = eval(valorAuxFin)
            if (eval(el) >= valorAuxIni && eval(el) <= valorAuxFin) {
              if (eval(el) === valorAuxIni) {
                dibujarPunto(state, x, y, true)
              } else {
                let delta = eval(el.split('.')[1][1]) * segmento / 10
                let centroX = x + delta
                dibujarPunto(state, centroX, y, false)
              }
            }
          }
        })
      }
    } else {
      if (arrValores.includes(valor)) {
        dibujarPunto(state, x, y, true)
      }
    }
  }

  function mostrarFigura(state, dataRecta, x, y, index, valor, arrValores) {
    const { typeRect } = state
    const { segmento } = dataRecta
    if (typeRect === 'decimal' || typeRect === 'mixta decimal') {
      let valorAuxIni = `${valor.split('.')[0]}.${valor.split('.')[1][0]}`
      let valorAuxFin = eval(valor.split('.')[1][0]) === 9 ? `${eval(valor.split('.')[0]) + 1}.0` : `${valor.split('.')[0]}.${eval(valor.split('.')[1][0]) + 1}`
      if (arrValores[0] !== '') {
        arrValores.forEach(el => {
          if (eval(el) !== NaN && el.split('.')[1]) {
            valor = eval(valor), valorAuxIni = eval(valorAuxIni), valorAuxFin = eval(valorAuxFin)
            if (eval(el) >= valorAuxIni && eval(el) <= valorAuxFin) {
              if (eval(el) === valorAuxIni) {
                dibujarRombo(state, x, y, valor, true)
              } else {
                let delta = eval(el.split('.')[1][1]) * segmento / 10
                let centroX = x + delta
                dibujarRombo(state, centroX, y, valor, false)
              }
            }
          }
        })
      }
    } else {
      if (arrValores.includes(valor)) {
        dibujarRombo(state, x, y, valor, true)
      }
    }
  }

  function mostrarArco(state, dataRecta, xPos, centroY, i, valor, desde, hasta, constante) {
    const { ctx, typeRect, chart, scale } = state
    const { segmento } = dataRecta
    let maximoValorEscala = eval(chart.values.initValue) + scale.divisions * scale.value
    let arcoRadio = segmento / 2
    let valorDesde = desde[0]
    let valorHasta = hasta[0]
    if (valorDesde !== '' & valorHasta !== '') {
      valorDesde = eval(valorDesde)
      valorHasta = eval(valorHasta) < maximoValorEscala ? eval(valorHasta) : maximoValorEscala
      if (typeRect === 'enteros') {
        valorDesde = valorDesde.toString().split('.') ? eval(valorDesde.toString().split('.')[0]) : valorDesde
        valorHasta = valorHasta.toString().split('.') ? eval(valorHasta.toString().split('.')[0]) : valorHasta
      } else if (typeRect === 'mixta decimal') {
        if (valorDesde.toString().split('.')[1] && valorHasta.toString().split('.')[1]) {
          maximoValorEscala = eval(chart.values.initValue) + scale.divisions * scale.value / 10
          valorHasta = eval(valorHasta) < maximoValorEscala ? eval(valorHasta) : maximoValorEscala
          valorDesde = valorDesde.toString().split('.')[0] ? eval(`${(valorDesde.toString().split('.')[0])}.${(valorDesde.toString().split('.')[1][0])}`) : valorDesde
          valorHasta = valorHasta.toString().split('.')[0] ? eval(`${(valorHasta.toString().split('.')[0])}.${(valorHasta.toString().split('.')[1][0])}`) : valorHasta
        }
      }
      valor = eval(valor)
      if (valor >= valorDesde && valor < valorHasta) {

        dibujarArco(state, xPos + arcoRadio, centroY, arcoRadio)
        if (constante) {
          ctx.fillStyle = '#A84C4E';
          ctx.textAlign = "center";
          ctx.font = '15px ' + rectFontType;
          ctx.fillText(espacioMiles(scale.value.toString()), xPos + arcoRadio, centroY - arcoRadio - 10);
        }
      }
    }
  }

  /* ------------------------ DIBUJOS ------------------------- */

  function dibujarPunto(state, x, y, grande) {
    const { ctx, scale, chart, font } = state
    ctx.save()
    let arcoRadio = grande ? scale.length / 2 : scale.length / 3
    ctx.fillStyle = font.color
    ctx.lineWidth = grande ? scale.width * 0.6 : scale.width * 0.5
    ctx.strokeStyle = chart.axis.color
    ctx.beginPath()
    ctx.arc(x, y, arcoRadio, 0, 360 * Math.PI / 180)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
    ctx.save()
  }
  function dibujarRombo(state, x, y, valor, grande) {
    const { ctx, typeRect, scale, font } = state
    const { figures, allValues } = state.show
    const xPos = x, centroY = y
    ctx.save()
    let diamondSize = grande ? font.size * 1.4 : font.size * 1.2
    let diamondW = diamondSize
    let diamondH = diamondW * 1.3
    let yDist = scale.length * 1.5
    if (figures.show !== 'abajo') {
      yDist -= (scale.length * 1.5 * 2 + diamondH)
    } else {
      let incluVal = allValues.show === 'mostrar' && allValues.values.includes((valor).toString())
      let noIncluVal = allValues.show === 'ocultar' && !allValues.values.includes((valor).toString())
      if (allValues.show === 'todos' || incluVal || noIncluVal) {
        yDist += (typeRect === 'mixta' || typeRect === 'mixta decimal' || typeRect === 'mixta centesimal') ? font.size * 2.3 : font.size * 2
      }
    }
    ctx.strokeStyle = scale.color
    ctx.fillStyle = font.color
    ctx.fillStyle = '#dbac04'
    ctx.strokeStyle = '#dbac04'
    ctx.beginPath()
    ctx.moveTo(xPos, centroY + yDist)
    ctx.lineTo(xPos + diamondW / 2, centroY + diamondH / 2 + yDist)
    ctx.lineTo(xPos, centroY + diamondH + yDist)
    ctx.lineTo(xPos - diamondW / 2, centroY + diamondH / 2 + yDist)
    ctx.lineTo(xPos, centroY + yDist)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
    ctx.save()
  }
  function dibujarArco(state, x, y, arcoRadio, mini = false) {
    const { ctx, font, show } = state
    let direccion = show.arcs.show === 'derecha' ? true : false
    if (mini) {
      direccion = show.miniScale.arcs.show === 'derecha' ? true : false
    }
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = font.color
    ctx.lineWidth = 2
    let iniAngulo = 220 * Math.PI / 180
    let finAngulo = 320 * Math.PI / 180
    ctx.arc(x, y, arcoRadio, iniAngulo, finAngulo)
    let xDist, ladoDib
    ladoDib = -(arcoRadio) * Math.cos(40 * Math.PI / 180)
    xDist = -arcoRadio * 0.3
    if (direccion) {
      xDist *= -1
      ladoDib *= -1
    }
    ctx.moveTo(x + ladoDib, y - (arcoRadio) * Math.sin(40 * Math.PI / 180) - arcoRadio * 0.3)
    ctx.lineTo(x + ladoDib, y - (arcoRadio) * Math.sin(40 * Math.PI / 180))
    ctx.lineTo(x + ladoDib - xDist, y - (arcoRadio) * Math.sin(40 * Math.PI / 180))
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
    ctx.save()
  }

  /* ------------------------ NUMEROS ------------------------- */
  function numeroEntero(state, x, y, valor, multSize) {
    const { ctx, font } = state
    ctx.save()
    ctx.strokeStyle = font.color
    ctx.fillStyle = font.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.font = font.size + 'px ' + rectFontType
    ctx.fillText(espacioMiles(valor), x, y)
    //console.log('texto escrito');
    ctx.restore()
    ctx.save()
  }

  function numeroEnteroDecimal(state, x, y, valor, multSize) {
    const { ctx, font } = state
    ctx.save()
    ctx.strokeStyle = font.color
    ctx.fillStyle = font.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.font = font.size * multSize + 'px ' + rectFontType
    let unidad, decimal//, centesimal
    unidad = valor.split('.')[0]
    if (valor.split('.')[1][0]) {
      decimal = valor.split('.')[1][0]
      // if (decimal) {
      //   centesimal = valor.split('.')[0][1]
      // }
    }
    valor = `${unidad}.${decimal}`
    ctx.fillText(valor, x, y)
    ctx.restore()
    ctx.save()
  }

  function numeroDecimal(state, x, y, valor, multSize) {
    const { ctx, font } = state
    ctx.save()
    ctx.strokeStyle = font.color
    ctx.fillStyle = font.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.font = font.size * multSize + 'px ' + rectFontType
    ctx.fillText(valor, x, y)
    ctx.restore()
    ctx.save()
  }

  function numeroCentesimal(state, x, y, valor, multSize) {
    const { ctx, font } = state
    ctx.save()
    ctx.strokeStyle = font.color
    ctx.fillStyle = font.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.font = font.size * multSize + 'px ' + rectFontType
    ctx.fillText(valor, x, y)
    ctx.restore()
    ctx.save()
  }

  function numeroMixto(state, x, y, valor, multSize, index) {
    const { ctx, font, scale } = state
    ctx.save()
    ctx.strokeStyle = font.color
    ctx.fillStyle = font.color
    let valorUnidad = Number(valor.split('.')[0])
    let valorDecimal = Number(valor.split('.')[1][0])
    let denominador
    denominador = scale.divisions
    ctx.textBaseline = 'middle'
    ctx.font = font.size * multSize + 'px ' + rectFontType
    ctx.textAlign = 'right'
    let enteroTextLength = ctx.measureText(valorUnidad).width
    let enteroPosX = x - enteroTextLength / 4
    let centroY = y + font.size * multSize / 2
    if (valorDecimal > denominador) {
      ctx.fillText(valorUnidad + 1, x, centroY)
    } else if (valorDecimal === 0) {
      ctx.textAlign = 'center'
      ctx.fillText(valorUnidad, x, centroY)
      return
    } else if (valorDecimal === denominador) {
      let delta = 1
      ctx.textAlign = 'center'
      ctx.fillText(valorUnidad + delta, x, centroY)
      return
    } else {
      ctx.fillText(valorUnidad, enteroPosX, centroY)
    }

    let numberFontSize = Number(font.size * multSize * 0.8)
    ctx.font = numberFontSize + 'px ' + rectFontType
    let denominadorTextLength
    denominadorTextLength = ctx.measureText(denominador).width
    ctx.strokeStyle = scale.color
    ctx.lineWidth = font.size / 8
    ctx.lineCap = 'round'
    let deltaYLine = font.size / 16 + 1
    ctx.beginPath()
    ctx.moveTo(enteroPosX + 1, centroY - deltaYLine)
    ctx.lineTo(x + denominadorTextLength + 2, centroY - deltaYLine)
    ctx.stroke()
    ctx.closePath()
    let centroX = x + (denominadorTextLength) / 2

    ctx.textAlign = 'center'
    //ctx.textBaseline = 'bottom'
    let deltaYFraccion = numberFontSize / 2
    if (valorDecimal > denominador) {
      ctx.fillText(valorDecimal - denominador, centroX, centroY - deltaYFraccion)
    } else {
      ctx.fillText(valorDecimal, centroX, centroY - deltaYFraccion)
    }
    //ctx.textBaseline = 'top'
    ctx.fillText(denominador, centroX, centroY + deltaYFraccion)
    ctx.restore()
    ctx.save()
  }

  function numeroMixtoDecimal(state, x, y, valor, multSize, index) {
    const { ctx, font, scale } = state
    ctx.save()
    ctx.strokeStyle = font.color
    ctx.fillStyle = font.color
    let valorUnidad = Number(valor.split('.')[0])
    let valorDecimal = Number(valor.split('.')[1][0])
    let denominador
    denominador = scale.divisions
    ctx.textBaseline = 'middle'
    ctx.font = font.size * multSize + 'px ' + rectFontType
    ctx.textAlign = 'right'
    let enteroTextLength = ctx.measureText(valorUnidad).width
    let enteroPosX = x - enteroTextLength / 4
    let centroY = y + font.size * multSize / 2
    if (valorDecimal > denominador) {
      ctx.fillText(valorUnidad + 1, x, centroY)
    } else if (valorDecimal === 0) {
      ctx.textAlign = 'center'
      ctx.fillText(valorUnidad, x, centroY)
      return
    } else if (valorDecimal === denominador) {
      let delta = 1
      ctx.textAlign = 'center'
      ctx.fillText(valorUnidad + delta, x, centroY)
      return
    } else {
      ctx.fillText(valorUnidad, enteroPosX, centroY)
    }

    let numberFontSize = Number(font.size * multSize * 0.8)
    ctx.font = numberFontSize + 'px ' + rectFontType
    let denominadorTextLength
    denominadorTextLength = ctx.measureText(denominador).width
    ctx.strokeStyle = scale.color
    ctx.lineWidth = font.size / 8
    ctx.lineCap = 'round'
    let deltaYLine = font.size / 16 + 1
    ctx.beginPath()
    ctx.moveTo(enteroPosX + 1, centroY - deltaYLine)
    ctx.lineTo(x + denominadorTextLength + 2, centroY - deltaYLine)
    ctx.stroke()
    ctx.closePath()
    let centroX = x + (denominadorTextLength) / 2
    let deltaYFraccion = numberFontSize / 2
    ctx.textAlign = 'center'
    if (valorDecimal > denominador) {
      ctx.fillText(valorDecimal - denominador, centroX, centroY - deltaYFraccion)
    } else {
      ctx.fillText(valorDecimal, centroX, centroY - deltaYFraccion)
    }
    ctx.fillText(denominador, centroX, centroY + deltaYFraccion)
    ctx.restore()
    ctx.save()
  }

  function numeroMixtoCentesimal(state, x, y, valor, multSize, index) {
    const { ctx, font, scale } = state
    ctx.save()
    ctx.strokeStyle = font.color
    ctx.fillStyle = font.color
    let valorUnidad = Number(valor.split('.')[0])
    let valorDecimal = Number(valor.split('.')[1][0])
    let valorCentesimal = Number(valor.split('.')[1][1])
    let numerador = Number(`${valorDecimal}${valorCentesimal}`)
    let denominador
    denominador = scale.divisions * 10
    ctx.textBaseline = 'middle'
    ctx.font = font.size * multSize + 'px ' + rectFontType
    ctx.textAlign = 'right'
    let enteroTextLength = ctx.measureText(valorUnidad).width
    let enteroPosX = x - enteroTextLength / 4
    let centroY = y + font.size * multSize / 2
    if (numerador > denominador) {
      ctx.fillText(valorUnidad + 1, x, centroY)
    } else if (numerador === 0) {
      ctx.textAlign = 'center'
      ctx.fillText(valorUnidad, x, centroY)
      return
    } else if (numerador === denominador) {
      let delta = 1
      ctx.textAlign = 'center'
      ctx.fillText(valorUnidad + delta, x, centroY)
      return
    } else {
      ctx.fillText(valorUnidad, enteroPosX, centroY)
    }

    let numberFontSize = Number(font.size * multSize * 0.8)
    ctx.font = numberFontSize + 'px ' + rectFontType
    let denominadorTextLength
    denominadorTextLength = ctx.measureText(denominador).width
    ctx.strokeStyle = scale.color
    ctx.lineWidth = font.size / 8
    ctx.lineCap = 'round'
    let deltaYLine = font.size / 16 + 1
    ctx.beginPath()
    ctx.moveTo(enteroPosX + 1, centroY - deltaYLine)
    ctx.lineTo(x + denominadorTextLength + 2, centroY - deltaYLine)
    ctx.stroke()
    ctx.closePath()
    let centroX = x + (denominadorTextLength) / 2
    let deltaYFraccion = numberFontSize / 2
    ctx.textAlign = 'center'
    if (numerador > denominador) {
      ctx.fillText(numerador - denominador, centroX, centroY - deltaYFraccion)
    } else {
      ctx.fillText(numerador, centroX, centroY - deltaYFraccion)
    }
    ctx.fillText(denominador, centroX, centroY + deltaYFraccion)
    ctx.restore()
    ctx.save()
  }
}

function tablaPosicional(config) {
  const { container, params, variables, versions, vt } = config;
  var imgSrcFlechaAbajo = '../../../../imagenes_front/tablas_posicionales/flecha_fija.svg';
  var imgSrcSignoMas = '../../../../imagenes_front/tablas_posicionales/num_sig_mas.svg';
  var srcFuente = '../../../../fonts/LarkeNeueThin.ttf';
  //× => ALT+0215
  var { _width, _tipoTabla, /*puede ser 'centenas' o 'miles'*/_pisosTabla, /*pueden ser 'uno', 'dos', 'tres'*/_separacionElementos, _titulo,
    _tipoPisoUno, _repeticionPictoricaPisoUno, _mostrarNumeroCompletoUno, _numeroCompletoPisoUno, _umilPisoUno, _centenaPisoUno, _decenaPisoUno, _unidadPisoUno, _altoTextoPisoUno, /*numerico , imagenes, repeticion*/
    _altoImgMilesPisoUno, _altoImgCentPisoUno, _altoImgDecPisoUno, _altoImgUniPisoUno,//termino datos piso uno
    _tipoPisoDos, _repeticionPictoricaPisoDos, _mostrarNumeroCompletoDos, _numeroCompletoPisoDos, _umilPisoDos, _centenaPisoDos, _decenaPisoDos, _unidadPisoDos, _altoTextoPisoDos,
    _altoImgMilesPisoDos, _altoImgCentPisoDos, _altoImgDecPisoDos, _altoImgUniPisoDos,//termino datos piso dos
    _tipoPisoTres, _repeticionPictoricaPisoTres, _mostrarNumeroCompletoTres, _numeroCompletoPisoTres, _umilPisoTres, _centenaPisoTres, _decenaPisoTres, _unidadPisoTres, _altoTextoPisoTres,
    _altoImgMilesPisoTres, _altoImgCentPisoTres, _altoImgDecPisoTres, _altoImgUniPisoTres,//termino datos piso tres
    _dibujaValorPosicional1, _mostrarSignoMasVP1, _altoTextoValorPosicional1, _umilVP1, _centenaVP1, _decenaVP1, _unidadVP1,
    _dibujaValorPosicional2, _mostrarSignoMasVP2, _altoTextoValorPosicional2, _umilVP2, _centenaVP2, _decenaVP2, _unidadVP2,
    _dibujaTextoResultado, _altoTextoResultado, _resultado,
    _tipoUmilVP1, _tipoCentenaVP1, _tipoDecenaVP1, _tipoUnidadVP1, _altoumilvp1, _altocentenavp1, _altodecenavp1, _altounidadvp1,
    _tipoUmilVP2, _tipoCentenaVP2, _tipoDecenaVP2, _tipoUnidadVP2, _altoumilvp2, _altocentenavp2, _altodecenavp2, _altounidadvp2 } = params;

  var vars = vt ? variables : versions;
  try {
    var numeroCompletoPisoUno = _mostrarNumeroCompletoUno === 'si' ? regex(_numeroCompletoPisoUno, vars, vt) : '';
    _umilPisoUno = _mostrarNumeroCompletoUno === 'si' ? numeroCompletoPisoUno[0] : regex(_umilPisoUno, vars, vt);
    _centenaPisoUno = _mostrarNumeroCompletoUno === 'si' ? numeroCompletoPisoUno[1] : regex(_centenaPisoUno, vars, vt);
    _decenaPisoUno = _mostrarNumeroCompletoUno === 'si' ? numeroCompletoPisoUno[2] : regex(_decenaPisoUno, vars, vt);
    _unidadPisoUno = _mostrarNumeroCompletoUno === 'si' ? numeroCompletoPisoUno[3] : regex(_unidadPisoUno, vars, vt);

    var numeroCompletoPisoDos = _mostrarNumeroCompletoDos === 'si' ? regex(_numeroCompletoPisoDos, vars, vt) : '';
    _umilPisoDos = _mostrarNumeroCompletoDos === 'si' ? numeroCompletoPisoDos[0] : regex(_umilPisoDos, vars, vt);
    _centenaPisoDos = _mostrarNumeroCompletoDos === 'si' ? numeroCompletoPisoDos[1] : regex(_centenaPisoDos, vars, vt);
    _decenaPisoDos = _mostrarNumeroCompletoDos === 'si' ? numeroCompletoPisoDos[2] : regex(_decenaPisoDos, vars, vt);
    _unidadPisoDos = _mostrarNumeroCompletoDos === 'si' ? numeroCompletoPisoDos[3] : regex(_unidadPisoDos, vars, vt);

    var numeroCompletoPisoTres = _mostrarNumeroCompletoTres === 'si' ? regex(_numeroCompletoPisoTres, vars, vt) : '';
    _umilPisoTres = _mostrarNumeroCompletoTres === 'si' ? numeroCompletoPisoTres[0] : regex(_umilPisoTres, vars, vt);
    _centenaPisoTres = _mostrarNumeroCompletoTres === 'si' ? numeroCompletoPisoTres[1] : regex(_centenaPisoTres, vars, vt);
    _decenaPisoTres = _mostrarNumeroCompletoTres === 'si' ? numeroCompletoPisoTres[2] : regex(_decenaPisoTres, vars, vt);
    _unidadPisoTres = _mostrarNumeroCompletoTres === 'si' ? numeroCompletoPisoTres[3] : regex(_unidadPisoTres, vars, vt);

    _umilVP1 = regex(_umilVP1, vars, vt);
    _centenaVP1 = regex(_centenaVP1, vars, vt);
    _decenaVP1 = regex(_decenaVP1, vars, vt);
    _unidadVP1 = regex(_unidadVP1, vars, vt);

    _umilVP2 = regex(_umilVP2, vars, vt);
    _centenaVP2 = regex(_centenaVP2, vars, vt);
    _decenaVP2 = regex(_decenaVP2, vars, vt);
    _unidadVP2 = regex(_unidadVP2, vars, vt);

    _resultado = regex(_resultado, vars, vt);
  } catch (error) {
    //console.log(error);
  }
  let datosEjercicio = {};
  datosEjercicio.tabla = {};
  datosEjercicio.tabla.configuracion = {
    tipoTabla: _tipoTabla,
    pisosTabla: Number(_pisosTabla)
  }
  datosEjercicio.tabla.detallePisos = [{//tipo piso uno
    tipo: _tipoPisoUno,
    tipoRepeticion: _repeticionPictoricaPisoUno,
    umil: _umilPisoUno,
    centena: _centenaPisoUno,
    decena: _decenaPisoUno,
    unidad: _unidadPisoUno,
    altoTexto: _altoTextoPisoUno,
    umilAltoImg: _altoImgMilesPisoUno,
    decAltoImg: _altoImgDecPisoUno,
    centAltoImg: _altoImgCentPisoUno,
    uniAltoImg: _altoImgUniPisoUno
  }]
  if (datosEjercicio.tabla.configuracion.pisosTabla > 1) {
    datosEjercicio.tabla.detallePisos[1] = {//tipo piso dos
      tipo: _tipoPisoDos,
      tipoRepeticion: _repeticionPictoricaPisoDos,
      umil: _umilPisoDos,
      centena: _centenaPisoDos,
      decena: _decenaPisoDos,
      unidad: _unidadPisoDos,
      altoTexto: _altoTextoPisoDos,
      umilAltoImg: _altoImgMilesPisoDos,
      decAltoImg: _altoImgDecPisoDos,
      centAltoImg: _altoImgCentPisoDos,
      uniAltoImg: _altoImgUniPisoDos
    }
  }
  if (datosEjercicio.tabla.configuracion.pisosTabla > 2) {
    datosEjercicio.tabla.detallePisos[2] = {//tipo piso tres
      tipo: _tipoPisoTres,
      tipoRepeticion: _repeticionPictoricaPisoTres,
      umil: _umilPisoTres,
      centena: _centenaPisoTres,
      decena: _decenaPisoTres,
      unidad: _unidadPisoTres,
      altoTexto: _altoTextoPisoTres,
      umilAltoImg: _altoImgMilesPisoTres,
      decAltoImg: _altoImgDecPisoTres,
      centAltoImg: _altoImgCentPisoTres,
      uniAltoImg: _altoImgUniPisoTres
    }
  }
  datosEjercicio.valoresPosicionales = [];

  if (_dibujaValorPosicional1 === 'si') {
    datosEjercicio.valoresPosicionales[0] = {
      mostrar: _dibujaValorPosicional1,
      mostrarSignoMas: _mostrarSignoMasVP1,
      altoTexto: Number(_altoTextoValorPosicional1), //alto del texto de los valores posicionales
      numeros: {//numeros que se muestran debajo de la tabla en forma de suma
        umil: _tipoUmilVP1 === 'texto' ? _umilVP1 : {
          src: _umilVP1.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          alto: Number(_altoumilvp1)
        },
        centena: _tipoCentenaVP1 === 'texto' ? _centenaVP1 : {
          src: _centenaVP1.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          alto: Number(_altocentenavp1)
        },
        decena: _tipoDecenaVP1 === 'texto' ? _decenaVP1 : {
          src: _decenaVP1.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          alto: Number(_altodecenavp1)
        },
        unidad: _tipoUnidadVP1 === 'texto' ? _unidadVP1 : {
          src: _unidadVP1.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          alto: Number(_altounidadvp1)
        }
      }
    }
  }

  if (_dibujaValorPosicional2 === 'si') {
    datosEjercicio.valoresPosicionales[1] = {
      mostrar: _dibujaValorPosicional2,
      mostrarSignoMas: _mostrarSignoMasVP2,
      altoTexto: Number(_altoTextoValorPosicional2), //alto del texto de los valores posicionales
      numeros: {//numeros que se muestran debajo de la tabla en forma de suma
        umil: _tipoUmilVP2 === 'texto' ? _umilVP2 : {
          src:
            _umilVP2.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          alto: Number(_altoumilvp2)
        },
        centena: _tipoCentenaVP2 === 'texto' ? _centenaVP2 : {
          src: _centenaVP2.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          alto: Number(_altocentenavp2)
        },
        decena: _tipoDecenaVP2 === 'texto' ? _decenaVP2 : {
          src: _decenaVP2.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          alto: Number(_altodecenavp2)
        },
        unidad: _tipoUnidadVP2 === 'texto' ? _unidadVP2 : {
          src: _unidadVP2.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          alto: Number(_altounidadvp2)
        }
      }
    }
  }

  datosEjercicio.resultado = {
    mostrar: _dibujaTextoResultado,
    numero: _resultado, //numero del valor final centrado (puede ser texto o  numero)
    altoTexto: Number(_altoTextoResultado) //alto del texto del resultado
  }

  _separacionElementos = Number(_separacionElementos);
  //console.log(datosEjercicio);
  let recursos = cargaRecursos();
  var ctx, yStart = 0;
  if (_titulo !== '') {
    container.parentElement.querySelectorAll('span').forEach(e => e.parentNode.removeChild(e));
    container.parentElement.classList.add('text-center');
    var titulo = document.createElement('span');
    titulo.innerText = regexFunctions(regex(_titulo, vars, vt));
    titulo.style.fontSize = '18px';
    titulo.style.fontWeight = '600';
    titulo.style.color = 'black';
    container.parentNode.insertBefore(titulo, container);
  }
  Promise.all(recursos).then(function ([imgTabla, imgFlechaAbajo, imgSignoMas]) {
    var { altoCanvas, altoImagen } = calculaAltoCanvas(imgTabla.width, imgTabla.height, imgFlechaAbajo.height);
    container.width = Number(_width);
    container.height = altoCanvas;
    ctx = container.getContext('2d');
    ctx.drawImage(imgTabla, 0, 0, _width, altoImagen); //dibuja la tabla de repeticion

    const diviciones = datosEjercicio.tabla.configuracion.tipoTabla === 'centenas' ? 3 : 4;
    const anchoSeparaciones = _width / diviciones;

    dibujaContenidoTabla(anchoSeparaciones, altoImagen);
    yStart = altoImagen + _separacionElementos;

    datosEjercicio.valoresPosicionales.forEach(function (valorPosicional) {
      yStart = muestraValoresPosicionales(valorPosicional, yStart, diviciones, anchoSeparaciones, imgFlechaAbajo, imgSignoMas);
    });

    if (datosEjercicio.resultado.mostrar === 'si') {
      muestraTextoResultado(yStart, diviciones, anchoSeparaciones, imgFlechaAbajo);
    }

  }).catch(function (error) {
    //console.log(error, error.message);
  });

  function dibujaContenidoTabla(anchoSeparaciones, altoImagen) {
    const { detallePisos } = datosEjercicio.tabla;
    const { tipoTabla, pisosTabla } = datosEjercicio.tabla.configuracion;
    var porcion = altoImagen / ((pisosTabla * 2) + 1);//cantidad de separaciones que tiene la imagen ya que el alto de un cuadro equivale a dos alto del titulo de la tabla
    var altoCuadro = porcion * 2;
    var separaciones = tipoTabla === 'centenas' ? 3 : 4;
    var anchoSeparacion = container.width / separaciones;


    for (var fila = 0; fila < detallePisos.length; fila++) {
      const { tipo, tipoRepeticion, umil, centena, decena, unidad, altoTexto, umilAltoImg, centAltoImg, decAltoImg, uniAltoImg } = detallePisos[fila];
      var numeros = tipoTabla === 'centenas' ? [centena, decena, unidad] : [umil, centena, decena, unidad];
      numeros.forEach(function (numero, columna) {
        switch (tipo) {
          case 'numerico':
            !(tipoTabla === 'miles' && numero == 0 && columna === 0) && dibujaNumeroEnFila(numero, fila, columna, altoTexto);
            break;
          case 'imagenes':
            dibujaImagen(numero, fila, columna, tipoRepeticion);
            break;
          case 'repeticion':
            var altoImagenDeRepeticion;
            if (tipoTabla === 'miles') {
              if (columna === 0) {
                altoImagenDeRepeticion = umilAltoImg;
              } else if (columna === 1) {
                altoImagenDeRepeticion = centAltoImg;
              } else if (columna === 2) {
                altoImagenDeRepeticion = decAltoImg;
              } else if (columna === 3) {
                altoImagenDeRepeticion = uniAltoImg;
              }
            } else {
              if (columna === 0) {
                altoImagenDeRepeticion = centAltoImg;
              } else if (columna === 1) {
                altoImagenDeRepeticion = decAltoImg;
              } else if (columna === 2) {
                altoImagenDeRepeticion = uniAltoImg;
              }
            }
            dibujaRepeticion(numero, fila, columna, tipoRepeticion, altoImagenDeRepeticion);
            break;
          default:
            //console.log('opcion aun no soportada');
            break;
        }
      });
    }

    function dibujaNumeroEnFila(numero, fila, columna, altoTexto) {
      ctx.fillStyle = '#F58220';
      ctx.font = `${altoTexto}pt LarkeNeueThinFuente`;
      ctx.textAlign = 'center';
      fila++;
      var xTexto = (anchoSeparacion * columna) + (anchoSeparacion / 2);
      var yTexto = porcion + (altoCuadro * fila) - (altoCuadro - altoTexto) / 2;
      ctx.fillText(numero, xTexto, yTexto);
    }

    function dibujaImagen(numero, fila, columna, tipoRepeticion) {
      if (tipoRepeticion === 'pelotas') {
        var src = `../../../../imagenes_front/pelotas_repeticiones/Arreglo${numero}.svg`;
        cargaImagen(src).then(image => {
          var xImg = (anchoSeparacion * columna) + (anchoSeparacion / 2) - (altoCuadro * 0.85 / 2);
          var yImg = porcion + (altoCuadro * fila) + (altoCuadro / 2) - (altoCuadro * 0.85 / 2);
          ctx.drawImage(image, xImg, yImg, altoCuadro * 0.85, altoCuadro * 0.85);
        }).catch(error => {
          //console.log(error)
        });
      } else if (tipoRepeticion === 'circulo y cuadrado') {
        var img = columna % 2 === 0 ? 'Circulo.svg' : 'Cuadrado.svg';
        var src = '../../../../imagenes_front/tablas_posicionales/' + img;
        cargaImagen(src).then(image => {
          var xImg = (anchoSeparacion * columna) + (anchoSeparacion / 2) - (altoCuadro * 0.85 / 2);
          var yImg = porcion + (altoCuadro * fila) + (altoCuadro / 2) - (altoCuadro * 0.85 / 2);
          ctx.drawImage(image, xImg, yImg, altoCuadro * 0.85, altoCuadro * 0.85);
        }).catch(error => {
          //console.log(error)
        });
      }
    }

    function dibujaRepeticion(numero, fila, columna, tipoRepeticion, altoImgRep) {
      var ruta, src;
      ruta = tipoTabla === 'centenas' ? 5 - columna : 4 - columna; // busca que imagen ocupar
      if (tipoRepeticion === 'bloques') {
        src = `../../../../imagenes_front/bloques_multibase/bloque-${ruta}.svg`;
      } else if (tipoRepeticion === 'monedas y billetes') {
        var ceros = ruta === 1 ? '' : ruta === 2 ? '0' : ruta === 3 ? '00' : '000';
        src = `../../../../imagenes_front/monedas_billetes/1${ceros}.svg`;
      }
      cargaImagen(src).then(image => {
        var cx = (anchoSeparacion * columna) + (anchoSeparacion / 2);
        var cy = porcion + (altoCuadro * fila) + (altoCuadro / 2);
        for (var repeticion = 0; repeticion < numero; repeticion++) {
          switch (ruta) {
            case 4:
              if (tipoRepeticion === 'bloques') {
                dibujaBloqueEnPosicionTres(numero, image, cx, cy, altoImgRep);
              } else if (tipoRepeticion === 'monedas y billetes') {
                dibujaRepeticionDadoBilletes(numero, anchoSeparacion, altoCuadro, image, cx, cy);
              }
              break;
            case 3:
              if (tipoRepeticion === 'bloques') {
                dibujaBloqueEnPosicionTres(numero, image, cx, cy, altoImgRep);
              } else {
                dibujaRepeticionDado(numero, anchoSeparacion, altoCuadro, image, cx, cy, altoImgRep);
              }
              break;
            case 2:
              if (tipoRepeticion === 'bloques') {
                dibujaRepeticionHorizontal(numero, anchoSeparacion, altoCuadro, image, cx, cy, altoImgRep);
              } else if (tipoRepeticion === 'monedas y billetes') {
                dibujaRepeticionDado(numero, anchoSeparacion, altoCuadro, image, cx, cy, altoImgRep);
              }
              break;
            case 1:
              dibujaRepeticionDado(numero, anchoSeparacion, altoCuadro, image, cx, cy, altoImgRep);
              break;
            default:
              //console.log('aun no se pinta ' + ruta);
              break;
          }
        }
      }).catch(error => {
        //console.log(error);
      });

      function dibujaRepeticionDadoBilletes(numero, anchoSeparacion, altoCuadro, image, cx, cy) {
        var container = altoCuadro * 0.9;
        var altoImg = container / 3 * 0.9;
        var widthImg = image.width * altoImg / image.height;
        var separacion = container / 3 * 0.1;

        switch (numero) {
          case '1':
            var x = cx - widthImg / 2;
            var y = cy - altoImg / 2;
            ctx.drawImage(image, x, y, widthImg, altoImg);
            break;
          case '2':
            var x = cx - widthImg / 2;
            var y1 = cy - container / 2,
              y2 = cy + container / 2 - altoImg;
            ctx.drawImage(image, x, y1, widthImg, altoImg);
            ctx.drawImage(image, x, y2, widthImg, altoImg);
            break;
          case '3':
            var x = cx - widthImg / 2;
            var y1 = cy - container / 2,
              y2 = cy + container / 2 - altoImg,
              y3 = cy - altoImg / 2;
            ctx.drawImage(image, x, y1, widthImg, altoImg);
            ctx.drawImage(image, x, y2, widthImg, altoImg);
            ctx.drawImage(image, x, y3, widthImg, altoImg);
            break;
          case '4':
            var x1 = cx - separacion / 2 - widthImg, x2 = cx + separacion / 2;
            var y1 = cy - separacion / 2 - altoImg, y2 = cy + separacion / 2;
            ctx.drawImage(image, x1, y1, widthImg, altoImg);
            ctx.drawImage(image, x1, y2, widthImg, altoImg);
            ctx.drawImage(image, x2, y1, widthImg, altoImg);
            ctx.drawImage(image, x2, y2, widthImg, altoImg);
            break;
          case '5':
            var x1 = cx - separacion / 2 - widthImg,
              x2 = cx + separacion / 2;
            var y1 = cy - container / 2,
              y2 = cy + container / 2 - altoImg,
              y3 = cy - altoImg / 2,
              y4 = cy - separacion / 2 - altoImg,
              y5 = cy + separacion / 2;
            ctx.drawImage(image, x1, y1, widthImg, altoImg);
            ctx.drawImage(image, x1, y2, widthImg, altoImg);
            ctx.drawImage(image, x1, y3, widthImg, altoImg);
            ctx.drawImage(image, x2, y4, widthImg, altoImg);
            ctx.drawImage(image, x2, y5, widthImg, altoImg);
            break;
          case '6':
            var x1 = cx - separacion / 2 - widthImg, x2 = cx + separacion / 2;
            var y1 = cy - container / 2,
              y2 = cy + container / 2 - altoImg,
              y3 = cy - altoImg / 2;
            ctx.drawImage(image, x1, y1, widthImg, altoImg);
            ctx.drawImage(image, x1, y2, widthImg, altoImg);
            ctx.drawImage(image, x1, y3, widthImg, altoImg);
            ctx.drawImage(image, x2, y1, widthImg, altoImg);
            ctx.drawImage(image, x2, y2, widthImg, altoImg);
            ctx.drawImage(image, x2, y3, widthImg, altoImg);
            break;
          default:
            //console.log('Hola :)');
            break;
        }
      }

      function dibujaRepeticionHorizontal(numero, anchoSeparacion, altoCuadro, image, cx, cy, altoImgRep) {
        var altoImg = altoImgRep;
        var anchoImg = image.width * altoImg / image.height;
        var separacion = 10;
        var xStart = cx - ((numero * anchoImg) + (separacion * (numero - 1))) / 2
        var yStart = cy - (altoImg / 2)
        for (var i = 0, x, y; i < numero; i++) {
          x = xStart + (anchoImg * i) + (separacion * i);
          y = yStart;
          ctx.drawImage(image, x, y, anchoImg, altoImg);
        }
      }

      function dibujaRepeticionDado(numero, anchoSeparacion, altoCuadro, image, cx, cy, altoImgRep) {
        var altoImg = altoImgRep;
        var anchoImg = image.width * altoImg / image.height;
        var separacion = ((altoCuadro * 0.85) / 3) * 0.1;
        switch (numero) {
          case '1':
            dibujaBloqueEnPosicionNueve(5, image, altoImg, anchoImg, cx, cy, separacion);
            break;
          case '2':
            dibujaBloqueEnPosicionNueve(9, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(1, image, altoImg, anchoImg, cx, cy, separacion);
            break;
          case '3':
            dibujaBloqueEnPosicionNueve(9, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(1, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(5, image, altoImg, anchoImg, cx, cy, separacion);
            break;
          case '4':
            dibujaBloqueEnPosicionNueve(9, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(7, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(3, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(1, image, altoImg, anchoImg, cx, cy, separacion);
            break;
          case '5':
            dibujaBloqueEnPosicionNueve(1, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(3, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(5, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(7, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(9, image, altoImg, anchoImg, cx, cy, separacion);
            break;
          case '6':
            dibujaBloqueEnPosicionNueve(9, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(6, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(3, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(7, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(4, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(1, image, altoImg, anchoImg, cx, cy, separacion);
            break;
          case '7':
            dibujaBloqueEnPosicionNueve(9, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(6, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(3, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(5, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(7, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(4, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(1, image, altoImg, anchoImg, cx, cy, separacion);
            break;
          case '8':
            dibujaBloqueEnPosicionNueve(9, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(6, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(3, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(8, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(2, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(7, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(4, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(1, image, altoImg, anchoImg, cx, cy, separacion);
            break;
          case '9':
            dibujaBloqueEnPosicionNueve(9, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(6, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(3, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(8, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(5, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(2, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(7, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(4, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(1, image, altoImg, anchoImg, cx, cy, separacion);
            break;
        }

        function dibujaBloqueEnPosicionNueve(posicion, image, altoImg, anchoImg, cx, cy, separacion) { //posicion 1-9
          separacion = altoImg == 6 ? separacion * 4 : separacion;
          var x, y;
          if (posicion == 1 || posicion == 4 || posicion == 7) {
            x = cx - (anchoImg * 1.5) - separacion;
          } else if (posicion == 2 || posicion == 5 || posicion == 8) {
            x = cx - (anchoImg / 2)
          } else {
            x = cx + (anchoImg / 2) + separacion;
          }
          if (posicion == 1 || posicion == 2 || posicion == 3) {
            y = cy - (altoImg * 1.5) - separacion;
          } else if (posicion == 4 || posicion == 5 || posicion == 6) {
            y = cy - (altoImg / 2);
          } else {
            y = cy + (altoImg / 2) + separacion;
          }
          ctx.drawImage(image, x, y, anchoImg, altoImg);
        }
      }

      function dibujaBloqueEnPosicionTres(numero, image, cx, cy, altoImgRep) {
        //console.log('se ejecuto');
        var altoImg = altoImgRep;
        var anchoImg = image.width * altoImg / image.height;
        numero = Number(numero)
        var x, y;
        altoImg = Number(altoImg);
        if (numero === 1) {
          x = cx - anchoImg / 2;
          y = cy - altoImg / 2;
          ctx.drawImage(image, x, y, anchoImg, altoImg);
        } else if (numero === 2) {
          x = cx - (anchoImg + anchoImg / 2) / 2;
          y = cy - (altoImg + altoImg / 2) / 2;
          ctx.drawImage(image, x, y, anchoImg, altoImg);
          x = x + anchoImg / 2;
          y = y + altoImg / 2;
          ctx.drawImage(image, x, y, anchoImg, altoImg);
        } else if (numero === 3) {
          x = cx - anchoImg / 2;
          y = cy - altoImg / 2;
          ctx.drawImage(image, x - anchoImg / 2, y - altoImg / 2, anchoImg, altoImg);
          ctx.drawImage(image, x, y, anchoImg, altoImg);
          ctx.drawImage(image, cx, cy, anchoImg, altoImg);
        }
      }
    }
  }

  async function muestraValoresPosicionales(valorPosicional, yStart, diviciones, anchoSeparaciones, imgFlechaAbajo, imgSignoMas) {
    ctx.font = `${valorPosicional.altoTexto}pt LarkeNeueThinFuente`;
    ctx.fillStyle = '#F58220';
    ctx.textAlign = 'center';
    var { umil, centena, decena, unidad } = valorPosicional.numeros;
    var numerosValorPosicional = diviciones === 3 ? [centena, decena, unidad] : [umil, centena, decena, unidad];
    ////console.log(numerosValorPosicional);
    for (var i = 1, centroSeccion, centroSeparacion, yTexto; i < diviciones + 1; i++) {
      centroSeccion = (anchoSeparaciones * i) - (anchoSeparaciones / 2);
      centroSeparacion = anchoSeparaciones * i;
      //flecha
      var xFlecha = centroSeccion - (imgFlechaAbajo.width / 2);
      ctx.drawImage(imgFlechaAbajo, xFlecha, yStart);
      //texto
      if (typeof numerosValorPosicional[i - 1] === 'string') {
        yTexto = yStart + imgFlechaAbajo.height + _separacionElementos + valorPosicional.altoTexto;
        ctx.fillText(numerosValorPosicional[i - 1], centroSeccion, yTexto);
      } else {
        await cargaImagen(numerosValorPosicional[i - 1].src).then(function (img) {
          var anchoImgVp = numerosValorPosicional[i - 1].alto * img.width / img.height;
          var xImagenVp = centroSeccion - anchoImgVp / 2;
          var yImagenVp = yStart + imgFlechaAbajo.height + _separacionElementos;
          ctx.drawImage(img, xImagenVp, yImagenVp, anchoImgVp, numerosValorPosicional[i - 1].alto);
        }).catch(function (error) {
          //console.log(error);
        });
      }
      //singo mas
      if (valorPosicional.mostrarSignoMas === 'si') {
        if (i + 1 !== diviciones + 1) {
          var xMas = centroSeparacion - (imgSignoMas.width / 2);
          var yMas = yStart + imgFlechaAbajo.height + _separacionElementos + (valorPosicional.altoTexto / 2) - (imgSignoMas.height / 2)
          ctx.drawImage(imgSignoMas, xMas, yMas);
        }
      }
    }
    return yTexto + _separacionElementos;
  }

  function muestraTextoResultado(yStart, diviciones, anchoSeparaciones, imgFlechaAbajo) {
    ctx.font = `${datosEjercicio.resultado.altoTexto}pt LarkeNeueThinFuente`;
    ctx.fillStyle = '#F58220';
    //imagen flecha
    var xImage = _width / 2 - imgFlechaAbajo.width / 2;
    ctx.drawImage(imgFlechaAbajo, xImage, yStart);

    var xTexto = _width / 2;
    var yTexto = yStart + imgFlechaAbajo.height + _separacionElementos + datosEjercicio.resultado.altoTexto;

    ctx.fillText(datosEjercicio.resultado.numero, xTexto, yTexto);
  }

  function cargaRecursos() {
    var columnas = datosEjercicio.tabla.configuracion.tipoTabla === 'miles' ? '4' : '3';
    var pisos = datosEjercicio.tabla.configuracion.pisosTabla;
    var srcTabla = `../../../../imagenes_front/tablas_posicionales/Tabla${columnas}x${pisos}.svg`
    let recursos = [
      cargaImagen(srcTabla),
      cargaImagen(imgSrcFlechaAbajo),
      cargaImagen(imgSrcSignoMas),
      cargaFuente("LarkeNeueThinFuente", srcFuente)
    ];

    return recursos;
  }

  function calculaAltoCanvas(anchoTabla, altoTabla, altoFlechas) {
    let altoImagen = _width * altoTabla / anchoTabla; // calcula el alto de la imagen
    let separaciones = 0, flechas = 0, texto = 0;
    if (datosEjercicio.valoresPosicionales.length > 0) { //
      separaciones = separaciones + 3 * datosEjercicio.valoresPosicionales.length;
      flechas += datosEjercicio.valoresPosicionales.length;
      texto = texto +
        (datosEjercicio.valoresPosicionales[0] ? Number(datosEjercicio.valoresPosicionales[0].altoTexto) : 0) +
        (datosEjercicio.valoresPosicionales[1] ? Number(datosEjercicio.valoresPosicionales[1].altoTexto) : 0);
    }
    if (_dibujaTextoResultado == 'si') {
      separaciones = datosEjercicio.valoresPosicionales.length > 0 ?
        separaciones + 2 * datosEjercicio.valoresPosicionales.length :
        separaciones + 3;
      flechas++;
      texto = texto + Number(_altoTextoResultado);
    }
    let altoCanvas = altoImagen + // alto de la imagen de la tabla
      altoFlechas * flechas + //alto de las imagenes de flechas
      separaciones * _separacionElementos + // alto de las separaciones
      texto + 10; //alto de la fuente de los textos
    return { altoCanvas, altoImagen };
  }
}


function valorPosicional(config) {
  const { container, params, variables, versions, vt } = config;
  var { _tipo, _texto, _numeroPalabras, _marca, _separacionNumeros, _miles, _centenas, _decenas, _unidades, _altoTexo, _margenTopBottom } = params;
  var imgSrcFlechaAbajo = '../../../../imagenes_front/tablas_posicionales/flecha_fija.svg';
  var imgSrcSignoMas = '../../../../imagenes_front/tablas_posicionales/num_sig_mas.svg';
  var srcFuente = '../../../../fonts/LarkeNeueThin.ttf';

  var vars = vt ? variables : versions;

  try {
    _miles = regex(`$${_miles}`, vars, vt);
    _centenas = regex(`$${_centenas}`, vars, vt);
    _decenas = regex(`$${_decenas}`, vars, vt);
    _unidades = regex(`$${_unidades}`, vars, vt);
    if (_tipo === 'Numero Escrito') {
      _numeroPalabras = regex(`$${_numeroPalabras}`, vars, vt);
    } else if (_tipo === 'Texto') {
      _texto = regex(_texto, vars, vt);
    } else if (_tipo === 'Texto a Palabras') {
      _numeroPalabras = regex(`$${_numeroPalabras}`, vars, vt);
      _texto = regex(_texto, vars, vt);
    }
  } catch (error) {
    //console.log(error);
  }


  var ctx = container.getContext('2d');
  Promise.all([
    cargaImagen(imgSrcFlechaAbajo),
    cargaImagen(imgSrcSignoMas),
    cargaFuente('LarkeNeueThinFuente', srcFuente)
  ]).then(function (result) {
    var imgFlecha = result[0],
      imgSignoMas = result[1];
    _altoTexo = Number(_altoTexo);
    _margenTopBottom = Number(_margenTopBottom);
    container.height = (_margenTopBottom * 4) + (_altoTexo * 2) + imgFlecha.height;
    container.width = 850;
    ctx.font = `${_altoTexo}pt LarkeNeueThinFuente`;
    ctx.textAlign = "center";
    ctx.fillStyle = '#F58220';
    var xTexto = container.width / 2;
    var yTexto = _altoTexo + _margenTopBottom;

    if (_tipo === 'Numero Escrito') {
      ctx.fillText(_numeroPalabras, xTexto, yTexto);
    } else if (_tipo === 'Texto' || _tipo === 'Texto a Palabras') {
      ctx.fillText(_texto, xTexto, yTexto);
    }

    if (_tipo === 'Numero Escrito') {
      var xFlecha = (container.width / 2) - (imgFlecha.width / 2);
      var yFlecha = _altoTexo + (_margenTopBottom * 2);
      ctx.drawImage(imgFlecha, xFlecha, yFlecha);

      var separaciones = _miles !== '$Seleccione' ? 4 : 3;
      var anchoSeparacion = (container.width - 60) / separaciones;
      var numeros = _miles !== '$Seleccione' ? [_miles, _centenas, _decenas, _unidades] : [_centenas, _decenas, _unidades];
      for (var i = 1; i < separaciones + 1; i++) {
        var centro = (anchoSeparacion * i) + 30 - (anchoSeparacion / 2);
        var separacion = (anchoSeparacion * i) + 30;
        escribeNumero(centro, numeros[i - 1]);
        i + 1 !== separaciones + 1 && dibujaSignoMas(separacion);
      }
    } else if (_tipo === 'Texto') {
      var xFlecha = (container.width / 2) - (imgFlecha.width / 2);
      var yFlecha = _altoTexo + (_margenTopBottom * 2);
      ctx.drawImage(imgFlecha, xFlecha, yFlecha);

      escribeNumeroCentro();
    } else if (_tipo === 'Texto a Palabras') {
      var xFlecha = (container.width / 2) - (imgFlecha.width / 2);
      var yFlecha = _altoTexo + (_margenTopBottom * 2);
      ctx.drawImage(imgFlecha, xFlecha, yFlecha);
      var xPalabras = container.width / 2;
      var yPalabras = _altoTexo * 2 + (_margenTopBottom * 3) + imgFlecha.height;
      ctx.fillText(_numeroPalabras, xPalabras, yPalabras);
    } else {
      var underline = _marca === 'U de Mil' ? 1 : 2;
      var anchoTextoNumero = _altoTexo * 4 + 3 * Number(_separacionNumeros);
      var margen = (container.width - anchoTextoNumero) / 4;
      var numeros = [_miles, _centenas, _decenas, _unidades];
      for (var i = 1; i < 5; i++) {
        var centro = margen + _separacionNumeros * (i - 1) + (_altoTexo * i) - (_altoTexo / 2);
        var y = _margenTopBottom + _altoTexo;
        ctx.fillText(numeros[i - 1], centro, y);
        if (i === underline) {
          var xStart = centro - (_altoTexo / 2) - 5;
          var xEnd = centro + (_altoTexo / 2) + 5;
          var yUnderline = y + 5;
          dibujaUnderlineNumero(xStart, xEnd, yUnderline);
          var xFlecha = centro - (imgFlecha.width / 2);
          var yFlecha = y + 5 + _margenTopBottom;
          ctx.drawImage(imgFlecha, xFlecha, yFlecha);
          ctx.textAlign = "left";
          var xTexto = centro - (_altoTexo * 0.35);
          var yTexto = y + 5 + _margenTopBottom * 2 + imgFlecha.height + _altoTexo;
          if (underline === 2) {
            ctx.fillText(`${_centenas} centenas = ${_centenas}00`, xTexto, yTexto);
          } else {
            ctx.fillText(`${_miles} unidades de mil = ${_miles}000`, xTexto, yTexto);
          }
        }
      }
    }

    function dibujaUnderlineNumero(xStart, xEnd, yUnderline) {
      ctx.strokeStyle = "#FF0000";
      ctx.beginPath();
      ctx.moveTo(xStart, yUnderline);
      ctx.lineTo(xEnd, yUnderline);
      ctx.stroke();
      ctx.closePath();
    }

    function escribeNumeroCentro() {
      var numero = `${_miles} ${_centenas}${_decenas}${_unidades}`;
      var x = container.width / 2;
      var y = (_altoTexo * 2) + (_margenTopBottom * 3) + imgFlecha.height;
      ctx.fillText(numero, x, y);
    }

    function escribeNumero(centro, numero) {
      var y = (_altoTexo * 2) + (_margenTopBottom * 3) + imgFlecha.height;
      ctx.fillText(numero, centro, y);
    }

    function dibujaSignoMas(separacion) {
      var x = separacion - (imgSignoMas.width / 2);
      var y = (_altoTexo * 2) + (_margenTopBottom * 3) + imgFlecha.height - (_altoTexo / 2) - (imgSignoMas.height / 2);
      ctx.drawImage(imgSignoMas, x, y);
    }

  }).catch(function (error) {
    //console.log(error)
  });
}

function repeticionPic(config) {
  const { container, params, variables, versions, vt } = config;

  var imagenes = [{
    name: 'bloque mil',
    src: '../../../../imagenes_front/bloques_multibase/bloque-4.svg'
  }, {
    name: 'bloque cien',
    src: '../../../../imagenes_front/bloques_multibase/bloque-3.svg'
  }, {
    name: 'bloque diez',
    src: '../../../../imagenes_front/bloques_multibase/bloque-2.svg'
  }, {
    name: 'bloque uno',
    src: '../../../../imagenes_front/bloques_multibase/bloque-1.svg'
  }, {
    name: 'billete mil',
    src: '../../../../imagenes_front/monedas_billetes/1000.svg'
  }, {
    name: 'moneda cien',
    src: '../../../../imagenes_front/monedas_billetes/100.svg'
  }, {
    name: 'moneda diez',
    src: '../../../../imagenes_front/monedas_billetes/10.svg'
  }, {
    name: 'moneda uno',
    src: '../../../../imagenes_front/monedas_billetes/1.svg'
  }, {
    name: 'moneda quinientos',
    src: '../../../../imagenes_front/monedas_billetes/500.svg'
  }, {
    name: 'moneda cincuenta',
    src: '../../../../imagenes_front/monedas_billetes/50.svg'
  }, {
    name: 'moneda cinco',
    src: '../../../../imagenes_front/monedas_billetes/5.svg'
  }, {
    name: 'signo resta',
    src: '../../../../imagenes_front/simbolos/menos.svg'
  }, {
    name: 'signo igual',
    src: '../../../../imagenes_front/simbolos/igual.svg'
  }, {
    name: 'signo mayor',
    src: '../../../../imagenes_front/simbolos/mayor.svg'
  }, {
    name: 'signo menor',
    src: '../../../../imagenes_front/simbolos/menor.svg'
  }, {
    name: 'signo suma',
    src: '../../../../imagenes_front/tablas_posicionales/num_sig_mas.svg'
  }, {
    name: 'signo distinto',
    src: '../../../../imagenes_front/simbolos/Numeracion_Distinto.svg'
  }, {
    name: 'rectangulo',
    src: '../../../../imagenes_front/figuras_geometricas/rectangulo_2.svg'
  }];
  //'signo resta', 'signo igual', 'signo mayor', 'signo menor'
  let { _pictoricos, _separacion, heightCanvas, widthCanvas, _tituloCanvas, _canvasBorder, _canvasBorderRadius, _agruparRepeticiones,
    _imagen1, _altoImagen1, _formaRepeticion1, _repeticiones1, _separacion1, _separaciony1, _repBiY1,
    _imagen2, _altoImagen2, _formaRepeticion2, _repeticiones2, _separacion2, _separaciony2, _repBiY2,
    _imagen3, _altoImagen3, _formaRepeticion3, _repeticiones3, _separacion3, _separaciony3, _repBiY3,
    _imagen4, _altoImagen4, _formaRepeticion4, _repeticiones4, _separacion4, _separaciony4, _repBiY4,
    _imagen5, _altoImagen5, _formaRepeticion5, _repeticiones5, _separacion5, _separaciony5, _repBiY5,
    _imagen6, _altoImagen6, _formaRepeticion6, _repeticiones6, _separacion6, _separaciony6, _repBiY6,
    _imagen7, _altoImagen7, _formaRepeticion7, _repeticiones7, _separacion7, _separaciony7, _repBiY7,
    _imagen8, _altoImagen8, _formaRepeticion8, _repeticiones8, _separacion8, _separaciony8, _repBiY8,
    _imagen9, _altoImagen9, _formaRepeticion9, _repeticiones9, _separacion9, _separaciony9, _repBiY9,
    _imagen10, _altoImagen10, _formaRepeticion10, _repeticiones10, _separacion10, _separaciony10, _repBiY10,
    _imagen11, _altoImagen11, _formaRepeticion11, _repeticiones11, _separacion11, _separaciony11, _repBiY11,
    _imagen12, _altoImagen12, _formaRepeticion12, _repeticiones12, _separacion12, _separaciony12, _repBiY12, } = params;

  var vars = vt ? variables : versions;
  try {
    _repeticiones1 = regexFunctions(regex(_repeticiones1, vars, vt));
    _repeticiones2 = regexFunctions(regex(_repeticiones2, vars, vt));
    _repeticiones3 = regexFunctions(regex(_repeticiones3, vars, vt));
    _repeticiones4 = regexFunctions(regex(_repeticiones4, vars, vt));
    _repeticiones5 = regexFunctions(regex(_repeticiones5, vars, vt));
    _repeticiones6 = regexFunctions(regex(_repeticiones6, vars, vt));
    _repeticiones7 = regexFunctions(regex(_repeticiones7, vars, vt));
    _repeticiones8 = regexFunctions(regex(_repeticiones8, vars, vt));
    _repeticiones9 = regexFunctions(regex(_repeticiones9, vars, vt));
    _repeticiones10 = regexFunctions(regex(_repeticiones10, vars, vt));
    _repeticiones11 = regexFunctions(regex(_repeticiones11, vars, vt));
    _repeticiones12 = regexFunctions(regex(_repeticiones12, vars, vt));
  } catch (error) {
    //console.log(error);
  }

  var repeticiones = getRepeticiones();

  _separacion = Number(_separacion);
  let xStart = _separacion;
  let posicicionesInicio = [Number(xStart)];
  container.height = Number(heightCanvas);
  container.width = Number(widthCanvas);
  if (_canvasBorder !== '') {
    container.style.border = _canvasBorder;
    container.style.borderRadius = _canvasBorderRadius + 'px';
  }
  if (_tituloCanvas !== '') {
    var titulo = document.createElement('span');
    titulo.innerText = _tituloCanvas;
    titulo.style.fontSize = '18px';
    titulo.style.fontWeight = '600';
    container.parentNode.insertBefore(titulo, container);
  }

  var ctx = container.getContext('2d');
  //carga las imagenes y dibuja las repeticiones
  Promise.all(repeticiones.map(x => cargaImagen(x.imagen.src))).then(imagenes => {
    repeticiones.forEach(function (x, i) {
      repeticiones[i].imagen = imagenes[i]
    });
    return repeticiones;
  }).then(function (repeticionesPictoricas) {
    for (let repeticion of repeticionesPictoricas) {
      if (repeticion.repeticiones > 0) {
        switch (repeticion.formaRepeticion) {
          case 'dado':
            xStart = dibujaRepeticionDado(repeticion);
            break;
          case 'diagonal/apilado':
            xStart = dibujaRepeticionDiagonalApilado(repeticion);
            break;
          case 'diagonal':
            xStart = dibujaRepeticionDiagonal(repeticion);
            break;
          case 'horizontal/vertical':
            xStart = dibujaRepeticionHorizontalVertical(repeticion);
            break;
          case 'horizontal':
            xStart = dibujaRepeticionHorizontal(repeticion);
            break;
          case 'vertical':
            xStart = dibujaRepeticionVertical(repeticion);
            break;
          case 'bidimensional':
            xStart = dibujaRepeticionBidimensional(repeticion);
            break;
          default:
            //console.log(repeticion);
            break;
        }

      }
      posicicionesInicio.push(xStart);
    }
    if (_agruparRepeticiones !== "") {
      dibujaAgrupacionDePictoricos();
    }
    //console.log(posicicionesInicio);
  }).catch(function (error) {
    //console.log(error);
  });

  function buscarImagen(imagenBuscada) {
    for (var imagen of imagenes) {
      if (imagen.name === imagenBuscada) {
        return imagen;
      }
    }
  }

  function dibujaAgrupacionDePictoricos() {
    let agrupaciones = _agruparRepeticiones.split(';');
    let yRect = _separacion / 2;
    let heightRect = container.height - _separacion;
    agrupaciones.forEach(function (agrupacion) {
      let puntos = agrupacion.split('-');
      let puntoInicio = Number(puntos[0]);
      let puntoFinal = Number(puntos[1]);
      let color = puntos[2] ? puntos[2] : getColorDeEje(ejeF);
      let xRect = posicicionesInicio[puntoInicio - 1] - (_separacion / 2);
      let widthRect = posicicionesInicio[puntoFinal] - (_separacion / 2) - xRect;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.strokeRect(xRect, yRect, widthRect, heightRect);
      ctx.restore();
    });
  }

  function getColorDeEje(eje) {
    switch (eje) {
      case '00':
        return '#BC2424';
      case '01':
        return '#BC2424';
      case '02':
        return '#91518F';
      case '03':
        return '#00AAAD';
      case '04':
        return '#175389';
      case '05':
        return '#549C02';
    }
  }

  function getRepeticiones() {
    let repeticiones = [{
      imagen: _imagen1 !== '' ? buscarImagen(_imagen1) : { src: '' },
      altoImagen: Number(_altoImagen1),
      formaRepeticion: _formaRepeticion1,
      repeticiones: Number(_repeticiones1),
      separacion: Number(_separacion1),
      separaciony: Number(_separaciony1),
      ejeY: Number(_repBiY1)
    }];

    if (_pictoricos > 1) {
      repeticiones[1] = {
        imagen: _imagen2 !== '' ? buscarImagen(_imagen2) : { src: '' },
        altoImagen: Number(_altoImagen2),
        formaRepeticion: _formaRepeticion2,
        repeticiones: Number(_repeticiones2),
        separacion: Number(_separacion2),
        separaciony: Number(_separaciony2),
        ejeY: Number(_repBiY2)
      }
    }

    if (_pictoricos > 2) {
      repeticiones[2] = {
        imagen: _imagen3 !== '' ? buscarImagen(_imagen3) : { src: '' },
        altoImagen: Number(_altoImagen3),
        formaRepeticion: _formaRepeticion3,
        repeticiones: Number(_repeticiones3),
        separacion: Number(_separacion3),
        separaciony: Number(_separaciony3),
        ejeY: Number(_repBiY3)
      }
    }

    if (_pictoricos > 3) {
      repeticiones[3] = {
        imagen: _imagen4 !== '' ? buscarImagen(_imagen4) : { src: '' },
        altoImagen: Number(_altoImagen4),
        formaRepeticion: _formaRepeticion4,
        repeticiones: Number(_repeticiones4),
        separacion: Number(_separacion4),
        separaciony: Number(_separaciony4),
        ejeY: Number(_repBiY4)
      }
    }

    if (_pictoricos > 4) {
      repeticiones[4] = {
        imagen: _imagen5 !== '' ? buscarImagen(_imagen5) : { src: '' },
        altoImagen: Number(_altoImagen5),
        formaRepeticion: _formaRepeticion5,
        repeticiones: Number(_repeticiones5),
        separacion: Number(_separacion5),
        separaciony: Number(_separaciony5),
        ejeY: Number(_repBiY5)
      }
    }

    if (_pictoricos > 5) {
      repeticiones[5] = {
        imagen: _imagen6 !== '' ? buscarImagen(_imagen6) : { src: '' },
        altoImagen: Number(_altoImagen6),
        formaRepeticion: _formaRepeticion6,
        repeticiones: Number(_repeticiones6),
        separacion: Number(_separacion6),
        separaciony: Number(_separaciony6),
        ejeY: Number(_repBiY6)
      }
    }

    if (_pictoricos > 6) {
      repeticiones[6] = {
        imagen: _imagen7 !== '' ? buscarImagen(_imagen7) : { src: '' },
        altoImagen: Number(_altoImagen7),
        formaRepeticion: _formaRepeticion7,
        repeticiones: Number(_repeticiones7),
        separacion: Number(_separacion7),
        separaciony: Number(_separaciony7),
        ejeY: Number(_repBiY7)
      }
    }

    if (_pictoricos > 7) {
      repeticiones[7] = {
        imagen: _imagen8 !== '' ? buscarImagen(_imagen8) : { src: '' },
        altoImagen: Number(_altoImagen8),
        formaRepeticion: _formaRepeticion8,
        repeticiones: Number(_repeticiones8),
        separacion: Number(_separacion8),
        separaciony: Number(_separaciony8),
        ejeY: Number(_repBiY8)
      }
    }

    if (_pictoricos > 8) {
      repeticiones[8] = {
        imagen: _imagen9 !== '' ? buscarImagen(_imagen9) : { src: '' },
        altoImagen: Number(_altoImagen9),
        formaRepeticion: _formaRepeticion9,
        repeticiones: Number(_repeticiones9),
        separacion: Number(_separacion9),
        separaciony: Number(_separaciony9),
        ejeY: Number(_repBiY9)
      }
    }

    if (_pictoricos > 9) {
      repeticiones[9] = {
        imagen: _imagen10 !== '' ? buscarImagen(_imagen10) : { src: '' },
        altoImagen: Number(_altoImagen10),
        formaRepeticion: _formaRepeticion10,
        repeticiones: Number(_repeticiones10),
        separacion: Number(_separacion10),
        separaciony: Number(_separaciony10),
        ejeY: Number(_repBiY10)
      }
    }

    if (_pictoricos > 10) {
      repeticiones[10] = {
        imagen: _imagen11 !== '' ? buscarImagen(_imagen11) : { src: '' },
        altoImagen: Number(_altoImagen11),
        formaRepeticion: _formaRepeticion11,
        repeticiones: Number(_repeticiones11),
        separacion: Number(_separacion11),
        separaciony: Number(_separaciony11),
        ejeY: Number(_repBiY11)
      }
    }

    if (_pictoricos > 11) {
      repeticiones[11] = {
        imagen: _imagen12 !== '' ? buscarImagen(_imagen12) : { src: '' },
        altoImagen: Number(_altoImagen12),
        formaRepeticion: _formaRepeticion12,
        repeticiones: Number(_repeticiones12),
        separacion: Number(_separacion12),
        separaciony: Number(_separaciony12),
        ejeY: Number(_repBiY12)
      }
    }


    return repeticiones;
  }

  function dibujaRepeticionBidimensional(repeticion) {
    //console.log(xStart);
    const { imagen, altoImagen, repeticiones, separacion, ejeY } = repeticion;
    var anchoImagen = imagen.width * altoImagen / imagen.height;
    var altoTotal = altoImagen * ejeY + separacion * (ejeY + 1);
    var yStart = container.height / 2 - altoTotal / 2;
    for (var i = 0, fila = 1, columna, xImagen, yImagen; i < repeticiones; i++) {
      columna = Math.floor(i / ejeY);
      yImagen = yStart + altoImagen * (fila - 1) + separacion * fila;
      xImagen = xStart + anchoImagen * columna + separacion * columna;
      //console.log(xImagen);
      ctx.drawImage(imagen, xImagen, yImagen, anchoImagen, altoImagen);
      if (fila === ejeY) {
        fila = 1;
      } else {
        fila++;
      }
    }
    return xImagen + anchoImagen + _separacion;
  }

  function dibujaRepeticionVertical(repeticion) {
    var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
    var yStart = container.height / 2 - (repeticion.repeticiones * repeticion.altoImagen + (repeticion.repeticiones - 1) * repeticion.separacion) / 2;
    for (var i = 0, x = xStart, y; i < repeticion.repeticiones; i++) {
      y = yStart + (i * repeticion.altoImagen) + (i * repeticion.separacion);
      ctx.drawImage(repeticion.imagen, x, y, width, repeticion.altoImagen);
    }
    return x + width + _separacion;
  }

  function dibujaRepeticionHorizontal(repeticion) {
    var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
    for (var i = 0, x, y; i < repeticion.repeticiones; i++) {
      x = xStart + (i * repeticion.separacion) + (i * width);
      y = container.height / 2 - repeticion.altoImagen / 2;
      ctx.drawImage(repeticion.imagen, x, y, width, repeticion.altoImagen);
    }
    return x + width + _separacion;
  }

  function dibujaRepeticionHorizontalVertical(repeticion) {
    var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
    var yPrimera;
    if (repeticion.repeticiones < 6) {
      yPrimera = container.height / 2 - repeticion.altoImagen / 2;
    } else {
      var heightTotal = repeticion.altoImagen + (repeticion.repeticiones - 6) * repeticion.separacion + width * (repeticion.repeticiones - 5);
      yPrimera = container.height / 2 - heightTotal / 2;
    }
    for (var i = 0, x, x2, y2; i < repeticion.repeticiones; i++) {
      if (i >= 6) {
        x2 = xStart;
        y2 = yPrimera + repeticion.separacion * (i - 5) + width * (i - 5) + repeticion.altoImagen;
        ctx.save();
        ctx.translate(x2, y2);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(repeticion.imagen, 0, 0, width, repeticion.altoImagen);
        ctx.restore();
      } else {
        x = (width * i) + (repeticion.separacion * i) + xStart;
        ctx.drawImage(repeticion.imagen, x, yPrimera, width, repeticion.altoImagen);
      }
    }
    return x + width + _separacion;
  }

  function dibujaRepeticionDiagonal(repeticion) {
    var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
    for (var i = 0, x, y, height; i < repeticion.repeticiones; i++) {
      x = xStart + i * repeticion.separacion;
      height = repeticion.altoImagen + (repeticion.repeticiones - 1) * repeticion.separaciony;
      y = (container.height / 2) - (height / 2) + (i * repeticion.separaciony);
      ctx.drawImage(repeticion.imagen, x, y, width, repeticion.altoImagen);
    }
    return x + width + _separacion;
  }

  function dibujaRepeticionDiagonalApilado(repeticion) {
    var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
    for (var i = 0, x, y, height; i < repeticion.repeticiones; i++) {
      x = i <= 4 ?
        xStart + i * repeticion.separacion :
        xStart + width + (5 * repeticion.separacion) + ((i - 5) * repeticion.separacion);
      if (repeticion.repeticiones <= 5) { // solo hay una pila
        height = repeticion.altoImagen + (repeticion.repeticiones - 1) * repeticion.separaciony;
        y = (container.height / 2) - (height / 2) + (i * repeticion.separaciony);
      } else { // hay dos pilas
        if (i <= 4) {
          height = repeticion.altoImagen + 4 * repeticion.separaciony;
          y = (container.height / 2) - (height / 2) + (i * repeticion.separaciony);
        } else {
          height = repeticion.altoImagen + (repeticion.repeticiones - 5) * repeticion.separaciony;
          y = (container.height / 2) - (height / 2) + ((i - 4) * repeticion.separaciony);
        }
      }
      ctx.drawImage(repeticion.imagen, x, y, width, repeticion.altoImagen);
    }
    return x + width + _separacion;
  }

  function dibujaRepeticionDado(repeticion) {
    var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
    var x = 0;
    switch (repeticion.repeticiones) {
      case 1:
        x = dibujaBloqueEnPosicionUno(repeticion.imagen, repeticion.altoImagen);
        break;
      case 2:
        x = dibujaBloqueEnPosicionCuatro(4, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionCuatro(1, repeticion.imagen, repeticion.altoImagen, repeticion.separacion)
        break;
      case 3:
        dibujaBloqueEnPosicionNueve(1, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(5, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        x = dibujaBloqueEnPosicionNueve(9, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        break;
      case 4:
        dibujaBloqueEnPosicionCuatro(4, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionCuatro(3, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        x = dibujaBloqueEnPosicionCuatro(2, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionCuatro(1, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        break;
      case 5:
        dibujaBloqueEnPosicionNueve(1, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(3, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(5, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(7, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        x = dibujaBloqueEnPosicionNueve(9, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        break;
      case 6:
        x = dibujaBloqueEnPosicionNueve(8, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(5, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(2, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(7, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(4, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(1, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        break;
      case 7:
        x = dibujaBloqueEnPosicionNueve(9, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(6, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(3, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(5, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(7, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(4, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(1, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        break;
      case 8:
        x = dibujaBloqueEnPosicionNueve(9, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(6, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(3, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(8, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(2, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(7, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(4, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(1, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        break;
      case 9:
        x = dibujaBloqueEnPosicionNueve(9, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(6, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(3, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(8, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(5, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(2, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(7, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(4, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        dibujaBloqueEnPosicionNueve(1, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
        break;
    }
    //console.log(x);
    return x + width + _separacion;

    function dibujaBloqueEnPosicionNueve(posicion, imagen, altoImagen, separacion) { //posicion 1-9
      var width = imagen.width * altoImagen / imagen.height;
      var x, y;
      if (posicion == 1 || posicion == 4 || posicion == 7) {
        x = xStart;
      } else if (posicion == 2 || posicion == 5 || posicion == 8) {
        x = separacion + width + xStart;
      } else {
        x = separacion * 2 + width * 2 + xStart;
      }
      if (posicion == 1 || posicion == 2 || posicion == 3) {
        y = container.height / 2 - altoImagen / 2 - separacion - altoImagen;
      } else if (posicion == 4 || posicion == 5 || posicion == 6) {
        y = container.height / 2 - altoImagen / 2;
      } else {
        y = container.height / 2 + altoImagen / 2 + separacion;
      }
      ctx.drawImage(imagen, x, y, width, altoImagen);
      return x;
    }

    function dibujaBloqueEnPosicionCuatro(posicion, imagen, altoImagen, separacion) {
      var width = imagen.width * altoImagen / imagen.height;
      var x, y;
      if (posicion == 1 || posicion == 3) {
        x = xStart;
      } else {
        x = separacion + width + xStart;
      }
      if (posicion == 1 || posicion == 2) {
        y = container.height / 2 - altoImagen - separacion / 2;
      } else {
        y = container.height / 2 + separacion / 2;
      }
      ctx.drawImage(imagen, x, y, width, altoImagen);
      return x;
    }

    function dibujaBloqueEnPosicionUno(imagen, altoImagen) {
      var width = imagen.width * altoImagen / imagen.height;
      var x = xStart;
      var y = container.height / 2 - altoImagen / 2;
      ctx.drawImage(imagen, x, y, width, altoImagen);
      return x;
    }
  }
}

function cardinalAOrdinal(numero, genero) {//M o F
  switch (numero) {
    case '1':
      return genero === 'M' ? 'primer' : 'primera';
    case '2':
      return genero === 'M' ? 'segundo' : 'segunda';
    case '3':
      return genero === 'M' ? 'tercer' : 'tercera';
    case '4':
      return genero === 'M' ? 'cuarto' : 'tercera';
    case '5':
      return genero === 'M' ? 'quinto' : 'quinta';
    case '6':
      return genero === 'M' ? 'sexto' : 'sexta';
    case '7':
      return genero === 'M' ? 'séptimo' : 'séptima';
    case '8':
      return genero === 'M' ? 'octavo' : 'octava';
    case '9':
      return genero === 'M' ? 'noveno' : 'novena';
    case '10':
      return genero === 'M' ? 'décimo' : 'décima';
    default:
      return '';
  }
}


function repeticionBidimensional(config) {
  const { container, params, variables, versions, vt } = config;
  //console.log(params);
  const { _separacion, _altoOpciones, _anchoCanvas, _altoCanvas, errFrec, feed } = params;
  let { datos } = params;
  let sepElem = Number(_separacion);
  let altoOpciones = Number(_altoOpciones);
  let anchoCanvas = Number(_anchoCanvas);
  let altoCanvas = Number(_altoCanvas)
  container.height = altoCanvas;
  container.width = anchoCanvas;

  var ctx = container.getContext('2d');
  var vars = vt ? variables : versions;

  datos = datos.map(dato => {//arreglo, imagen, texto
    switch (dato.tipo) {
      case 'arreglo':
        return {
          src: String(regex(dato.src, vars, vt)).replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          repX: Number(regex(dato.repX, vars, vt)),
          repY: Number(regex(dato.repY, vars, vt)),
          textoEjeX: regex(dato.textoEjeX, vars, vt),
          textoEjeY: regex(dato.textoEjeY, vars, vt),
          opcion: regex(dato.opcion, vars, vt),
          altoImagen: Number(dato.altoImagen),
          anchoImagen: Number(dato.anchoImagen),
          separacion: Number(dato.separacion),
          altoOpcion: Number(dato.altoOpcion),
          tipoOpcion: dato.tipoOpcion,
          colorTextoOpcion: dato.colorTextoOpcion,
          tipo: dato.tipo
        };
      case 'imagen':
        return {
          src: String(regex(dato.src, vars, vt)).replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          altoImagen: Number(dato.altoImagen),
          separacion: Number(dato.separacion),
          tipo: dato.tipo
        };
      case 'texto':
        return {
          src: String(regex(dato.src, vars, vt)).replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          nombreFuente: dato.nombreFuente,
          altoTexto: Number(dato.altoTexto),
          texto: regex(dato.texto, vars, vt),
          separacion: Number(dato.separacion),
          tipo: dato.tipo
        };
      default:
        //console.log('defecto');
        break;
    }
  });
  Promise.all(datos.map(arreglo => arreglo.tipo === 'texto' ?
    cargaFuente(arreglo.nombreFuente, arreglo.src) :
    cargaImagen(arreglo.src))
  ).then(async function (imagenes) {
    await cargaFuente('Open-Sans-Regular-Font', '../../../../fonts/OpenSans-Regular-webfont.woff');
    var anchoTotal = sepElem, altoRepeticiones = [];
    imagenes.forEach(function (imagen, index) {
      if (datos[index].tipo === 'arreglo') {
        datos[index].imagen = imagen;
        datos[index].anchoImagen = datos[index].altoImagen * imagen.width / imagen.height;
        altoRepeticiones.push(datos[index].altoImagen * datos[index].repY + datos[index].separacion * (datos[index].repY + 1));
        anchoTotal += (datos[index].anchoImagen * datos[index].repX) + (datos[index].separacion * (datos[index].repX + 1)) + sepElem;
      } else if (datos[index].tipo === 'imagen') {
        datos[index].imagen = imagen;
        datos[index].anchoImagen = datos[index].altoImagen * imagen.width / imagen.height;
        anchoTotal += datos[index].anchoImagen + (datos[index].separacion * 2) + sepElem;
      } else {
        ctx.save();
        ctx.font = `${datos[index].altoTexto}px ${datos[index].nombreFuente}`;
        anchoTotal += datos[index].separacion * 2 + ctx.measureText(datos[index].texto).width + sepElem;
        ctx.restore();
      }
    });
    var xInicio = container.width / 2 - anchoTotal / 2;
    var altoRepeticionMaximo = altoRepeticiones.sort().pop();
    var yStartRepeticiones = container.height / 2 - altoRepeticionMaximo / 2;
    return { datos: datos, xInicio, yStartRepeticiones, altoRepeticionMaximo };
  }).then(function (resultado) {
    const { datos, xInicio, yStartRepeticiones, altoRepeticionMaximo } = resultado;
    for (var i = 0, x = xInicio, y = 0; i < datos.length; i++) { //x => inicio de la repeticion, tiene que acumularse --- y => inicio de la repeticion, se setea en cada repeticion 
      const { imagen, altoImagen, anchoImagen, tipo, separacion } = datos[i];
      if (tipo === 'imagen') {
        x += sepElem + separacion;
        y = container.height / 2 - altoImagen / 2;
        ctx.drawImage(imagen, x, y, anchoImagen, altoImagen);
        x += anchoImagen + separacion;
      } else if (tipo === 'arreglo') {
        let altoTextoOpcion = (errFrec || feed) ? 45 : 30;
        let altoTextoLaterales = (errFrec || feed) ? 40 : 18;
        const { repX, repY, textoEjeX, textoEjeY, opcion, altoOpcion, tipoOpcion, colorTextoOpcion } = datos[i];
        var altoTotalRep = altoImagen * repY + separacion * (repY + 1); //alto total de la repeticion
        var anchoTotalRep = anchoImagen * repX + separacion * (repX + 1); //ancho total de la repeticion
        var xStart = x + sepElem + separacion;
        var yStart = yStartRepeticiones;
        if (opcion !== '') {
          if (tipoOpcion === 'texto') {
            mostrarTexto(opcion, xStart + (anchoTotalRep / 2) - separacion, container.height - altoOpciones + (altoOpcion / 2), 'center', altoOpcion, colorTextoOpcion);
          } else {
            let imgOpcionSrc = opcion.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../');
            let img = new Image();
            img.src = imgOpcionSrc;
            const dibujaImagen = (img, centro, yImg, altoOpcion) => {
              //console.log(img, centro, yImg, altoOpcion);
              let anchoOpcion = img.width * altoOpcion / img.height;
              let xImg = centro - (anchoOpcion / 2);
              ctx.drawImage(img, xImg, yImg, anchoOpcion, altoOpcion);
            };
            let centro = xStart + (anchoTotalRep / 2) - separacion;
            let yImg = container.height - altoOpciones - (altoOpcion / 2) * .85;
            img.onload = () => dibujaImagen(img, centro, yImg, altoOpcion);
          }
        }
        textoEjeX !== '' && mostrarTexto(textoEjeX, xStart + (anchoTotalRep / 2) - separacion, yStart, 'center', altoTextoLaterales, '#000000');
        textoEjeY !== '' && mostrarTexto(textoEjeY, xStart - separacion, yStart + (altoTotalRep / 2), 'right', altoTextoLaterales, '#000000');
        for (var filas = 0, yImagen; filas < repY; filas++) {
          yImagen = yStart + separacion * (filas + 1) + altoImagen * filas;
          for (var cols = 0, xImagen; cols < repX; cols++) {
            xImagen = xStart + separacion * cols + anchoImagen * cols;
            ctx.drawImage(imagen, xImagen, yImagen, anchoImagen, altoImagen);
          }
        }
        x += sepElem + separacion * (repX + 1) + anchoImagen * repX;
      } else {
        const { nombreFuente, altoTexto, separacion, texto } = datos[i];
        ctx.save();
        ctx.font = `${altoTexto}px ${nombreFuente}`;
        ctx.fillStyle = '#F05024';
        ctx.textAlign = 'center';
        var anchoTexto = ctx.measureText(texto).width;
        ctx.fillText(texto, x + sepElem + separacion + anchoTexto / 2, container.height / 2 + altoTexto / 2);
        x += sepElem + separacion * 2 + anchoTexto;
        ctx.restore();
      }
    }

    function mostrarTexto(texto, x, y, aling, fontsize, color) {
      ctx.font = `${fontsize}px Open-Sans-Regular-Font`;
      ctx.textAlign = aling;
      ctx.fillStyle = color ? color : '#000000';
      ctx.fillText(texto, x, y);
    }
  }).catch(function (error) {
    //console.log(error);
  });
}

function multiplicacionPic(config) {
  const { container, params, variables, versions, vt } = config;
  //console.log(params);
  let { datos, _altoCanvas, _anchoCanvas, _repeticiones, _separacion, _sepImgs, _mostrarValores, _separar } = params;
  container.height = Number(_altoCanvas);
  container.width = Number(_anchoCanvas);
  let separacionImg = Number(_sepImgs);
  var ctx = container.getContext('2d');
  var vars = vt ? variables : versions;
  let repgrupos = _mostrarValores === 'si' ? Number(regex(_repeticiones, vars, vt)) + 1 : Number(regex(_repeticiones, vars, vt));
  let separacionElem = Number(_separacion);



  datos = datos.map(function (dato, index) {
    switch (dato.formaRepeticion) {
      case 'izqDer':
        return {
          formaRepeticion: dato.formaRepeticion,
          src: regex(dato.src, vars, vt).replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          alto: Number(dato.alto),
          cantidad: Number(regex(dato.cantidad, vars, vt)),
          numeroX: Number(dato.numeroX),
          tipoValorFinal: dato.tipoValorFinal,
          valorFinal: dato.valorFinal ? regex(dato.valorFinal, vars, vt) : '',
          altoValorFinal: Number(dato.altoValorFinal),
          colorValorFinal: dato.colorValorFinal
        };
      case 'horVert':
        return {
          formaRepeticion: dato.formaRepeticion,
          src: regex(dato.src, vars, vt).replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          alto: Number(dato.alto),
          cantidad: Number(regex(dato.cantidad, vars, vt)),
          srcVert: String(regex(dato.srcVert, vars, vt)),
          tipoValorFinal: dato.tipoValorFinal,
          valorFinal: dato.valorFinal ? regex(dato.valorFinal, vars, vt) : '',
          altoValorFinal: Number(dato.altoValorFinal),
          colorValorFinal: dato.colorValorFinal
        };
      case 'diagonal':
        return {
          formaRepeticion: dato.formaRepeticion,
          src: regex(dato.src, vars, vt).replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
          alto: Number(dato.alto),
          cantidad: Number(regex(dato.cantidad, vars, vt)),
          separacionX: Number(dato.separacionX),
          separacionY: Number(dato.separacionY),
          tipoValorFinal: dato.tipoValorFinal,
          valorFinal: dato.valorFinal ? regex(dato.valorFinal, vars, vt) : '',
          altoValorFinal: Number(dato.altoValorFinal),
          colorValorFinal: dato.colorValorFinal
        };
      default:
        //console.log('defecto');
        break;
    }
  });

  Promise.all(datos.map(x => cargaImagen(x.src))).then(function (imagenes) {
    let altoTotal = separacionElem, anchoElementos = [];
    for (let [index, imagen] of imagenes.entries()) {
      const { formaRepeticion, alto, cantidad } = datos[index];
      datos[index].imagen = imagen;
      datos[index].ancho = imagen.width * alto / imagen.height;
      switch (formaRepeticion) {
        case 'izqDer':
          const { numeroX } = datos[index];
          let filas = cantidad % numeroX === 0 ? cantidad / numeroX : Math.floor(cantidad / numeroX) + 1;
          datos[index].altoRepeticion = alto * filas + separacionImg * (filas + 1) + separacionElem;
          datos[index].anchoRepeticion = datos[index].ancho * numeroX + separacionImg * (numeroX + 1) + separacionElem * 2;
          altoTotal += datos[index].altoRepeticion;
          break;
        case 'horVert':
          datos[index].altoRepeticion = cantidad <= 4 ?
            alto + separacionImg * 2 + separacionElem :
            alto + separacionImg * 2 + (cantidad - 4) * datos[index].ancho + (cantidad - 4) * separacionImg + separacionElem;
          datos[index].anchoRepeticion = cantidad > 4 ?
            datos[index].alto + separacionElem * 2 :
            datos[index].ancho * cantidad + separacionImg * (cantidad + 1) + separacionElem * 2;
          altoTotal += datos[index].altoRepeticion;
          break;
        case 'diagonal':
          const { separacionX, separacionY } = datos[index];
          datos[index].altoRepeticion = alto + separacionY * (cantidad - 1) + separacionImg * 2 + separacionElem;
          datos[index].anchoRepeticion = datos[index].ancho + separacionX * (cantidad - 1) + separacionImg * 2 + separacionElem * 2;
          altoTotal += datos[index].altoRepeticion;
          break;
        default:
          //console.log('degault');
          break;
      }
      anchoElementos.push(datos[index].anchoRepeticion);
    }
    return { repeticiones: datos, altoTotal, anchoMaximo: Math.max(...anchoElementos) };
  }).then(async function (datos) {
    const { repeticiones, altoTotal, anchoMaximo } = datos;
    let anchoSeccion = container.width / repgrupos;
    for (var i = 0, centro; i < repgrupos; i++) {
      let yStart = container.height / 2 - altoTotal / 2;
      centro = (i + 1) * anchoSeccion - (anchoSeccion / 2);
      if (_mostrarValores === 'si' && (i + 1) === repgrupos) {
        let centroY = yStart;
        ctx.save();//dibuja llave de agrupacion de pictoriocos
        ctx.beginPath();
        ctx.arc(centro - (anchoMaximo / 2), yStart + separacionImg + separacionElem + 20, 20, 1.5 * Math.PI, 0, false);
        ctx.lineTo(centro - (anchoMaximo / 2) + 20, yStart + (altoTotal / 2) - 20);
        ctx.arc(centro - (anchoMaximo / 2) + 40, yStart + (altoTotal / 2) - 20, 20, Math.PI, .5 * Math.PI, true)
        ctx.arc(centro - (anchoMaximo / 2) + 40, yStart + (altoTotal / 2) + 20, 20, 1.5 * Math.PI, Math.PI, true)
        ctx.lineTo(centro - (anchoMaximo / 2) + 20, yStart + altoTotal - 40);
        ctx.arc(centro - (anchoMaximo / 2), yStart + altoTotal - separacionImg - separacionElem - 20, 20, 0, .5 * Math.PI, false);
        ctx.strokeStyle = "#808080";
        ctx.stroke();
        ctx.restore();//fin llave de agrupacion de pictoriocos
        for (let repeticion of repeticiones) {
          centroY += repeticion.altoRepeticion / 2;
          let xImg, yImg;
          switch (repeticion.tipoValorFinal) {
            case 'texto':
              ctx.save();
              ctx.textAlign = "center";
              ctx.font = repeticion.altoValorFinal + "px Helvetica"
              ctx.fillStyle = repeticion.colorValorFinal;
              let yTexto = centroY + repeticion.altoValorFinal / 2;
              ctx.fillText(repeticion.valorFinal, centro, yTexto);
              ctx.restore();
              break;
            case 'imagen':
              let imagenValor = await cargaImagen(repeticion.valorFinal);
              let anchoImagen = imagenValor.width * repeticion.altoValorFinal / imagenValor.height;
              xImg = centro - (anchoImagen / 2);
              yImg = centroY - (repeticion.altoValorFinal / 2);
              ctx.drawImage(imagenValor, xImg, yImg, anchoImagen, repeticion.altoValorFinal);
              break;
            default:
              //console.log('degault');
              break;
          }
          centroY += repeticion.altoRepeticion / 2;
        }
      } else {
        if (_separar === 'si') {
          let xRect = centro - (anchoMaximo / 2) + separacionElem;
          let yRect = yStart + separacionElem;
          ctx.strokeStyle = "#808080";
          ctx.strokeRect(xRect, yRect, anchoMaximo - (separacionElem * 2), altoTotal - (separacionElem * 2));
        }
        for (let repeticion of repeticiones) {
          let xStart = centro - repeticion.anchoRepeticion / 2;
          switch (repeticion.formaRepeticion) {
            case 'izqDer':
              let fila = 0, columna = 0;
              for (let r = 0, xImg, yImg; r < repeticion.cantidad; r++) {
                xImg = xStart + separacionElem + separacionImg * (fila + 1) + repeticion.ancho * fila;
                yImg = yStart + separacionElem + separacionImg * (columna + 1) + repeticion.alto * columna;
                ctx.drawImage(repeticion.imagen, xImg, yImg, repeticion.ancho, repeticion.alto);
                if (fila + 1 === repeticion.numeroX) {
                  fila = 0;
                  columna++;
                } else {
                  fila++;
                }
                if (r + 1 === repeticion.cantidad) {
                  let filas = repeticion.cantidad % repeticion.numeroX === 0 ? repeticion.cantidad / repeticion.numeroX : Math.floor(repeticion.cantidad / repeticion.numeroX) + 1;
                  yStart += repeticion.alto * filas + separacionImg * (filas + 1) + separacionElem;
                }
              }
              break;
            case 'horVert':
              let limite = 5;
              let imagen = await cargaImagen(repeticion.srcVert);
              for (let hv = 0, xImg, yImg; hv < repeticion.cantidad; hv++) {
                if (hv < limite) {
                  xImg = xStart + separacionElem + separacionImg * (hv + 1) + repeticion.ancho * hv;
                  yImg = yStart + separacionElem + separacionImg;
                  ctx.drawImage(repeticion.imagen, xImg, yImg, repeticion.ancho, repeticion.alto);
                } else {
                  xImg = xStart + separacionElem;
                  yImg = yStart + separacionElem + repeticion.alto + separacionImg * (hv - limite + 2) + repeticion.ancho * (hv - limite);
                  ctx.drawImage(imagen, xImg, yImg, repeticion.alto, repeticion.ancho);
                }
                if (hv + 1 === repeticion.cantidad) {
                  yStart += repeticion.cantidad <= 4 ?
                    repeticion.alto + separacionImg * 2 + separacionElem :
                    repeticion.alto + separacionImg * 2 + (repeticion.cantidad - 4) * repeticion.ancho + (repeticion.cantidad - 4) * separacionImg + separacionElem;
                }
              }
              break;
            case 'diagonal':
              for (let d = 0, xImg, yImg; d < repeticion.cantidad; d++) {
                xImg = xStart + separacionElem + separacionImg + repeticion.separacionX * d;
                yImg = yStart + separacionElem + separacionImg + repeticion.separacionY * d;
                ctx.drawImage(repeticion.imagen, xImg, yImg, repeticion.ancho, repeticion.alto);
                if (d + 1 === repeticion.cantidad) {
                  yStart += repeticion.alto + repeticion.separacionY * (repeticion.cantidad - 1) + separacionImg * 2 + separacionElem;
                }
              }
              break;
            default:
              //console.log('degault');
              break;
          }
        }
      }
    }
  }).catch(function (error) {
    //console.log(error);
  });
}

function abaco(config) {
  const { container, params, variables, versions, vt } = config;
  const { datos, _separacion, _altoCanvas, _anchoCanvas } = params;
  let srcImagenAbaco = "../../../../imagenes_front/abaco/Abaco.svg";
  let srcImagenFicha = "../../../../imagenes_front/abaco/Ficha_Abaco.svg";
  let altoCanvas = Number(_altoCanvas), anchoCanvas = Number(_anchoCanvas), separacion = Number(_separacion);
  container.height = altoCanvas;
  container.width = anchoCanvas;
  let ctx = container.getContext('2d');
  var vars = vt ? variables : versions;

  let datosfn = datos.map(obj => {
    switch (obj.tipo) {
      case 'abaco':
        return {
          tipo: obj.tipo,
          altoImg: Number(obj.altoImg),
          unidad: obj.numComp !== '0' ? Number(regex(obj.numComp, vars, vt)[2]) : Number(regex(obj.unidad, vars, vt)),
          decena: obj.numComp !== '0' ? Number(regex(obj.numComp, vars, vt)[1]) : Number(regex(obj.decena, vars, vt)),
          centena: obj.numComp !== '0' ? Number(regex(obj.numComp, vars, vt)[0]) : Number(regex(obj.centena, vars, vt)),
          numComp: Number(regex(obj.numComp, vars, vt)),
          esAgrupado: obj.esAgrupado === 'si' ? true : false,
          grupos: Number(regex(obj.grupos, vars, vt)),
          agrupar: obj.agrupar === 'si' ? true : false,
          numerosArriba: obj.numerosArriba === 'si' ? true : false,
          agruparCanje: obj.agruparCanje === 'si' ? true : false
        };
      case 'imagen':
        return {
          tipo: obj.tipo,
          src: obj.src,
          altoImg: obj.altoImg,
          texto1: regex(obj.texto1, vars, vt),
          texto2: regex(obj.texto2, vars, vt),
          texto3: regex(obj.texto3, vars, vt),
          texto4: regex(obj.texto4, vars, vt),
          yTexto1: Number(obj.yTexto1),
          yTexto2: Number(obj.yTexto2),
          yTexto3: Number(obj.yTexto3),
          yTexto4: Number(obj.yTexto4),
          altoTexto: Number(obj.altoTexto),
          colorTexto: obj.colorTexto
        };
      case 'texto':
        return {
          tipo: obj.tipo,
          texto1: regex(obj.texto1, vars, vt),
          texto2: regex(obj.texto2, vars, vt),
          texto3: regex(obj.texto3, vars, vt),
          texto4: regex(obj.texto4, vars, vt),
          yTexto1: Number(obj.yTexto1),
          yTexto2: Number(obj.yTexto2),
          yTexto3: Number(obj.yTexto3),
          yTexto4: Number(obj.yTexto4),
          altoTexto: Number(obj.altoTexto),
          colorTexto: obj.colorTexto
        };
    }
  });

  Promise.all([
    cargaImagen(srcImagenAbaco),
    cargaImagen(srcImagenFicha),
    cargaFuente('larkneuethin', 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/fonts/LarkeNeueThin.ttf'),
    ...datosfn.map(x => x.tipo === 'imagen' ? cargaImagen(x.src) : null)
  ]).then(function (imagenes) {
    let imagenAbaco = imagenes[0];
    let imagenFicha = imagenes[1];
    let anchoTotal = 0;
    for (let i = 3; i < imagenes.length; i++) {
      if (datosfn[i - 3].tipo === 'imagen') {
        datosfn[i - 3].imagen = imagenes[i];
        datosfn[i - 3].ancho = Number(datosfn[i - 3].altoImg) * imagenes[i].width / imagenes[i].height;
      } else if (datosfn[i - 3].tipo === 'abaco') {
        datosfn[i - 3].ancho = Number(datosfn[i - 3].altoImg) * imagenAbaco.width / imagenAbaco.height;
      } else {
        ctx.save();
        ctx.font = `${datosfn[i - 3].altoTexto}px larkneuethin`;
        datosfn[i - 3].ancho = Math.max(
          ctx.measureText(datosfn[i - 3].texto1).width,
          ctx.measureText(datosfn[i - 3].texto2).width,
          ctx.measureText(datosfn[i - 3].texto3).width,
          ctx.measureText(datosfn[i - 3].texto4).width
        );
        ctx.restore();
      }
      anchoTotal += datosfn[i - 3].ancho + ((i + 1) === imagenes.length ? 0 : separacion);
    }

    for (let j = 0, centroX, anchoImg, xImg, yImg, anchoAcu = 0; j < datosfn.length; j++) {
      anchoAcu += (j === 0) ? 0 : datosfn[j - 1].ancho;
      centroX = (anchoCanvas / 2 - anchoTotal / 2) + anchoAcu + (datosfn[j].ancho / 2) + (separacion * j)
      switch (datosfn[j].tipo) {
        case 'abaco':
          anchoImg = imagenAbaco.width * datosfn[j].altoImg / imagenAbaco.height;
          xImg = centroX - (anchoImg / 2);
          yImg = altoCanvas / 2 - datosfn[j].altoImg / 2;
          ctx.drawImage(imagenAbaco, xImg, yImg, anchoImg, datosfn[j].altoImg);

          let xCentena = centroX - anchoImg / 2 + anchoImg * .135;
          let xDecena = centroX;
          let xUnidad = centroX + anchoImg / 2 - anchoImg * .135;

          if (datosfn[j].numerosArriba) {
            let yTextoArriba = altoCanvas / 2 - datosfn[j].altoImg / 2 - 5;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.font = `15px larkneuethin`;
            ctx.fillStyle = '#000000';
            ctx.fillText(datosfn[j].unidad, xUnidad, yTextoArriba);
            ctx.fillText(datosfn[j].decena, xDecena, yTextoArriba);
            ctx.fillText(datosfn[j].centena, xCentena, yTextoArriba);
            ctx.restore();
          } else {
            let yInicio = altoCanvas / 2 + datosfn[j].altoImg / 2 - datosfn[j].altoImg * .125;
            let altoImgFicha = datosfn[j].altoImg * .05;
            let anchoImgFicha = imagenFicha.width * altoImgFicha / imagenFicha.height;
            if (datosfn[j].esAgrupado) {
              let espacioFichas = datosfn[j].altoImg - datosfn[j].altoImg * .125
              let altoDiviciones = espacioFichas / datosfn[j].grupos;
              let contadorUnidades = 0, contadorDecenas = 0, yDecimaUnidad = 0, yDecimaCentena = 0;
              for (let grupo = 0, centroGrupo, yStartUnidades, yStartDecenas, yStartCentenas; grupo < datosfn[j].grupos; grupo++) {
                //centroGrupo = yInicio - altoDiviciones - altoDiviciones*grupo + altoDiviciones/2;
                centroGrupo = yImg + altoDiviciones * grupo + altoDiviciones / 2;
                yStartUnidades = centroGrupo - (datosfn[j].unidad * altoImgFicha) / 2;
                yStartDecenas = centroGrupo - (datosfn[j].decena * altoImgFicha) / 2;
                yStartCentenas = centroGrupo - (datosfn[j].centena * altoImgFicha) / 2

                for (let u = 0, yUnidad; u < datosfn[j].unidad; u++) {
                  yUnidad = yStartUnidades + altoImgFicha * u;
                  ctx.drawImage(imagenFicha, xUnidad - anchoImgFicha / 2, yUnidad, anchoImgFicha, altoImgFicha);
                  contadorUnidades++;
                  if (contadorUnidades === 10) {
                    yDecimaUnidad = yUnidad + altoImgFicha;
                  }
                }
                for (let d = 0, yDecena; d < datosfn[j].decena; d++) {
                  yDecena = yStartDecenas + altoImgFicha * d;
                  ctx.drawImage(imagenFicha, xDecena - anchoImgFicha / 2, yDecena, anchoImgFicha, altoImgFicha);
                  contadorDecenas++;
                  if (contadorDecenas === 10) {
                    yDecimaCentena = yDecena + altoImgFicha;
                  }
                }
                for (let c = 0, yCentena; c < datosfn[j].centena; c++) {
                  yCentena = yStartCentenas + altoImgFicha * c;
                  ctx.drawImage(imagenFicha, xCentena - anchoImgFicha / 2, yCentena, anchoImgFicha, altoImgFicha);
                }

                if (datosfn[j].agrupar) {
                  let maxHeight = Math.max((datosfn[j].unidad * altoImgFicha), (datosfn[j].decena * altoImgFicha), (datosfn[j].centena * altoImgFicha))
                  ctx.save();
                  ctx.strokeStyle = "#ff0000";
                  ctx.beginPath();
                  ctx.rect(xImg + 5, centroGrupo - maxHeight / 2, anchoImg - 10, maxHeight);
                  ctx.stroke();
                  ctx.restore();
                }
              }
              if (datosfn[j].agruparCanje) {
                if (datosfn[j].unidad * datosfn[j].grupos >= 10) {
                  let yInicio = yImg + (altoDiviciones / 2) - datosfn[j].unidad * (altoImgFicha / 2);
                  let yFin = yDecimaUnidad - yInicio;

                  ctx.save();
                  ctx.strokeStyle = "#ff0000";
                  ctx.beginPath();
                  ctx.rect(xUnidad - anchoImgFicha / 2 - 5, yInicio, anchoImgFicha + 10, yFin);
                  ctx.stroke();

                  //dibuja arco por sobre el abaco
                  let rArc = (xUnidad - xDecena) / 2;
                  let xArc = xDecena + rArc;
                  let yArc = yImg + rArc * 0.8;
                  ctx.beginPath();
                  ctx.arc(xArc, yArc, rArc + 10, 1.25 * Math.PI, 1.75 * Math.PI);
                  ctx.stroke();
                  //dibuja linea hacia arriba de la flecha
                  let difX = Math.cos(0.25 * Math.PI) * rArc + 10 * 0.8;
                  let difY = Math.sin(0.25 * Math.PI) * rArc + 10 * 0.8;
                  let xPuntoInicial = xArc - difX;
                  let yPuntoInicial = yArc - difY;
                  ctx.beginPath();
                  ctx.moveTo(xPuntoInicial, yPuntoInicial);
                  ctx.lineTo(xPuntoInicial + 10, yPuntoInicial);
                  ctx.stroke();
                  //dibuja linea hacia la derecha de la flecha
                  ctx.beginPath();
                  ctx.moveTo(xPuntoInicial, yPuntoInicial);
                  ctx.lineTo(xPuntoInicial, yPuntoInicial - 10);
                  ctx.stroke();
                  ctx.restore();

                  ctx.drawImage(imagenFicha, xArc - anchoImgFicha / 2, yImg - (rArc * 0.8) - altoImgFicha, anchoImgFicha, altoImgFicha);
                }
                if (datosfn[j].decena * datosfn[j].grupos >= 10) {
                  let yInicio = yImg + (altoDiviciones / 2) - datosfn[j].decena * (altoImgFicha / 2);
                  let yFin = yDecimaCentena - yInicio;

                  ctx.save();
                  ctx.strokeStyle = "#ff0000";
                  ctx.beginPath();
                  ctx.rect(xDecena - anchoImgFicha / 2 - 5, yInicio, anchoImgFicha + 10, yFin);
                  ctx.stroke();

                  let rArc = (xDecena - xCentena) / 2;
                  let xArc = xCentena + rArc;
                  let yArc = yImg + rArc * 0.8;
                  ctx.beginPath();
                  ctx.arc(xArc, yArc, rArc + 10, 1.25 * Math.PI, 1.75 * Math.PI);
                  ctx.stroke();

                  let difX = Math.cos(0.25 * Math.PI) * rArc + 10 * 0.8;
                  let difY = Math.sin(0.25 * Math.PI) * rArc + 10 * 0.8;
                  let xPuntoInicial = xArc - difX;
                  let yPuntoInicial = yArc - difY;
                  ctx.beginPath();
                  ctx.moveTo(xPuntoInicial, yPuntoInicial);
                  ctx.lineTo(xPuntoInicial + 10, yPuntoInicial);
                  ctx.stroke();

                  ctx.beginPath();
                  ctx.moveTo(xPuntoInicial, yPuntoInicial);
                  ctx.lineTo(xPuntoInicial, yPuntoInicial - 10);
                  ctx.stroke();
                  ctx.restore();

                  ctx.drawImage(imagenFicha, xArc - anchoImgFicha / 2, yImg - (rArc * 0.8) - altoImgFicha, anchoImgFicha, altoImgFicha);
                }
              }

            } else {
              for (let u = 0, yUnidad; u < datosfn[j].unidad; u++) {
                yUnidad = yInicio - altoImgFicha - altoImgFicha * u;
                ctx.drawImage(imagenFicha, xUnidad - anchoImgFicha / 2, yUnidad, anchoImgFicha, altoImgFicha);
              }
              for (let d = 0, yDecena; d < datosfn[j].decena; d++) {
                yDecena = yInicio - altoImgFicha - altoImgFicha * d;
                ctx.drawImage(imagenFicha, xDecena - anchoImgFicha / 2, yDecena, anchoImgFicha, altoImgFicha);
              }
              for (let c = 0, yCentena; c < datosfn[j].centena; c++) {
                yCentena = yInicio - altoImgFicha - altoImgFicha * c;
                ctx.drawImage(imagenFicha, xCentena - anchoImgFicha / 2, yCentena, anchoImgFicha, altoImgFicha);
              }
              if (datosfn[j].agruparCanje) {
                let yUltimaUnidad = yInicio - datosfn[j].unidad * altoImgFicha;
                let yUltimaDecena = yInicio - datosfn[j].decena * altoImgFicha;
                if (datosfn[j].unidad >= 10) {
                  //dibuja rectangulo de agrupacion de 10
                  ctx.save();
                  ctx.strokeStyle = "#ff0000";
                  ctx.beginPath();
                  ctx.rect(xUnidad - anchoImgFicha / 2 - 5, yUltimaUnidad, anchoImgFicha + 10, altoImgFicha * 10);
                  ctx.stroke();
                  //dibuja arco por sobre el abaco
                  let rArc = (xUnidad - xDecena) / 2;
                  let xArc = xDecena + rArc;
                  let yArc = yImg + rArc * 0.8;
                  ctx.beginPath();
                  ctx.arc(xArc, yArc, rArc + 10, 1.25 * Math.PI, 1.75 * Math.PI);
                  ctx.stroke();
                  //dibuja linea hacia arriba de la flecha
                  let difX = Math.cos(0.25 * Math.PI) * rArc + 10 * 0.8;
                  let difY = Math.sin(0.25 * Math.PI) * rArc + 10 * 0.8;
                  let xPuntoInicial = xArc - difX;
                  let yPuntoInicial = yArc - difY;
                  ctx.beginPath();
                  ctx.moveTo(xPuntoInicial, yPuntoInicial);
                  ctx.lineTo(xPuntoInicial + 10, yPuntoInicial);
                  ctx.stroke();
                  //dibuja linea hacia la derecha de la flecha
                  ctx.beginPath();
                  ctx.moveTo(xPuntoInicial, yPuntoInicial);
                  ctx.lineTo(xPuntoInicial, yPuntoInicial - 10);
                  ctx.stroke();
                  ctx.restore();

                  ctx.drawImage(imagenFicha, xArc - anchoImgFicha / 2, yImg - (rArc * 0.8) - altoImgFicha, anchoImgFicha, altoImgFicha);
                }
                if (datosfn[j].decena >= 10) {
                  if (datosfn[j].unidad >= 10) {
                    ctx.save();
                    ctx.strokeStyle = "#ff0000";
                    ctx.beginPath();
                    ctx.rect(xDecena - anchoImgFicha / 2 - 5, yUltimaDecena, anchoImgFicha + 10, altoImgFicha * 10);
                    ctx.stroke();

                    let rArc = (xDecena - xCentena) / 2;
                    let xArc = xCentena + rArc;
                    let yArc = yImg + rArc * 0.8;
                    ctx.beginPath();
                    ctx.arc(xArc, yArc, rArc + 10, 1.25 * Math.PI, 1.75 * Math.PI);
                    ctx.stroke();

                    let difX = Math.cos(0.25 * Math.PI) * rArc + 10 * 0.8;
                    let difY = Math.sin(0.25 * Math.PI) * rArc + 10 * 0.8;
                    let xPuntoInicial = xArc - difX;
                    let yPuntoInicial = yArc - difY;
                    ctx.beginPath();
                    ctx.moveTo(xPuntoInicial, yPuntoInicial);
                    ctx.lineTo(xPuntoInicial + 10, yPuntoInicial);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(xPuntoInicial, yPuntoInicial);
                    ctx.lineTo(xPuntoInicial, yPuntoInicial - 10);
                    ctx.stroke();
                    ctx.restore();

                    ctx.drawImage(imagenFicha, xArc - anchoImgFicha / 2, yImg - (rArc * 0.8) - altoImgFicha, anchoImgFicha, altoImgFicha);
                  }
                }
              }
            }
          }
          break;
        case 'imagen':
          anchoImg = datosfn[j].imagen.width * datosfn[j].altoImg / datosfn[j].imagen.height;
          xImg = centroX - (anchoImg / 2);
          yImg = altoCanvas / 2 - datosfn[j].altoImg / 2;
          ctx.drawImage(datosfn[j].imagen, xImg, yImg, anchoImg, datosfn[j].altoImg);
          ctx.save();
          ctx.textAlign = 'center';
          ctx.font = `${datosfn[j].altoTexto}px larkneuethin`;
          ctx.fillStyle = datosfn[j].colorTexto;
          if (datosfn[j].texto1) {
            ctx.fillText(datosfn[j].texto1, centroX, datosfn[j].yTexto1);
          }
          if (datosfn[j].texto2) {
            ctx.fillText(datosfn[j].texto2, centroX, datosfn[j].yTexto2);
          }
          if (datosfn[j].texto3) {
            ctx.fillText(datosfn[j].texto3, centroX, datosfn[j].yTexto3);
          }
          if (datosfn[j].texto4) {
            ctx.fillText(datosfn[j].texto4, centroX, datosfn[j].yTexto4);
          }
          ctx.save();
          break;
        case 'texto':
          ctx.save();
          ctx.textAlign = 'center';
          ctx.font = `${datosfn[j].altoTexto}px larkneuethin`;
          ctx.fillStyle = datosfn[j].colorTexto;
          if (datosfn[j].texto1) {
            ctx.fillText(datosfn[j].texto1, centroX, datosfn[j].yTexto1);
          }
          if (datosfn[j].texto2) {
            ctx.fillText(datosfn[j].texto2, centroX, datosfn[j].yTexto2);
          }
          if (datosfn[j].texto3) {
            ctx.fillText(datosfn[j].texto3, centroX, datosfn[j].yTexto3);
          }
          if (datosfn[j].texto4) {
            ctx.fillText(datosfn[j].texto4, centroX, datosfn[j].yTexto4);
          }
          ctx.save();
          break;
        default:
          //console.log('default');
          break;
      }
    }
  }).catch(function (error) {
    //console.log(error);
  });
}

async function multiplicacionElem(config) {
  await cargaFuente('Open-Sans-Reg', '../../../../fonts/OpenSans-Regular-webfont.woff');
  const { container, params, variables, versions, vt } = config;
  container.style.border = "1px solid #000"
  //console.log(container);
  var vars = vt ? variables : versions;

  let { datos, _separacion, _altoCanvas, _anchoCanvas, _mostrarValores } = params;
  _separacion = Number(_separacion);
  _altoCanvas = Number(_altoCanvas);
  _anchoCanvas = Number(_anchoCanvas);
  _mostrarValores = _mostrarValores === 'si' ? true : false;
  container.width = _anchoCanvas;
  container.height = _altoCanvas;
  var ctx = container.getContext('2d');
  let altoDiviciones = _altoCanvas / datos.length;

  async function getObject(dato) {
    switch (dato.tipo) {
      case 'repeticion':
        return {
          tipo: dato.tipo,
          srcImgPrinc: dato.srcImgPrinc,
          imagenPrinc: await cargaImagen(regex(dato.srcImgPrinc.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'), vars, vt)),
          altoImgPrinc: Number(dato.altoImgPrinc),
          cantidadPrinc: Number(regex(dato.cantidadPrinc, vars, vt)),
          srcImgSec: dato.srcImgSec,
          imagenSec: dato.srcImgSec ? await cargaImagen(regex(dato.srcImgSec.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'), vars, vt)) : null,
          altoImgSec: Number(dato.altoImgSec),
          cantidadSec: Number(regex(dato.cantidadSec, vars, vt)),
          valorFinal: dato.valorFinal.tipoVF === 'texto' ? {
            tipoVF: dato.valorFinal.tipoVF,
            textoVF: regex(dato.valorFinal.textoVF, vars, vt),
            altoTextoVF: dato.valorFinal.altoTextoVF,
            colorTextoVF: dato.valorFinal.colorTextoVF
          } : {
              tipoVF: dato.valorFinal.tipoVF,
              srcImgVF: dato.valorFinal.srcImgVF,
              imgVF: await cargaImagen(regex(dato.valorFinal.srcImgVF.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'), vars, vt)),
              altoImgVF: Number(dato.valorFinal.altoImgVF)
            }
        };
      case 'seccion':
        return {
          tipo: dato.tipo,
          llave: dato.llave === 'si' ? true : false,
          colorLLave: dato.colorLLave,
          texto: dato.texto,
          altoTexto: dato.altoTexto,
          colorTexto: dato.colorTexto
        };
    }
  }
  Promise.all(datos.map(x => getObject(x))).then(reps => {
    let divs, yCentro, divicionesRepeticiones = [];
    reps.forEach((dato, index) => {
      yCentro = altoDiviciones * index + altoDiviciones / 2;
      switch (dato.tipo) {
        case 'repeticion':
          divs = dato.cantidadPrinc + (_mostrarValores ? 1 : 0);
          let anchoDiviciones = _anchoCanvas / divs;
          let anchoImgPrinc = dato.altoImgPrinc * dato.imagenPrinc.width / dato.imagenPrinc.height;
          divicionesRepeticiones.push(anchoDiviciones);
          for (let i = 0, xCentro, xImg, yImg; i < divs; i++) {
            xCentro = anchoDiviciones * i + anchoDiviciones / 2;
            if (i + 1 === divs && _mostrarValores) {
              if (dato.valorFinal.tipoVF === 'texto') {
                ctx.save();
                ctx.fillStyle = dato.valorFinal.colorTextoVF;
                ctx.font = `${dato.valorFinal.altoTextoVF}px Open-Sans-Reg`;
                ctx.textAlign = "center";
                ctx.fillText(dato.valorFinal.textoVF, xCentro, yCentro + dato.valorFinal.altoTextoVF / 2);
                ctx.restore();
              } else if (dato.valorFinal.tipoVF === 'imagen') {
                let anchoImgVF = dato.valorFinal.altoImgVF * dato.valorFinal.imgVF.width / dato.valorFinal.imgVF.height;
                xImg = xCentro - anchoImgVF / 2;
                yImg = yCentro - dato.valorFinal.altoImgVF / 2;
                ctx.drawImage(dato.valorFinal.imgVF, xImg, yImg, anchoImgVF, dato.valorFinal.altoImgVF);
              }
            } else {
              xImg = xCentro - anchoImgPrinc / 2;
              yImg = yCentro - dato.altoImgPrinc / 2;
              ctx.drawImage(dato.imagenPrinc, xImg, yImg, anchoImgPrinc, dato.altoImgPrinc);
            }
          }
          break;
        case 'seccion':
          let anchoDivMaximo = Math.min(...divicionesRepeticiones);
          let anchoImagenUltimaRep = (reps[index - 1].altoImgPrinc * reps[index - 1].imagenPrinc.width / reps[index - 1].imagenPrinc.height) / 2;
          let xInicio = anchoDivMaximo / 2 - anchoImagenUltimaRep;
          let xFin = _anchoCanvas - anchoDivMaximo / 2 - (_mostrarValores ? anchoDivMaximo : 0) + anchoImagenUltimaRep;
          let xMitad = (xInicio + xFin) / 2;
          if (dato.llave) {
            let radio = 10;
            let yTramo = yCentro - altoDiviciones / 2;
            let yTramoInicio = yTramo - radio;
            let yTramoFin = yTramo + radio;
            ctx.save();
            ctx.strokeStyle = dato.colorLLave;
            ctx.lineWidth = 1;
            ctx.lineJoin = 'round';
            ctx.beginPath();

            ctx.arc(xInicio + radio, yTramoInicio, radio, -Math.PI, -1.5 * Math.PI, true)

            ctx.lineTo(xMitad - radio, yTramo);

            ctx.arc(xMitad - radio, yTramoFin, radio, -0.5 * Math.PI, 0, false);
            ctx.arc(xMitad + radio, yTramoFin, radio, -Math.PI, -0.5 * Math.PI, false);

            ctx.lineTo(xFin - radio, yTramo);

            ctx.arc(xFin - radio, yTramoInicio, radio, -1.5 * Math.PI, 0, true);
            ctx.stroke();
          }
          if (dato.texto) {
            ctx.save();
            ctx.fillStyle = dato.colorTexto;
            ctx.textAlign = "center";
            ctx.font = `${dato.altoTexto}px Open-Sans-Reg`;
            ctx.fillText(dato.texto, xMitad, yCentro);
            ctx.restore();
          }

          break;
      }
    });
  }).catch(x => {
    //console.log(x) 
  });


}

async function repeticionPicV2(config) {
  const { container, params, variables, versions, vt } = config;
  const { datos, _titulo, _separacion, _separaciones, _altoRepeticiones, _anchoCanvas,
    _mostrarVP1, _mostrarVP2, _mostrarRes, _altoVP1, _altoVP2, _altoRes, _res,
    _flechaRes, _flechaVP1, _flechaVP2, _srcFlecha, _altoImgFlecha,
    _altoImgSignoMas, _srcImgSignoMas, _signoMasVP1, _signoMasVP2 } = params
  await cargaFuente('Open-Sans-Reg', '../../../../fonts/OpenSans-Regular-webfont.woff');
  let vars = vt ? variables : versions;
  let titulo = regexFunctions(regex(_titulo, vars, vt)), //titulo arriba de la repeticion
    separacion = Number(_separacion), //separaciones entre cada repeticion de elementos
    altoRepeticiones = Number(_altoRepeticiones), //alto que usaran solo las repeticiones
    anchoCanvas = Number(_anchoCanvas), //ancho del canvas

    mostrarVP1 = _mostrarVP1 === 'si' ? true : false, //decide si se muestra o no el VP1
    altoVP1 = mostrarVP1 ? Number(_altoVP1) : 0, //alto que usara el VP1 si se muestra
    mostrarFlechaVP1 = _flechaVP1 === 'si' ? true : false,
    mostrarSignoMasVP1 = _signoMasVP1 === 'si' ? true : false,

    mostrarVP2 = _mostrarVP2 === 'si' ? true : false, //decide si se muestra o no el VP2
    mostrarFlechaVP2 = _flechaVP2 === 'si' ? true : false,
    altoVP2 = mostrarVP2 ? Number(_altoVP2) : 0, //alto que usara el VP2 si se muestra
    mostrarSignoMasVP2 = _signoMasVP2 === 'si' ? true : false,

    mostrarRes = _mostrarRes === 'si' ? true : false, //decide si se muestra o no el resultado
    mostrarFlechaRes = _flechaRes === 'si' ? true : false,
    altoRes = mostrarRes ? Number(_altoRes) : 0, //alto que usara el resultado si se muestra

    res = mostrarRes ? { //datos del resultado final para posicionar en el canvas si es que se muestra
      tipo: _res.tipo,
      texto: _res.tipo === 'texto' ? regexFunctions(regex(_res.texto, vars, vt)) : undefined,
      altoTexto: _res.tipo === 'texto' ? Number(_res.altoTexto) : undefined,
      colorTexto: _res.tipo === 'texto' ? _res.colorTexto : undefined,
      srcImg: _res.tipo === 'imagen' ? await cargaImagen(regexFunctions(regex(_res.srcImg.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'), vars, vt))) : undefined,
      altoImg: _res.tipo === 'imagen' ? Number(_res.altoImg) : undefined
    } : null,
    //datos de la flecha
    srcFlecha = _srcFlecha.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
    altoImgFlecha = Number(_altoImgFlecha),
    imgFlecha = (mostrarFlechaVP1 || mostrarFlechaVP2 || mostrarFlechaRes) ? await cargaImagen(srcFlecha) : null,
    anchoImgFlecha = (mostrarFlechaVP1 || mostrarFlechaVP2 || mostrarFlechaRes) ? imgFlecha.width * altoImgFlecha / imgFlecha.height : 0,
    //datos del signo
    srcImgSignoMas = _srcImgSignoMas.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'),
    altoImgSignoMas = Number(_altoImgSignoMas),
    imgSignoMas = (mostrarSignoMasVP1 || mostrarSignoMasVP2) ? await cargaImagen(srcImgSignoMas) : null,
    anchoImgSignoMas = (mostrarSignoMasVP1 || mostrarSignoMasVP2) ? imgSignoMas.width * altoImgSignoMas / imgSignoMas.height : 0,

    separaciones = _separaciones.trim().length > 0 ? _separaciones.split(';').map(x => x.split('-')).map(x => ({ inicio: Number(x[0]), fin: Number(x[1]) })) : undefined;

  //console.log(_res, res)
  container.height = altoRepeticiones + altoVP1 + altoVP2 + altoRes;
  container.width = anchoCanvas;
  let ctx = container.getContext('2d');


  async function getObject(dato) {
    let srcImgVP1 = '', srcImgVP2 = '';
    switch (dato.tipo) {
      case 'repeticion':
        let srcImgRepSrc = regexFunctions(regex(dato.srcImg, vars, vt)).replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../');
        srcImgVP1 = mostrarVP1 ? dato.vp1.tipo === 'imagen' ? await regexFunctions(regex(dato.vp1.srcImg, vars, vt)).replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../') : null : null;
        srcImgVP2 = mostrarVP2 ? dato.vp2.tipo === 'imagen' ? await regexFunctions(regex(dato.vp2.srcImg, vars, vt)).replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../') : null : null;
        return {
          tipo: dato.tipo,
          srcImg: srcImgRepSrc,
          altoImg: Number(dato.altoImg),
          img: await cargaImagen(srcImgRepSrc),
          cantidadRepeticiones: Number(regexFunctions(regex(dato.cantidadRepeticiones, vars, vt))),
          formaRepeticiones: dato.formaRepeticiones,
          sepX: dato.sepX.split(',').map(x => Number(x)),
          sepY: dato.sepY.split(',').map(x => Number(x)),
          vp1: mostrarVP1 ? dato.vp1.tipo === 'texto' ? { // si el valor posicional 1 es texto
            tipo: dato.vp1.tipo,
            texto: regexFunctions(regex(dato.vp1.texto, vars, vt)),
            altoTexto: Number(dato.vp1.altoTexto),
            colorTexto: dato.vp1.colorTexto
          } : { // si el valor posicional 1 es imagen
              tipo: dato.vp1.tipo,
              srcImg: srcImgVP1,
              img: await cargaImagen(srcImgVP1),
              altoImg: Number(dato.vp1.altoImg)
            } : undefined,
          vp2: mostrarVP2 ? dato.vp2.tipo === 'texto' ? { // si el valor posicional 2 es texto
            tipo: dato.vp2.tipo,
            texto: regexFunctions(regex(dato.vp2.texto, vars, vt)),
            altoTexto: Number(dato.vp2.altoTexto),
            colorTexto: dato.vp2.colorTexto
          } : { // si el valor posicional 2 es texto
              tipo: dato.vp2.tipo,
              srcImg: srcImgVP2,
              img: await cargaImagen(srcImgVP2),
              altoImg: Number(dato.vp2.altoImg)
            } : undefined
        }
      case 'texto':
        srcImgVP1 = mostrarVP1 ? dato.vp1.tipo === 'imagen' ? await regexFunctions(regex(dato.vp1.srcImg, vars, vt)).replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../') : null : null;
        srcImgVP2 = mostrarVP2 ? dato.vp2.tipo === 'imagen' ? await regexFunctions(regex(dato.vp2.srcImg, vars, vt)).replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../') : null : null;
        return {
          tipo: dato.tipo,
          texto: regexFunctions(regex(dato.texto, vars, vt)),
          altoTexto: Number(dato.altoTexto),
          colorTexto: dato.colorTexto,
          vp1: mostrarVP1 ? dato.vp1.tipo === 'texto' ? { // si el valor posicional 1 es texto
            tipo: dato.vp1.tipo,
            texto: regexFunctions(regex(dato.vp1.texto)),
            altoTexto: Number(dato.vp1.altoTexto),
            colorTexto: dato.vp1.colorTexto
          } : { // si el valor posicional 1 es imagen
              tipo: dato.vp1.tipo,
              srcImg: srcImgVP1,
              img: await cargaImagen(srcImgVP1),
              altoImg: Number(dato.vp1.altoImg)
            } : undefined,
          vp2: mostrarVP2 ? dato.vp2.tipo === 'texto' ? { // si el valor posicional 2 es texto
            tipo: dato.vp2.tipo,
            texto: regexFunctions(regex(dato.vp2.texto)),
            altoTexto: Number(dato.vp2.altoTexto),
            colorTexto: dato.vp2.colorTexto
          } : { // si el valor posicional 2 es texto
              tipo: dato.vp2.tipo,
              srcImg: srcImgVP2,
              img: await cargaImagen(srcImgVP2),
              altoImg: Number(dato.vp2.altoImg)
            } : undefined
        }
    }
  }

  function calculaDimencionesRepeticion(formaRepeticiones, altoImg, anchoImg, sepX, sepY, cantidadRepeticiones) {
    switch (formaRepeticiones) {
      case 'diagonal/apilado':
        if (cantidadRepeticiones > 5) {
          return {
            ancho: anchoImg + (sepX[0] * 5) + anchoImg + ((cantidadRepeticiones - 6) * sepX[0]),
            alto: altoImg + (sepY[0] * 4)
          };
        } else {
          return {
            ancho: anchoImg + ((cantidadRepeticiones - 1) * sepX[0]),
            alto: altoImg + ((cantidadRepeticiones - 1) * sepY[0])
          };
        }
      case 'diagonal':
        return {
          ancho: anchoImg + (sepX[0] > 0 ? cantidadRepeticiones * anchoImg : 0) + ((cantidadRepeticiones - 1) * sepX[0]),
          alto: altoImg + (sepY[0] > 0 ? cantidadRepeticiones * altoImg : 0) + ((cantidadRepeticiones - 1) * sepY[0])
        };
      case 'dado':
        if (cantidadRepeticiones === 1) {
          return {
            ancho: anchoImg,
            alto: altoImg
          };
        } else if (cantidadRepeticiones === 2 || cantidadRepeticiones === 4) {
          return {
            ancho: anchoImg * 2 + sepX[0],
            alto: altoImg * 2 + sepY[0]
          };
        } else if (cantidadRepeticiones === 3 || cantidadRepeticiones === 5 || cantidadRepeticiones > 6) {
          return {
            ancho: anchoImg * 3 + sepX[0] * 2,
            alto: altoImg * 3 + sepY[0] * 2
          };
        } else if (cantidadRepeticiones === 6) {
          return {
            ancho: anchoImg * 2 + sepX[0],
            alto: altoImg * 3 + sepY[0] * 2
          };
        }
      case 'izq/der':
        return {
          ancho: sepX[1] > cantidadRepeticiones ? cantidadRepeticiones * anchoImg + (cantidadRepeticiones - 1) * sepX[0] : sepX[1] * anchoImg + (sepX[1] - 1) * sepX[0],
          alto: Math.ceil(cantidadRepeticiones / sepX[1]) * altoImg + (Math.ceil(cantidadRepeticiones / sepX[1]) - 1) * sepY[0]
        };
      default:
        return {
          ancho: 0,
          alto: 0
        };
    }
  }

  let elementos = await Promise.all([
    ...datos.filter(function (x) {
      if (x.tipo === 'texto') {
        return true;
      } else if (x.tipo === 'repeticion') {
        return Number(regexFunctions(regex(x.cantidadRepeticiones, vars, vt))) > 0
      }
    }).map(x => getObject(x)),
    mostrarRes ? res : null
  ]);
  let anchoTotal = separacion, posicicionesInicio = [];
  for (let i = 0; i < elementos.length; i++) {
    if (elementos[i]) {
      switch (elementos[i].tipo) {
        case 'repeticion':
          var { img, altoImg, formaRepeticiones, sepX, sepY, cantidadRepeticiones } = elementos[i];
          elementos[i].anchoImg = altoImg * img.width / img.height;
          elementos[i].dimenciones = calculaDimencionesRepeticion(formaRepeticiones, altoImg, elementos[i].anchoImg, sepX, sepY, cantidadRepeticiones);
          anchoTotal += elementos[i].dimenciones.ancho + separacion;
          break;
        case 'imagen':
          var { srcImg, altoImg } = elementos[i];
          elementos[i].anchoImg = altoImg * srcImg.width / srcImg.height;
          //si es imagen es el resultado, entonces no se suma al ancho total de la repeticion
          break;
        case 'texto':
          var { texto, altoTexto } = elementos[i];
          ctx.save();
          ctx.font = `${altoTexto}px Open-Sans-Reg`;
          elementos[i].anchoTexto = ctx.measureText(texto).width;
          ctx.restore();
          anchoTotal += (i + 1) === elementos.length ? 0 : elementos[i].anchoTexto + separacion;
          break;
      }
      if (mostrarVP1 && !((i + 1) === elementos.length)) {
        if (elementos[i].vp1.tipo === 'texto') {
          var { texto, altoTexto } = elementos[i].vp1;
          ctx.save();
          ctx.font = `${altoTexto}px Open-Sans-Reg`;
          elementos[i].vp1.anchoTexto = ctx.measureText(texto).width;
          ctx.restore();
        } else {
          var { img, altoImg } = elementos[i].vp1;
          elementos[i].vp1.anchoImg = altoImg * img.width / img.height;
        }
      }
      if (mostrarVP2 && !((i + 1) === elementos.length)) {
        if (elementos[i].vp2.tipo === 'texto') {
          var { texto, altoTexto } = elementos[i].vp1;
          ctx.save();
          ctx.font = `${altoTexto}px Open-Sans-Reg`;
          elementos[i].vp2.anchoTexto = ctx.measureText(texto).width;
          ctx.restore();
        } else {
          var { img, altoImg } = elementos[i].vp2;
          elementos[i].vp2.anchoImg = altoImg * img.width / img.height;
        }
      }
    }
  }
  let xInicio = (anchoCanvas / 2) - (anchoTotal / 2) + separacion,
    xCentro = 0,
    yCentroRepeticiones = altoRepeticiones / 2,
    yCentroVP1 = altoRepeticiones + altoVP1 / 2,
    yCentroVP2 = altoRepeticiones + altoVP1 + altoVP2 / 2,
    yCentroRes = altoRepeticiones + altoVP1 + altoVP2 + altoRes / 2,
    datosResultado = elementos.pop();

  if (mostrarRes && elementos.length > 1) {
    let { tipo, texto, altoTexto, colorTexto, srcImg, altoImg } = datosResultado
    let primerCentro = xInicio + elementos[0].dimenciones.ancho / 2
    let ultimoCentro = xInicio + anchoTotal - (elementos[elementos.length - 1].tipo === 'repeticion' ?
      elementos[elementos.length - 1].dimenciones.ancho / 2 :
      elementos[elementos.length - 1].anchoTexto / 2) - separacion * 2
    let centroRespuesta = primerCentro + ((ultimoCentro - primerCentro) / 2)
    if (tipo == 'texto') {
      ctx.save();
      ctx.font = `${altoTexto}px Open-Sans-Reg`;
      ctx.fillStyle = colorTexto;
      ctx.textAlign = 'center';
      ctx.fillText(texto, centroRespuesta, yCentroRes + altoTexto / 2);
      ctx.restore();
    } else {
      let anchoImg = altoImg * srcImg.width / srcImg.height;
      //console.log({ yRes: yCentroRes-altoImg/2, yCentroRes, altoImg, datosResultado });
      ctx.drawImage(srcImg, anchoCanvas / 2 - anchoImg / 2, yCentroRes - altoImg / 2, anchoImg, altoImg);
    }
    if (mostrarFlechaRes) {
      ctx.drawImage(imgFlecha, centroRespuesta - anchoImgFlecha / 2, yCentroRes - altoRes / 2 - altoImgFlecha / 2, anchoImgFlecha, altoImgFlecha)
    }
  }

  elementos.forEach(function (elemento, index) {
    let anchoElemento = 0
    switch (elemento.tipo) {
      case 'repeticion':
        let { formaRepeticiones, img, altoImg, anchoImg, cantidadRepeticiones, sepX, sepY, dimenciones } = elemento;
        posicicionesInicio.push({ xInicio, anchoTotal: dimenciones.ancho, altoTotal: dimenciones.alto });
        xCentro = xInicio + dimenciones.ancho / 2;
        dibujaRepeticion(formaRepeticiones, img, altoImg, anchoImg, cantidadRepeticiones, sepX, sepY, dimenciones, xCentro, yCentroRepeticiones);
        xInicio += dimenciones.ancho + separacion;
        anchoElemento = dimenciones.ancho
        break;
      case 'texto':
        let { texto, altoTexto, colorTexto, anchoTexto } = elemento;
        posicicionesInicio.push({ xInicio, anchoTotal: anchoTexto, altoTotal: altoTexto });
        xCentro = xInicio + anchoTexto / 2;
        ctx.save();
        ctx.font = `${altoTexto}px Open-Sans-Reg`;
        ctx.fillStyle = colorTexto;
        ctx.textAlign = 'center';
        ctx.fillText(texto, xCentro, yCentroRepeticiones + altoTexto / 2);
        ctx.restore();
        xInicio += anchoTexto + separacion;
        anchoElemento = anchoTexto
        break;
    }
    if (mostrarVP1) {
      if (elemento.vp1.tipo === 'texto') {
        let { texto, altoTexto, colorTexto } = elemento.vp1;
        ctx.save();
        ctx.font = `${altoTexto}px Open-Sans-Reg`;
        ctx.fillStyle = colorTexto;
        ctx.textAlign = 'center';
        ctx.fillText(texto, xCentro, yCentroVP1 + altoTexto / 2);
        ctx.restore();
      } else {
        let { img, altoImg, anchoImg, } = elemento.vp1;
        ctx.drawImage(img, xCentro - anchoImg / 2, yCentroVP1 - altoImg / 2, anchoImg, altoImg);
      }
      if (mostrarFlechaVP1) {
        ctx.drawImage(imgFlecha, xCentro - anchoImgFlecha / 2, yCentroVP1 - altoVP1 / 2 - altoImgFlecha / 2, anchoImgFlecha, altoImgFlecha)
      }
      if (mostrarSignoMasVP1 && (index + 1) < elementos.length) {
        let siguienteCentro = xCentro + anchoElemento / 2 + (elementos[index + 1].tipo === 'repeticion' ?
          elementos[index + 1].dimenciones.ancho / 2 :
          elementos[index + 1].anchoTexto / 2) + separacion
        let xImgSignoMas = xCentro + (siguienteCentro - xCentro) / 2 - anchoImgSignoMas / 2
        let yImgSignoMas = yCentroVP1 - altoImgSignoMas / 2;
        ctx.drawImage(imgSignoMas, xImgSignoMas, yImgSignoMas, anchoImgSignoMas, altoImgSignoMas)
      }
    }
    if (mostrarVP2) {
      if (elemento.vp2.tipo === 'texto') {
        let { texto, altoTexto, colorTexto } = elemento.vp2;
        ctx.save();
        ctx.font = `${altoTexto}px Open-Sans-Reg`;
        ctx.fillStyle = colorTexto;
        ctx.textAlign = 'center';
        ctx.fillText(texto, xCentro, yCentroVP2 + altoTexto / 2);
        ctx.restore();
      } else {
        let { img, altoImg, anchoImg } = elemento.vp2;
        ctx.drawImage(img, xCentro - anchoImg / 2, yCentroVP2 - altoImg / 2, anchoImg, altoImg);
      }
      if (mostrarFlechaVP2) {
        ctx.drawImage(imgFlecha, xCentro - anchoImgFlecha / 2, yCentroVP2 - altoVP2 / 2 - altoImgFlecha / 2, anchoImgFlecha, altoImgFlecha)
      }
      if (mostrarSignoMasVP2 && (index + 1) < elementos.length) {
        let siguienteCentro = xCentro + anchoElemento / 2 + (elementos[index + 1].tipo === 'repeticion' ?
          elementos[index + 1].dimenciones.ancho / 2 :
          elementos[index + 1].anchoTexto / 2) + separacion
        let xImgSignoMas = xCentro + (siguienteCentro - xCentro) / 2 - anchoImgSignoMas / 2
        let yImgSignoMas = yCentroVP2 - altoImgSignoMas / 2;
        ctx.drawImage(imgSignoMas, xImgSignoMas, yImgSignoMas, anchoImgSignoMas, altoImgSignoMas)
      }
    }
  });

  function dibujaRepeticion(formaRepeticiones, img, altoImg, anchoImg, cantidadRepeticiones, sepX, sepY, dimenciones, xCentro, yCentroRepeticiones) {
    switch (formaRepeticiones) {
      case 'diagonal/apilado':
        for (let i = 0, x, y; i < cantidadRepeticiones; i++) {
          if (i <= 4) {
            x = xCentro - (dimenciones.ancho / 2) + (i * sepX[0]);
            y = yCentroRepeticiones - (dimenciones.alto / 2) + (i * sepY[0]);
          } else {
            x = xCentro - (dimenciones.ancho / 2) + anchoImg + (i * sepX[0]);
            y = yCentroRepeticiones - (dimenciones.alto / 2) + ((i - 5) * sepY[0]);
          }
          ctx.drawImage(img, x, y, anchoImg, altoImg);
        }
        break;
      case 'diagonal':
        for (let i = 0, x, y; i < cantidadRepeticiones; i++) {
          x = xCentro - (dimenciones.ancho / 2) + (sepX[0] > 0 ? i * anchoImg : 0) + (i * sepX[0]);
          y = yCentroRepeticiones - (dimenciones.alto / 2) + (sepY[0] > 0 ? i * altoImg : 0) + (i * sepY[0]);
          ctx.drawImage(img, x, y, anchoImg, altoImg);
        }
        break;
      case 'izq/der':
        for (let i = 0, posX = 1, posY, x, y; i < cantidadRepeticiones; i++) {
          posY = Math.floor(i / sepX[1]);
          x = xCentro - (dimenciones.ancho / 2) + anchoImg * (posX - 1) + sepX[0] * (posX - 1);
          y = yCentroRepeticiones - (dimenciones.alto / 2) + altoImg * posY + sepY[0] * posY;
          ctx.drawImage(img, x, y, anchoImg, altoImg);
          if (posX === sepX[1]) {
            posX = 1;
          } else {
            posX++;
          }
        }
        break;
      case 'dado':
        switch (cantidadRepeticiones) {
          case 1:
            poneImagenEnPosicionDado9(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            break;
          case 2:
            poneImagenEnPosicionDado4(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado4(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            break;
          case 3:
            poneImagenEnPosicionDado9(9, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            break;
          case 4:
            poneImagenEnPosicionDado4(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado4(2, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado4(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado4(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            break;
          case 5:
            poneImagenEnPosicionDado9(9, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(7, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            break;
          case 6:
            poneImagenEnPosicionDado6(6, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado6(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado6(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado6(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado6(2, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado6(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            break;
          case 7:
            poneImagenEnPosicionDado9(9, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(7, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(6, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            break;
          case 8:
            poneImagenEnPosicionDado9(9, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(8, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(7, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(6, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(2, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            break;
          case 9:
            poneImagenEnPosicionDado9(9, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(8, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(7, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(6, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(2, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            poneImagenEnPosicionDado9(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
            break;
        }
        function poneImagenEnPosicionDado9(numero, img, anchoImg, altoImg, xCentro, yCentro, sepX, sepY) {
          let x, y;
          if (numero == 1 || numero == 4 || numero == 7) {
            x = xCentro - (anchoImg * 1.5) - sepX
          } else if (numero == 2 || numero == 5 || numero == 8) {
            x = xCentro - (anchoImg / 2)
          } else {
            x = xCentro + (anchoImg / 2) + sepX
          }
          if (numero == 1 || numero == 2 || numero == 3) {
            y = yCentro - (altoImg * 1.5) - sepY
          } else if (numero == 4 || numero == 5 || numero == 6) {
            y = yCentro - (altoImg / 2)
          } else {
            y = yCentro + (altoImg / 2) + sepY
          }
          ctx.drawImage(img, x, y, anchoImg, altoImg);
        }
        function poneImagenEnPosicionDado6(numero, img, anchoImg, altoImg, xCentro, yCentro, sepX, sepY) {
          let x, y;
          if (numero == 1 || numero == 3 || numero == 5) {
            x = xCentro - (sepX / 2) - anchoImg
          } else {
            x = xCentro + (sepX / 2)
          }
          if (numero == 1 || numero == 2 || numero == 3) {
            y = yCentro - (altoImg * 1.5) - sepY
          } else if (numero == 4 || numero == 5 || numero == 6) {
            y = yCentro - (altoImg / 2)
          } else {
            y = yCentro + (altoImg / 2) + sepY
          }
          ctx.drawImage(img, x, y, anchoImg, altoImg);
        }
        function poneImagenEnPosicionDado4(numero, img, anchoImg, altoImg, xCentro, yCentro, sepX, sepY) {
          let x, y;
          if (numero == 1 || numero == 3) {
            x = xCentro - (sepX / 2) - anchoImg
          } else {
            x = xCentro + (sepX / 2)
          }
          if (numero == 1 || numero == 2) {
            y = yCentro - (sepY / 2) - altoImg
          } else {
            y = yCentro + (sepY / 2)
          }
          ctx.drawImage(img, x, y, anchoImg, altoImg);
        }
        break;
      default:
        //console.log('insoportado');
        break;
    }
  }

  if (titulo !== '') { // dibuja titulo
    container.parentElement.querySelectorAll('span').forEach(e => e.parentNode.removeChild(e));
    let tituloObj = document.createElement('span');
    tituloObj.innerText = regexFunctions(regex(titulo, vars, vt));
    tituloObj.style.fontSize = '18px';
    tituloObj.style.fontWeight = '600';
    tituloObj.style.color = 'black';
    container.parentNode.insertBefore(tituloObj, container);
  }

  if (separaciones) { // dibuja separaciones
    let heightRect = Math.max(...posicicionesInicio.map(x => x.altoTotal)) + (separacion / 2)
    let yRect = yCentroRepeticiones - heightRect / 2
    separaciones.forEach(function (agrupacion) {
      let xRect = posicicionesInicio[agrupacion.inicio - 1].xInicio - (separacion / 4);
      let widthRect = posicicionesInicio[agrupacion.fin - 1].xInicio + posicicionesInicio[agrupacion.fin - 1].anchoTotal - (separacion * 3 / 4) + separacion - xRect;
      ctx.save();
      ctx.strokeStyle = '#808080';
      ctx.strokeRect(xRect, yRect, widthRect, heightRect);
      ctx.restore();
    });
  }
}

async function recta(config, tipo) {
  const { container, params, variables, versions, vt } = config
  //container.innerHTML = '' //quitar linea en funcionalidad de app.js
  //container.style.border = '1px solid #000'
  let vars = vt ? variables : versions

  let { altoRecta, anchoRecta,
    grosorRecta, grosorMarcas, colorRecta, largoFlechas, largoMarcas, fontSize, colorFuente, //diseño recta numerica
    formato, valorInicialRecta, valorFinalRecta, valorEscalaRecta, divicionesRecta, //valores para pintar recta
    marcas, extremos, valores, valorInicioMostrar, valorFinalMostrar,
    formatoSubescala, divicionesSubescala, marcasSubescala, marcaInicioMostrarSubescala, marcaFinMostrarSubescala, valoresSubescala, valorInicioMostrarSubescala, valorFinMostrarSubescala,
    valoresEspecificos, //valores a mostrar en recta
    imagenes, //aqui se agregan las imagenes de la recta
    resaltarTramo, tipoTramo, inicioTramo, finTramo, separacionTramo, colorTramo,//datos de tramos
    arcos, //datos de arcos
    textos, //datos de texto
    puntos,
    encerrarValores } = params //puntos de la recta para marcar
  //reemplaza valores para calcular datos de recta
  valorInicialRecta = Number(regexFunctions(regex(valorInicialRecta, vars, vt)))
  divicionesRecta = Number(regexFunctions(regex(divicionesRecta, vars, vt)))
  valorFinalRecta = valorFinalRecta ?
    Number(regexFunctions(regex(valorFinalRecta, vars, vt))) :
    valorInicialRecta + Number(regexFunctions(regex(valorEscalaRecta, vars, vt))) * divicionesRecta
  valorEscalaRecta = valorEscalaRecta ?
    Number(regexFunctions(regex(valorEscalaRecta, vars, vt))) :
    (valorFinalRecta - valorInicialRecta) / divicionesRecta
  //valores para mostrar en recta numerica
  valoresEspecificos = valoresEspecificos ? await Promise.all(valoresEspecificos.map(x => x.tipo == 'numero' ? num(x) : frac(x))) : []
  //subdiviciones de recta numerica
  divicionesSubescala = Number(regexFunctions(regex(divicionesSubescala, vars, vt)))
  //puntos de la recta para marcar
  puntos = puntos.length > 0 ? regexFunctions(regex(puntos, vars, vt)).split(';').map(x => x.split(',')).map(x => ({
    posicion: valorRectaACoordenadaX(Number(x[0])),
    color: x[1]
  })) : []
  //valores para ecerrar en recta numerica
  encerrarValores = encerrarValores.length > 0 ? regexFunctions(regex(encerrarValores, vars, vt)).split(';').map(x => x.split(',')).map(x => ({
    posicion: valorRectaACoordenadaX(Number(x[0])),
    ancho: Number(x[1]),
    alto: Number(x[2]),
    color: x[3]
  })) : []
  //imagenes para mostrar en recta numerica
  imagenes = imagenes ? await Promise.all(imagenes.map(x => getImagenObj(x))) : []
  //arcos para mostrar en la recta numerica
  arcos = arcos ? await Promise.all(arcos.map(x => getArcoObj(x))) : []
  //texto para mostrar en la recta numerica
  textos = textos ? await Promise.all(textos.map(x => getTextoObj(x))) : []
  //parsea los textos y los numeros reemplazando variables y funciones
  grosorRecta = Number(grosorRecta)
  grosorMarcas = Number(grosorMarcas)
  largoFlechas = Number(largoFlechas)
  largoMarcas = Number(largoMarcas)
  fontSize = Number(fontSize)
  inicioTramo = Number(Number(regexFunctions(regex(inicioTramo, vars, vt))).toFixed(10))
  finTramo = Number(Number(regexFunctions(regex(finTramo, vars, vt))).toFixed(10))
  separacionTramo = Number(separacionTramo)
  valorInicioMostrar = Number(Number(regexFunctions(regex(valorInicioMostrar, vars, vt))).toFixed(10))
  valorFinalMostrar = Number(Number(regexFunctions(regex(valorFinalMostrar, vars, vt))).toFixed(10))
  //setea valores de dimensiones de recta
  container.setAttributeNS(null, 'height', altoRecta)
  container.setAttributeNS(null, 'width', anchoRecta)
  container.setAttributeNS(null, 'viewBox', `0 0 ${anchoRecta} ${altoRecta}`)
  let _centroYRecta = altoRecta / 2 - grosorRecta / 2,
    _anchoSeparaciones = anchoRecta / (divicionesRecta + 2),
    _posicionesEnRecta = []
  //importa fuente opensans para ser utilizada en los elementos de texto
  let defs = crearElemento('defs', {})
  let styles = document.createElement('style')
  styles.innerHTML = '@font-face{font-family:"Open-Sans-Reg";src:url("../../../../fonts/OpenSans-Regular-webfont.woff");}'
  defs.appendChild(styles)
  container.appendChild(defs)
  //dibuja recta numerica (linea base y flechas)
  container.appendChild(crearElemento('rect', { //dibuja linea principal
    x: 0,
    y: _centroYRecta,
    width: anchoRecta,
    height: grosorRecta,
    fill: colorRecta,
    rx: 2,
    ry: 2
  }))
  container.appendChild(crearElemento('rect', { //dibuja flecha inicial
    x: grosorRecta / 2,
    y: _centroYRecta,
    width: largoFlechas,
    height: grosorRecta,
    fill: colorRecta,
    transform: `rotate(30 ${0},${_centroYRecta})`,
    rx: 2,
    ry: 2
  }))
  container.appendChild(crearElemento('rect', { //dibuja flecha inicial
    x: 0,
    y: _centroYRecta,
    width: largoFlechas,
    height: grosorRecta,
    fill: colorRecta,
    transform: `rotate(-30 ${0},${_centroYRecta})`,
    rx: 2,
    ry: 2
  }))
  container.appendChild(crearElemento('rect', { //dibuja flecha final
    x: anchoRecta - largoFlechas,
    y: _centroYRecta,
    width: largoFlechas,
    height: grosorRecta,
    fill: colorRecta,
    transform: `rotate(30 ${anchoRecta},${_centroYRecta})`,
    rx: 2,
    ry: 2
  }))
  container.appendChild(crearElemento('rect', { //dibuja flecha final
    x: anchoRecta - largoFlechas - grosorRecta / 2,
    y: _centroYRecta,
    width: largoFlechas,
    height: grosorRecta,
    fill: colorRecta,
    transform: `rotate(-30 ${anchoRecta},${_centroYRecta})`,
    rx: 2,
    ry: 2
  }))
  //calcula los valores a posicionar en la recta numerica y sus posiciones en el eje x
  _posicionesEnRecta = await Promise.all([{
    numero: valorInicialRecta,
    posicion: _anchoSeparaciones - grosorMarcas / 2
  }]
    .concat(Array(divicionesRecta)
      .fill()
      .map((x, index) => ({
        numero: Number((valorInicialRecta + valorEscalaRecta * (index + 1)).toFixed(10)),
        posicion: _anchoSeparaciones + _anchoSeparaciones * (index + 1) - grosorMarcas / 2
      }))))
  //dibuja marcas y numeros en recta numerica 
  ////console.log({ _posicionesEnRecta, valoresEspecificos, imagenes })
  _posicionesEnRecta.forEach(({ numero, posicion }, index) => {
    //dibuja las marcas por si solas
    if ((index == 0 || index == divicionesRecta) || marcas === 'todas') {
      dibujarMarca(posicion)
    }
    //dibuja el numero asociado a la marca
    if (index == 0 && (extremos == 'ambos' || extremos == 'inicial')) { // dibuja primer valor
      dibujaValorDeMarca(numero, posicion, index)
    } else if (index == divicionesRecta && (extremos == 'ambos' || extremos == 'final')) { //dibuja ultimo valor
      dibujaValorDeMarca(numero, posicion, index)
    }
    if (index != 0 && index != divicionesRecta && valores === 'todos') { //dibuja todos los valores de recta
      dibujaValorDeMarca(numero, posicion, index)
    }
  })

  if (puntos && puntos.length > 0) {
    puntos.forEach(punto => {
      container.appendChild(crearElemento('circle', {
        cx: punto.posicion,
        cy: altoRecta / 2,
        r: grosorRecta + grosorRecta / 2,
        fill: punto.color,
        stroke: colorRecta,
        strokeWidth: grosorRecta / 2
      }))
    })
  }

  valoresEspecificos.forEach(valor => {
    if (valor.tipo == 'numero') {
      let { numero, posicion, ubicacion } = valor
      dibujaNumeroEnPosicion(numero, posicion, ubicacion)
      dibujarMarca(posicion)
    } else {
      let { entero, numerador, denominador, posicion, ubicacion } = valor
      dibujaFraccionEnPosicion(entero, numerador, denominador, posicion, ubicacion)
      dibujarMarca(posicion)
    }
  })

  imagenes.forEach(img => {
    let widthImg = img.height * img.imagen.width / img.imagen.height
    img.posiciones.forEach(posicionEnRecta => {
      let posicionX = valorRectaACoordenadaX(posicionEnRecta)
      if (img.marcar) {
        container.appendChild(crearElemento('rect', { //dibuja marca
          x: posicionX - grosorMarcas / 2,
          y: altoRecta / 2 - largoMarcas / 2,
          width: grosorMarcas,
          height: largoMarcas,
          fill: colorRecta,
          rx: 2,
          ry: 2
        }))
      }
      container.appendChild(crearElementoDeImagen(img.srcImg, {
        x: posicionX - widthImg / 2,
        y: img.posicion == 'arriba' ? altoRecta / 2 - largoMarcas / 2 - img.separacion - img.height : altoRecta / 2 + largoMarcas / 2 + img.separacion,
        height: img.height
      }))
    })
  })
  //dibuja solo los valores entre las variables valorInicioMostrar y valorFinalMostrar
  if (marcas == 'ninguna' && valores == 'entre') {
    let valoresAMarcar = _posicionesEnRecta.filter(x => x.numero >= valorInicioMostrar && x.numero <= valorFinalMostrar)
    valoresAMarcar.forEach(({ numero, posicion }) => {
      dibujarMarca(posicion)
      dibujaValorDeMarca(numero, posicion, _posicionesEnRecta.map(x => x.numero).indexOf(numero))
    })
  }
  //dibuja tramo de recta numerica
  if (resaltarTramo === 'si') {
    let inicioX = valorRectaACoordenadaX(inicioTramo)
    let finX = valorRectaACoordenadaX(finTramo)
    let centro = (finX - inicioX) / 2 + inicioX
    let inicioY = altoRecta / 2 - largoMarcas / 2 - separacionTramo
    let radio = 10

    switch (tipoTramo) {
      case 'llave':
        container.appendChild(crearElemento('path', {
          d: `M ${inicioX} ${inicioY}
						A ${radio} ${radio} 0 0 1 ${inicioX + radio} ${inicioY - radio}
						H ${centro - radio}
						A ${radio} ${radio} 0 0 0 ${centro} ${inicioY - radio * 2}
						A ${radio} ${radio} 0 0 0 ${centro + radio} ${inicioY - radio}
						H ${finX - radio}
						A ${radio} ${radio} 0 0 1 ${finX} ${inicioY}`,
          fill: 'none',
          stroke: colorTramo,
          strokeWidth: grosorMarcas
        }))
        break
      case 'punto-punto':
        container.appendChild(crearElemento('circle', {
          cx: inicioX,
          cy: altoRecta / 2,
          r: grosorRecta + 2,
          fill: colorTramo,
          stroke: colorRecta,
          strokeWidth: grosorRecta / 2
        }))
        container.appendChild(crearElemento('circle', {
          cx: finX,
          cy: altoRecta / 2,
          r: grosorRecta + 2,
          fill: colorTramo,
          stroke: colorRecta,
          strokeWidth: grosorRecta / 2
        }))
        container.appendChild(crearElemento('rect', {
          x: inicioX,
          y: altoRecta / 2 - grosorRecta / 2,
          width: finX - inicioX,
          height: grosorRecta,
          fill: colorTramo
        }))
        break
      default:
        //console.log('no se puede agregar este tipo de tramo :c')
        break
    }
  }

  arcos.forEach(arco => {
    if (arco.saltos) {
      let puntosDeArcos = _posicionesEnRecta.filter(x => x.numero >= arco.inicio && x.numero <= arco.fin)
      puntosDeArcos.forEach(({ posicion }, index) => {
        if (index + 1 == puntosDeArcos.length) {
          return
        }
        let x = posicion + _anchoSeparaciones / 2
        let y = altoRecta / 2
        let radio = _anchoSeparaciones / 2
        container.appendChild(crearElemento('path', {
          d: createArcWithAngles(x, y, radio, 45, 135),
          fill: 'none',
          stroke: arco.color,
          strokeWidth: grosorMarcas
        }))
        if (arco.direccion == 'derecha') {
          let puntaFlecha = polarToCartesian(x, y, radio, 135)
          container.appendChild(crearElemento('path', {
            d: `M ${puntaFlecha.x} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y - 5}
							L ${puntaFlecha.x - 5} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
            fill: arco.color,
            stroke: arco.color
          }))
        } else {
          let puntaFlecha = polarToCartesian(x, y, radio, 45)
          container.appendChild(crearElemento('path', {
            d: `M ${puntaFlecha.x} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y - 5}
							L ${puntaFlecha.x + 5} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
            fill: arco.color,
            stroke: arco.color
          }))
        }
        if (arco.mostrarValorTramo) {
          container.appendChild(crearElementoDeTexto({
            x: posicion + _anchoSeparaciones / 2,
            y: altoRecta / 2 - _anchoSeparaciones / 2 - 5,
            fontSize: fontSize,
            textAnchor: 'middle',
            fill: colorFuente,
            style: 'font-family:Open-Sans-Reg;'
          }, valorEscalaRecta))
        }
      })
    } else {
      let inicioArco = valorRectaACoordenadaX(arco.inicio)
      let finArco = valorRectaACoordenadaX(arco.fin)
      let mitad = (finArco - inicioArco) / 2 + inicioArco
      let yArco = altoRecta / 2 - largoMarcas / 2 - 10
      container.appendChild(crearElemento('path', {
        d: `M ${inicioArco} ${yArco}
					A 22 2 0 0 1 ${finArco} ${yArco}`,
        fill: 'none',
        stroke: arco.color,
        strokeWidth: grosorMarcas
      }))
      if (arco.direccion == 'derecha') {
        let puntaFlecha = {
          x: finArco,
          y: yArco
        }
        container.appendChild(crearElemento('path', {
          d: `M ${puntaFlecha.x} ${puntaFlecha.y}
						L ${puntaFlecha.x} ${puntaFlecha.y - 5}
						L ${puntaFlecha.x - 5} ${puntaFlecha.y}
						L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
          fill: arco.color,
          stroke: arco.color
        }))
      } else {
        let puntaFlecha = {
          x: inicioArco,
          y: yArco
        }
        container.appendChild(crearElemento('path', {
          d: `M ${puntaFlecha.x} ${puntaFlecha.y}
						L ${puntaFlecha.x} ${puntaFlecha.y - 5}
						L ${puntaFlecha.x + 5} ${puntaFlecha.y}
						L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
          fill: arco.color,
          stroke: arco.color
        }))
      }
      if (arco.mostrarValorTramo) {
        let diferencia = arco.fin - arco.inicio
        container.appendChild(crearElementoDeTexto({
          x: mitad,
          y: altoRecta / 2 - _anchoSeparaciones * 0.7,
          fontSize: fontSize,
          textAnchor: 'middle',
          fill: colorFuente,
          style: 'font-family:Open-Sans-Reg;'
        }, diferencia.toString().replace('.', ',')))
      }
    }
  })
  //pone todos los textos de la recta
  textos.forEach(({ texto, valorCentro, posicionY }) => {
    container.appendChild(crearElementoDeTexto({
      x: valorCentro,
      y: posicionY,
      fontSize: fontSize,
      textAnchor: 'middle',
      fill: colorFuente,
      style: 'font-family:Open-Sans-Reg;'
    }, texto))
  })

  if (divicionesSubescala > 0) {

  }

  if (encerrarValores && encerrarValores.length > 0) {
    encerrarValores.forEach(encerrarValor => {
      container.appendChild(crearElemento('rect', {
        x: encerrarValor.posicion - encerrarValor.ancho / 2,
        y: altoRecta / 2 - encerrarValor.alto / 2,
        width: encerrarValor.ancho,
        height: encerrarValor.alto,
        stroke: encerrarValor.color,
        strokeWidth: '2',
        fill: 'none'
      }))
    })
  }

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) { // 0 grados = 9 hrs
    let angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  function createArcWithAngles(x, y, radius, startAngle, endAngle) {

    let start = polarToCartesian(x, y, radius, endAngle)
    let end = polarToCartesian(x, y, radius, startAngle)

    let arcSweep = endAngle - startAngle <= 180 ? '0' : '1'

    let d = [
      'M', start.x, start.y,
      'A', radius, radius, 0, arcSweep, 0, end.x, end.y
      //'L', x,y,
      //'L', start.x, start.y
    ].join(' ')

    return d
  }

  function valorRectaACoordenadaX(valorRecta) {
    let valorReal = valorRecta + valorEscalaRecta - valorInicialRecta
    let valorInicioMenosEscala = valorInicialRecta - valorEscalaRecta
    let valorFinalMasEscala = valorFinalRecta + valorEscalaRecta
    let largoRecta = valorFinalMasEscala - valorInicioMenosEscala
    return anchoRecta * valorReal / largoRecta
  }

  async function getImagenObj(img) {
    let src = regexFunctions(regex(img.srcImg, vars, vt))
    src = src.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../')
    return {
      srcImg: regexFunctions(regex(img.srcImg, vars, vt)),
      imagen: await cargaImagen(regexFunctions(regex(img.srcImg, vars, vt))),
      height: Number(img.height),
      posicion: img.posicion,
      separacion: Number(img.separacion),
      marcar: img.marcar === 'si' ? true : false,
      posiciones: String(img.posiciones).split(',')
        .map(x => regexFunctions(regex(x, vars, vt)))
        .map(x => Number(Number(x).toFixed(10)))
    }
  }

  function getArcoObj(arco) {
    return {
      inicio: Number(regexFunctions(regex(arco.inicio, vars, vt))),
      fin: Number(regexFunctions(regex(arco.fin, vars, vt))),
      direccion: arco.direccion,
      color: '#8B1013',
      saltos: arco.saltos == 'si' ? true : false,
      mostrarValorTramo: arco.mostrarValorTramo == 'si' ? true : false
    }
  }

  function getTextoObj(texto) {
    return {
      texto: regexFunctions(regex(texto.texto, vars, vt)),
      valorCentro: valorRectaACoordenadaX(Number(regexFunctions(regex(texto.valorCentro, vars, vt)))),
      posicionY: texto.posicionY
    }
  }

  function dibujarMarca(posicion) {
    container.appendChild(crearElemento('rect', { //dibuja marca
      x: posicion,
      y: altoRecta / 2 - largoMarcas / 2,
      width: grosorMarcas,
      height: largoMarcas,
      fill: colorRecta,
      rx: 2,
      ry: 2
    }))
  }

  function dibujaValorDeMarca(numero, posicion, index) { //pone los numeros o fracciones debajo de la marca de la recta
    if (Number.isInteger(numero)) {
      dibujaNumeroEnPosicion(numero, posicion, 'abajo')
    } else if (formato == 'numero') {
      //va a pintar el valor como numero, ya sea decimal o no, con todos sus decimales
      dibujaNumeroEnPosicion(numero, posicion, 'abajo')
    } else if (((valorFinalRecta - valorInicialRecta) == 1) && formato == 'fraccion' && index >= 0) {
      /*si la diferencia entre la primera y la segunda marca es 1 y 
      el formato se debe pintar como fraccion y 
      el valor esta dentro de los valores de la recta*/
      dibujaFraccionEnPosicion(Math.floor(numero), index, divicionesRecta, posicion, 'abajo')
    }
  }

  function dibujaNumeroEnPosicion(numero, posicion, ubicacion) {
    //console.log({numero, posicion, ubicacion})
    container.appendChild(crearElementoDeTexto({
      x: posicion + grosorMarcas / 2,
      y: ubicacion == 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize : altoRecta / 2 - largoMarcas / 2 - 4,
      fontSize: fontSize,
      textAnchor: 'middle',
      fill: colorFuente,
      style: 'font-family:Open-Sans-Reg;'
    }, numero.toString().replace('.', ',')))
  }

  function frac({ tipo, entero, numerador, denominador, ubicacion }) {
    entero = Number(regexFunctions(regex(entero, vars, vt)))
    numerador = Number(regexFunctions(regex(numerador, vars, vt)))
    denominador = Number(regexFunctions(regex(denominador, vars, vt)))
    let valor = Number(entero + numerador / denominador)
    let posicion = valorRectaACoordenadaX(valor)

    return { entero, numerador, denominador, valor, posicion, ubicacion, tipo }
  }

  function num({ tipo, valor, ubicacion }) {
    let numero = Number(regexFunctions(regex(valor, vars, vt)))
    let posicion = valorRectaACoordenadaX(numero)
    return { numero, posicion, ubicacion, tipo }
  }

  function dibujaFraccionEnPosicion(entero, numerador, denominador, posicion, ubicacion) {
    //console.log(ubicacion)
    if (entero > 0) {
      container.appendChild(crearElementoDeTexto({
        x: posicion + grosorMarcas / 2 - 10,
        y: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize * 1.5 : altoRecta / 2 - largoMarcas / 2 - fontSize / 2 - 2,
        fontSize: fontSize + 2,
        textAnchor: 'middle',
        fill: colorFuente,
        style: 'font-family:Open-Sans-Reg;'
      }, entero))
      container.appendChild(crearElementoDeTexto({
        x: posicion + grosorMarcas / 2 + 10,
        y: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize : altoRecta / 2 - largoMarcas / 2 - fontSize - 2,
        fontSize: fontSize,
        textAnchor: 'middle',
        fill: colorFuente,
        style: 'font-family:Open-Sans-Reg;'
      }, numerador))
      container.appendChild(crearElemento('line', {
        x1: posicion + grosorMarcas / 2,
        y1: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize + 3 : altoRecta / 2 - largoMarcas / 2 - fontSize + 1,
        x2: posicion + grosorMarcas / 2 + 20,
        y2: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize + 3 : altoRecta / 2 - largoMarcas / 2 - fontSize + 1,
        stroke: colorRecta,
        strokeWidth: 2
      }))
      container.appendChild(crearElementoDeTexto({
        x: posicion + grosorMarcas / 2 + 10,
        y: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize * 2 : altoRecta / 2 - largoMarcas / 2 - 2,
        fontSize: fontSize,
        textAnchor: 'middle',
        fill: colorFuente,
        style: 'font-family:Open-Sans-Reg;'
      }, denominador))
    } else {
      container.appendChild(crearElementoDeTexto({
        x: posicion + grosorMarcas / 2,
        y: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize : altoRecta / 2 - largoMarcas / 2 - fontSize - 2,
        fontSize: fontSize,
        textAnchor: 'middle',
        fill: colorFuente,
        style: 'font-family:Open-Sans-Reg;'
      }, numerador))
      container.appendChild(crearElemento('line', {
        x1: posicion + grosorMarcas / 2 - 10,
        y1: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize + 3 : altoRecta / 2 - largoMarcas / 2 - fontSize + 1,
        x2: posicion + grosorMarcas / 2 + 10,
        y2: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize + 3 : altoRecta / 2 - largoMarcas / 2 - fontSize + 1,
        stroke: colorRecta,
        strokeWidth: 2
      }))
      container.appendChild(crearElementoDeTexto({
        x: posicion + grosorMarcas / 2,
        y: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize * 2 : altoRecta / 2 - largoMarcas / 2 - 2,
        fontSize: fontSize,
        textAnchor: 'middle',
        fill: colorFuente,
        style: 'font-family:Open-Sans-Reg;'
      }, denominador))
    }
  }

  function crearElementoDeImagen(src, atributos) {
    let element = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
    for (let p in atributos) {
      element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
        return '-' + m.toLowerCase()
      }), atributos[p])
    }
    return element
  }

  function crearElemento(nombre, atributos) {
    let element = document.createElementNS('http://www.w3.org/2000/svg', nombre)
    for (let p in atributos) {
      element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
        return '-' + m.toLowerCase()
      }), atributos[p])
    }
    return element
  }

  function crearElementoDeTexto(atributos, texto) {
    let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    for (let p in atributos) {
      element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
        return '-' + m.toLowerCase()
      }), atributos[p])
    }
    let textNode = document.createTextNode(texto)
    element.appendChild(textNode)
    return element
  }
  if (window.innerWidth <= 576) {
    container.setAttributeNS(null, 'height', Number(altoRecta) + 50)
    container.style.borderRadius = '5px'
    container.style.background = '#CACCCA'
    if (tipo == 'g') {
      svgGlosa.push(container)
    } else {
      svgPanZoom(container, {
        zoomEnabled: true,
        minZomm: 1,
        maxZoom: 2,
        customEventsHandler: eventsHandler,
        beforePan: beforePan
      })
    }
  }
}

var eventsHandler = {
  haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
  init: function (options) {
    var instance = options.instance
      , initialScale = 1
      , pannedX = 0
      , pannedY = 0

    // Init Hammer
    // Listen only for pointer and touch events
    this.hammer = Hammer(options.svgElement, {
      inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
    })

    // Enable pinch
    this.hammer.get('pinch').set({ enable: true })

    // Handle double tap
    this.hammer.on('doubletap', function (ev) {
      instance.zoomIn()
    })

    // Handle pan
    this.hammer.on('panstart panmove', function (ev) {
      // On pan start reset panned variables
      if (ev.type === 'panstart') {
        pannedX = 0
        pannedY = 0
      }

      // Pan only the difference
      instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY })
      pannedX = ev.deltaX
      pannedY = ev.deltaY
    })

    // Handle pinch
    this.hammer.on('pinchstart pinchmove', function (ev) {
      // On pinch start remember initial zoom
      if (ev.type === 'pinchstart') {
        initialScale = instance.getZoom()
        instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y })
      }

      instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y })
    })

    // Prevent moving the page on some devices when panning over SVG
    options.svgElement.addEventListener('touchmove', function (e) { e.preventDefault(); });
  },
  destroy: function () {
    this.hammer.destroy()
  }
}

function beforePan(oldPan, newPan) {
  var stopHorizontal = false,
    stopVertical = false,
    gutterWidth = 50,
    gutterHeight = 50,
    sizes = this.getSizes(),
    leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
    rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom),
    topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight,
    bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom)
  customPan = {}
  customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
  customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y))
  return customPan
}

async function tabPos(config) {
  const { container, params, variables, versions, vt } = config
  //container.innerHTML = ''
  //container.style.border = '1px solid #000'
  let vars = vt ? variables : versions
  let { tipoTabla, pisoTabla, detallePisos, conOperacion, tipoOperacion, canje, detalleCanje } = params

  let tiposTabla = [{
    id: 'UMCDU',
    detalle: ['UM', 'C', 'D', 'U'],
    url: `../../../../imagenes_front/tablas_posicionales/UMCDU${pisoTabla}.svg`
  }, {
    id: 'CDU',
    detalle: ['C', 'D', 'U'],
    url: `../../../../imagenes_front/tablas_posicionales/CDU${pisoTabla}.svg`
  }, {
    id: 'DU,dc',
    detalle: ['D', 'U', 'd', 'c'],
    url: `../../../../imagenes_front/tablas_posicionales/DU_dc${pisoTabla}.svg`
  }, {
    id: 'U,dc',
    detalle: ['U', 'd', 'c'],
    url: `../../../../imagenes_front/tablas_posicionales/U_dc${pisoTabla}.svg`
  }, {
    id: 'U,d',
    detalle: ['U', 'd'],
    url: `../../../../imagenes_front/tablas_posicionales/U_d${pisoTabla}.svg`
  }]

  let urlImagenesPosicionalesBloques = [{
    posicion: 'U',
    url: '../../../../imagenes_front/bloques_multibase/cubito#.svg'
  }, {
    posicion: 'D',
    url: '../../../../imagenes_front/bloques_multibase/barra#.svg'
  }, {
    posicion: 'C',
    url: '../../../../imagenes_front/bloques_multibase/placa#.svg'
  }, {
    posicion: 'UM',
    url: '../../../../imagenes_front/bloques_multibase/cubo#.svg'
  }, {
    posicion: 'd',
    url: '../../../../imagenes_front/bloques_multibase/cubo_decimo_#.svg'
  }, {
    posicion: 'c',
    url: '../../../../imagenes_front/bloques_multibase/cubo_centesimo_#.svg'
  }]

  let urlImgsFichasRojas = '../../../../imagenes_front/pelotas_repeticiones/naranjo#.svg'

  let urlImgsFichasAmarillas = '../../../../imagenes_front/pelotas_repeticiones/amarillo#.svg'

  let urlImgSuma = '../../../../imagenes_front/tablas_posicionales/num_sig_mas.svg'
  let urlImgResta = '../../../../imagenes_front/simbolos/menos.svg'


  //variables para dibujar tabla
  let { imagenes, imagenTabla } = await getImagenesPorCargar()
  //variables para medidas
  conOperacion = conOperacion === 'si' ? true : false
  canje = regexFunctions(regex(canje, vars, vt)) === 'si' ? true : false
  let anchoPosicion = 160
  let anchoSvg = imagenTabla.detalle.length * anchoPosicion + (conOperacion ? anchoPosicion / 2 : 0)
  let altoSvg = imagenTabla.detalle.length * anchoPosicion * imagenTabla.height / imagenTabla.width
  let altoPosicion = (altoSvg / ((pisoTabla * 2) + 1)) * 2
  let altoPosicionConMargen = altoPosicion * 0.8
  let anchoPosicionConMargen = anchoPosicion * 0.8
  let fontSize = altoPosicion * 0.8
  //agrega elementos a defs
  let defs = crearElemento('defs', {})
  let styles = document.createElement('style')
  styles.innerHTML = '@font-face{font-family:"Open-Sans-Reg";src:url("../../../../fonts/OpenSans-Regular-webfont.woff");}'
  defs.appendChild(styles)
  imagenes.forEach(imagen => {
    let g = crearElemento('g', {
      id: imagen.id
    })
    if (imagen.id.startsWith('bloque')) {
      let posicion = imagen.id.match(/-\w{1,}-/g)[0].replace(/-/g, '')
      switch (posicion) {
        case 'D':
          if (tipoTabla.indexOf(',') > -1) {
            g.appendChild(crearElementoDeImagen(imagen.url, {
              height: altoPosicionConMargen,
              width: altoPosicionConMargen * imagen.width / imagen.height
            }))
          } else {
            g.appendChild(crearElementoDeImagen(imagen.url, {
              height: anchoPosicionConMargen * imagen.height / imagen.width,
              width: anchoPosicionConMargen
            }))
          }
          break
        case 'U':
          if (tipoTabla.indexOf(',') > -1) {
            g.appendChild(crearElementoDeImagen(imagen.url, {
              height: altoPosicionConMargen,
              width: altoPosicionConMargen * imagen.width / imagen.height
            }))
          } else {
            g.appendChild(crearElementoDeImagen(imagen.url, {
              height: altoPosicionConMargen * 0.5 * imagen.width / imagen.height,
              width: altoPosicionConMargen * 0.5
            }))
          }
          break
        case 'd':
          g.appendChild(crearElementoDeImagen(imagen.url, {
            height: altoPosicionConMargen * 1.2,
            width: altoPosicionConMargen * 1.2 * imagen.width / imagen.height
          }))
          break
        case 'c':
          g.appendChild(crearElementoDeImagen(imagen.url, {
            height: altoPosicionConMargen * 1.2,
            width: altoPosicionConMargen * 1.2 * imagen.width / imagen.height
          }))
          break
        default:
          g.appendChild(crearElementoDeImagen(imagen.url, {
            height: altoPosicionConMargen,
            width: altoPosicionConMargen * imagen.width / imagen.height
          }))
          break
      }
    } else {
      g.appendChild(crearElementoDeImagen(imagen.url, {
        height: altoPosicionConMargen,
        width: altoPosicionConMargen * imagen.width / imagen.height
      }))
    }

    defs.appendChild(g)
  })
  container.appendChild(defs)

  //setea tamaños de la tabla
  container.setAttributeNS(null, 'height', altoSvg)
  container.setAttributeNS(null, 'width', anchoSvg)
  container.setAttributeNS(null, 'viewBox', `0 0 ${anchoSvg} ${altoSvg}`)
  //dibuja tabla principal
  container.appendChild(crearElementoDeImagen(imagenTabla.url, {
    x: conOperacion ? anchoPosicion / 2 : 0,
    y: 0,
    width: conOperacion ? anchoSvg - anchoPosicion / 2 : anchoSvg,
    height: altoSvg
  }))
  //inicio de relleno de pisos
  detallePisos = detallePisos.map(x => getDetallePiso(x)).forEach((detallePiso, piso) => {
    let centroYPiso = (piso + 1) * altoPosicion
    switch (detallePiso.tipo) {
      case 'numero':
        let yNumero = centroYPiso + fontSize / 3
        let grupoT = crearElemento('g', {
          id: `Piso${piso + 1}`,
          textAnchor: 'middle',
          fontSize: fontSize,
          fill: '#E58433'
        })
        imagenTabla.detalle.forEach((posicion, index) => {
          let centroXPiso = conOperacion ? anchoPosicion + index * anchoPosicion : anchoPosicion / 2 + index * anchoPosicion
          let numero = detallePiso.detalle[posicion]
          grupoT.appendChild(crearElementoDeTexto({
            //si es con operacion, hay que mostrar canje, es la primera fila y hay un numero en el objeto de canje pàra la columna especifica
            x: (conOperacion && canje && piso === 0 && detalleCanje[posicion]) ? centroXPiso - fontSize / 4 : centroXPiso,
            y: (conOperacion && canje && piso === 0 && detalleCanje[posicion]) ? yNumero + fontSize / 4 : yNumero,
            style: 'font-family:Open-Sans-Reg;'
          }, numero ? numero : 0))
        })
        container.appendChild(grupoT)
        break
      case 'fichas amarillas':
        let grupoFA = crearElemento('g', {
          id: `Piso${piso + 1}`
        })
        imagenTabla.detalle.forEach((posicion, index) => {
          let centroXPiso = conOperacion ? anchoPosicion + index * anchoPosicion : anchoPosicion / 2 + index * anchoPosicion
          grupoFA.appendChild(crearReferenciaAElemento(
            detallePiso.tipo.replace(' ', '-') + '-' + detallePiso.detalle[posicion], {
            x: centroXPiso - altoPosicionConMargen / 2,
            y: centroYPiso - altoPosicionConMargen / 2
          }))
        })
        container.appendChild(grupoFA)
        break
      case 'fichas rojas':
        let grupoFR = crearElemento('g', {
          id: `Piso${piso + 1}`
        })
        imagenTabla.detalle.forEach((posicion, index) => {
          let centroXPiso = conOperacion ? anchoPosicion + index * anchoPosicion : anchoPosicion / 2 + index * anchoPosicion
          grupoFR.appendChild(crearReferenciaAElemento(
            detallePiso.tipo.replace(' ', '-') + '-' + detallePiso.detalle[posicion], {
            x: centroXPiso - altoPosicionConMargen / 2,
            y: centroYPiso - altoPosicionConMargen / 2
          }))
        })
        container.appendChild(grupoFR)
        break
      case 'bloques':
        let grupoB = crearElemento('g', {
          id: `Piso${piso + 1}`
        })
        imagenTabla.detalle.forEach((posicion, index) => {
          let imagen = document.getElementById(detallePiso.tipo + '-' + posicion + '-' + detallePiso.detalle[posicion]).children[0]
          let centroXPiso = conOperacion ? anchoPosicion + index * anchoPosicion : anchoPosicion / 2 + index * anchoPosicion
          grupoB.appendChild(crearReferenciaAElemento(
            detallePiso.tipo + '-' + posicion + '-' + detallePiso.detalle[posicion], {
            x: centroXPiso - Number(imagen.getAttribute('width')) / 2,
            y: centroYPiso - Number(imagen.getAttribute('height')) / 2
          }))
        })
        container.appendChild(grupoB)
        break
      default:
        //no soportado
        break
    }
  })
  //dibuja la operacion y los canjes
  if (conOperacion) {
    let simbolo = tipoOperacion === 'suma' ? '+' : '-'
    let centroYUltimoPiso = (pisoTabla - 1) * altoPosicion
    container.appendChild(crearElementoDeTexto({
      x: (anchoPosicion / 2) / 2,
      y: centroYUltimoPiso + (fontSize * 1.2) / 3,
      style: 'font-family:Open-Sans-Reg;',
      textAnchor: 'middle',
      fontSize: fontSize * 1.2,
      fill: '#E58433'
    }, simbolo))

    let yLineaOperacion = (pisoTabla - 1) * altoPosicion + altoPosicion / 2
    container.appendChild(crearElemento('rect', {
      x: 0,
      y: yLineaOperacion - 2,
      width: anchoSvg,
      height: 4,
      stroke: '#E58433',
      fill: '#E58433'
    }))
    imagenTabla.detalle.forEach((posicion, columna) => {
      if (detalleCanje[posicion]) {
        let numero = regexFunctions(regex(detalleCanje[posicion], vars, vt))
        if (numero) {
          let centroXPiso = anchoPosicion + columna * anchoPosicion
          container.appendChild(crearElementoDeTexto({
            x: centroXPiso + fontSize / 2,
            y: altoPosicion + fontSize / 4,
            style: 'font-family:Open-Sans-Reg;',
            textAnchor: 'middle',
            fontSize: fontSize,
            fill: '#E58433'
          }, numero))

          container.appendChild(crearElemento('line', {
            x1: centroXPiso,
            y1: altoPosicion - fontSize / 4.5,
            x2: centroXPiso - fontSize / 1.8,
            y2: altoPosicion + altoPosicion / 2,
            stroke: '#E58433',
            strokeWidth: '3'
          }))
        }
      }
    })
  }

  //FUNCIONES -------------------
  function getDetallePiso(x) {
    let numeroCompleto = x.numeroCompleto === 'si' ? true : false
    let detalle = {}
    if (numeroCompleto) {
      let numero = regexFunctions(regex(x.detalle, vars, vt)).toString().replace('.', '').split('')
      tiposTabla.find(x => x.id === tipoTabla).detalle.forEach((posicion, index) => {
        detalle[posicion] = numero[index]
      })
    } else {
      Object.keys(x.detalle).forEach(posicion => {
        detalle[posicion] = regexFunctions(regex(x.detalle[posicion], vars, vt))
      })
    }
    return {
      tipo: x.tipo,
      detalle
    }
  }

  async function getImagenesPorCargar() {
    let imagenes = []
    detallePisos.forEach(piso => {
      switch (piso.tipo) {
        case 'bloques':
          Object.keys(piso.detalle).forEach(posicion => {
            piso.detalle[posicion] > 0 && imagenes.push({
              id: piso.tipo + '-' + posicion + '-' + piso.detalle[posicion],
              url: urlImagenesPosicionalesBloques.find(x => x.posicion === posicion).url.replace('#', piso.detalle[posicion])
            })
          })
          break
        case 'fichas amarillas':
          Object.keys(piso.detalle).forEach(posicion => {
            piso.detalle[posicion] > 0 && imagenes.push({
              id: piso.tipo.replace(' ', '-') + '-' + piso.detalle[posicion],
              url: urlImgsFichasAmarillas.replace('#', piso.detalle[posicion])
            })
          })
          break
        case 'fichas rojas':
          Object.keys(piso.detalle).forEach(posicion => {
            piso.detalle[posicion] > 0 && imagenes.push({
              id: piso.tipo.replace(' ', '-') + '-' + piso.detalle[posicion],
              url: urlImgsFichasRojas.replace('#', piso.detalle[posicion])
            })
          })
          break
        default:
          //no debe ingresar texto
          break
      }
    })
    imagenes = imagenes.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id)
      if (!x) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [])
    let imagenesCargadas = await Promise.all(imagenes.map(x => cargaImagen(x.url)))
    imagenes = imagenes.map((x, i) => ({
      id: x.id,
      url: x.url,
      height: imagenesCargadas[i].height,
      width: imagenesCargadas[i].width
    }))
    let imagenTabla = tiposTabla.find(x => x.id === tipoTabla)
    let imagenTablaCargada = await cargaImagen(imagenTabla.url)
    imagenTabla = {
      ...imagenTabla,
      height: imagenTablaCargada.height,
      width: imagenTablaCargada.width
    }
    return {
      imagenes,
      imagenTabla
    }
  }

  function crearElementoDeImagen(src, atributos) {
    let element = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
    for (let p in atributos) {
      element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
        return '-' + m.toLowerCase()
      }), atributos[p])
    }
    return element
  }

  function crearReferenciaAElemento(id, atributos) {
    let element = document.createElementNS('http://www.w3.org/2000/svg', 'use')
    element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`)
    for (let p in atributos) {
      element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
        return '-' + m.toLowerCase()
      }), atributos[p])
    }
    return element
  }

  function crearElemento(nombre, atributos) {
    let element = document.createElementNS('http://www.w3.org/2000/svg', nombre)
    for (let p in atributos) {
      element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
        return '-' + m.toLowerCase()
      }), atributos[p])
    }
    return element
  }

  function crearElementoDeTexto(atributos, texto) {
    let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    for (let p in atributos) {
      element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
        return '-' + m.toLowerCase()
      }), atributos[p])
    }
    let textNode = document.createTextNode(texto)
    element.appendChild(textNode)
    return element
  }
}