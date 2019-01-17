'use strict';

//datos ejercicio
var contenidoBody = JSON.parse(document.body.getAttribute('data-content').replace(/\'/g, '\"'));
var versionBody = JSON.parse(document.body.getAttribute('data-version').replace(/\'/g, '\"'));

$(document).ready(function () {
	dibujaHtml();
	print();
});

function shuffle(arr) {
	var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

	for (var i = 0; i < t; i++) {
		arr = arr.sort(function () {
			return .5 - Math.random();
		});
	};
	return arr;
}

function replace(texto, variables) {
	var result = texto.toString().replace(/\$[a-z]/g, function (coincidencia) {
		//coincidencia => '$a'
		var valor;
		for (var index = 0; index < variables.length; index++) {
			if (variables[index].var === coincidencia[1]) {
				valor = variables[index].var;
			}
		}
		return valor.val;
	});
	return result;
}

function regex(theInput, theVariables, isTutorial) {
	var result = theInput.toString().replace(/\$[a-z]/g, function (coincidencia) {
		//coincidencia => '$a'
		var variable = theVariables.find(function (item) {
			return item.var == coincidencia[1];
		});
		return isTutorial ? variable.vt : variable.val;
	});
	return result;
}

function regexFunctions(text) {
	var result = text.replace(/(?=\{).*?(\})/g, function (coincidencia) {
		//coincidencia => '{funcion()}'
		var final = coincidencia.length - 2;
		var funcion = coincidencia.substr(1, final);
		return eval(funcion);
	});
	return result;
}

function cargaImagen(src) {
	return new Promise(function (resolve, reject) {
		var img = new Image();
		img.src = src;
		img.onload = function () {
			resolve(img);
		};
		img.onerror = function () {
			reject('no pasa nada');
		};
	});
}

function cargaFuente(nombre, src) {
	return new Promise(function (resolve, reject) {
		var font = new FontFace(nombre, 'url(\'' + src + '\')', {});
		font.load().then(function (loadedFont) {
			document.fonts.add(loadedFont);
			resolve(nombre);
		}).catch(function (error) {
			reject(error);
		});
	});
}

//funciones para poner texto en texto
function fraccion(entero, numerador, denominador) {
	return '<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline" mathcolor="teal" mathbackground="yellow" mathsize="big">\n\t' + (entero > 0 ? '<mn>' + Number(entero) + '</mn>' : '') + '\n\t<mrow>\n\t\t<mfrac>\n\t\t\t\t<mrow>\n\t\t\t\t\t <mn>' + Number(numerador) + '</mn>\n\t\t\t\t</mrow>\n\t\t\t\t<mrow> \n\t\t\t\t\t <mn>' + Number(denominador) + '</mn> \n\t\t\t\t</mrow>\n\t\t </mfrac>\n\t</mrow>\n</math>';
}

var FUNCIONES = [{ name: 'General', tag: 'general', fns: [{ id: 'Insertar Texto', action: insertarTexto }, { id: 'Insertar Input', action: insertarInput }, { id: 'Insertar Tabla', action: insertarTabla }, { id: 'Insertar Input Fraccion', action: insertarInputFraccion }] }, { name: 'Datos', tag: 'datos', fns: [] }, { name: 'Numeracion', tag: 'numeracion', fns: [{ id: 'Recta 2', action: recta }, { id: 'Tabla Posicional', action: tablaPosicional }, { id: 'Valor Posicional', action: valorPosicional }, { id: 'Repetición Pictóricos', action: repeticionPic }] }, { name: 'Medicion', tag: 'medicion', fns: [{ id: 'Perimetro', action: igualPerimetro }] }];

function print() {
	//Dibujar ejercicios
	var h = ['e', 'r', 'g'];
	h.forEach(function (n) {
		contenidoBody[n].forEach(function (m, i) {
			for (var oaIndex = 0; oaIndex < FUNCIONES.length; oaIndex++) {
				if (FUNCIONES[oaIndex].tag === m.tag) {

					for (var funcionIndex = 0; funcionIndex < FUNCIONES[oaIndex].fns.length; funcionIndex++) {
						if (FUNCIONES[oaIndex].fns[funcionIndex].id === m.name) {
							console.log(FUNCIONES[oaIndex].fns[funcionIndex]);
							FUNCIONES[oaIndex].fns[funcionIndex].action({
								container: document.getElementById('container-' + n + i),
								params: m.params,
								versions: versionBody.vars,
								vt: false
							});
							break;
						}
					}
					break;
				}
			}
		});
	});
}

function dibujaHtml() {
	// INICIO ENUNCIADO
	var contenidoDiv = document.getElementById('enunciado');
	var contenidoHtml = '';
	contenidoBody['e'].forEach(function (m, i) {
		contenidoHtml += '<div class="col-md-' + m.width.md + ' col-sm-' + m.width.sm + ' col-xs-' + m.width.xs + ' tag">';
		if (m.tag != 'general') {
			contenidoHtml += '<canvas id="container-' + 'e' + i + '" class="img-fluid mx-auto d-block" style="background:' + m.params.background + '"></canvas>';
		} else {
			contenidoHtml += '<div id="container-' + 'e' + i + '" class="general"></div>';
		}
		contenidoHtml += '</div>';
	});
	contenidoDiv.innerHTML = contenidoHtml;
	// INICIO RESPUESTA
	var respuestaDiv = document.getElementById('respuesta');
	var respuestaHtml = '';
	var canvasSeleccionables = contenidoBody['r'].filter(function (item) {
		return item.tag != 'general';
	});
	if (canvasSeleccionables.length === 3) {
		canvasSeleccionables = shuffle(canvasSeleccionables, 5);
		canvasSeleccionables.forEach(function (item, index) {
			var esCorrecta = item.params.esCorrecta ? true : false;
			var dataContent = {
				feedback: item.params.feedback,
				esCorrecta: esCorrecta,
				opcion: 'Opcion ' + (index + 1),
				errFrec: item.params.errFrec
			};
			respuestaHtml += '<div class="col-md-' + item.width.md + ' col-sm-' + item.width.sm + ' col-xs-' + item.width.xs + ' radio-div text-center">';
			respuestaHtml += '<canvas class="img-fluid" id="container-' + 'r' + item.position + '" style="background:' + item.params.background + '"></canvas>';
			respuestaHtml += '<h5 class="h5 text-center">Opcion ' + (index + 1) + '</h5>';
			respuestaHtml += '<input name="answer" value="Opcion ' + (index + 1) + '" class="d-none" type="radio" data-content=\'' + JSON.stringify(dataContent) + '\' />';
			respuestaHtml += '</div>';
		});
	} else {
		contenidoBody['r'].forEach(function (item, index) {
			respuestaHtml += '<div class="col-md-' + item.width.md + ' col-sm-' + item.width.sm + ' col-xs-' + item.width.xs + ' tag">';
			if (item.tag != 'general') {
				respuestaHtml += '<canvas class="img-fluid" id="container-' + 'r' + index + '" style="background:' + item.params.background + '"></canvas>';
			} else {
				respuestaHtml += '<div id="container-' + 'r' + index + '" class="general"></div>';
			}
			respuestaHtml += '</div>';
		});
	}
	respuestaDiv.innerHTML = respuestaHtml;
	// INICIO GLOSA
	var glosaDiv = document.getElementById('glosa');
	var glosaHtml = '';
	contenidoBody['g'].forEach(function (m, i) {
		glosaHtml += '<div class="col-md-' + m.width.md + ' col-sm-' + m.width.sm + ' col-xs-' + m.width.xs + ' tag">';
		if (m.tag != 'general') {
			glosaHtml += '<canvas class="img-fluid mx-auto d-block" id="container-' + 'g' + i + '" style="background:' + m.params.background + '"></canvas>';
		} else {
			glosaHtml += '<div id="container-' + 'g' + i + '" class="general"></div>';
		}
		glosaHtml += '</div>';
	});
	glosaDiv.innerHTML = glosaHtml;
}

function insertarTexto(config) {
	var container = config.container,
	    params = config.params,
	    variables = config.variables,
	    versions = config.versions,
	    vt = config.vt;

	if (container) {
		var vars = vt ? variables : versions;
		var texto = regex(params.content, vars, vt);
		texto = regexFunctions(texto, true);
		container.innerHTML = texto;
	}
}
function insertarInput(config) {
	var container = config.container,
	    params = config.params,
	    variables = config.variables,
	    versions = config.versions,
	    vt = config.vt,
	    tipoInput = params.tipoInput,
	    maxLength = params.maxLength,
	    inputSize = params.inputSize,
	    error0 = params.error0,
	    error2 = params.error2,
	    error3 = params.error3,
	    error4 = params.error4,
	    defaultError = params.defaultError,
	    feed0 = params.feed0,
	    feed1 = params.feed1,
	    feed2 = params.feed2,
	    feed3 = params.feed3,
	    feed4 = params.feed4,
	    defaultFeed = params.defaultFeed,
	    value1 = params.value1,
	    value2 = params.value2,
	    value3 = params.value3,
	    value4 = params.value4,
	    inputType = params.inputType,
	    colmd = params.colmd,
	    colsm = params.colsm,
	    col = params.col;

	var vars = vt ? variables : versions;
	var r = '',
	    n = '',
	    valoresReemplazados = '';
	var feedGenerico = regex(feed0, vars, vt);
	var answers = [{
		respuesta: regex(value1, vars, vt),
		feedback: regex(feed1, vars, vt),
		errFrec: null
	}, {
		respuesta: regex(value2, vars, vt),
		feedback: feed0 === '' ? regex(feed2, vars, vt) : feedGenerico,
		errFrec: error0 === '' ? error2 : error0
	}];
	if (inputSize > 2) {
		answers[2] = {
			respuesta: regex(value3, vars, vt),
			feedback: feed0 === '' ? regex(feed3, vars, vt) : feedGenerico,
			errFrec: error0 === '' ? error3 : error0
		};
	}
	if (inputSize > 3) {
		answers[3] = {
			respuesta: regex(value4, vars, vt),
			feedback: feed0 === '' ? regex(feed4, vars, vt) : feedGenerico,
			errFrec: error0 === '' ? error4 : error0
		};
	}
	if (container) {
		switch (inputType) {
			case 'input':
				var dataContent = {
					tipoInput: tipoInput,
					answers: answers,
					feedbackDefecto: feed0 === '' ? regex(defaultFeed, vars, vt) : feedGenerico,
					errFrecDefecto: error0 === '' ? defaultError : error0
				};
				container.innerHTML = '';
				switch (tipoInput) {
					case 'texto':
						container.innerHTML = '<input type="text" name="answer" maxlength="' + maxLength + '" class="inputTexto" placeholder="Respuesta" data-content=\'' + JSON.stringify(dataContent) + '\' onkeypress="cambiaInputTexto(event)" />';
						break;
					case 'numero':
						container.innerHTML = '<input type="text" name="answer" maxlength="' + maxLength + '" class="inputTexto" placeholder="Respuesta" data-content=\'' + JSON.stringify(dataContent) + '\' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />';
						break;
					case 'alfanumerico':
						container.innerHTML = '<input type="text" name="answer" maxlength="' + maxLength + '" class="inputTexto" placeholder="Respuesta" data-content=\'' + JSON.stringify(dataContent) + '\' onkeypress="cambiaInputAlfanumerico(event)"/>';
						break;
				}
				break;
			case 'radio':
				container.innerHTML = '';
				container.className = 'row justify-content-center';
				answers = shuffle(answers);
				answers.forEach(function (m, i) {
					var lmnt = document.createElement('div');
					lmnt.className = 'col-' + col + ' col-sm-' + colsm + ' col-md-' + colmd;
					lmnt.innerHTML = '<div class="opcionradio">\n\t<span></span>\n\t<input type="radio" id="radio-' + i + '" name="answer" value="' + m.respuesta + '" onchange="cambiaRadios(event)" data-content=\'' + JSON.stringify(m) + '\'>\n\t<label for="radio-' + i + '">' + m.respuesta + '</label>\n</div>';
					lmnt.style.marginBottom = '5px';
					container.appendChild(lmnt);
				});
				break;
			case 'checkbox':
				arr.forEach(function (m, i) {
					valoresReemplazados = replace(m, vars, vt);
					try {
						n = eval(valoresReemplazados);
						r += '<li key="' + i + '"><input name="answer" value="' + n + '" type="checkbox"/><label>' + n + '</label></li>';
					} catch (e) {
						r += '<li key="' + i + '"><input name="answer" value="' + valoresReemplazados + '" type="checkbox"/><label>' + valoresReemplazados + '</label></li>';
					}
				});
				container.innerHTML = r;
				break;
			case 'textarea':
				container.innerHTML = '<textarea placeholder="Respuesta"></textarea>';
				break;
		}
	}
}
function insertarTabla(config) {
	var container = config.container,
	    params = config.params,
	    variables = config.variables,
	    versions = config.versions,
	    vt = config.vt,
	    table = params.table,
	    encabezado = params.encabezado,
	    vars = vt ? variables : versions;

	if (container) {
		var r = '<table class="tabla"><tbody>';
		for (var row = 0; row < table.length; row++) {
			r += '<tr>';
			for (var col = 0; col < table[row].length; col++) {
				r += '<td>';
				switch (table[row][col].type) {
					case 'text':
						if (encabezado === 'arriba' && row === 0) {
							r += '<p><b>' + regex(table[row][col].value.text, vars, vt) + '</b></p>';
						} else if (encabezado === 'izquierda' && col === 0) {
							r += '<p><b>' + regex(table[row][col].value.text, vars, vt) + '</b></p>';
						} else {
							r += '<p>' + regex(table[row][col].value.text, vars, vt) + '</p>';
						}
						break;
					case 'image':
						r += '<img src=' + regex(table[row][col].value.url, vars, vt) + ' height=' + table[row][col].value.height + ' width=' + table[row][col].value.width + '/>';
						break;
					case 'input':
						var _table$row$col$value = table[row][col].value,
						    tipoInput = _table$row$col$value.tipoInput,
						    maxLength = _table$row$col$value.maxLength,
						    error0 = _table$row$col$value.error0,
						    error2 = _table$row$col$value.error2,
						    error3 = _table$row$col$value.error3,
						    error4 = _table$row$col$value.error4,
						    defaultError = _table$row$col$value.defaultError,
						    feed0 = _table$row$col$value.feed0,
						    feed1 = _table$row$col$value.feed1,
						    feed2 = _table$row$col$value.feed2,
						    feed3 = _table$row$col$value.feed3,
						    feed4 = _table$row$col$value.feed4,
						    defaultFeed = _table$row$col$value.defaultFeed,
						    value1 = _table$row$col$value.value1,
						    value2 = _table$row$col$value.value2,
						    value3 = _table$row$col$value.value3,
						    value4 = _table$row$col$value.value4;

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
							};
						}
						if (value3 !== '') {
							answers[2] = {
								respuesta: regex(value3, vars, vt),
								feedback: feed0 === '' ? regex(feed3, vars, vt) : feedGenerico,
								errFrec: error0 === '' ? error3 : error0
							};
						}
						if (value4 !== '') {
							answers[3] = {
								respuesta: regex(value4, vars, vt),
								feedback: feed0 === '' ? regex(feed4, vars, vt) : feedGenerico,
								errFrec: error0 === '' ? error4 : error0
							};
						}
						var dataContent = {
							tipoInput: tipoInput,
							answers: answers,
							feedbackDefecto: feed0 === '' ? regex(defaultFeed, vars, vt) : feedGenerico,
							errFrecDefecto: error0 === '' ? defaultError : error0
						};
						switch (tipoInput) {
							case 'text':
								r += '<input type="text" name="answer" maxlength="' + maxLength + '" placeholder="Respuesta" data-content=\'' + JSON.stringify(dataContent) + '\' onkeypress="cambiaInputTexto(event)" />';
								break;
							case 'numero':
								r += '<input type="text" name="answer" maxlength="' + maxLength + '" placeholder="Respuesta" data-content=\'' + JSON.stringify(dataContent) + '\' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />';
								break;
							case 'alfanumerico':
								r += '<input type="text" name="answer" maxlength="' + maxLength + '" placeholder="Respuesta" data-content=\'' + JSON.stringify(dataContent) + '\' onkeypress="cambiaInputAlfanumerico(event)"/>';
								break;
						}
						break;
					case 'text-input':
						var _table$row$col$value2 = table[row][col].value,
						    text = _table$row$col$value2.text,
						    tipoInput = _table$row$col$value2.tipoInput,
						    maxLength = _table$row$col$value2.maxLength,
						    error0 = _table$row$col$value2.error0,
						    error2 = _table$row$col$value2.error2,
						    error3 = _table$row$col$value2.error3,
						    error4 = _table$row$col$value2.error4,
						    defaultError = _table$row$col$value2.defaultError,
						    feed0 = _table$row$col$value2.feed0,
						    feed1 = _table$row$col$value2.feed1,
						    feed2 = _table$row$col$value2.feed2,
						    feed3 = _table$row$col$value2.feed3,
						    feed4 = _table$row$col$value2.feed4,
						    defaultFeed = _table$row$col$value2.defaultFeed,
						    value1 = _table$row$col$value2.value1,
						    value2 = _table$row$col$value2.value2,
						    value3 = _table$row$col$value2.value3,
						    value4 = _table$row$col$value2.value4;

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
							};
						}
						if (value3 !== '') {
							answers[2] = {
								respuesta: regex(value3, vars, vt),
								feedback: feed0 === '' ? regex(feed3, vars, vt) : feedGenerico,
								errFrec: error0 === '' ? error3 : error0
							};
						}
						if (value4 !== '') {
							answers[3] = {
								respuesta: regex(value4, vars, vt),
								feedback: feed0 === '' ? regex(feed4, vars, vt) : feedGenerico,
								errFrec: error0 === '' ? error4 : error0
							};
						}
						var dataContent = {
							tipoInput: tipoInput,
							answers: answers,
							feedbackDefecto: feed0 === '' ? regex(defaultFeed, vars, vt) : feedGenerico,
							errFrecDefecto: error0 === '' ? defaultError : error0
						};
						var input;
						switch (tipoInput) {
							case 'text':
								input = '<input type="text" name="answer" maxlength="' + maxLength + '" placeholder="Respuesta" data-content=\'' + JSON.stringify(dataContent) + '\' onkeypress="cambiaInputTexto(event)" />';
								break;
							case 'numero':
								input = '<input type="text" name="answer" maxlength="' + maxLength + '" placeholder="Respuesta" data-content=\'' + JSON.stringify(dataContent) + '\' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />';
								break;
							case 'alfanumerico':
								input = '<input type="text" name="answer" maxlength="' + maxLength + '" placeholder="Respuesta" data-content=\'' + JSON.stringify(dataContent) + '\' onkeypress="cambiaInputAlfanumerico(event)"/>';
								break;
						}
						r += '<p>' + p.replace('{input}', input) + '</p>';
						break;
					case 'text-image':
						var p = regex(table[row][col].value.text, vars, vt);
						var img = '<img src=' + regex(table[row][col].value.url, vars, vt) + ' height=' + table[row][col].value.height + ' width=' + table[row][col].value.width + '/>';
						r += '<p>' + p.replace('{imagen}', img) + '</p>';
						break;
				}
				r += '</td>';
			}
			r += '</tr>';
		}
		r += '</tbody></table>';
		container.innerHTML = r;
	}
}
function insertarInputFraccion(config) {
	var container = config.container,
	    params = config.params,
	    variables = config.variables,
	    versions = config.versions,
	    vt = config.vt;

	var inputFraccion = '',
	    vars;
	try {
		vars = vt ? variables : versions;
		var feedbackGood = regex(params.feedbackGood, vars, vt);
		var feedbackBad = regex(params.feedbackBad, vars, vt);
		var disabled = params.disabled === 'si' ? 'disabled' : '';
		var entero = regex('$'.concat(params.entero), vars, vt);
		var numerador = regex('$'.concat(params.numerador), vars, vt);
		var denominador = regex('$'.concat(params.denominador), vars, vt);
		inputFraccion = '<table><tbody><tr><td rowspan="2">';
		inputFraccion += '<input type="text" id="entero" name="answer" class="input-numerador" data-content="{\'feedbackGood\':\'' + feedbackGood + '\',\'feedbackBad\':\'' + feedbackBad + '\',\'esCorrecta\': \'' + entero + '\'}" ' + disabled + ' ' + (params.disabled === 'si' && 'value="' + entero + '"') + ' />';
		inputFraccion += '</td><td style="border-bottom: 2px solid black;">';
		inputFraccion += '<input type="text" id="numerador" name="answer" class="input-num-y-den" data-content="{\'feedbackGood\':\'' + feedbackGood + '\',\'feedbackBad\':\'' + feedbackBad + '\',\'esCorrecta\': \'' + numerador + '\'}" ' + disabled + ' ' + (params.disabled === 'si' && 'value="' + numerador + '"') + '"/>';
		inputFraccion += '</td></tr><tr><td>';
		inputFraccion += '<input type="text" id="denominador" name="answer" class="input-num-y-den" data-content="{\'feedbackGood\':\'' + feedbackGood + '\',\'feedbackBad\':\'' + feedbackBad + '\',\'esCorrecta\': \'' + denominador + '\'}" ' + disabled + ' ' + (params.disabled === 'si' && 'value="' + denominador + '"') + '/>';
		inputFraccion += '</td></tr></tbody></table>';
	} catch (e) {
		console.log(e);
	}
	container.innerHTML = inputFraccion;
}
function recta(config) {
	var container = config.container,
	    params = config.params,
	    variables = config.variables,
	    versions = config.versions,
	    vt = config.vt;
	var _altoCanvas = params._altoCanvas,
	    _anchoCanvas = params._anchoCanvas,
	    _anchoReacta = params._anchoReacta,
	    _largoLineasFlechas = params._largoLineasFlechas,
	    _posiciones = params._posiciones,
	    _marcarPosiciones = params._marcarPosiciones,
	    _altoPosiciones = params._altoPosiciones,
	    _ponerObjeto = params._ponerObjeto,
	    _posicionObjeto = params._posicionObjeto,
	    _tipoObjeto = params._tipoObjeto,
	    _leyenda = params._leyenda,
	    _proporcion = params._proporcion,
	    _limite = params._limite,
	    _dibujaFlechas = params._dibujaFlechas,
	    _escalaFlechas = params._escalaFlechas,
	    _dibujaFlechasHasta = params._dibujaFlechasHasta,
	    _dibujaRango = params._dibujaRango,
	    _rangoCorchete = params._rangoCorchete,
	    _textoRango = params._textoRango,
	    _fraccion = params._fraccion;

	var conoImgSrc = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/Eje_1/OA_10/Cono.png';
	var xFinal = _anchoCanvas - _anchoReacta / 2;
	var xInicial = _anchoReacta / 2;
	var inicialFinalY = _altoCanvas / 2;
	container.height = _altoCanvas;
	container.width = _anchoCanvas;

	var ctx = container.getContext('2d');

	dibujaRectaPrincipal();
	marcarPosiciones();
	_ponerObjeto === 'si' && dibujaObjetoEnPosicion();
	_leyenda === 'si' && dibujaLeyenda();
	_dibujaFlechas === 'si' && dibujaFlechasCamino();
	dibujaNumeros();
	dibujaElementoRepetitivo();
	_dibujaRango === 'si' && dibujaRango();
	_fraccion !== '' && dibujaFraccion2();

	function dibujaRectaPrincipal() {
		ctx.beginPath();
		ctx.moveTo(xInicial, inicialFinalY);

		dibujaFlechas(xInicial, inicialFinalY, true);

		ctx.moveTo(xInicial, inicialFinalY);
		ctx.lineTo(xFinal, inicialFinalY);

		dibujaFlechas(xFinal, inicialFinalY, false);

		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = _anchoReacta;
		ctx.stroke();
		ctx.closePath();
	}

	function dibujaFlechas(x, y, primera) {
		if (primera) {
			ctx.lineTo(x + _largoLineasFlechas * Math.cos(Math.PI / 4), y - _largoLineasFlechas * Math.sin(Math.PI / 4));
			ctx.moveTo(x, inicialFinalY);
			ctx.lineTo(x + _largoLineasFlechas * Math.cos(Math.PI / 4), y - _largoLineasFlechas * Math.sin(Math.PI / 4 * -1));
		} else {
			ctx.lineTo(x - _largoLineasFlechas * Math.cos(Math.PI / 4 * -1), y - _largoLineasFlechas * Math.sin(Math.PI / 4 * -1));
			ctx.moveTo(x, inicialFinalY);
			ctx.lineTo(x - _largoLineasFlechas * Math.cos(Math.PI / 4 * -1), y - _largoLineasFlechas * Math.sin(Math.PI / 4));
		}
	}

	function marcarPosiciones() {
		var divicion = _anchoCanvas / _posiciones;
		switch (_marcarPosiciones) {
			case 'todas':
				for (var i = 1; i < _posiciones; i++) {
					ctx.beginPath();
					ctx.moveTo(i * divicion, inicialFinalY - _altoPosiciones / 2);
					ctx.lineTo(i * divicion, inicialFinalY + _altoPosiciones / 2);
					ctx.stroke();
					ctx.closePath();
				}
				break;
			case 'inicial y final':
				ctx.beginPath();
				ctx.moveTo(divicion, inicialFinalY - _altoPosiciones / 2);
				ctx.lineTo(divicion, inicialFinalY + _altoPosiciones / 2);
				ctx.stroke();
				ctx.closePath();
				ctx.beginPath();
				ctx.moveTo(_anchoCanvas - divicion, inicialFinalY - _altoPosiciones / 2);
				ctx.lineTo(_anchoCanvas - divicion, inicialFinalY + _altoPosiciones / 2);
				ctx.stroke();
				ctx.closePath();
				break;
			case 'proporcional':
				try {
					var divicion = _anchoCanvas / _posiciones;
					var largoRecta = _anchoCanvas - divicion * 2;
					var proporcion = regex(_proporcion, vt ? variables : versions, vt);
					proporcion = eval(proporcion);
					var limite = regex(_limite, vt ? variables : versions, vt);
					limite = eval(limite);
					var espacio = largoRecta / (limite / proporcion);

					for (var i = 0, separacion = 0; i < limite / proporcion + 1; i++) {
						ctx.beginPath();
						var startEndX = i * espacio + divicion;
						if (Number.isInteger(separacion)) {
							var startY = inicialFinalY - (Number(_altoPosiciones) + 3 / 2);
							var endY = inicialFinalY + (Number(_altoPosiciones) + 3 / 2);
							ctx.moveTo(startEndX, startY);
							ctx.lineTo(startEndX, endY);
						} else {
							ctx.moveTo(startEndX, inicialFinalY - Number(_altoPosiciones) / 2);
							ctx.lineTo(startEndX, inicialFinalY + Number(_altoPosiciones) / 2);
						}
						ctx.stroke();
						ctx.closePath();
						separacion = separacion + proporcion;
					}
				} catch (e) {
					console.log(e);
				}
				break;
		}
	}

	function dibujaObjetoEnPosicion() {
		var divicion = _anchoCanvas / _posiciones;
		var posiciones = String(Number(regex(_posicionObjeto, vt ? variables : versions, vt))).split(',');
		switch (_tipoObjeto) {
			case 'cono':
				posiciones.forEach(function (posicion) {
					var x = Number.parseFloat(posicion);
					if (x) {
						var posicionX = (_anchoCanvas - divicion * 2) * (1 / x) + divicion;
						ctx.beginPath();
						ctx.moveTo(posicionX, inicialFinalY - _altoPosiciones / 2);
						ctx.lineTo(posicionX, inicialFinalY + _altoPosiciones / 2);
						ctx.stroke();
						ctx.closePath();
						var img = new Image();
						img.src = conoImgSrc;
						img.onload = function () {
							var imgX = posicionX - img.width / 2;
							var imgY = inicialFinalY - _altoPosiciones / 2 - img.height - 20;
							ctx.drawImage(img, imgX, imgY);
						};
						dibujaFraccion(posicionX);
					}
				});
				break;
		}
	}

	function dibujaFraccion(posicionX) {
		var denominador = Number(regex(_posicionObjeto, vt ? variables : versions, vt));
		var numerador = 1;
		var textHeightFraccion = 20;
		ctx.font = textHeightFraccion + 'px Arial';
		ctx.fillStyle = 'black';
		var anchoNumerador = ctx.measureText(String(numerador)).width;
		var anchoDenominador = ctx.measureText(String(denominador)).width;

		var numeradorX = posicionX - anchoNumerador / 2;
		var numeradorY = inicialFinalY + _altoPosiciones / 2 + 20 + textHeightFraccion;
		ctx.fillText(String(numerador), numeradorX, numeradorY);

		ctx.beginPath();
		var lineaX = posicionX - 10;
		var lineaY = inicialFinalY + _altoPosiciones / 2 + 20 + (textHeightFraccion + 5);
		ctx.moveTo(lineaX, lineaY);
		ctx.lineTo(lineaX + 20, lineaY);
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();

		var denominadorX = posicionX - anchoDenominador / 2;
		var denominadorY = inicialFinalY + _altoPosiciones / 2 + 25 + textHeightFraccion * 2;
		ctx.fillText(String(denominador), denominadorX, denominadorY);
	}

	function dibujaFraccion2() {
		switch (_escalaFlechas) {
			case 'principal':
				break;
			case 'secundaria':
				try {
					var numeros = String(regex(_fraccion, vt ? variables : versions, vt)).split(',');
					var divicion = _anchoCanvas / _posiciones;
					var largoRecta = _anchoCanvas - divicion * 2;
					var proporcion = regex(_proporcion, vt ? variables : versions, vt);
					proporcion = eval(proporcion);
					var limite = regex(_limite, vt ? variables : versions, vt);
					limite = eval(limite);
					var largo = regex(_rangoCorchete, vt ? variables : versions, vt);
					largo = eval(largo);
					var espacios = limite / proporcion;
					var largoSeparacion = largoRecta / espacios;

					if (numeros.length === 2) {} else if (numeros.length === 3) {
						var entero = Number(numeros[0]),
						    numerador = Number(numeros[1]),
						    denominador = Number(numeros[2]);

						var espacioFraccion = denominador * entero + numerador;
						var x = largoSeparacion * espacioFraccion + divicion;
						var y = inicialFinalY + Number(_altoPosiciones);

						ctx.fillStyle = 'black';
						ctx.font = '25px Arial';
						var enteroWidth = ctx.measureText(String(entero)).width;

						ctx.font = '15px Arial';
						var numeradorWidth = ctx.measureText(String(numerador)).width;
						var denominadorWidth = ctx.measureText(String(denominador)).width;

						var widthFraccion = enteroWidth + 25; //20 linea de separacion y 5 entre entero y la linea
						var enteroX = x - widthFraccion / 2;
						ctx.font = '25px Arial';
						ctx.fillText(String(entero), enteroX, y + 40);

						ctx.font = '20px Arial';
						var numeradorX = x + widthFraccion / 2 - numeradorWidth - 8;
						ctx.fillText(String(numerador), numeradorX, y + 28);

						var inicioDivicionX = x - widthFraccion / 2 + enteroWidth + 5;
						ctx.beginPath();
						ctx.moveTo(inicioDivicionX, y + 32);
						ctx.lineTo(inicioDivicionX + 20, y + 32);
						ctx.stroke();
						ctx.closePath();

						var denominadorX = x + widthFraccion / 2 - denominadorWidth - 8;
						ctx.fillText(String(denominador), denominadorX, y + 51);
					}
				} catch (e) {
					console.log(e);
				}
				break;
		}
	}

	function dibujaLeyenda() {
		var divicion = _anchoCanvas / _posiciones;
		ctx.font = 15 + 'px Arial';
		ctx.fillStyle = 'black';
		var anchoTexto = ctx.measureText('Borde de').width;
		var textoX = divicion - anchoTexto / 2;
		var textoY = inicialFinalY - _altoPosiciones / 2 - 40;
		ctx.fillText('Borde de', textoX, textoY);

		anchoTexto = ctx.measureText('la cancha').width;
		textoX = divicion - anchoTexto / 2;
		textoY = inicialFinalY - _altoPosiciones / 2 - 25;
		ctx.fillText('la cancha', textoX, textoY);

		anchoTexto = ctx.measureText('1m').width;
		textoX = _anchoCanvas - divicion - anchoTexto / 2;
		textoY = inicialFinalY + _altoPosiciones / 2 + 30;
		ctx.fillText('1m', textoX, textoY);
	}

	function dibujaFlechasCamino() {
		switch (_escalaFlechas) {
			case 'principal':
				break;
			case 'secundaria':
				try {
					var divicion = _anchoCanvas / _posiciones;
					var largoRecta = _anchoCanvas - divicion * 2;
					var proporcion = regex(_proporcion, vt ? variables : versions, vt);
					proporcion = eval(proporcion);
					var limite = regex(_limite, vt ? variables : versions, vt);
					limite = eval(limite);
					var espacios = limite / proporcion;
					var largoSeparacion = largoRecta / espacios;
					var cantidadFlechas = regex(_dibujaFlechasHasta, vt ? variables : versions, vt);

					for (var i = 0; i < Number(cantidadFlechas); i++) {
						ctx.lineWidth = 2;
						ctx.beginPath();
						var centroX = i * largoSeparacion + divicion + largoSeparacion / 2,
						    centroY = inicialFinalY,
						    startAngle = Math.PI * 1.2,
						    endAngle = Math.PI * 1.8,
						    r = largoSeparacion / 2;
						ctx.arc(centroX, centroY, r, startAngle, endAngle, false);
						ctx.stroke();
						var sx = Math.cos(endAngle) * r + centroX,
						    sy = Math.sin(endAngle) * r + centroY;
						ctx.lineTo(sx, sy - 10);
						ctx.moveTo(sx, sy);
						ctx.lineTo(sx - 10, sy);
						ctx.stroke();
						ctx.closePath();
					}
				} catch (e) {
					console.log(e);
				}
				break;
		}
	}

	function dibujaNumeros() {
		var divicion = _anchoCanvas / _posiciones;
		switch (_marcarPosiciones) {
			case 'todas':
				break;
			case 'inicial y final':
				break;
			case 'proporcional':
				try {
					var divicion = _anchoCanvas / _posiciones;
					var largoRecta = _anchoCanvas - divicion * 2;
					var proporcion = regex(_proporcion, vt ? variables : versions, vt);
					proporcion = eval(proporcion);
					var limite = regex(_limite, vt ? variables : versions, vt);
					limite = eval(limite);
					var espacio = largoRecta / (limite / proporcion);
					ctx.font = 15 + 'px Arial';
					ctx.fillStyle = 'black';
					for (var i = 0, separacion = 0; i < limite / proporcion + 1; i++) {
						ctx.beginPath();
						var x = i * espacio + divicion;
						if (Number.isInteger(separacion)) {
							var endY = inicialFinalY + (Number(_altoPosiciones) + 40 / 2);
							var width = ctx.measureText(String(separacion)).width;
							ctx.fillText(String(separacion), x - width / 2, endY);
						}
						ctx.stroke();
						ctx.closePath();
						separacion = separacion + proporcion;
					}
				} catch (e) {
					console.log(e);
				}
				break;
		}
	}

	function dibujaElementoRepetitivo() {
		switch (_escalaFlechas) {
			case 'principal':
				break;
			case 'secundaria':
				try {
					var divicion = _anchoCanvas / _posiciones;
					var largoRecta = _anchoCanvas - divicion * 2;
					var proporcion = regex(_proporcion, vt ? variables : versions, vt);
					proporcion = eval(proporcion);
					var limite = regex(_limite, vt ? variables : versions, vt);
					limite = eval(limite);
					var espacios = limite / proporcion;
					var largoSeparacion = largoRecta / espacios;
					var cantidadFlechas = regex(_dibujaFlechasHasta, vt ? variables : versions, vt);
					var img = new Image();
					img.src = conoImgSrc;
					img.onload = function () {
						for (var i = 1; i < Number(cantidadFlechas) + 1; i++) {
							var imgX = i * largoSeparacion + divicion - img.width / 2;
							var imgY = inicialFinalY - largoSeparacion / 2 - 10 - img.height;
							ctx.drawImage(img, imgX, imgY);
						}
					};
				} catch (e) {
					console.log(e);
				}
				break;
		}
	}

	function dibujaRango() {
		switch (_escalaFlechas) {
			case 'principal':
				break;
			case 'secundaria':
				try {
					var divicion = _anchoCanvas / _posiciones;
					var largoRecta = _anchoCanvas - divicion * 2;
					var proporcion = regex(_proporcion, vt ? variables : versions, vt);
					proporcion = eval(proporcion);
					var limite = regex(_limite, vt ? variables : versions, vt);
					limite = eval(limite);
					var largo = regex(_rangoCorchete, vt ? variables : versions, vt);
					largo = eval(largo);
					var espacios = limite / proporcion;
					var largoSeparacion = largoRecta / espacios;
					var inicioFinalRango = inicialFinalY + 50;
					ctx.beginPath();
					ctx.arc(divicion + 10, inicioFinalRango - 10, 10, Math.PI * 0.5, Math.PI);
					ctx.moveTo(divicion + 10, inicioFinalRango);
					var terminoX = largoSeparacion * Number(largo) + divicion;
					ctx.lineTo(terminoX / 2 - 10 + divicion / 2, inicioFinalRango);
					ctx.arc(terminoX / 2 - 10 + divicion / 2, inicioFinalRango + 10, 10, Math.PI * 1.5, Math.PI * 2);
					ctx.arc(terminoX / 2 + 10 + divicion / 2, inicioFinalRango + 10, 10, Math.PI, Math.PI * 1.5);
					ctx.moveTo(terminoX / 2 + 10 + divicion / 2, inicioFinalRango);
					ctx.lineTo(terminoX - 10, inicioFinalRango);
					ctx.arc(terminoX - 10, inicioFinalRango - 10, 10, Math.PI * 0.5, 0, true);
					ctx.stroke();
					ctx.closePath();
					var texto = regex(_textoRango, vt ? variables : versions, vt);
					var anchoTexto = ctx.measureText(texto).width;
					var textoX = (terminoX + divicion - anchoTexto) / 2;
					var textoY = inicioFinalRango + 30;
					ctx.fillText(texto, textoX, textoY);
				} catch (e) {
					console.log(e);
				}
				break;
		}
	}
}

