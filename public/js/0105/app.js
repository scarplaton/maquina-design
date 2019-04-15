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
		{ id:'Recta Numérica', action:rectNumFn },
		{ id:'Tabla Posicional', action:tablaPosicional },
		{ id:'Valor Posicional', action:valorPosicional },
		{ id:'Repetición Pictóricos', action:repeticionPic }
	]},{ name:'Medicion', tag:'medicion', fns:[
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
		contenidoHtml += `<div class="col-md-${m.width.md} col-sm-${m.width.sm} col-${m.width.xs} tag">`
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

	var contenidoRespuestas =  contenidoBody['r'].filter((item) => { //respuestas que deben estar en forma de imagen seleccionable
		if(item.tag != 'general') {
			return true;
		} else {
			return item.name === 'Insertar Imagen' || item.name === 'Insertar Tabla';
		}
	});
	if(contenidoRespuestas.length > 0) {
		contenidoRespuestas = shuffle(contenidoBody['r'], 5);
		contenidoRespuestas.forEach(function(item, index){
				console.log(item);
				var dataContent = { 
					feedback: regex(item.params.feed, versionBody.vars, false),
					respuesta: `Opción ${index+1}`, 
					errFrec: item.params.errFrec === '' ? null : item.params.errFrec
				};
				respuestaHtml += `<div class="col-md-${item.params.colmd} col-sm-${item.params.colsm} col-${item.params.col}">
					<div class="radio-div" onclick="seleccionaImagenRadio(event, 'label${index}')">
						${
							item.tag != 'general' ? 
							`<canvas class="img-fluid" id="container-r${index}"></canvas>` :
							`<div id="container-r${index}" class="general"></div>`
						}
						<input id="rbtn${index}" name="answer" value="Opción ${index+1}" type="radio" data-content='${JSON.stringify(dataContent)}' onchange="cambiaRadioImagen(event)"/>
						<label for="rbtn${index}" id="label${index}">Opción ${index+1}</label>
					</div>
				</div>`;
		});
	} else {
		contenidoBody['r'].forEach(function(item, index){
			console.log(item);
			respuestaHtml += `<div class="col-md-${item.width.md} col-sm-${item.width.sm} col-${item.width.xs} tag">`
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
		glosaHtml += `<div class="col-md-${m.width.md} col-sm-${m.width.sm} col-${m.width.xs} tag">`
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
	const { src, display, height, width, col, colsm, colmd, offsetsm, offsetmd, errFrec, feed } = params;
	var source;
	try {
		var vars = vt ? variables : versions;
		var relativePath =  src.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../');
		source = regex(relativePath, vars, vt);
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
	const { container, params, variables, versions, vt } = config, { table, cssclases, encabezado, lineasHorizontales, estiloLineaHorizontal } = params, vars = vt ? variables : versions
	if (container) {
		let r = `<table class="tabla ${cssclases}"><tbody>`;
		for(var row = 0; row < table.length; row++) {
			if(lineasHorizontales === '') {
				r += '<tr>';
			} else {
				r += String(lineasHorizontales).split(',').includes(String(row+1)) ? `<tr style="border-bottom: ${estiloLineaHorizontal};">` : '<tr>';
			}
			for(var col = 0; col < table[row].length; col++) {
				r+= '<td>';
				switch(table[row][col].type) {
					case 'text':
						var tachado = table[row][col].value.tachar === 'si' ? 
							//`style="background: linear-gradient(to left top, transparent 47.75%, #ff0000, #ff0000, transparent 52.25%);"` : '';
							`class="strikethrough"` : '';
						if(encabezado==='arriba' && row === 0) {
							r+= `<p ${tachado}><b>${regexFunctions(regex(table[row][col].value.text, vars, vt))}</b></p>`;
						} else if(encabezado==='izquierda' && col === 0) {
							r+= `<p ${tachado}><b>${regexFunctions(regex(table[row][col].value.text, vars, vt))}</b></p>`;
						} else {
							r+= `<p ${tachado}>${regexFunctions(regex(table[row][col].value.text, vars, vt))}</p>`;
						}
						break;
          case 'image':
            var relativePath =  table[row][col].value.url.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../');
						r+= `<img src=${regex(relativePath, vars, vt)} height=${table[row][col].value.height} width=${table[row][col].value.width}/>`;
						break;
					case 'input':
						var { tipoInput, maxLength, error0, error2, error3, error4, defaultError,
							feed0, feed1, feed2, feed3, feed4, defaultFeed,
							value1, value2, value3, value4 } = table[row][col].value;
						var feedGenerico = regex(feed0, vars, vt);
						var answers = [{
							respuesta: regex(value1, vars, vt),
							feedback: regex(feed1, vars, vt),
							errFrec: null
						}];
						if(value2 !== '') {
							answers[1] = {
								respuesta: regex(value2, vars, vt),
								feedback: feed0 === '' ? regex(feed2, vars, vt) : feedGenerico,
								errFrec: error0 === '' ? error2 : error0
							}
						}
						if(value3 !== '') {
							answers[2] = {
								respuesta: regex(value3, vars, vt),
								feedback: feed0 === '' ? regex(feed3, vars, vt) : feedGenerico,
								errFrec: error0 === '' ? error3 : error0
							}
						}
						if(value4 !== '') {
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
						switch(tipoInput) {
							case 'text':
								r+= `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputTexto(event)" />`;
								break;
							case 'numero':
								r+= `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />`;
								break;
							case 'alfanumerico':
								r+= `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputAlfanumerico(event)"/>`;
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
						if(value2 !== '') {
							answers[1] = {
								respuesta: regex(value2, vars, vt),
								feedback: feed0 === '' ? regex(feed2, vars, vt) : feedGenerico,
								errFrec: error0 === '' ? error2 : error0
							}
						}
						if(value3 !== '') {
							answers[2] = {
								respuesta: regex(value3, vars, vt),
								feedback: feed0 === '' ? regex(feed3, vars, vt) : feedGenerico,
								errFrec: error0 === '' ? error3 : error0
							}
						}
						if(value4 !== '') {
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
						switch(tipoInput) {
							case 'text':
								input = `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputTexto(event)" />`;
								break;
							case 'numero':
								input = `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />`;
								break;
							case 'alfanumerico':
								input = `<input type="text" name="answer" maxlength="${maxLength}" autocomplete="off" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputAlfanumerico(event)"/>`;
								break;
						}
						r+= `<p>${p.replace('{input}', input)}</p>`;
						break;
					case 'text-image':
            var p = regex(table[row][col].value.text, vars, vt);
            var relativePath =  table[row][col].value.url.replace('https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/', '../../../../');
						var img = `<img src=${regex(relativePath, vars, vt)} height=${table[row][col].value.height} width=${table[row][col].value.width}/>`;
						
						p = `<p>${p.replace('{imagen}', img)}</p>`
						r += regexFunctions(p)
						break;
				}
				r+= '</td>';
			}
			r += '</tr>'
		}
		r += '</tbody></table>';
		container.classList.add("table-responsive");
		container.innerHTML = r;
	}
}

function rectNumFn(config) {
  const { container, params, variables, versions, vt } = config

  const {
    // General
    rectType, decimalScale,height, width, /*background,*/
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
    showArcs, initArcPt, endArcPt,showConstant,
    // Mini Escala
    showMiniScale, showMiniTheValue, showMiniExValues, showMiniAllValues,
    showMiniPointValue, showMiniFig, wichMiniFigValues, showMiniArcs,
    initArcPtMini, endArcPtMini, showMiniGuides, showLens, alignLens,
    // Ejes
    axisColor, withArrows, axisWidth,
    // Fuente
    fontColor, fontSize, fontFamily, fontWeight
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
    width: c.width < 500 ? eval(scaleWidth)*0.6 : eval(scaleWidth),
    color: scaleColor,
    length: c.width < 500 ? eval(scaleLength)*0.7 : eval(scaleLength)
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
      values: wichFigValues
    },
    arcs: {
      show: showArcs !== 'no' ? showArcs : false,
      values : {
        init: regex(initArcPt, vars, vt),
        end: regex(endArcPt, vars, vt),
        constant: showConstant === 'si' ? true : false
      }
    },
    miniScale: {
      show: (rectType !== 'enteros' && rectType !== 'mixta') && showMiniScale === 'si' ? true : false,
      extValues: showMiniExValues === 'si' ? true: false,
      allValues: showMiniAllValues === 'si' ? true: false,
      theValue: showMiniTheValue,
      point: showMiniPointValue === 'si' ? true: false,
      figure: {
        show: showMiniFig === 'no' ? false : showMiniFig,
        values: wichMiniFigValues
      },
      arcs: {
        show: showMiniArcs !== 'no' ? showMiniArcs : false,
        init: initArcPtMini,
        end: endArcPtMini
      },
      guides: showMiniGuides === 'si' ? true: false,
      lens: {
        show: showLens === 'si' ? true : false,
        align: alignLens === 'punto' ? true : false
      }
    }
  }
  state.font = {
    family: fontFamily,
    weight: fontWeight,
    size: c.width < 500 ? eval(fontSize)*0.6 : eval(fontSize),
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
      top: c.height*(canvasPaddingAux.top/1000),
      right: c.width*(canvasPaddingAux.right/1000),
      bottom: c.height*(canvasPaddingAux.bottom/1000),
      left: c.width*(canvasPaddingAux.left/1000)
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
      top: c.height*(containerPaddingAux.top/1000),
      right: c.width*(containerPaddingAux.right/1000),
      bottom: c.height*(containerPaddingAux.bottom/1000),
      left: c.width*(containerPaddingAux.left/1000)
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
      top: c.height*(chartPaddingAux.top/1000),
      right: c.width*(chartPaddingAux.right/1000),
      bottom: c.height*(chartPaddingAux.bottom/1000),
      left: c.width*(chartPaddingAux.left/1000)
    },
    axis: {
      width: c.width < 500 ? eval(axisWidth)*0.6 : eval(axisWidth),
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

  let mainData = {
    pointsData: ptosPrincipales(state),
    pointsDataMini: ptosPrincipalesMini(state)
  }
  // dibujarBordes(state, state.canvas, 'red') // Canvas
  // dibujarBordes(state, state.container, 'blue') // Container
  // dibujarBordes(state, state.chart, 'green') // Chart

  init(state, mainData)
}

// Dibuja los espacios definidos, container, chart
/*
function dibujarBordes(state, el, color) {
  const { ctx } = state
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.rect(el.position.x0, el.position.y0, el.position.x1 - el.position.x0, el.position.y1 - el.position.y0)
  ctx.stroke()
  ctx.restore()
  ctx.save()
}
*/

function ptosPrincipales(state) {
  const { typeRect, chart, show, scale } = state
  const { x0, y0, x1, y1 } = chart.position
  let centroY = (y1 - y0)/2 + y0
  if (show.miniScale.show && !(typeRect === 'centesimal' || typeRect === 'mixta centesimal')) {
    centroY = (y1 - y0)/4 + y0
  }
  let segmento = (x1 - x0)/(scale.divisions + 2)
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
  let margenEje = contenedorAncho/8
  let xIniEje = x0 + margenEje
  let xFinEje = x1 - margenEje
  let ejeAncho = xFinEje - xIniEje
  let segmento = ejeAncho/(divisiones + 2)
  let xIniRecta = xIniEje + segmento
  let xFinRecta = xFinEje - segmento
  
  let centroY = (y1 - y0)*3/4 + y0
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
  const { guides,  lens } = show.miniScale
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
          posIniGuia = Number(((miniValMin - valMin)*10).toFixed(0))
          posFinGuia = posIniGuia + 1
        }
      }
    }
    if (miniVal >= valMin && miniVal <= valMax) {
      puntoXIni = pointsData.recta.xIni + pointsData.recta.segmento*posIniGuia
      puntoXFin = pointsData.recta.xIni + pointsData.recta.segmento*posFinGuia
    }



    let miniPuntoXIni = mainData.pointsDataMini.recta.xIni
    let miniPuntoXFin = mainData.pointsDataMini.recta.xFin
    let miniPuntoY = mainData.pointsDataMini.recta.centroY
    let delta = scale.length*2
    let puntoY = miniPuntoY - mainData.pointsData.recta.centroY - scale.length*2 - font.size*2.3
    guides && dibujarLinea(state, miniPuntoXIni, miniPuntoXFin, miniPuntoY, puntoXIni, puntoXFin, puntoY, delta)
    lens.show && dibujarLente(state, puntoXIni, puntoXFin, puntoY, pointsData.recta.segmento)
    // xIni, xFin, centroY, segmento
    function dibujarLinea(state, miniPuntoXIni, miniPuntoXFin, miniPuntoY, puntoXIni, puntoXFin, puntoY, delta) {
      const { ctx, scale, font } = state
      ctx.lineWidth = scale.width*2/3
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
      let factorImg = (129/191)
      let imageWidth = imgWidth*2.2
      let imageHeight = imageWidth*factorImg
      let centerX, centerY
      centerY = puntoY - imageHeight*0.38
      centerX = puntoXIni - imgWidth/2.2
      img.onload = function() {
        // img.width = imgWidth
        // img.height = imgWidth*factorImg
        ctx.translate(centerX + imageWidth/2, centerY + imageHeight/2)
        ctx.rotate(60*Math.PI/180)
        ctx.drawImage(img,-imageWidth/2,-imageHeight/2, imageWidth, imageHeight)
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
    let x = (canvas.position.x1)/2 + mainTitle.move.moveX + canvas.position.x0
    let y = 0 + canvas.position.y0 + mainTitle.move.moveY
    ctx.translate(x,y)
    ctx.fillStyle = mainTitle.color
    ctx.textAlign = mainTitle.alignX
    ctx.textBaseline = mainTitle.alignY
    ctx.font = mainTitle.font.weight + ' ' + mainTitle.font.size + 'px ' + mainTitle.font.family
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
  let arrowsLenght = scale.length*0.7
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
    let xPos = xIni + segmento*i
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
      for (let j = 1; j < 10; j ++) {
        let extraLarge = j === 5 ? bordersScales*0.2 : 0
        let xPos = xIni + segmento*i + segmento/10*j
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(xPos, centroY - bordersScales*0.7 - extraLarge)
        ctx.lineTo(xPos, centroY + bordersScales*0.7 + extraLarge)
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
  const { extValues, firstValue, allValues, points, figures, arcs } = show
  const { xIni, centroY, segmento, divisiones } = dataRecta
  for (let i = 0; i <= divisiones; i++) {
    let xPos = xIni + segmento*i
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
  }  
}

function mostrarDatosEjeSec(state, dataRecta) {
  const { show, scale } = state
  const { miniScale } = show
  const { theValue, extValues, allValues, point, figure, arcs } = miniScale
  const { xIni, centroY, segmento } = dataRecta

  //console.log(miniScale)
  let centroYNum = centroY + scale.length*1.7
  let valor = Number(theValue)
  for (let i = 0; i <= 10; i++) {
    let xPos = xIni + segmento*i
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
      let arcoRadio = segmento/2
      dibujarArco(state, x + arcoRadio, y - arcoRadio/2, arcoRadio, true)
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
      let diamondSize = grande ? font.size*1.4 : font.size*1.2
      let diamondW = diamondSize
      let diamondH = diamondW*1.3
      let yDist = scale.length*1.5
      if (figure.show !== 'abajo') {
        yDist -= (scale.length*1.5*2 + diamondH)
      } else {
        if (allValues) {
          yDist += (typeRect === 'mixta' || typeRect === 'mixta decimal' || typeRect === 'mixta centesimal') ?  font.size*2.3 : font.size*2
        }
      }
      ctx.strokeStyle = scale.color
      ctx.fillStyle = font.color
      ctx.fillStyle = '#dbac04'
      ctx.strokeStyle = '#dbac04'
      ctx.beginPath()
      ctx.moveTo(xPos, centroY + yDist)
      ctx.lineTo(xPos + diamondW/2, centroY + diamondH/2 + yDist)
      ctx.lineTo(xPos, centroY + diamondH + yDist)
      ctx.lineTo(xPos - diamondW/2, centroY + diamondH/2 + yDist)
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
      valor = eval(valor) + index*scale.value
      valor = valor.toString()
      valor = valor.split('.') ? valor.split('.')[0] : valor
      break;
    case 'enteros con decimales':
      valor = eval(valor) + index*scale.value 
      valor = valor.toFixed(2), valor = valor.toString()
      if (valor.split('.')[1].toString()) {
        valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0,1)}`
      } else {
        valor = `${valor.split('.')[0]}.0`
      }
      break;
    case 'decimal':
      valor = eval(valor) + index*scale.value/10
      valor = valor.toString()
      if (valor.split('.')[1]) {
        valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0,1)}`
      } else {
        valor = `${valor.split('.')[0]}.0`
      }
      break;
    case 'centesimal':
      valor = (eval(valor) + index*scale.value/100).toFixed(2)
      valor = valor.toString()
      valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0,2)}`
      break;
    case 'mixta':
      valor = eval(valor) + index*scale.value/10
      valor = valor.toFixed(2), valor = valor.toString()
      if (valor.split('.')[1]) {
        valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0,1)}`
      } else {
        valor = `${valor.split('.')[0]}.0`
      }
      break;
    case 'mixta decimal':
      valor = eval(valor) + index*scale.value/10
      valor = valor.toFixed(2), valor = valor.toString()
      if (valor.split('.')[1]) {
        valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0,2)}`
      } else {
        valor = `${valor.split('.')[0]}.00`
      }
      break;
    case 'mixta centesimal':
      valor = (eval(valor) + index*scale.value/100).toFixed(2)
      valor = valor.toString()
      valor = `${valor.split('.')[0]}.${valor.split('.')[1].toString().substring(0,2)}`
      break;
  }
  return valor
}

/* ------------------------ MOSTRAR DATOS  ------------------------- */

function mostrarValorExterno(state, x, y, index, valor) {
  const { typeRect, scale } = state
  y += (typeRect === 'mixta' || typeRect === 'mixta decimal' || typeRect === 'mixta centesimal') ? scale.length*2 : scale.length*1.7
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
  y += (typeRect === 'mixta' || typeRect === 'mixta decimal' || typeRect === 'mixta centesimal') ? scale.length*2 : scale.length*1.7
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
    let valorAuxFin = eval(valor.split('.')[1][0]) === 9 ? `${eval(valor.split('.')[0])+1}.0` : `${valor.split('.')[0]}.${eval(valor.split('.')[1][0])+1}`
    if (arrValores[0] !== '') {
      arrValores.forEach( el => {
        if (eval(el) !== NaN && el.split('.')[1]) {
          valor = eval(valor), valorAuxIni = eval(valorAuxIni), valorAuxFin = eval(valorAuxFin)
          if (eval(el) >= valorAuxIni && eval(el) <= valorAuxFin) {
            if (eval(el) === valorAuxIni) {
              dibujarPunto(state, x, y, true)
            } else {
              let delta = eval(el.split('.')[1][1])*segmento/10
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
    let valorAuxFin = eval(valor.split('.')[1][0]) === 9 ? `${eval(valor.split('.')[0])+1}.0` : `${valor.split('.')[0]}.${eval(valor.split('.')[1][0])+1}`
    if (arrValores[0] !== '') {
      arrValores.forEach( el => {
        if (eval(el) !== NaN && el.split('.')[1]) {
          valor = eval(valor), valorAuxIni = eval(valorAuxIni), valorAuxFin = eval(valorAuxFin)
          if (eval(el) >= valorAuxIni && eval(el) <= valorAuxFin) {
            if (eval(el) === valorAuxIni) {
              dibujarRombo(state, x, y, valor, true)
            } else {
              let delta = eval(el.split('.')[1][1])*segmento/10
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
  let maximoValorEscala = eval(chart.values.initValue) + scale.divisions*scale.value
  let arcoRadio = segmento/2
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
        maximoValorEscala = eval(chart.values.initValue) + scale.divisions*scale.value/10
        valorHasta = eval(valorHasta) < maximoValorEscala ? eval(valorHasta) : maximoValorEscala
        valorDesde = valorDesde.toString().split('.')[0] ? eval(`${(valorDesde.toString().split('.')[0])}.${(valorDesde.toString().split('.')[1][0])}`) : valorDesde
        valorHasta = valorHasta.toString().split('.')[0] ? eval(`${(valorHasta.toString().split('.')[0])}.${(valorHasta.toString().split('.')[1][0])}`) : valorHasta
      }
    }
    valor = eval(valor)
    if (valor >= valorDesde && valor < valorHasta) {
      
      dibujarArco(state, xPos + arcoRadio, centroY, arcoRadio)
      if(constante) {
        ctx.fillStyle = '#A84C4E';
        ctx.textAlign = "center"; 
        ctx.font = '15px Helvetica';
        ctx.fillText(`+${scale.value}`, xPos + arcoRadio, centroY-arcoRadio-10);
      }
    }
  }
}

/* ------------------------ DIBUJOS ------------------------- */

function dibujarPunto(state, x, y, grande) {
  const { ctx, scale, chart, font } = state
  ctx.save()
  let arcoRadio = grande ? scale.length/2 : scale.length/3
  ctx.fillStyle = font.color
  ctx.lineWidth = grande ? scale.width*0.6 : scale.width*0.5
  ctx.strokeStyle = chart.axis.color
  ctx.beginPath()
  ctx.arc(x, y, arcoRadio,0,360*Math.PI/180)
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
  let diamondSize = grande ? font.size*1.4 : font.size*1.2
  let diamondW = diamondSize
  let diamondH = diamondW*1.3
  let yDist = scale.length*1.5
  if (figures.show !== 'abajo') {
    yDist -= (scale.length*1.5*2 + diamondH)
  } else {
    let incluVal = allValues.show === 'mostrar' && allValues.values.includes((valor).toString())
    let noIncluVal = allValues.show === 'ocultar' && !allValues.values.includes((valor).toString())
    if (allValues.show === 'todos' || incluVal || noIncluVal ) {
      yDist += (typeRect === 'mixta' || typeRect === 'mixta decimal' || typeRect === 'mixta centesimal') ?  font.size*2.3 : font.size*2
    }
  }
  ctx.strokeStyle = scale.color
  ctx.fillStyle = font.color
  ctx.fillStyle = '#dbac04'
  ctx.strokeStyle = '#dbac04'
  ctx.beginPath()
  ctx.moveTo(xPos, centroY + yDist)
  ctx.lineTo(xPos + diamondW/2, centroY + diamondH/2 + yDist)
  ctx.lineTo(xPos, centroY + diamondH + yDist)
  ctx.lineTo(xPos - diamondW/2, centroY + diamondH/2 + yDist)
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
  let iniAngulo = 220*Math.PI/180
  let finAngulo = 320*Math.PI/180
  ctx.arc(x, y, arcoRadio, iniAngulo, finAngulo)
  let xDist, ladoDib
  ladoDib = -(arcoRadio)*Math.cos(40*Math.PI/180)
  xDist = -arcoRadio*0.3
  if (direccion) {
    xDist *= -1
    ladoDib *= -1
  }
  ctx.moveTo(x + ladoDib, y - (arcoRadio)*Math.sin(40*Math.PI/180) - arcoRadio*0.3)
  ctx.lineTo(x + ladoDib, y - (arcoRadio)*Math.sin(40*Math.PI/180))
  ctx.lineTo(x + ladoDib - xDist, y - (arcoRadio)*Math.sin(40*Math.PI/180))
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
  ctx.font = font.size*multSize + 'px ' + font.family
  ctx.fillText(espacioMiles(valor), x, y)
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
  ctx.font = font.size*multSize + 'px ' + font.family
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
  ctx.font = font.size*multSize + 'px ' + font.family
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
  ctx.font = font.size*multSize + 'px ' + font.family
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
  ctx.font = font.size*multSize + 'px ' + font.family
  ctx.textAlign = 'right'
  let enteroTextLength = ctx.measureText(valorUnidad).width
  let enteroPosX = x - enteroTextLength/4
  let centroY = y + font.size*multSize/2
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

  let numberFontSize = Number(font.size*multSize*0.8)
  ctx.font = numberFontSize + 'px ' + font.family
  let denominadorTextLength
  denominadorTextLength = ctx.measureText(denominador).width
  ctx.strokeStyle = scale.color
  ctx.lineWidth = font.size/8
  ctx.lineCap = 'round'
  let deltaYLine = font.size/16 + 1
  ctx.beginPath()
  ctx.moveTo(enteroPosX + 1, centroY - deltaYLine)
  ctx.lineTo(x + denominadorTextLength + 2, centroY - deltaYLine)
  ctx.stroke()
  ctx.closePath()
  let centroX = x + (denominadorTextLength)/2

  ctx.textAlign = 'center'
  //ctx.textBaseline = 'bottom'
  let deltaYFraccion = numberFontSize/2
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
  ctx.font = font.size*multSize + 'px ' + font.family
  ctx.textAlign = 'right'
  let enteroTextLength = ctx.measureText(valorUnidad).width
  let enteroPosX = x - enteroTextLength/4
  let centroY = y + font.size*multSize/2
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

  let numberFontSize = Number(font.size*multSize*0.8)
  ctx.font = numberFontSize + 'px ' + font.family
  let denominadorTextLength
  denominadorTextLength = ctx.measureText(denominador).width
  ctx.strokeStyle = scale.color
  ctx.lineWidth = font.size/8
  ctx.lineCap = 'round'
  let deltaYLine = font.size/16 + 1
  ctx.beginPath()
  ctx.moveTo(enteroPosX + 1, centroY - deltaYLine)
  ctx.lineTo(x + denominadorTextLength + 2, centroY - deltaYLine)
  ctx.stroke()
  ctx.closePath()
  let centroX = x + (denominadorTextLength)/2
  let deltaYFraccion = numberFontSize/2
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
  denominador = scale.divisions*10
  ctx.textBaseline = 'middle'
  ctx.font = font.size*multSize + 'px ' + font.family
  ctx.textAlign = 'right'
  let enteroTextLength = ctx.measureText(valorUnidad).width
  let enteroPosX = x - enteroTextLength/4
  let centroY = y + font.size*multSize/2
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

  let numberFontSize = Number(font.size*multSize*0.8)
  ctx.font = numberFontSize + 'px ' + font.family
  let denominadorTextLength
  denominadorTextLength = ctx.measureText(denominador).width
  ctx.strokeStyle = scale.color
  ctx.lineWidth = font.size/8
  ctx.lineCap = 'round'
  let deltaYLine = font.size/16 + 1
  ctx.beginPath()
  ctx.moveTo(enteroPosX + 1, centroY - deltaYLine)
  ctx.lineTo(x + denominadorTextLength + 2, centroY - deltaYLine)
  ctx.stroke()
  ctx.closePath()
  let centroX = x + (denominadorTextLength)/2
  let deltaYFraccion = numberFontSize/2
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

function tablaPosicional(config) {
  const { container, params, variables, versions, vt } = config;
  var imgSrcFlechaAbajo = '../../../../imagenes_front/tablas_posicionales/flecha_fija.svg';
  var imgSrcSignoMas = '../../../../imagenes_front/tablas_posicionales/num_sig_mas.svg';
  var srcFuente = '../../../../fonts/LarkeNeueThin.ttf';
  //× => ALT+158
  var {_width,_tipoTabla, /*puede ser 'centenas' o 'miles'*/_pisosTabla, /*pueden ser 'uno', 'dos', 'tres'*/_separacionElementos,
_tipoPisoUno,_repeticionPictoricaPisoUno,_umilPisoUno,_centenaPisoUno,_decenaPisoUno,_unidadPisoUno,_altoTextoPisoUno, /*numerico , imagenes, repeticion*/
_tipoPisoDos,_repeticionPictoricaPisoDos,_umilPisoDos,_centenaPisoDos,_decenaPisoDos,_unidadPisoDos,_altoTextoPisoDos,
_tipoPisoTres,_repeticionPictoricaPisoTres,_umilPisoTres,_centenaPisoTres,_decenaPisoTres,_unidadPisoTres,_altoTextoPisoTres,
_dibujaValorPosicional1,_altoTextoValorPosicional1,_umilVP1,_centenaVP1,_decenaVP1,_unidadVP1,
_dibujaValorPosicional2,_altoTextoValorPosicional2,_umilVP2,_centenaVP2,_decenaVP2,_unidadVP2,
_dibujaTextoResultado,_altoTextoResultado,_resultado} = params;

  var vars = vt ? variables : versions;
  try {
    _umilPisoUno = regex(_umilPisoUno, vars, vt);
    _centenaPisoUno = regex(_centenaPisoUno, vars, vt);
    _decenaPisoUno = regex(_decenaPisoUno, vars, vt);
    _unidadPisoUno = regex(_unidadPisoUno, vars, vt);

    _umilPisoDos = regex(_umilPisoDos, vars, vt);
    _centenaPisoDos = regex(_centenaPisoDos, vars, vt);
    _decenaPisoDos = regex(_decenaPisoDos, vars, vt);
    _unidadPisoDos = regex(_unidadPisoDos, vars, vt);

    _umilPisoTres = regex(_umilPisoTres, vars, vt);
    _centenaPisoTres = regex(_centenaPisoTres, vars, vt);
    _decenaPisoTres = regex(_decenaPisoTres, vars, vt);
    _unidadPisoTres = regex(_unidadPisoTres, vars, vt);

    _umilVP1 = regex(_umilVP1, vars, vt);
    _centenaVP1 = regex(_centenaVP1, vars, vt);
    _decenaVP1 = regex(_decenaVP1, vars, vt);
    _unidadVP1 = regex(_unidadVP1, vars, vt);

    _umilVP2 = regex(_umilVP2, vars, vt);
    _centenaVP2 = regex(_centenaVP2, vars, vt);
    _decenaVP2 = regex(_decenaVP2, vars, vt);
    _unidadVP2 = regex(_unidadVP2, vars, vt);

    _resultado = regex(_resultado, vars, vt);
  } catch(error) {
    console.log(error);
  }
  let datosEjercicio = {};
  datosEjercicio.tabla = {};
  datosEjercicio.tabla.configuracion = {
    tipoTabla: _tipoTabla,
    pisosTabla: Number(_pisosTabla)
  }
  datosEjercicio.tabla.detallePisos = [{
    tipo: _tipoPisoUno, //tipo piso uno
    tipoRepeticion: _repeticionPictoricaPisoUno,
    umil: _umilPisoUno,
    centena: _centenaPisoUno,
    decena: _decenaPisoUno,
    unidad: _unidadPisoUno,
    altoTexto: _altoTextoPisoUno
  }]
  if (datosEjercicio.tabla.configuracion.pisosTabla > 1) {
    datosEjercicio.tabla.detallePisos[1] = {
      tipo: _tipoPisoDos,
      tipoRepeticion: _repeticionPictoricaPisoDos,
      umil: _umilPisoDos,
      centena: _centenaPisoDos,
      decena: _decenaPisoDos,
      unidad: _unidadPisoDos,
      altoTexto: _altoTextoPisoDos
    }
  }
  if (datosEjercicio.tabla.configuracion.pisosTabla > 2) {
    datosEjercicio.tabla.detallePisos[2] = {
      tipo: _tipoPisoTres,
      tipoRepeticion: _repeticionPictoricaPisoTres,
      umil: _umilPisoTres,
      centena: _centenaPisoTres,
      decena: _decenaPisoTres,
      unidad: _unidadPisoTres,
      altoTexto: _altoTextoPisoTres
    }
  }
  datosEjercicio.valoresPosicionales = [];

  if (_dibujaValorPosicional1 === 'si') {
    datosEjercicio.valoresPosicionales[0] = {
      mostrar: _dibujaValorPosicional1,
      altoTexto: Number(_altoTextoValorPosicional1), //alto del texto de los valores posicionales
      numeros: {//numeros que se muestran debajo de la tabla en forma de suma
        umil: _umilVP1,
        centena: _centenaVP1,
        decena: _decenaVP1,
        unidad: _unidadVP1
      }
    }
  }

  if (_dibujaValorPosicional2 === 'si') {
    datosEjercicio.valoresPosicionales[1] = {
      mostrar: _dibujaValorPosicional2,
      altoTexto: Number(_altoTextoValorPosicional2), //alto del texto de los valores posicionales
      numeros: {//numeros que se muestran debajo de la tabla en forma de suma
        umil: _umilVP2,
        centena: _centenaVP2,
        decena: _decenaVP2,
        unidad: _unidadVP2
      }
    }
  }

  datosEjercicio.resultado = {
    mostrar: _dibujaTextoResultado,
    numero: _resultado, //numero del valor final centrado (puede ser texto o  numero)
    altoTexto: Number(_altoTextoResultado) //alto del texto del resultado
  }

  _separacionElementos = Number(_separacionElementos);

  let recursos = cargaRecursos();
  var ctx, yStart = 0;
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
      const { tipo, tipoRepeticion, umil, centena, decena, unidad, altoTexto } = detallePisos[fila];
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
            dibujaRepeticion(numero, fila, columna, tipoRepeticion);
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

    function dibujaRepeticion(numero, fila, columna, tipoRepeticion) {
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
                dibujaRepeticionDado(numero, anchoSeparacion, altoCuadro, image, cx, cy);
              } else if (tipoRepeticion === 'monedas y billetes') {
                dibujaRepeticionDadoBilletes(numero, anchoSeparacion, altoCuadro, image, cx, cy);
              }
              break;
            case 3:
              dibujaRepeticionDado(numero, anchoSeparacion, altoCuadro, image, cx, cy);
              break;
            case 2:
              if (tipoRepeticion === 'bloques') {
                dibujaRepeticionHorizontalVertical(numero, anchoSeparacion, altoCuadro, image, cx, cy);
              } else if (tipoRepeticion === 'monedas y billetes') {
                dibujaRepeticionDado(numero, anchoSeparacion, altoCuadro, image, cx, cy);
              }
              break;
            case 1:
              dibujaRepeticionDado(numero, anchoSeparacion, altoCuadro, image, cx, cy);
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

      function dibujaRepeticionHorizontalVertical(numero, anchoSeparacion, altoCuadro, image, cx, cy) {
        var container = altoCuadro * 0.9;
        var altoImg = container / 2;
        var anchoImg = image.width * altoImg / image.height;
        var separacion = ((container * 0.9) / 2) * 0.3;
        var xStart = cx - ((numero * anchoImg) + ((numero - 1) * separacion)) / 2;
        if (numero <= 6) {
          xStart = cx - ((numero * anchoImg) + ((numero - 1) * separacion)) / 2;
        } else {
          xStart = cx - ((6 * anchoImg) + (5 * separacion)) / 2;
        }
        var yStart = cy - (container / 2);
        for (var i = 0, x, y; i < numero; i++) {
          if (i <= 5) {
            x = xStart + (anchoImg * i) + (separacion * i);
            y = yStart;
            ctx.drawImage(image, x, y, anchoImg, altoImg);
          } else {
            x = cx - (altoImg / 2)
            y = yStart + altoImg + anchoImg + separacion * (i - 6) + anchoImg * (i - 5);
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(-Math.PI / 2);
            ctx.drawImage(image, 0, 0, anchoImg, altoImg);
            ctx.restore();
          }
        }
      }

      function dibujaRepeticionDado(numero, anchoSeparacion, altoCuadro, image, cx, cy) {
        var altoImg = ((altoCuadro * 0.85) / 3) * 0.9;
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

  function muestraValoresPosicionales(valorPosicional, yStart, diviciones, anchoSeparaciones, imgFlechaAbajo, imgSignoMas) {
    ctx.font = `${valorPosicional.altoTexto}pt LarkeNeueThinFuente`;
    ctx.fillStyle = '#F58220';
    ctx.textAlign = 'center';
    var { umil, centena, decena, unidad } = valorPosicional.numeros;
    var numerosValorPosicional = diviciones === 3 ? [centena, decena, unidad] : [umil, centena, decena, unidad];

    for (var i = 1, centroSeccion, centroSeparacion, yTexto; i < diviciones + 1; i++) {
      centroSeccion = (anchoSeparaciones * i) - (anchoSeparaciones / 2);
      centroSeparacion = anchoSeparaciones * i;
      //flecha
      var xFlecha = centroSeccion - (imgFlechaAbajo.width / 2);
      ctx.drawImage(imgFlechaAbajo, xFlecha, yStart);
      //texto
      yTexto = yStart + imgFlechaAbajo.height + _separacionElementos + valorPosicional.altoTexto;
      ctx.fillText(numerosValorPosicional[i - 1], centroSeccion, yTexto);
      //singo mas
      if (i + 1 !== diviciones + 1) {
        var xMas = centroSeparacion - (imgSignoMas.width / 2);
        var yMas = yStart + imgFlechaAbajo.height + _separacionElementos + (valorPosicional.altoTexto / 2) - (imgSignoMas.height / 2)
        ctx.drawImage(imgSignoMas, xMas, yMas);
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
  }];
  //'signo resta', 'signo igual', 'signo mayor', 'signo menor'
  let { _pictoricos, _separacion, heightCanvas, widthCanvas, _tituloCanvas, _canvasBorder, _canvasBorderRadius,
    _imagen1, _altoImagen1, _formaRepeticion1, _repeticiones1, _separacion1, _separaciony1,
    _imagen2, _altoImagen2, _formaRepeticion2, _repeticiones2, _separacion2, _separaciony2,
    _imagen3, _altoImagen3, _formaRepeticion3, _repeticiones3, _separacion3, _separaciony3,
    _imagen4, _altoImagen4, _formaRepeticion4, _repeticiones4, _separacion4, _separaciony4,
    _imagen5, _altoImagen5, _formaRepeticion5, _repeticiones5, _separacion5, _separaciony5,
    _imagen6, _altoImagen6, _formaRepeticion6, _repeticiones6, _separacion6, _separaciony6,
    _imagen7, _altoImagen7, _formaRepeticion7, _repeticiones7, _separacion7, _separaciony7,
    _imagen8, _altoImagen8, _formaRepeticion8, _repeticiones8, _separacion8, _separaciony8,
    _imagen9, _altoImagen9, _formaRepeticion9, _repeticiones9, _separacion9, _separaciony9,
    _imagen10, _altoImagen10, _formaRepeticion10, _repeticiones10, _separacion10, _separaciony10,
    _imagen11, _altoImagen11, _formaRepeticion11, _repeticiones11, _separacion11, _separaciony11,
    _imagen12, _altoImagen12, _formaRepeticion12, _repeticiones12, _separacion12, _separaciony12 } = params;

  var vars = vt ? variables : versions;
  try {
    _repeticiones1 = regex(_repeticiones1, vars, vt);
    _repeticiones2 = regex(_repeticiones2, vars, vt);
    _repeticiones3 = regex(_repeticiones3, vars, vt);
    _repeticiones4 = regex(_repeticiones4, vars, vt);
    _repeticiones5 = regex(_repeticiones5, vars, vt);
    _repeticiones6 = regex(_repeticiones6, vars, vt);
    _repeticiones7 = regex(_repeticiones7, vars, vt);
    _repeticiones8 = regex(_repeticiones8, vars, vt);
    _repeticiones9 = regex(_repeticiones9, vars, vt);
    _repeticiones10 = regex(_repeticiones10, vars, vt);
    _repeticiones11 = regex(_repeticiones11, vars, vt);
    _repeticiones12 = regex(_repeticiones12, vars, vt);
  } catch (error) {
    console.log(error);
  }

  var repeticiones = getRepeticiones();

  _separacion = Number(_separacion);
  let xStart = _separacion;
  container.height = Number(heightCanvas);
  container.width = Number(widthCanvas);
  if(_canvasBorder !== '') {
    container.style.border = _canvasBorder;
    container.style.borderRadius = _canvasBorderRadius + 'px';
  }
  if(_tituloCanvas !== '') {
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
      console.log(repeticion);
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
          default:
            console.log(repeticion);
            break;
        }
      }
    }
  }).catch(function (error) {
    console.log(error);
  });

  function buscarImagen(imagenBuscada) {
    for (var imagen of imagenes) {
      if (imagen.name === imagenBuscada) {
        return imagen;
      }
    }
  }

  function getRepeticiones() {
    let repeticiones = [{
      imagen: _imagen1 !== '' ? buscarImagen(_imagen1) : { src: '' },
      altoImagen: Number(_altoImagen1),
      formaRepeticion: _formaRepeticion1,
      repeticiones: Number(_repeticiones1),
      separacion: Number(_separacion1),
      separaciony: Number(_separaciony1)
    }];

    if (_pictoricos > 1) {
      repeticiones[1] = {
        imagen: _imagen2 !== '' ? buscarImagen(_imagen2) : { src: '' },
        altoImagen: Number(_altoImagen2),
        formaRepeticion: _formaRepeticion2,
        repeticiones: Number(_repeticiones2),
        separacion: Number(_separacion2),
        separaciony: Number(_separaciony2)
      }
    }

    if (_pictoricos > 2) {
      repeticiones[2] = {
        imagen: _imagen3 !== '' ? buscarImagen(_imagen3) : { src: '' },
        altoImagen: Number(_altoImagen3),
        formaRepeticion: _formaRepeticion3,
        repeticiones: Number(_repeticiones3),
        separacion: Number(_separacion3),
        separaciony: Number(_separaciony3)
      }
    }

    if (_pictoricos > 3) {
      repeticiones[3] = {
        imagen: _imagen4 !== '' ? buscarImagen(_imagen4) : { src: '' },
        altoImagen: Number(_altoImagen4),
        formaRepeticion: _formaRepeticion4,
        repeticiones: Number(_repeticiones4),
        separacion: Number(_separacion4),
        separaciony: Number(_separaciony4)
      }
    }

    if (_pictoricos > 4) {
      repeticiones[4] = {
        imagen: _imagen5 !== '' ? buscarImagen(_imagen5) : { src: '' },
        altoImagen: Number(_altoImagen5),
        formaRepeticion: _formaRepeticion5,
        repeticiones: Number(_repeticiones5),
        separacion: Number(_separacion5),
        separaciony: Number(_separaciony5)
      }
    }

    if (_pictoricos > 5) {
      repeticiones[5] = {
        imagen: _imagen6 !== '' ? buscarImagen(_imagen6) : { src: '' },
        altoImagen: Number(_altoImagen6),
        formaRepeticion: _formaRepeticion6,
        repeticiones: Number(_repeticiones6),
        separacion: Number(_separacion6),
        separaciony: Number(_separaciony6)
      }
    }

    if (_pictoricos > 6) {
      repeticiones[6] = {
        imagen: _imagen7 !== '' ? buscarImagen(_imagen7) : { src: '' },
        altoImagen: Number(_altoImagen7),
        formaRepeticion: _formaRepeticion7,
        repeticiones: Number(_repeticiones7),
        separacion: Number(_separacion7),
        separaciony: Number(_separaciony7)
      }
    }

    if (_pictoricos > 7) {
      repeticiones[7] = {
        imagen: _imagen8 !== '' ? buscarImagen(_imagen8) : { src: '' },
        altoImagen: Number(_altoImagen8),
        formaRepeticion: _formaRepeticion8,
        repeticiones: Number(_repeticiones8),
        separacion: Number(_separacion8),
        separaciony: Number(_separaciony8)
      }
    }

    if (_pictoricos > 8) {
      repeticiones[8] = {
        imagen: _imagen9 !== '' ? buscarImagen(_imagen9) : { src: '' },
        altoImagen: Number(_altoImagen9),
        formaRepeticion: _formaRepeticion9,
        repeticiones: Number(_repeticiones9),
        separacion: Number(_separacion9),
        separaciony: Number(_separaciony9)
      }
    }

    if (_pictoricos > 9) {
      repeticiones[9] = {
        imagen: _imagen10 !== '' ? buscarImagen(_imagen10) : { src: '' },
        altoImagen: Number(_altoImagen10),
        formaRepeticion: _formaRepeticion10,
        repeticiones: Number(_repeticiones10),
        separacion: Number(_separacion10),
        separaciony: Number(_separaciony10)
      }
    }

    if (_pictoricos > 10) {
      repeticiones[10] = {
        imagen: _imagen11 !== '' ? buscarImagen(_imagen11) : { src: '' },
        altoImagen: Number(_altoImagen11),
        formaRepeticion: _formaRepeticion11,
        repeticiones: Number(_repeticiones11),
        separacion: Number(_separacion11),
        separaciony: Number(_separaciony11)
      }
    }

    if (_pictoricos > 11) {
      repeticiones[11] = {
        imagen: _imagen12 !== '' ? buscarImagen(_imagen12) : { src: '' },
        altoImagen: Number(_altoImagen12),
        formaRepeticion: _formaRepeticion12,
        repeticiones: Number(_repeticiones12),
        separacion: Number(_separacion12),
        separaciony: Number(_separaciony12)
      }
    }


    return repeticiones;
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
    console.log(x);
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