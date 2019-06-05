//datos ejercicio
var contenidoBody = JSON.parse(document.body.getAttribute('data-content').replace(/\'/g, '\"'));
var versionBody = JSON.parse(document.body.getAttribute('data-version').replace(/\'/g, '\"'));

$(document).ready(function(){
	dibujaHtml();
	print();
});

function shuffle(arr, t = 10) { 
	for (let i = 0; i < t; i++) { 
		arr = arr.sort(() => (.5 - Math.random()));
	}; 
	return arr 
}

function replace(texto, variables) { 
	var result = texto.toString().replace(/\$[a-z]/g, function(coincidencia) { //coincidencia => '$a'
		for(var indexVar = 0; indexVar < variables.length; indexVar++) {
			if(variables[indexVar].var == coincidencia[1]) {
				return variables[indexVar].var;
			}
		}
	});
	return result;
}

function regex(theInput, theVariables, isTutorial) {
	var result = theInput.toString().replace(/\$[a-z]/g, function(coincidencia) { //coincidencia => '$a'
		for(var indexVar = 0; indexVar < theVariables.length; indexVar++) {
			if(theVariables[indexVar].var == coincidencia[1]) {
				return isTutorial ? theVariables[indexVar].vt : theVariables[indexVar].val;
			}
		}
	});
	return result;
}

function regexFunctions(text) {
	var result = text.replace(/(?=\{).*?(\})/g, function(coincidencia){ //coincidencia => '{funcion()}'
			var final = coincidencia.length - 2;
			var funcion = coincidencia.substr(1,final);
			return eval(funcion);
	});
	return result;
}

function cargaImagen(src) {
	return new Promise(function(resolve, reject){
			var img = new Image();
			img.src = src;
			img.onload = function() {
					resolve(img);
			}
			img.onerror = function() {
					reject('no pasa nada');
			}
	});
}

function cargaFuente(nombre, src) {
	return new Promise(function(resolve, reject){
			var font = new FontFace(nombre, `url('${src}')`, {});
			font.load().then(function(loadedFont) {
					document.fonts.add(loadedFont);
					resolve(nombre);
			}).catch(function(error){
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
	if(stringNumero.length >= 4) {
			var arrayReverse = String(stringNumero).split("").reverse();
			for(var i=0,count=0,valor=''; i < arrayReverse.length; i++) {
					count++;
					if(count === 3 && arrayReverse[i+1]) {
							valor=' '+arrayReverse[i]+valor;
							count=0;
					} else {
							valor=arrayReverse[i]+valor;
					}
			} 
			return valor;
	} else {
			return stringNumero;
	}
}
// ---FIN--- funciones para modificar texto en texto

const FUNCIONES = [	
	{ name:'General', tag:'general', fns:[ 
		{ id:'Insertar Texto', action:insertarTexto }, 
		{ id:'Insertar Input', action:insertarInput },
		{ id:'Insertar Tabla', action:insertarTabla },
		{ id:'Insertar Imagen', action:insertarImagen }
	]},{ name:'Datos', tag:'datos', fns:[ 
	]},{ name:'Numeracion', tag:'numeracion', fns:[
		{ id:'Tabla Posicional', action:tablaPosicional },
		{ id:'Valor Posicional', action:valorPosicional },
		{ id:'Repetición Pictóricos', action:repeticionPic }
	]},{ name:'Medicion', tag:'medicion', fns:[
		{ id:'Perimetro', action:igualPerimetro } 
	]}
]

function print() { //Dibujar ejercicios
	var h = ['e', 'r', 'g'];
	h.forEach(n => {
		contenidoBody[n].forEach((m, i) => {
			for(var oaIndex = 0; oaIndex < FUNCIONES.length; oaIndex++) {

				if(FUNCIONES[oaIndex].tag === m.tag) {

					for(var funcionIndex = 0; funcionIndex < FUNCIONES[oaIndex].fns.length; funcionIndex++) {

						if(FUNCIONES[oaIndex].fns[funcionIndex].id === m.name) {

							FUNCIONES[oaIndex].fns[funcionIndex].action({
								container:document.getElementById(`container-${n}${i}`), 
								params:m.params, 
								versions:versionBody.vars, 
								vt:false 
							});

							break;
						}
					}

					break;
				}
			}
		})
	})
}

function dibujaHtml() {
  // INICIO ENUNCIADO
  var contenidoDiv = document.getElementById('enunciado');
  var contenidoHtml = '';
  contenidoBody['e'].forEach((m, i) => {
    contenidoHtml += `<div class="col-md-${m.width.md} col-sm-${m.width.sm} col-xs-${m.width.xs} tag">`
    if (m.tag != 'general') {
      contenidoHtml += `<canvas id="container-${'e'}${i}" class="img-fluid mx-auto d-block" style="background:${m.params.background}"></canvas>`
    } else {
      contenidoHtml += `<div id="container-${'e'}${i}" class="general"></div>`
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
      console.log(item);
      var dataContent = {
        feedback: regexFunctions(regex(item.params.feed, versionBody.vars, false)),
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
          `<canvas class="img-fluid" id="container-r${index}"></canvas>` :
          `<div id="container-r${index}" class="general"></div>`
        }
					</div>
				</div>`;
    });
  } else {
    contenidoBody['r'].forEach(function (item, index) {
      console.log(item);
      respuestaHtml += `<div class="col-md-${item.width.md} col-sm-${item.width.sm} col-xs-${item.width.xs} tag">`
      if (item.tag != 'general') {
        respuestaHtml += `<canvas class="img-fluid mx-auto d-block" id="container-r${index}" style="background:${item.params.background}"></canvas>`
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
      glosaHtml += `<canvas class="img-fluid mx-auto d-block" id="container-${'g'}${i}" style="background:${m.params.background}"></canvas>`
    } else {
      glosaHtml += `<div id="container-${'g'}${i}" class="general"></div>`
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
  	container.innerHTML = texto;
	}
}
function insertarImagen(config){
	const { container, params, variables, versions, vt } = config;
	const { src, display, height, width, col, colsm, colmd, offsetsm, offsetmd } = params;
	var source;
	try {
		var vars = vt ? variables : versions;
		source = regex(src, vars, vt);
	} catch(e) {
		console.log(e);
	}
	cargaImagen(source).then(img => {
		if(display === 'alto exacto') {
			img.width = height * img.width / img.height;
			img.height = height;
			container.className = "text-center"
		} else if (display === 'ancho exacto') {
			img.height = width * img.height / img.width;
			img.width = width;
			container.className = "text-center"
		} else if(display === 'alto y ancho exacto') {
			img.width = width;
			img.height = height;
			container.className = "text-center"
		} else {
			img.className = "img-responsive";
			container.className = `col-${col} col-sm-${colsm} offset-sm-${offsetsm} col-md-${colmd} offset-sm-${offsetmd}`;
		}
		container.innerHTML = "";
		container.appendChild(img);
	}).catch(error => {
		var img = document.createElement('img');
		img.src = "/notfound";
		img.alt = "Error al cargar imagen";
		container.appendChild(img);
		console.log(error);
	});
}
function insertarInput(config) {
	const { container, params, variables, versions, vt } = config,
	{ tipoInput, maxLength, inputSize, error0, error2, error3, error4, defaultError,
		feed0, feed1, feed2, feed3, feed4, defaultFeed,
		value1, value2, value3, value4, inputType,colmd,colsm,col } = params
	var vars = vt ? variables : versions;
	let r = '', n = '', valoresReemplazados = '';
	var feedGenerico = regexFunctions(regex(feed0, vars, vt));
	var answers = [{
		respuesta: regexFunctions(regex(value1, vars, vt)),
		feedback: regexFunctions(regex(feed1, vars, vt)),
		errFrec: null
	},{
		respuesta: regexFunctions(regex(value2, vars, vt)),
		feedback: feed0 === '' ? regexFunctions(regex(feed2, vars, vt)) : feedGenerico,
		errFrec: error0 === '' ? error2 : error0
	}];
	if(inputSize > 2) {
		answers[2] = {
			respuesta: regexFunctions(regex(value3, vars, vt)),
			feedback: feed0 === '' ? regexFunctions(regex(feed3, vars, vt)) : feedGenerico,
			errFrec: error0 === '' ? error3 : error0
		}
	}
	if(inputSize > 3) {
		answers[3] = {
			respuesta: regexFunctions(regex(value4, vars, vt)),
			feedback: feed0 === '' ? regexFunctions(regex(feed4, vars, vt)) : feedGenerico,
			errFrec: error0 === '' ? error4 : error0
		}
	}
	if (container) {
		switch(inputType) {
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
						container.innerHTML = `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" class="inputTexto" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputTexto(event)" />`;
						break;
					case 'numero':
						container.innerHTML = `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" class="inputTexto" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />`;
						break;
					case 'alfanumerico':
						container.innerHTML = `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" class="inputTexto" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputAlfanumerico(event)"/>`;
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
					} catch(e) {
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
function insertarTabla(config) {
  const { container, params, variables, versions, vt } = config, { table, cssclases, encabezado, lineasHorizontales, estiloLineaHorizontal, destacado, estiloFondoTD, anchoCols, tituloTabla, widthTabla } = params, vars = vt ? variables : versions
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
      if (lineasHorizontales === '') {
        r += '<tr>';
      } else {
        r += String(lineasHorizontales).split(',').includes(String(row + 1)) ? `<tr style="border-bottom: ${estiloLineaHorizontal};">` : '<tr>';
      }
      for (var col = 0; col < table[row].length; col++) {
        if (destacado === '') {
          r += '<td>';
        } else {
          if (debeMarcarse(row, col)) {
            r += `<td style="background:${estiloFondoTD};">`;
          } else {
            r += '<td>';
          }
        }
        switch (table[row][col].type) {
          case 'text':
            var tachado = table[row][col].value.tachar === 'si' ?
              `class="strikethrough"` : '';
            if (encabezado === 'arriba' && row === 0) {
              r += `<p ${tachado}><b>${regexFunctions(regex(table[row][col].value.text, vars, vt))}</b></p>`;
            } else if (encabezado === 'izquierda' && col === 0) {
              r += `<p ${tachado}><b>${regexFunctions(regex(table[row][col].value.text, vars, vt))}</b></p>`;
            } else {
              r += `<p ${tachado}>${regexFunctions(regex(table[row][col].value.text, vars, vt))}</p>`;
            }
            break;
          case 'image':
            var relativePath = table[row][col].value.url.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../');
            r += `<img src=${regex(relativePath, vars, vt)} height=${table[row][col].value.height} width=${table[row][col].value.width}/>`;
            break;
          case 'input':
            var { tipoInput, maxLength, placeholder, anchoInput,
              error0, error2, error3, error4, defaultError,
              feed0, feed1, feed2, feed3, feed4, defaultFeed,
              value1, value2, value3, value4 } = table[row][col].value;
            var feedGenerico = regex(feed0, vars, vt);
            var answers = [{
              respuesta: regex(value1, vars, vt),
              feedback: regex(feed1, vars, vt),
              errFrec: null
            }];
            if (value2 !== '') {
              answers[1] = {
                respuesta: regex(value2, vars, vt),
                feedback: feed0 === '' ? regex(feed2, vars, vt) : feedGenerico,
                errFrec: error0 === '' ? error2 : error0
              }
            }
            if (value3 !== '') {
              answers[2] = {
                respuesta: regex(value3, vars, vt),
                feedback: feed0 === '' ? regex(feed3, vars, vt) : feedGenerico,
                errFrec: error0 === '' ? error3 : error0
              }
            }
            if (value4 !== '') {
              answers[3] = {
                respuesta: regex(value4, vars, vt),
                feedback: feed0 === '' ? regex(feed4, vars, vt) : feedGenerico,
                errFrec: error0 === '' ? error4 : error0
              }
            }
            var dataContent = {
              tipoInput,
              answers,
              feedbackDefecto: feed0 === '' ? regex(defaultFeed, vars, vt) : feedGenerico,
              errFrecDefecto: error0 === '' ? defaultError : error0
            };
            switch (tipoInput) {
              case 'text':
                r += `<input type="text" name="answer" maxlength="${maxLength}" placeholder="${placeholder}" style="width:${anchoInput};" autocomplete="off" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputTexto(event)" />`;
                break;
              case 'numero':
                r += `<input type="text" name="answer" maxlength="${maxLength}" placeholder="${placeholder}" style="width:${anchoInput};" autocomplete="off" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />`;
                break;
              case 'alfanumerico':
                r += `<input type="text" name="answer" maxlength="${maxLength}" placeholder="${placeholder}" style="width:${anchoInput};" autocomplete="off" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputAlfanumerico(event)"/>`;
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
                feedback: feed0 === '' ? regex(feed2, vars, vt) : feedGenerico,
                errFrec: error0 === '' ? error2 : error0
              }
            }
            if (value3 !== '') {
              answers[2] = {
                respuesta: regex(value3, vars, vt),
                feedback: feed0 === '' ? regex(feed3, vars, vt) : feedGenerico,
                errFrec: error0 === '' ? error3 : error0
              }
            }
            if (value4 !== '') {
              answers[3] = {
                respuesta: regex(value4, vars, vt),
                feedback: feed0 === '' ? regex(feed4, vars, vt) : feedGenerico,
                errFrec: error0 === '' ? error4 : error0
              }
            }
            var dataContent = {
              tipoInput,
              answers,
              feedbackDefecto: feed0 === '' ? regex(defaultFeed, vars, vt) : feedGenerico,
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

function igualPerimetro(config) {
	const { container, params, variables, versions, vt } = config;

  container.width = params.cuadro * 10;
  container.height = params.cuadro * 5;
  container.style.border = params.borderWidth+'px solid  #000';
  
  var ctx = container.getContext('2d');
  var vars = vt ? variables : versions;
  for(var i = 1; i < 10; i++) { //lineas verticales
    ctx.beginPath();
    ctx.moveTo(i * params.cuadro, container.height);
    ctx.lineTo(i * params.cuadro, 0);
    ctx.strokeStyle = 'black';
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.closePath();
  }

  for(var i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(container.width, i * params.cuadro);
    ctx.lineTo(0, i * params.cuadro);
    ctx.strokeStyle = 'black';
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.closePath();
  }
  var alto, ancho;
  try {
    alto = regex(`$${params.alto}`, vars, vt);
    ancho = regex(`$${params.ancho}`, vars, vt);
    dibujaRectangulo(ctx, ancho * params.cuadro, alto * params.cuadro, params.cuadro);
  } catch(error) {
    console.log(error);
  }

  function dibujaRectangulo(ctx, largox, largoy, lado) {
    ctx.translate(0,0);
    var x,y;
    y = largoy / lado === 1 ? 2 * lado : lado;
    x = (10 * lado)/2 - (Math.trunc((largox / lado) / 2) * lado);
    ctx.beginPath();
    ctx.rect(x, y, largox, largoy);
    ctx.strokeStyle = 'red';
    ctx.lineWidth=4;
    ctx.stroke();
  }
}

function tablaPosicional(config) {
  const { container, params, variables, versions, vt } = config;
  var imgSrcFlechaAbajo = '../../../../imagenes_front/tablas_posicionales/flecha_fija.svg';
  var imgSrcSignoMas = '../../../../imagenes_front/tablas_posicionales/num_sig_mas.svg';
  var srcFuente = '../../../../fonts/LarkeNeueThin.ttf';
  //× => ALT+0215
  var { _width, _tipoTabla, /*puede ser 'centenas' o 'miles'*/_pisosTabla, /*pueden ser 'uno', 'dos', 'tres'*/_separacionElementos,_titulo,
    _tipoPisoUno, _repeticionPictoricaPisoUno, _mostrarNumeroCompletoUno, _numeroCompletoPisoUno, _umilPisoUno, _centenaPisoUno, _decenaPisoUno, _unidadPisoUno, _altoTextoPisoUno, /*numerico , imagenes, repeticion*/
    _altoImgMilesPisoUno, _altoImgCentPisoUno, _altoImgDecPisoUno, _altoImgUniPisoUno,//termino datos piso uno
    _tipoPisoDos, _repeticionPictoricaPisoDos, _mostrarNumeroCompletoDos, _numeroCompletoPisoDos, _umilPisoDos, _centenaPisoDos, _decenaPisoDos, _unidadPisoDos, _altoTextoPisoDos,
    _altoImgMilesPisoDos, _altoImgCentPisoDos, _altoImgDecPisoDos, _altoImgUniPisoDos,//termino datos piso dos
    _tipoPisoTres, _repeticionPictoricaPisoTres, _mostrarNumeroCompletoTres, _numeroCompletoPisoTres, _umilPisoTres, _centenaPisoTres, _decenaPisoTres, _unidadPisoTres, _altoTextoPisoTres,
    _altoImgMilesPisoTres, _altoImgCentPisoTres, _altoImgDecPisoTres, _altoImgUniPisoTres,//termino datos piso tres
    _dibujaValorPosicional1, _mostrarSignoMasVP1,_altoTextoValorPosicional1, _umilVP1, _centenaVP1, _decenaVP1, _unidadVP1,
    _dibujaValorPosicional2, _mostrarSignoMasVP2,_altoTextoValorPosicional2, _umilVP2, _centenaVP2, _decenaVP2, _unidadVP2,
    _dibujaTextoResultado, _altoTextoResultado, _resultado,
    _tipoUmilVP1,_tipoCentenaVP1,_tipoDecenaVP1,_tipoUnidadVP1,_altoumilvp1,_altocentenavp1,_altodecenavp1,_altounidadvp1,
    _tipoUmilVP2,_tipoCentenaVP2,_tipoDecenaVP2,_tipoUnidadVP2,_altoumilvp2,_altocentenavp2,_altodecenavp2,_altounidadvp2 } = params;

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
    console.log(error);
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
          alto: Number(_altoumilvp1) },
        centena: _tipoCentenaVP1 === 'texto' ? _centenaVP1 : { 
          src: _centenaVP1.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'), 
          alto: Number(_altocentenavp1) },
        decena: _tipoDecenaVP1 === 'texto' ? _decenaVP1 : { 
          src: _decenaVP1.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'), 
          alto: Number(_altodecenavp1) },
        unidad: _tipoUnidadVP1 === 'texto' ? _unidadVP1 : { 
          src: _unidadVP1.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'), 
          alto: Number(_altounidadvp1) }
      }
    }
  }

  if (_dibujaValorPosicional2 === 'si') {
    datosEjercicio.valoresPosicionales[1] = {
      mostrar: _dibujaValorPosicional2,
      mostrarSignoMas: _mostrarSignoMasVP2,
      altoTexto: Number(_altoTextoValorPosicional2), //alto del texto de los valores posicionales
      numeros: {//numeros que se muestran debajo de la tabla en forma de suma
        umil: _tipoUmilVP2 === 'texto' ? _umilVP2 : { src: 
          _umilVP2.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'), 
          alto: Number(_altoumilvp2) },
        centena: _tipoCentenaVP2 === 'texto' ? _centenaVP2 : { 
          src: _centenaVP2.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'), 
          alto: Number(_altocentenavp2) },
        decena: _tipoDecenaVP2 === 'texto' ? _decenaVP2 : { 
          src: _decenaVP2.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'), 
          alto: Number(_altodecenavp2) },
        unidad: _tipoUnidadVP2 === 'texto' ? _unidadVP2 : { 
          src: _unidadVP2.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../'), 
          alto: Number(_altounidadvp2) }
      }
    }
  }

  datosEjercicio.resultado = {
    mostrar: _dibujaTextoResultado,
    numero: _resultado, //numero del valor final centrado (puede ser texto o  numero)
    altoTexto: Number(_altoTextoResultado) //alto del texto del resultado
  }

  _separacionElementos = Number(_separacionElementos);
  console.log(datosEjercicio);
  let recursos = cargaRecursos();
  var ctx, yStart = 0;
  if(_titulo !== '') {
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
    console.log(error, error.message);
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
            console.log('opcion aun no soportada');
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
          console.log(error)
        });
      } else if (tipoRepeticion === 'circulo y cuadrado') {
        var img = columna % 2 === 0 ? 'Circulo.svg' : 'Cuadrado.svg';
        var src = '../../../../imagenes_front/tablas_posicionales/' + img;
        cargaImagen(src).then(image => {
          var xImg = (anchoSeparacion * columna) + (anchoSeparacion / 2) - (altoCuadro * 0.85 / 2);
          var yImg = porcion + (altoCuadro * fila) + (altoCuadro / 2) - (altoCuadro * 0.85 / 2);
          ctx.drawImage(image, xImg, yImg, altoCuadro * 0.85, altoCuadro * 0.85);
        }).catch(error => {
          console.log(error)
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
                dibujaRepeticionDado(numero, anchoSeparacion, altoCuadro, image, cx, cy, altoImgRep);
              } else if (tipoRepeticion === 'monedas y billetes') {
                dibujaRepeticionDadoBilletes(numero, anchoSeparacion, altoCuadro, image, cx, cy);
              }
              break;
            case 3:
              dibujaRepeticionDado(numero, anchoSeparacion, altoCuadro, image, cx, cy, altoImgRep);
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
              console.log('aun no se pinta ' + ruta);
              break;
          }
        }
      }).catch(error => {
        console.log(error);
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
            console.log('Hola :)');
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
            dibujaBloqueEnPosicionNueve(1, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(5, image, altoImg, anchoImg, cx, cy, separacion);
            dibujaBloqueEnPosicionNueve(9, image, altoImg, anchoImg, cx, cy, separacion);
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

        function dibujaBloqueEnPosicionNueve(posicion, image, altoImg, anchoImg, cx, cy, separacion, altoCuadro) { //posicion 1-9
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
    }
  }

  async function muestraValoresPosicionales(valorPosicional, yStart, diviciones, anchoSeparaciones, imgFlechaAbajo, imgSignoMas) {
    ctx.font = `${valorPosicional.altoTexto}pt LarkeNeueThinFuente`;
    ctx.fillStyle = '#F58220';
    ctx.textAlign = 'center';
    var { umil, centena, decena, unidad } = valorPosicional.numeros;
    var numerosValorPosicional = diviciones === 3 ? [centena, decena, unidad] : [umil, centena, decena, unidad];
    //console.log(numerosValorPosicional);
    for (var i = 1, centroSeccion, centroSeparacion, yTexto; i < diviciones + 1; i++) {
      centroSeccion = (anchoSeparaciones * i) - (anchoSeparaciones / 2);
      centroSeparacion = anchoSeparaciones * i;
      //flecha
      var xFlecha = centroSeccion - (imgFlechaAbajo.width / 2);
      ctx.drawImage(imgFlechaAbajo, xFlecha, yStart);
      //texto
      if(typeof numerosValorPosicional[i - 1] === 'string') {
        yTexto = yStart + imgFlechaAbajo.height + _separacionElementos + valorPosicional.altoTexto;
        ctx.fillText(numerosValorPosicional[i - 1], centroSeccion, yTexto);
      } else {
        await cargaImagen(numerosValorPosicional[i-1].src).then(function(img){
          var anchoImgVp = numerosValorPosicional[i-1].alto * img.width / img.height;
          var xImagenVp = centroSeccion-anchoImgVp/2;
          var yImagenVp = yStart + imgFlechaAbajo.height + _separacionElementos;
          ctx.drawImage(img, xImagenVp, yImagenVp, anchoImgVp, numerosValorPosicional[i-1].alto);
        }).catch(function(error){
          console.log(error);
        });
      }
      //singo mas
      if(valorPosicional.mostrarSignoMas === 'si') {
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
      texto; //alto de la fuente de los textos
    return { altoCanvas, altoImagen };
  }
}

function valorPosicional(config) {
  const { container, params, variables, versions, vt } = config;
  var { _tipo,_texto,_numeroPalabras,_marca,_separacionNumeros,_miles,_centenas,_decenas,_unidades,_altoTexo,_margenTopBottom } = params;
  var imgSrcFlechaAbajo = '../../../../imagenes_front/tablas_posicionales/flecha_fija.svg';
  var imgSrcSignoMas = '../../../../imagenes_front/tablas_posicionales/num_sig_mas.svg';
  var srcFuente = '../../../../fonts/LarkeNeueThin.ttf';

  var vars = vt ? variables : versions;

  try {
    _miles = regex(`$${_miles}`, vars, vt);
    _centenas = regex(`$${_centenas}`, vars, vt);
    _decenas = regex(`$${_decenas}`, vars, vt);
    _unidades = regex(`$${_unidades}`, vars, vt);
    if(_tipo === 'Numero Escrito') {
      _numeroPalabras = regex(`$${_numeroPalabras}`, vars, vt);
    } else if(_tipo === 'Texto') {
      _texto = regex(_texto, vars, vt);
    } else if (_tipo === 'Texto a Palabras') {
      _numeroPalabras = regex(`$${_numeroPalabras}`, vars, vt);
      _texto = regex(_texto, vars, vt);
    }
  } catch(error) {
    console.log(error);
  }
  

  var ctx = container.getContext('2d');
  Promise.all([
    cargaImagen(imgSrcFlechaAbajo),
    cargaImagen(imgSrcSignoMas),
    cargaFuente('LarkeNeueThinFuente', srcFuente)
  ]).then(function(result) {
    var imgFlecha = result[0],
    imgSignoMas = result[1];
    _altoTexo = Number(_altoTexo);
    _margenTopBottom = Number(_margenTopBottom);
    container.height = (_margenTopBottom * 4) + (_altoTexo * 2) + imgFlecha.height;
    container.width = 850;
    ctx.font = `${_altoTexo}pt LarkeNeueThinFuente`;
    ctx.textAlign="center";
    ctx.fillStyle = '#F58220';
    var xTexto = container.width / 2;
    var yTexto = _altoTexo + _margenTopBottom;

    if(_tipo === 'Numero Escrito') {
      ctx.fillText(_numeroPalabras, xTexto, yTexto);
    } else if(_tipo === 'Texto' || _tipo === 'Texto a Palabras'){
      ctx.fillText(_texto, xTexto, yTexto);
    }

    if(_tipo === 'Numero Escrito') {
      var xFlecha = (container.width / 2) - (imgFlecha.width / 2);
      var yFlecha = _altoTexo + (_margenTopBottom*2);
      ctx.drawImage(imgFlecha, xFlecha, yFlecha);

      var separaciones = _miles !== '$Seleccione' ? 4 : 3;
      var anchoSeparacion = (container.width - 60) / separaciones;
      var numeros = _miles !== '$Seleccione' ? [_miles, _centenas, _decenas, _unidades] : [_centenas, _decenas, _unidades];
      for(var i = 1; i < separaciones + 1; i++) {
        var centro = (anchoSeparacion * i) + 30 - (anchoSeparacion/2);
        var separacion = (anchoSeparacion * i) + 30;
        escribeNumero(centro, numeros[i-1]);
        i+1 !== separaciones+1 && dibujaSignoMas(separacion);
      }
    } else if(_tipo === 'Texto'){
      var xFlecha = (container.width / 2) - (imgFlecha.width / 2);
      var yFlecha = _altoTexo + (_margenTopBottom*2);
      ctx.drawImage(imgFlecha, xFlecha, yFlecha);

      escribeNumeroCentro();
    } else if(_tipo === 'Texto a Palabras') {
      var xFlecha = (container.width / 2) - (imgFlecha.width / 2);
      var yFlecha = _altoTexo + (_margenTopBottom*2);
      ctx.drawImage(imgFlecha, xFlecha, yFlecha);
      var xPalabras = container.width/2;
      var yPalabras = _altoTexo*2 + (_margenTopBottom*3) + imgFlecha.height;
      ctx.fillText(_numeroPalabras, xPalabras, yPalabras);
    } else {
      var underline = _marca === 'U de Mil' ? 1 : 2;
      var anchoTextoNumero = _altoTexo*4 + 3*Number(_separacionNumeros);
      var margen = (container.width - anchoTextoNumero) / 4;
      var numeros = [_miles, _centenas, _decenas, _unidades]; 
      for(var i = 1; i < 5; i++) {
        var centro = margen+_separacionNumeros*(i-1)+(_altoTexo*i)-(_altoTexo/2);
        var y = _margenTopBottom + _altoTexo;
        ctx.fillText(numeros[i-1], centro, y);
        if(i === underline) {
          var xStart = centro-(_altoTexo/2)-5;
          var xEnd = centro+(_altoTexo/2)+5;
          var yUnderline = y + 5;
          dibujaUnderlineNumero(xStart, xEnd, yUnderline);
          var xFlecha = centro - (imgFlecha.width/2);
          var yFlecha = y + 5 + _margenTopBottom;
          ctx.drawImage(imgFlecha, xFlecha, yFlecha);
          ctx.textAlign="left";
          var xTexto = centro - (_altoTexo * 0.35);
          var yTexto = y + 5 + _margenTopBottom*2 + imgFlecha.height + _altoTexo;
          if(underline === 2) {
            ctx.fillText(`${_centenas} centenas = ${_centenas}00`, xTexto, yTexto);
          } else {
            ctx.fillText(`${_miles} unidades de mil = ${_miles}000`, xTexto, yTexto);
          }
        }
      }
    }

    function dibujaUnderlineNumero(xStart, xEnd, yUnderline) {
      ctx.strokeStyle="#FF0000";
      ctx.beginPath();
      ctx.moveTo(xStart, yUnderline);
      ctx.lineTo(xEnd, yUnderline);
      ctx.stroke();
      ctx.closePath();
    }

    function escribeNumeroCentro() {
      var numero = `${_miles} ${_centenas}${_decenas}${_unidades}`;
      var x = container.width/2;
      var y = (_altoTexo*2) + (_margenTopBottom*3) + imgFlecha.height;
      ctx.fillText(numero, x, y);
    }

    function escribeNumero(centro, numero) {
      var y = (_altoTexo*2) + (_margenTopBottom*3) + imgFlecha.height;
      ctx.fillText(numero, centro, y);
    }

    function dibujaSignoMas(separacion) {
      var x = separacion - (imgSignoMas.width / 2);
      var y = (_altoTexo*2) + (_margenTopBottom*3) + imgFlecha.height - (_altoTexo/2) - (imgSignoMas.height/2);
      ctx.drawImage(imgSignoMas, x, y);
    }

  }).catch(function(error) {
    console.log(error)
  });
}

function repeticionPic(config) {
	const { container, params, variables, versions, vt } = config;

	var imagenes = [{
		name: 'bloque mil',
		src: '../../../../imagenes_front/bloques_multibase/bloque-4.svg'
	},{
		name: 'bloque cien',
		src: '../../../../imagenes_front/bloques_multibase/bloque-3.svg'
	}, {
		name: 'bloque diez',
		src: '../../../../imagenes_front/bloques_multibase/bloque-2.svg'
	},{
		name: 'bloque uno',
		src: '../../../../imagenes_front/bloques_multibase/bloque-1.svg'
	},{
		name: 'billete mil',
		src: '../../../../imagenes_front/monedas_billetes/1000.svg'
	},{
		name: 'moneda cien',
		src: '../../../../imagenes_front/monedas_billetes/100.svg'
	},{
		name: 'moneda diez',
		src: '../../../../imagenes_front/monedas_billetes/10.svg'
	},{
		name: 'moneda uno',
		src: '../../../../imagenes_front/monedas_billetes/1.svg'
	},{
		name: 'moneda quinientos',
		src: '../../../../imagenes_front/monedas_billetes/500.svg'
	},{
		name: 'moneda cincuenta',
		src: '../../../../imagenes_front/monedas_billetes/50.svg'
	},{
		name: 'moneda cinco',
		src: '../../../../imagenes_front/monedas_billetes/5.svg'
	}];

	let {_pictoricos, _separacion, heightCanvas, widthCanvas, 
		 _imagen1,_altoImagen1,_formaRepeticion1,_repeticiones1,_separacion1,_separaciony1,
		 _imagen2,_altoImagen2,_formaRepeticion2,_repeticiones2,_separacion2,_separaciony2,
		 _imagen3,_altoImagen3,_formaRepeticion3,_repeticiones3,_separacion3,_separaciony3,
		 _imagen4,_altoImagen4,_formaRepeticion4,_repeticiones4,_separacion4,_separaciony4,
		 _imagen5,_altoImagen5,_formaRepeticion5,_repeticiones5,_separacion5,_separaciony5,
		 _imagen6,_altoImagen6,_formaRepeticion6,_repeticiones6,_separacion6,_separaciony6,
		 _imagen7,_altoImagen7,_formaRepeticion7,_repeticiones7,_separacion7,_separaciony7,
		 _imagen8,_altoImagen8,_formaRepeticion8,_repeticiones8,_separacion8,_separaciony8} = params;

	var vars = vt ? variables : versions;
	try {
		 _repeticiones1 = regex(`$${_repeticiones1}`, vars, vt);
		 _repeticiones2 = regex(`$${_repeticiones2}`, vars, vt);
		 _repeticiones3 = regex(`$${_repeticiones3}`, vars, vt);
		 _repeticiones4 = regex(`$${_repeticiones4}`, vars, vt);
		 _repeticiones5 = regex(`$${_repeticiones5}`, vars, vt);
		 _repeticiones6 = regex(`$${_repeticiones6}`, vars, vt);
		 _repeticiones7 = regex(`$${_repeticiones7}`, vars, vt);
		 _repeticiones8 = regex(`$${_repeticiones8}`, vars, vt);
	} catch(error) {
		 console.log(error);
	}

	var repeticiones = getRepeticiones();
	
	_separacion = Number(_separacion);
	let xStart = _separacion;
	container.height = Number(heightCanvas);
	container.width = Number(widthCanvas);
	var ctx = container.getContext('2d');
	//carga las imagenes y dibuja las repeticiones
	Promise.all(repeticiones.map(x => cargaImagen(x.imagen.src))).then(imagenes => {
		 repeticiones.forEach(function(x, i){
				repeticiones[i].imagen = imagenes[i]
		 });
		 return repeticiones;
	}).then(function(repeticionesPictoricas) {
		 for(let repeticion of repeticionesPictoricas) {
				console.log(repeticion);
				if(repeticion.repeticiones > 0) {
					 switch(repeticion.formaRepeticion) {
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
							default:
								 console.log(repeticion);
								 break;
					 }
				}
		 }
	}).catch(function(error){
		 console.log(error);
	});

	function buscarImagen(imagenBuscada) {
		for(var imagen of imagenes) {
			if(imagen.name === imagenBuscada) {
				return imagen;
			}
		}
	}

	function getRepeticiones() {
		 let repeticiones = [{
				imagen: _imagen1 !== '' ? buscarImagen(_imagen1) : { src:'' },
				altoImagen: Number(_altoImagen1),
				formaRepeticion: _formaRepeticion1,
				repeticiones: Number(_repeticiones1),
				separacion: Number(_separacion1),
				separaciony: Number(_separaciony1)
		 }];

		 if(_pictoricos > 1) {
				repeticiones[1] = {
				imagen: _imagen2 !== '' ? buscarImagen(_imagen2) : { src:'' },
				altoImagen: Number(_altoImagen2),
				formaRepeticion: _formaRepeticion2,
				repeticiones: Number(_repeticiones2),
				separacion: Number(_separacion2),
				separaciony: Number(_separaciony2)
				}
		 }
		 
		 if(_pictoricos > 2) {
				repeticiones[2] = {
				imagen: _imagen3 !== '' ? buscarImagen(_imagen3) : { src:'' },
				altoImagen: Number(_altoImagen3),
				formaRepeticion: _formaRepeticion3,
				repeticiones: Number(_repeticiones3),
				separacion: Number(_separacion3),
				separaciony: Number(_separaciony3)
				}
		 }

		 if(_pictoricos > 3) {
				repeticiones[3] = {
				imagen: _imagen4 !== '' ? buscarImagen(_imagen4) : { src:'' },
				altoImagen: Number(_altoImagen4),
				formaRepeticion: _formaRepeticion4,
				repeticiones: Number(_repeticiones4),
				separacion: Number(_separacion4),
				separaciony: Number(_separaciony4)
				}
		 }

		 if(_pictoricos > 4) {
				repeticiones[4] = {
				imagen: _imagen5 !== '' ? buscarImagen(_imagen5) : { src:'' },
				altoImagen: Number(_altoImagen5),
				formaRepeticion: _formaRepeticion5,
				repeticiones: Number(_repeticiones5),
				separacion: Number(_separacion5),
				separaciony: Number(_separaciony5)
				}
		 }

		 if(_pictoricos > 5) {
				repeticiones[5] = {
				imagen: _imagen6 !== '' ? buscarImagen(_imagen6) : { src:'' },
				altoImagen: Number(_altoImagen6),
				formaRepeticion: _formaRepeticion6,
				repeticiones: Number(_repeticiones6),
				separacion: Number(_separacion6),
				separaciony: Number(_separaciony6)
				}
		 }

		 if(_pictoricos > 6) {
				repeticiones[6] = {
				imagen: _imagen7 !== '' ? buscarImagen(_imagen7) : { src:'' },
				altoImagen: Number(_altoImagen7),
				formaRepeticion: _formaRepeticion7,
				repeticiones: Number(_repeticiones7),
				separacion: Number(_separacion7),
				separaciony: Number(_separaciony7)
				}
		 }

		 if(_pictoricos > 7) {
				repeticiones[7] = {
				imagen: _imagen8 !== '' ? buscarImagen(_imagen8) : { src:'' },
				altoImagen: Number(_altoImagen8),
				formaRepeticion: _formaRepeticion8,
				repeticiones: Number(_repeticiones8),
				separacion: Number(_separacion8),
				separaciony: Number(_separaciony8)
				}
		 }

		 return repeticiones;
	}

	function dibujaRepeticionVertical(repeticion) {
		 var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
		 var yStart = container.height/2 - (repeticion.repeticiones * repeticion.altoImagen + (repeticion.repeticiones-1) * repeticion.separacion)/2; 
		 for(var i = 0, x = xStart, y; i < repeticion.repeticiones; i++){
				y = yStart + (i * repeticion.altoImagen) + (i * repeticion.separacion);
				ctx.drawImage(repeticion.imagen, x, y, width, repeticion.altoImagen);
		 }
		 return x+width+_separacion;
	}

	function dibujaRepeticionHorizontal(repeticion){
		 var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
		 for(var i = 0,x,y; i < repeticion.repeticiones; i++) {
				x = xStart + (i * repeticion.separacion) + (i * width);
				y = container.height/2 - repeticion.altoImagen/2;
				ctx.drawImage(repeticion.imagen, x, y, width, repeticion.altoImagen);
		 }
		 return x+width+_separacion;
	}

	function dibujaRepeticionHorizontalVertical(repeticion) {
		 var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
		 var yPrimera;
		 if(repeticion.repeticiones < 6) {
				yPrimera = container.height/2-repeticion.altoImagen/2;
		 } else {
				var heightTotal = repeticion.altoImagen + (repeticion.repeticiones-6)*repeticion.separacion + width*(repeticion.repeticiones-5);
				yPrimera = container.height/2-heightTotal/2;
		 }
		 for(var i = 0, x, x2, y2; i < repeticion.repeticiones; i++){
				if(i >= 6) {
					 x2 = xStart;
					 y2 = yPrimera + repeticion.separacion*(i-5) + width*(i-5) + repeticion.altoImagen;
					 ctx.save();
					 ctx.translate(x2,y2);
					 ctx.rotate(-Math.PI/2);
					 ctx.drawImage(repeticion.imagen, 0, 0, width, repeticion.altoImagen);
					 ctx.restore();
				} else {
					 x = (width * i) + (repeticion.separacion * i) + xStart;
					 ctx.drawImage(repeticion.imagen, x, yPrimera, width, repeticion.altoImagen);
				}
		 }
		 return x+width+_separacion;
	}

	function dibujaRepeticionDiagonal(repeticion) {
		 var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
		 for(var i = 0, x, y, height; i < repeticion.repeticiones; i++) {
				x = xStart + i * repeticion.separacion;
				height = repeticion.altoImagen + (repeticion.repeticiones-1) * repeticion.separaciony;
				y = (container.height/2)-(height/2)+(i*repeticion.separaciony);
				ctx.drawImage(repeticion.imagen, x, y, width, repeticion.altoImagen);
		 }
		 return x+width+_separacion;
	}

	function dibujaRepeticionDiagonalApilado(repeticion) {
		 var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
		 for(var i = 0, x, y, height; i < repeticion.repeticiones; i++) {
				x = i <= 4 ? 
					 xStart + i * repeticion.separacion : 
					 xStart + width + (5 * repeticion.separacion) + ((i-5) * repeticion.separacion);
				if(repeticion.repeticiones <= 5) { // solo hay una pila
					 height = repeticion.altoImagen + (repeticion.repeticiones-1) * repeticion.separaciony;
					 y = (container.height/2)-(height/2)+(i*repeticion.separaciony);
				} else { // hay dos pilas
					 if(i <= 4) {
							height = repeticion.altoImagen + 4 * repeticion.separaciony;
							y = (container.height/2)-(height/2)+(i*repeticion.separaciony);
					 } else {
							height = repeticion.altoImagen + (repeticion.repeticiones-5) * repeticion.separaciony;
							y = (container.height/2)-(height/2)+((i-4)*repeticion.separaciony);
					 }
				}
				ctx.drawImage(repeticion.imagen, x, y, width, repeticion.altoImagen);
		 }
		 return x+width+_separacion;
	}

	function dibujaRepeticionDado(repeticion) {
		 var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
		 var x = 0;
		 switch(repeticion.repeticiones) {
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
		 console.log(x);
		 return x+width+_separacion;

		 function dibujaBloqueEnPosicionNueve(posicion, imagen, altoImagen, separacion) { //posicion 1-9
				var width = imagen.width * altoImagen / imagen.height;
				var x, y;
				if(posicion==1 || posicion==4 || posicion==7) {
					 x = xStart;
				} else if(posicion==2 || posicion==5 || posicion==8) {
					 x = separacion+width+xStart;
				} else {
					 x = separacion*2+width*2+xStart;
				}
				if(posicion==1 || posicion==2 || posicion==3) {
					 y = container.height/2 - altoImagen/2 - separacion - altoImagen;
				} else if(posicion==4 || posicion==5 || posicion==6) {
					 y = container.height/2 - altoImagen/2;
				} else {
					 y = container.height/2 + altoImagen/2 + separacion;
				}
				ctx.drawImage(imagen, x, y, width, altoImagen);
				return x;
		 }

		 function dibujaBloqueEnPosicionCuatro(posicion, imagen, altoImagen, separacion) {
				var width = imagen.width * altoImagen / imagen.height;
				var x, y;
				if(posicion==1 || posicion==3) {
					 x = xStart;
				} else {
					 x = separacion+width+xStart;
				}
				if(posicion==1 || posicion==2) {
					 y = container.height/2 - altoImagen - separacion/2;
				} else {
					 y = container.height/2 + separacion/2;
				}
				ctx.drawImage(imagen, x, y, width, altoImagen);
				return x;
		 }

		 function dibujaBloqueEnPosicionUno(imagen, altoImagen) {
				var width = imagen.width * altoImagen / imagen.height;
				var x = xStart;
				var y = container.height/2-altoImagen/2;
				ctx.drawImage(imagen, x, y, width, altoImagen);
				return x;
		 }
	}
}