function igualPerimetro(config) {
	var container = config.container,
	    params = config.params,
	    variables = config.variables,
	    versions = config.versions,
	    vt = config.vt;


	container.width = params.cuadro * 10;
	container.height = params.cuadro * 5;
	container.style.border = params.borderWidth + "px solid  #000";

	var ctx = container.getContext('2d');

	for (var i = 1; i < 10; i++) {
		//lineas verticales
		ctx.beginPath();
		ctx.moveTo(i * params.cuadro, container.height);
		ctx.lineTo(i * params.cuadro, 0);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();
	}

	for (var i = 1; i < 5; i++) {
		ctx.beginPath();
		ctx.moveTo(container.width, i * params.cuadro);
		ctx.lineTo(0, i * params.cuadro);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();
	}

	try {
		var varAncho, varAlto;
		if (vt) {
			varAlto = variables.find(function (item) {
				return item.var === params.alto;
			});
			varAncho = variables.find(function (item) {
				return item.var === params.ancho;
			});
		} else {
			varAlto = versions.find(function (item) {
				return item.var === params.alto;
			});
			varAncho = versions.find(function (item) {
				return item.var === params.ancho;
			});
		}

		var alto = vt ? varAlto.vt : varAlto.val;
		var ancho = vt ? varAncho.vt : varAncho.val;
		dibujaRectangulo(ctx, ancho * params.cuadro, alto * params.cuadro, params.cuadro);
	} catch (error) {
		console.log('explota');
	}

	function dibujaRectangulo(ctx, largox, largoy, lado) {
		ctx.translate(0, 0);
		var x, y;
		y = largoy / lado === 1 ? 2 * lado : lado;
		x = 10 * lado / 2 - Math.trunc(largox / lado / 2) * lado;
		ctx.beginPath();
		ctx.rect(x, y, largox, largoy);
		ctx.strokeStyle = "red";
		ctx.lineWidth = 4;
		ctx.stroke();
	}
}

function tablaPosicional(config) {
	var container = config.container,
	    params = config.params,
	    variables = config.variables,
	    versions = config.versions,
	    vt = config.vt;

	var imgSrcTablaCentena = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/tabla_CDU.svg';
	var imgSrcTablaUMil = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/tabla_UMCDU.svg';
	var imgSrcFlechaAbajo = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/flecha_fija.svg';
	var imgSrcSignoMas = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/num_sig_mas.svg';
	var srcFuente = 'https://desarrolloadaptatin.blob.core.windows.net/fuentes/LarkeNeueThin.ttf';
	var _soloTabla = params._soloTabla,
	    _umil = params._umil,
	    _centena = params._centena,
	    _decena = params._decena,
	    _unidad = params._unidad,
	    _miles = params._miles,
	    _centenas = params._centenas,
	    _decenas = params._decenas,
	    _numero = params._numero,
	    _textoUnidades = params._textoUnidades,
	    _textoNumeroPalabras = params._textoNumeroPalabras,
	    _margenElementos = params._margenElementos;


	var vars = vt ? variables : versions;
	try {
		if (_umil !== 'Seleccione') {
			_umil = regex('$' + _umil, vars, vt);
			_miles = regex('$' + _miles, vars, vt);
		} else {
			_umil = '0';
			_miles = '0000';
		}
		_centena = regex('$' + _centena, vars, vt);
		_decena = regex('$' + _decena, vars, vt);
		_unidad = regex('$' + _unidad, vars, vt);
		_centenas = regex('$' + _centenas, vars, vt);
		_decenas = regex('$' + _decenas, vars, vt);
		_numero = regex('$' + _numero, vars, vt);
	} catch (error) {
		console.log(error);
	}

	_textoUnidades = Number(_textoUnidades);
	_textoNumeroPalabras = Number(_textoNumeroPalabras);
	_margenElementos = Number(_margenElementos);
	Promise.all([cargaImagen(imgSrcTablaCentena), cargaImagen(imgSrcTablaUMil), cargaImagen(imgSrcFlechaAbajo), cargaImagen(imgSrcSignoMas), cargaFuente('LarkeNeueThinFuente', srcFuente)]).then(function (result) {
		var imgTablaCentena = result[0],
		    imgTablaUMil = result[1],
		    imgFlechaAbajo = result[2],
		    imgSignoMas = result[3];

		var ctx = container.getContext('2d');
		var tabla = _umil !== '0' ? imgTablaUMil : imgTablaCentena;
		container.height = _soloTabla == 'no' ? tabla.height + _textoUnidades + _textoNumeroPalabras + imgFlechaAbajo.height * 2 + _margenElementos * 5 : tabla.height;
		container.width = tabla.width;
		ctx.drawImage(tabla, 0, 0);

		var diviciones = _umil !== '0' ? 4 : 3;
		var anchoSeparaciones = container.width / diviciones;
		var numeros = _umil !== '0' ? [_umil, _centena, _decena, _unidad] : [_centena, _decena, _unidad];
		var numerosSuma = _umil !== '0' ? [_miles, _centenas, _decenas, _unidad] : [_centenas, _decenas, _unidad];
		for (var i = 1; i < diviciones + 1; i++) {
			var centroSeccion = anchoSeparaciones * i - anchoSeparaciones / 2;
			var centroSeparacion = anchoSeparaciones * i;
			dibujaNumeros(numeros[i - 1], centroSeccion);
			_soloTabla == 'no' && insertaFlecha(centroSeccion);
			_soloTabla == 'no' && dibujaNumerosSuma(numerosSuma[i - 1], centroSeccion);
			i + 1 !== diviciones + 1 && _soloTabla == 'no' && insertaSignosMas(centroSeparacion);
		}

		dibujaFlechaCentro(centroSeccion);
		dibujaNumeroFinal();

		function dibujaNumeros(numero, centroSeccion) {
			var altoBox = tabla.height / 1.8;
			var altoTexto = altoBox * 0.65;
			var yTexto = tabla.height - altoBox / 2 + altoTexto / 2;
			ctx.font = altoTexto + 'pt LarkeNeueThinFuente';
			var anchoTexto = ctx.measureText(numero).width;
			var xTexto = centroSeccion - anchoTexto / 2;
			ctx.fillStyle = '#F58220';
			ctx.fillText(numero, xTexto, yTexto);
		}

		function insertaFlecha(centroSeccion) {
			var x = centroSeccion - imgFlechaAbajo.width / 2;
			var y = tabla.height + _margenElementos;
			ctx.drawImage(imgFlechaAbajo, x, y);
		}

		function dibujaNumerosSuma(numero, centroSeccion) {
			ctx.font = _textoUnidades + 'pt LarkeNeueThinFuente';
			var anchoTexto = ctx.measureText(numero).width;
			var xTexto = centroSeccion - anchoTexto / 2;
			var yTexto = tabla.height + imgFlechaAbajo.height + _margenElementos * 2 + _textoUnidades;
			ctx.fillStyle = '#F58220';
			ctx.fillText(numero, xTexto, yTexto);
		}

		function insertaSignosMas(centroSeparacion) {
			var x = centroSeparacion - imgSignoMas.width / 2;
			var y = tabla.height + _margenElementos * 2 + imgFlechaAbajo.height + _textoUnidades / 2 - imgSignoMas.height / 2;
			ctx.drawImage(imgSignoMas, x, y);
		}

		function dibujaFlechaCentro() {
			var x = container.width / 2 - imgFlechaAbajo.width / 2;
			var y = tabla.height + _margenElementos * 3 + imgFlechaAbajo.height + _textoUnidades;
			ctx.drawImage(imgFlechaAbajo, x, y);
		}

		function dibujaNumeroFinal() {
			ctx.font = _textoNumeroPalabras + 'pt LarkeNeueThinFuente';
			ctx.textAlign = "center";
			var x = container.width / 2;
			var y = tabla.height + _textoUnidades + _textoNumeroPalabras + imgFlechaAbajo.height * 2 + _margenElementos * 4;
			ctx.fillStyle = '#F58220';
			ctx.fillText(_numero, x, y);
		}
	}).catch(function (error) {
		console.log(error);
	});
}

function valorPosicional(config) {
	var container = config.container,
	    params = config.params,
	    variables = config.variables,
	    versions = config.versions,
	    vt = config.vt;
	var _tipo = params._tipo,
	    _texto = params._texto,
	    _numeroPalabras = params._numeroPalabras,
	    _marca = params._marca,
	    _separacionNumeros = params._separacionNumeros,
	    _miles = params._miles,
	    _centenas = params._centenas,
	    _decenas = params._decenas,
	    _unidades = params._unidades,
	    _altoTexo = params._altoTexo,
	    _margenTopBottom = params._margenTopBottom;

	var imgSrcFlechaAbajo = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/flecha_fija.svg';
	var imgSrcSignoMas = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/num_sig_mas.svg';
	var srcFuente = 'https://desarrolloadaptatin.blob.core.windows.net/fuentes/LarkeNeueThin.ttf';

	var vars = vt ? variables : versions;

	try {
		_miles = regex('$' + _miles, vars, vt);
		_centenas = regex('$' + _centenas, vars, vt);
		_decenas = regex('$' + _decenas, vars, vt);
		_unidades = regex('$' + _unidades, vars, vt);
		if (_tipo === 'Numero Escrito') {
			_numeroPalabras = regex('$' + _numeroPalabras, vars, vt);
		} else if (_tipo === 'Texto') {
			_texto = regex(_texto, vars, vt);
		} else if (_tipo === 'Texto a Palabras') {
			_numeroPalabras = regex('$' + _numeroPalabras, vars, vt);
			_texto = regex(_texto, vars, vt);
		}
	} catch (error) {
		console.log(error);
	}

	var ctx = container.getContext('2d');
	Promise.all([cargaImagen(imgSrcFlechaAbajo), cargaImagen(imgSrcSignoMas), cargaFuente('LarkeNeueThinFuente', srcFuente)]).then(function (result) {
		var imgFlecha = result[0],
		    imgSignoMas = result[1];
		_altoTexo = Number(_altoTexo);
		_margenTopBottom = Number(_margenTopBottom);
		container.height = _margenTopBottom * 4 + _altoTexo * 2 + imgFlecha.height;
		container.width = 850;
		ctx.font = _altoTexo + 'pt LarkeNeueThinFuente';
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
			var xFlecha = container.width / 2 - imgFlecha.width / 2;
			var yFlecha = _altoTexo + _margenTopBottom * 2;
			ctx.drawImage(imgFlecha, xFlecha, yFlecha);

			var separaciones = _miles !== '$Seleccione' ? 4 : 3;
			var anchoSeparacion = (container.width - 60) / separaciones;
			var numeros = _miles !== '$Seleccione' ? [_miles, _centenas, _decenas, _unidades] : [_centenas, _decenas, _unidades];
			for (var i = 1; i < separaciones + 1; i++) {
				var centro = anchoSeparacion * i + 30 - anchoSeparacion / 2;
				var separacion = anchoSeparacion * i + 30;
				escribeNumero(centro, numeros[i - 1]);
				i + 1 !== separaciones + 1 && dibujaSignoMas(separacion);
			}
		} else if (_tipo === 'Texto') {
			var xFlecha = container.width / 2 - imgFlecha.width / 2;
			var yFlecha = _altoTexo + _margenTopBottom * 2;
			ctx.drawImage(imgFlecha, xFlecha, yFlecha);

			escribeNumeroCentro();
		} else if (_tipo === 'Texto a Palabras') {
			var xFlecha = container.width / 2 - imgFlecha.width / 2;
			var yFlecha = _altoTexo + _margenTopBottom * 2;
			ctx.drawImage(imgFlecha, xFlecha, yFlecha);
			var xPalabras = container.width / 2;
			var yPalabras = _altoTexo * 2 + _margenTopBottom * 3 + imgFlecha.height;
			ctx.fillText(_numeroPalabras, xPalabras, yPalabras);
		} else {
			var underline = _marca === 'U de Mil' ? 1 : 2;
			var anchoTextoNumero = _altoTexo * 4 + 3 * Number(_separacionNumeros);
			var margen = (container.width - anchoTextoNumero) / 4;
			var numeros = [_miles, _centenas, _decenas, _unidades];
			for (var i = 1; i < 5; i++) {
				var centro = margen + _separacionNumeros * (i - 1) + _altoTexo * i - _altoTexo / 2;
				var y = _margenTopBottom + _altoTexo;
				ctx.fillText(numeros[i - 1], centro, y);
				if (i === underline) {
					var xStart = centro - _altoTexo / 2 - 5;
					var xEnd = centro + _altoTexo / 2 + 5;
					var yUnderline = y + 5;
					dibujaUnderlineNumero(xStart, xEnd, yUnderline);
					var xFlecha = centro - imgFlecha.width / 2;
					var yFlecha = y + 5 + _margenTopBottom;
					ctx.drawImage(imgFlecha, xFlecha, yFlecha);
					ctx.textAlign = "left";
					var xTexto = centro - _altoTexo * 0.35;
					var yTexto = y + 5 + _margenTopBottom * 2 + imgFlecha.height + _altoTexo;
					if (underline === 2) {
						ctx.fillText(_centenas + ' centenas = ' + _centenas + '00', xTexto, yTexto);
					} else {
						ctx.fillText(_miles + ' unidades de mil = ' + _miles + '000', xTexto, yTexto);
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
			var numero = _miles + ' ' + _centenas + _decenas + _unidades;
			var x = container.width / 2;
			var y = _altoTexo * 2 + _margenTopBottom * 3 + imgFlecha.height;
			ctx.fillText(numero, x, y);
		}

		function escribeNumero(centro, numero) {
			var y = _altoTexo * 2 + _margenTopBottom * 3 + imgFlecha.height;
			ctx.fillText(numero, centro, y);
		}

		function dibujaSignoMas(separacion) {
			var x = separacion - imgSignoMas.width / 2;
			var y = _altoTexo * 2 + _margenTopBottom * 3 + imgFlecha.height - _altoTexo / 2 - imgSignoMas.height / 2;
			ctx.drawImage(imgSignoMas, x, y);
		}
	}).catch(function (error) {
		console.log(error);
	});
}

function repeticionPic(config) {
	var container = config.container,
	    params = config.params,
	    variables = config.variables,
	    versions = config.versions,
	    vt = config.vt;


	var imagenes = [{
		name: 'bloque mil',
		src: 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/umil.svg'
	}, {
		name: 'bloque cien',
		src: 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/centena.svg'
	}, {
		name: 'bloque diez',
		src: 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/decena.svg'
	}, {
		name: 'bloque uno',
		src: 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/unidad.svg'
	}, {
		name: 'billete mil',
		src: 'https://desarrolloadaptatin.blob.core.windows.net/agapito/1000_1.png'
	}, {
		name: 'moneda cien',
		src: 'https://desarrolloadaptatin.blob.core.windows.net/agapito/100_1.png'
	}, {
		name: 'moneda diez',
		src: 'https://desarrolloadaptatin.blob.core.windows.net/agapito/10_1.png'
	}, {
		name: 'moneda uno',
		src: 'https://desarrolloadaptatin.blob.core.windows.net/agapito/1_1.png'
	}, {
		name: 'moneda quinientos',
		src: 'https://desarrolloadaptatin.blob.core.windows.net/agapito/500_1.png'
	}, {
		name: 'moneda cincuenta',
		src: 'https://desarrolloadaptatin.blob.core.windows.net/agapito/50_1.png'
	}, {
		name: 'moneda cinco',
		src: 'https://desarrolloadaptatin.blob.core.windows.net/agapito/5_1.png'
	}];

	var _pictoricos = params._pictoricos,
	    _separacion = params._separacion,
	    heightCanvas = params.heightCanvas,
	    widthCanvas = params.widthCanvas,
	    _imagen1 = params._imagen1,
	    _altoImagen1 = params._altoImagen1,
	    _formaRepeticion1 = params._formaRepeticion1,
	    _repeticiones1 = params._repeticiones1,
	    _separacion1 = params._separacion1,
	    _separaciony1 = params._separaciony1,
	    _imagen2 = params._imagen2,
	    _altoImagen2 = params._altoImagen2,
	    _formaRepeticion2 = params._formaRepeticion2,
	    _repeticiones2 = params._repeticiones2,
	    _separacion2 = params._separacion2,
	    _separaciony2 = params._separaciony2,
	    _imagen3 = params._imagen3,
	    _altoImagen3 = params._altoImagen3,
	    _formaRepeticion3 = params._formaRepeticion3,
	    _repeticiones3 = params._repeticiones3,
	    _separacion3 = params._separacion3,
	    _separaciony3 = params._separaciony3,
	    _imagen4 = params._imagen4,
	    _altoImagen4 = params._altoImagen4,
	    _formaRepeticion4 = params._formaRepeticion4,
	    _repeticiones4 = params._repeticiones4,
	    _separacion4 = params._separacion4,
	    _separaciony4 = params._separaciony4,
	    _imagen5 = params._imagen5,
	    _altoImagen5 = params._altoImagen5,
	    _formaRepeticion5 = params._formaRepeticion5,
	    _repeticiones5 = params._repeticiones5,
	    _separacion5 = params._separacion5,
	    _separaciony5 = params._separaciony5,
	    _imagen6 = params._imagen6,
	    _altoImagen6 = params._altoImagen6,
	    _formaRepeticion6 = params._formaRepeticion6,
	    _repeticiones6 = params._repeticiones6,
	    _separacion6 = params._separacion6,
	    _separaciony6 = params._separaciony6,
	    _imagen7 = params._imagen7,
	    _altoImagen7 = params._altoImagen7,
	    _formaRepeticion7 = params._formaRepeticion7,
	    _repeticiones7 = params._repeticiones7,
	    _separacion7 = params._separacion7,
	    _separaciony7 = params._separaciony7,
	    _imagen8 = params._imagen8,
	    _altoImagen8 = params._altoImagen8,
	    _formaRepeticion8 = params._formaRepeticion8,
	    _repeticiones8 = params._repeticiones8,
	    _separacion8 = params._separacion8,
	    _separaciony8 = params._separaciony8;


	var vars = vt ? variables : versions;
	try {
		_repeticiones1 = regex('$' + _repeticiones1, vars, vt);
		_repeticiones2 = regex('$' + _repeticiones2, vars, vt);
		_repeticiones3 = regex('$' + _repeticiones3, vars, vt);
		_repeticiones4 = regex('$' + _repeticiones4, vars, vt);
		_repeticiones5 = regex('$' + _repeticiones5, vars, vt);
		_repeticiones6 = regex('$' + _repeticiones6, vars, vt);
		_repeticiones7 = regex('$' + _repeticiones7, vars, vt);
		_repeticiones8 = regex('$' + _repeticiones8, vars, vt);
	} catch (error) {
		console.log(error);
	}

	var repeticiones = getRepeticiones();

	_separacion = Number(_separacion);
	var xStart = _separacion;
	container.height = Number(heightCanvas);
	container.width = Number(widthCanvas);
	var ctx = container.getContext('2d');
	//carga las imagenes y dibuja las repeticiones
	Promise.all(repeticiones.map(function (x) {
		return cargaImagen(x.imagen.src);
	})).then(function (imagenes) {
		repeticiones.forEach(function (x, i) {
			repeticiones[i].imagen = imagenes[i];
		});
		return repeticiones;
	}).then(function (repeticionesPictoricas) {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = repeticionesPictoricas[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var repeticion = _step.value;

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
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	}).catch(function (error) {
		console.log(error);
	});

	function getRepeticiones() {
		var repeticiones = [{
			imagen: _imagen1 !== '' ? imagenes.find(function (x) {
				return x.name === _imagen1;
			}) : { src: '' },
			altoImagen: Number(_altoImagen1),
			formaRepeticion: _formaRepeticion1,
			repeticiones: Number(_repeticiones1),
			separacion: Number(_separacion1),
			separaciony: Number(_separaciony1)
		}];

		if (_pictoricos > 1) {
			repeticiones[1] = {
				imagen: _imagen2 !== '' ? imagenes.find(function (x) {
					return x.name === _imagen2;
				}) : { src: '' },
				altoImagen: Number(_altoImagen2),
				formaRepeticion: _formaRepeticion2,
				repeticiones: Number(_repeticiones2),
				separacion: Number(_separacion2),
				separaciony: Number(_separaciony2)
			};
		}

		if (_pictoricos > 2) {
			repeticiones[2] = {
				imagen: _imagen3 !== '' ? imagenes.find(function (x) {
					return x.name === _imagen3;
				}) : { src: '' },
				altoImagen: Number(_altoImagen3),
				formaRepeticion: _formaRepeticion3,
				repeticiones: Number(_repeticiones3),
				separacion: Number(_separacion3),
				separaciony: Number(_separaciony3)
			};
		}

		if (_pictoricos > 3) {
			repeticiones[3] = {
				imagen: _imagen4 !== '' ? imagenes.find(function (x) {
					return x.name === _imagen4;
				}) : { src: '' },
				altoImagen: Number(_altoImagen4),
				formaRepeticion: _formaRepeticion4,
				repeticiones: Number(_repeticiones4),
				separacion: Number(_separacion4),
				separaciony: Number(_separaciony4)
			};
		}

		if (_pictoricos > 4) {
			repeticiones[4] = {
				imagen: _imagen5 !== '' ? imagenes.find(function (x) {
					return x.name === _imagen5;
				}) : { src: '' },
				altoImagen: Number(_altoImagen5),
				formaRepeticion: _formaRepeticion5,
				repeticiones: Number(_repeticiones5),
				separacion: Number(_separacion5),
				separaciony: Number(_separaciony5)
			};
		}

		if (_pictoricos > 5) {
			repeticiones[5] = {
				imagen: _imagen6 !== '' ? imagenes.find(function (x) {
					return x.name === _imagen6;
				}) : { src: '' },
				altoImagen: Number(_altoImagen6),
				formaRepeticion: _formaRepeticion6,
				repeticiones: Number(_repeticiones6),
				separacion: Number(_separacion6),
				separaciony: Number(_separaciony6)
			};
		}

		if (_pictoricos > 6) {
			repeticiones[6] = {
				imagen: _imagen7 !== '' ? imagenes.find(function (x) {
					return x.name === _imagen7;
				}) : { src: '' },
				altoImagen: Number(_altoImagen7),
				formaRepeticion: _formaRepeticion7,
				repeticiones: Number(_repeticiones7),
				separacion: Number(_separacion7),
				separaciony: Number(_separaciony7)
			};
		}

		if (_pictoricos > 7) {
			repeticiones[7] = {
				imagen: _imagen8 !== '' ? imagenes.find(function (x) {
					return x.name === _imagen8;
				}) : { src: '' },
				altoImagen: Number(_altoImagen8),
				formaRepeticion: _formaRepeticion8,
				repeticiones: Number(_repeticiones8),
				separacion: Number(_separacion8),
				separaciony: Number(_separaciony8)
			};
		}

		return repeticiones;
	}

	function dibujaRepeticionVertical(repeticion) {
		var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
		var yStart = container.height / 2 - (repeticion.repeticiones * repeticion.altoImagen + (repeticion.repeticiones - 1) * repeticion.separacion) / 2;
		for (var i = 0, x = xStart, y; i < repeticion.repeticiones; i++) {
			y = yStart + i * repeticion.altoImagen + i * repeticion.separacion;
			ctx.drawImage(repeticion.imagen, x, y, width, repeticion.altoImagen);
		}
		return x + width + _separacion;
	}

	function dibujaRepeticionHorizontal(repeticion) {
		var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
		for (var i = 0, x, y; i < repeticion.repeticiones; i++) {
			x = xStart + i * repeticion.separacion + i * width;
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
				x = width * i + repeticion.separacion * i + xStart;
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
			y = container.height / 2 - height / 2 + i * repeticion.separaciony;
			ctx.drawImage(repeticion.imagen, x, y, width, repeticion.altoImagen);
		}
		return x + width + _separacion;
	}

	function dibujaRepeticionDiagonalApilado(repeticion) {
		var width = repeticion.imagen.width * repeticion.altoImagen / repeticion.imagen.height;
		for (var i = 0, x, y, height; i < repeticion.repeticiones; i++) {
			x = i <= 4 ? xStart + i * repeticion.separacion : xStart + width + 5 * repeticion.separacion + (i - 5) * repeticion.separacion;
			if (repeticion.repeticiones <= 5) {
				// solo hay una pila
				height = repeticion.altoImagen + (repeticion.repeticiones - 1) * repeticion.separaciony;
				y = container.height / 2 - height / 2 + i * repeticion.separaciony;
			} else {
				// hay dos pilas
				if (i <= 4) {
					height = repeticion.altoImagen + 4 * repeticion.separaciony;
					y = container.height / 2 - height / 2 + i * repeticion.separaciony;
				} else {
					height = repeticion.altoImagen + (repeticion.repeticiones - 5) * repeticion.separaciony;
					y = container.height / 2 - height / 2 + (i - 4) * repeticion.separaciony;
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
				dibujaBloqueEnPosicionCuatro(1, repeticion.imagen, repeticion.altoImagen, repeticion.separacion);
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

		function dibujaBloqueEnPosicionNueve(posicion, imagen, altoImagen, separacion) {
			//posicion 1-9
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