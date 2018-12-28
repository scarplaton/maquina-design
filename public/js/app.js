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
		var variable = variables.find(function(item) {
			return item.var === coincidencia[1];
		});
		return variable.val;
	});
	return result;
}

function regex(theInput, theVariables, isTutorial) {
	var result = theInput.toString().replace(/\$[a-z]/g, function(coincidencia) { //coincidencia => '$a'
			var variable = theVariables.find(item => item.var == coincidencia[1]);
			return isTutorial ? variable.vt : variable.val;
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

//funciones para poner texto en texto
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

const FUNCIONES = [	
	{ name:'General', tag:'general', fns:[ 
		{ id:'Insertar Texto', action:insertarTexto }, 
		{ id:'Insertar Input', action:insertarInput },
		{ id:'Insertar Input Fraccion', action:insertarInputFraccion } ] },
	{ name:'Datos', tag:'datos', fns:[ ] },
	{ name:'Numeracion', tag:'numeracion', fns:[
		{ id:'Recta 2', action:recta },
		{ id:'Tabla Posicional', action:tablaPosicional },
		{ id:'Valor Posicional', action:valorPosicional },
		{ id:'Bloques Multibase', action:bloquesMultibase }
	]},  
  	{ name:'Medicion', tag:'medicion', fns:[{ id:'Perimetro', action:igualPerimetro } ] }
]

function print() { //Dibujar ejercicios
	var h = ['e', 'r', 'g'];
	h.forEach(n => {
		contenidoBody[n].forEach((m, i) => {
			let j = FUNCIONES.findIndex(x => x.tag == m.tag), 
			k = FUNCIONES[j].fns.findIndex(x => x.id == m.name)
			FUNCIONES[j].fns[k].action({ container:document.getElementById(`container-${n}${i}`), params:m.params, versions:versionBody.vars, vt:false })
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
			contenidoHtml += `<canvas id="container-${'e'}${i}" class="img-fluid" style="background:${m.params.background}"></canvas>`
		} else {
			contenidoHtml += `<div id="container-${'e'}${i}" class="general"></div>`
		}
		contenidoHtml += '</div>'
	});
	contenidoDiv.innerHTML = contenidoHtml;
	// INICIO RESPUESTA
	var respuestaDiv = document.getElementById('respuesta');
	var respuestaHtml = '';
	var canvasSeleccionables = contenidoBody['r'].filter(function(item) {
		return item.tag != 'general'
	});
	if(canvasSeleccionables.length === 3) {
		canvasSeleccionables = shuffle(canvasSeleccionables, 5);
		canvasSeleccionables.forEach(function(item, index){
			var esCorrecta = item.params.esCorrecta ? true : false
			var dataContent = { 
				feedback: item.params.feedback, 
				esCorrecta, 
				opcion: `Opcion ${index+1}`, 
				errFrec: item.params.errFrec 
			};
			respuestaHtml += `<div class="col-md-${item.width.md} col-sm-${item.width.sm} col-xs-${item.width.xs} radio-div text-center">`
			respuestaHtml += `<canvas class="img-fluid" id="container-${'r'}${item.position}" style="background:${item.params.background}"></canvas>`
			respuestaHtml += `<h5 class="h5 text-center">Opcion ${index+1}</h5>`
			respuestaHtml += `<input name="answer" value="Opcion ${index+1}" class="d-none" type="radio" data-content='${JSON.stringify(dataContent)}' />`
			respuestaHtml += '</div>'
		});
	} else {
		contenidoBody['r'].forEach(function(item, index){
			respuestaHtml += `<div class="col-md-${item.width.md} col-sm-${item.width.sm} col-xs-${item.width.xs} tag">`
			if (item.tag != 'general') {
				respuestaHtml += `<canvas class="img-fluid" id="container-${'r'}${index}" style="background:${item.params.background}"></canvas>`
			} else {
				respuestaHtml += `<div id="container-${'r'}${index}" class="general"></div>`
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
			glosaHtml += `<canvas class="img-fluid" id="container-${'g'}${i}" style="background:${m.params.background}"></canvas>`
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
function insertarInput(config) {
	const { container, params, variables, versions, vt } = config,
	{ tipoInput, maxLength, inputSize, error0, error2, error3, error4,
		feed0, feed1, feed2, feed3, feed4, 
		value1, value2, value3, value4, inputType,colmd,colsm,col } = params
	var vars = vt ? variables : versions;
	var values = inputSize === 3 ? [value1, value2, value3] : [value1, value2, value3, value4];
	var feedback = inputSize === 3 ? [feed1,feed2, feed3] : [feed1, feed2, feed3, feed4];
	var errFrec = inputSize === 3 ? [undefined, error2, error3] : [undefined, error2, error3, error4];
	let r = '', n = '', valoresReemplazados = '';
	var feedGenerico = regex(feed0, vars, vt);
	var answers = [{
		respuesta: regex(value1, vars, vt),
		feedback: regex(feed1, vars, vt),
		errFrec: null
	},{
		respuesta: regex(value2, vars, vt),
		feedback: feed0 === '' ? regex(feed2, vars, vt) : feedGenerico,
		errFrec: error0 === '' ? error2 : error0
	}];
	if(inputSize > 2) {
		answers[2] = {
			respuesta: regex(value3, vars, vt),
			feedback: feed0 === '' ? regex(feed3, vars, vt) : feedGenerico,
			errFrec: error0 === '' ? error3 : error0
		}
	}
	if(inputSize > 3) {
		answers[3] = {
			respuesta: regex(value4, vars, vt),
			feedback: feed0 === '' ? regex(feed4, vars, vt) : feedGenerico,
			errFrec: error0 === '' ? error4 : error0
		}
	}
	if (container) {
		switch(inputType) {
			case 'input':
				var dataContent = {
					tipoInput,
					answers
				};
				container.innerHTML = '';
				switch (tipoInput) {
					case 'texto':
						container.innerHTML = `<input type="text" maxlength="${maxLength}" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputTexto(event)" />`;
						break;
					case 'numero':
						container.innerHTML = `<input type="text" maxlength="${maxLength}" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />`;
						break;
					case 'alfanumerico':
						container.innerHTML = `<input type="text" maxlength="${maxLength}" placeholder="Respuesta" data-content='${JSON.stringify(dataContent)}' onkeypress="cambiaInputAlfanumerico(event)"/>`;
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
	<input type="radio" id="radio-${i}" name="answer" onchange="cambiaRadios(event)" value="${m.respuesta}" data-content='${JSON.stringify(m)}'>
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
function insertarInputFraccion(config) {
	const { container, params, variables, versions, vt } = config;
	var inputFraccion = '', vars;
	try {
		vars = vt ? variables : versions;
		var feedbackGood = regex(params.feedbackGood, vars, vt);
		var feedbackBad = regex(params.feedbackBad, vars, vt);
		var disabled = params.disabled==='si' ? 'disabled': '';
		var entero = regex('$'.concat(params.entero), vars, vt);
		var numerador = regex('$'.concat(params.numerador), vars, vt);
		var denominador = regex('$'.concat(params.denominador), vars, vt);
		inputFraccion = '<table><tbody><tr><td rowspan="2">';
		inputFraccion += `<input type="text" id="entero" name="answer" class="input-numerador" data-content="{'feedbackGood':'${feedbackGood}','feedbackBad':'${feedbackBad}','esCorrecta': '${entero}'}" ${disabled} ${params.disabled==='si' && `value="${entero}"`} />`;
		inputFraccion += '</td><td style="border-bottom: 2px solid black;">'
		inputFraccion += `<input type="text" id="numerador" name="answer" class="input-num-y-den" data-content="{'feedbackGood':'${feedbackGood}','feedbackBad':'${feedbackBad}','esCorrecta': '${numerador}'}" ${disabled} ${params.disabled==='si' && `value="${numerador}"`}"/>`
		inputFraccion += '</td></tr><tr><td>'
		inputFraccion += `<input type="text" id="denominador" name="answer" class="input-num-y-den" data-content="{'feedbackGood':'${feedbackGood}','feedbackBad':'${feedbackBad}','esCorrecta': '${denominador}'}" ${disabled} ${params.disabled==='si' && `value="${denominador}"`}/>`
		inputFraccion += '</td></tr></tbody></table>';
	} catch(e) {
		console.log(e);
	}
	container.innerHTML = inputFraccion;
}
function recta(config) {
	const { container, params, variables, versions, vt } = config
		const {
		  _altoCanvas,
		  _anchoCanvas,
		  _anchoReacta,
		  _largoLineasFlechas,
		  _posiciones,
		  _marcarPosiciones,
		  _altoPosiciones,
		  _ponerObjeto,
		  _posicionObjeto,
		  _tipoObjeto,
		  _leyenda,
		  _proporcion,
		  _limite,
		  _dibujaFlechas,
		  _escalaFlechas,
		  _dibujaFlechasHasta,
		  _dibujaRango,
		  _rangoCorchete,
		  _textoRango,
		  _fraccion
		} = params;
		var conoImgSrc = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/Eje_1/OA_10/Cono.png';
		var xFinal = _anchoCanvas-(_anchoReacta/2);
		var xInicial = _anchoReacta/2;
		var inicialFinalY = _altoCanvas/2;
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
		ctx.moveTo(xInicial,inicialFinalY);
  
		dibujaFlechas(xInicial,inicialFinalY,true);
  
		ctx.moveTo(xInicial, inicialFinalY);
		ctx.lineTo(xFinal, inicialFinalY);
  
		dibujaFlechas(xFinal,inicialFinalY,false);
  
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = _anchoReacta;
		ctx.stroke();
		ctx.closePath();
	  }
  
	  function dibujaFlechas(x,y,primera) {
		if(primera) {
		  ctx.lineTo(x+_largoLineasFlechas*Math.cos(Math.PI/4), y-_largoLineasFlechas*Math.sin(Math.PI/4));
		  ctx.moveTo(x,inicialFinalY);
		  ctx.lineTo(x+_largoLineasFlechas*Math.cos(Math.PI/4), y-_largoLineasFlechas*Math.sin(Math.PI/4*-1));
		} else {
		  ctx.lineTo(x-_largoLineasFlechas*Math.cos(Math.PI/4*-1), y-_largoLineasFlechas*Math.sin(Math.PI/4*-1));
		  ctx.moveTo(x, inicialFinalY);
		  ctx.lineTo(x-_largoLineasFlechas*Math.cos(Math.PI/4*-1), y-_largoLineasFlechas*Math.sin(Math.PI/4));
		}
	  }
  
	  function marcarPosiciones() {
		var divicion = _anchoCanvas / _posiciones;
		switch(_marcarPosiciones) {
		  case 'todas':
			for(var i = 1; i < _posiciones; i++) {
			  ctx.beginPath();
			  ctx.moveTo(i*divicion,inicialFinalY-(_altoPosiciones/2));
			  ctx.lineTo(i*divicion,inicialFinalY+(_altoPosiciones/2));
			  ctx.stroke();
			  ctx.closePath();
			}
			break;
		  case 'inicial y final':
			ctx.beginPath();
			ctx.moveTo(divicion,inicialFinalY-(_altoPosiciones/2));
			ctx.lineTo(divicion,inicialFinalY+(_altoPosiciones/2));
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(_anchoCanvas-divicion,inicialFinalY-(_altoPosiciones/2));
			ctx.lineTo(_anchoCanvas-divicion,inicialFinalY+(_altoPosiciones/2));
			ctx.stroke();
			ctx.closePath();
			break;
		  case 'proporcional':
			try {
			  var divicion = _anchoCanvas / _posiciones;
			  var largoRecta = _anchoCanvas - (divicion * 2);
			  var proporcion = regex(_proporcion, vt?variables:versions, vt);
			  proporcion = eval(proporcion);
			  var limite = regex(_limite, vt?variables:versions, vt);
			  limite = eval(limite);
			  var espacio = largoRecta/(limite/proporcion);
			  
			  for(var i = 0, separacion = 0; i < (limite/proporcion)+1; i++) {
				ctx.beginPath();
				var startEndX = (i*espacio)+divicion;
				if(Number.isInteger(separacion)) {
				  var startY = inicialFinalY-(Number(_altoPosiciones)+3/2);
				  var endY = inicialFinalY+(Number(_altoPosiciones)+3/2);
				  ctx.moveTo(startEndX,startY);
				  ctx.lineTo(startEndX,endY);
				} else {
				  ctx.moveTo(startEndX,inicialFinalY-(Number(_altoPosiciones)/2));
				  ctx.lineTo(startEndX,inicialFinalY+(Number(_altoPosiciones)/2));
				}
				ctx.stroke();
				ctx.closePath();
				separacion=separacion+proporcion;
			  }
			} catch(e) {
			  console.log(e);
			}
			break;
		}
	  }
  
	  function dibujaObjetoEnPosicion() {
		var divicion = _anchoCanvas / _posiciones;
		var posiciones = String(Number(regex(_posicionObjeto, vt?variables:versions, vt))).split(',');
		switch(_tipoObjeto) {
		  case 'cono':
			  posiciones.forEach(function(posicion) {
				var x = Number.parseFloat(posicion)
				if(x) {
				  var posicionX = ((_anchoCanvas - (divicion * 2)) * (1/x)) + divicion; 
				  ctx.beginPath();
				  ctx.moveTo(posicionX,inicialFinalY-(_altoPosiciones/2));
				  ctx.lineTo(posicionX,inicialFinalY+(_altoPosiciones/2));
				  ctx.stroke();
				  ctx.closePath();
				  var img = new Image();
				  img.src = conoImgSrc;
				  img.onload = function() {
					var imgX = posicionX-(img.width/2);
					var imgY = inicialFinalY-(_altoPosiciones/2)-img.height-20;
					ctx.drawImage(img, imgX, imgY);
				  }
				  dibujaFraccion(posicionX);
				}
			  });
			break;
		}
	  }
  
	  function dibujaFraccion(posicionX) {
		var denominador = Number(regex(_posicionObjeto, vt?variables:versions, vt));
		var numerador = 1;
		var textHeightFraccion = 20;
		ctx.font = `${textHeightFraccion}px Arial`;
		ctx.fillStyle = 'black';
		var anchoNumerador = ctx.measureText(String(numerador)).width;
		var anchoDenominador = ctx.measureText(String(denominador)).width;
		
		var numeradorX = posicionX-(anchoNumerador/2);
		var numeradorY = inicialFinalY+(_altoPosiciones/2)+20+textHeightFraccion;
		ctx.fillText(String(numerador), numeradorX, numeradorY);
  
		ctx.beginPath();
		var lineaX = posicionX-10;
		var lineaY =inicialFinalY+(_altoPosiciones/2)+20+(textHeightFraccion + 5)
		ctx.moveTo(lineaX, lineaY);
		ctx.lineTo(lineaX+20, lineaY);
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();
  
		var denominadorX = posicionX-(anchoDenominador/2);
		var denominadorY = inicialFinalY+(_altoPosiciones/2)+25+(textHeightFraccion*2);
		ctx.fillText(String(denominador), denominadorX, denominadorY);
	  }
  
	  function dibujaFraccion2() {
		switch(_escalaFlechas) {
		  case 'principal':
			break;
		  case 'secundaria':
			try {
			  var numeros = String(regex(_fraccion, vt?variables:versions, vt)).split(',');
			  var divicion = _anchoCanvas / _posiciones;
			  var largoRecta = _anchoCanvas - (divicion * 2);
			  var proporcion = regex(_proporcion, vt?variables:versions, vt);
			  proporcion = eval(proporcion);
			  var limite = regex(_limite, vt?variables:versions, vt);
			  limite = eval(limite);
			  var largo = regex(_rangoCorchete, vt?variables:versions, vt);
			  largo = eval(largo);
			  var espacios = limite/proporcion;
			  var largoSeparacion = largoRecta/espacios;
			 
			  if(numeros.length === 2) {
  
			  } else if (numeros.length === 3) {
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
				
				var widthFraccion = enteroWidth + 25;//20 linea de separacion y 5 entre entero y la linea
				var enteroX = x-(widthFraccion/2);
				ctx.font = '25px Arial';
				ctx.fillText(String(entero), enteroX, y+40);
				
				ctx.font = '20px Arial';
				var numeradorX = x+(widthFraccion/2)-numeradorWidth-8;
				ctx.fillText(String(numerador), numeradorX, y+28);
  
				var inicioDivicionX = x-(widthFraccion/2)+enteroWidth+5;
				ctx.beginPath();
				ctx.moveTo(inicioDivicionX, y+32);
				ctx.lineTo(inicioDivicionX+20, y+32);
				ctx.stroke();
				ctx.closePath();
  
				var denominadorX = x+(widthFraccion/2)-denominadorWidth-8;
				ctx.fillText(String(denominador), denominadorX, y+51);
			  }
			}catch(e){
			  console.log(e);
			}
			break;
		}
	  }
  
	  function dibujaLeyenda() {
		var divicion = _anchoCanvas / _posiciones;
		ctx.font = `${15}px Arial`;
		ctx.fillStyle = 'black';
		var anchoTexto = ctx.measureText('Borde de').width;
		var textoX = divicion-(anchoTexto/2);
		var textoY = inicialFinalY-(_altoPosiciones/2)-40;
		ctx.fillText('Borde de', textoX, textoY);
		
		anchoTexto = ctx.measureText('la cancha').width;
		textoX = divicion-(anchoTexto/2);
		textoY = inicialFinalY-(_altoPosiciones/2)-25;
		ctx.fillText('la cancha', textoX, textoY);
  
		anchoTexto = ctx.measureText('1m').width;
		textoX = _anchoCanvas-divicion-(anchoTexto/2);
		textoY = inicialFinalY+(_altoPosiciones/2)+30;
		ctx.fillText('1m', textoX, textoY);
	  }
  
	  function dibujaFlechasCamino() {
		switch(_escalaFlechas) {
		  case 'principal':
			break;
		  case 'secundaria':
			try {
			  var divicion = _anchoCanvas / _posiciones;
			  var largoRecta = _anchoCanvas - (divicion * 2);
			  var proporcion = regex(_proporcion, vt?variables:versions, vt);
			  proporcion = eval(proporcion);
			  var limite = regex(_limite, vt?variables:versions, vt);
			  limite = eval(limite);
			  var espacios = limite/proporcion;
			  var largoSeparacion = largoRecta/espacios;
			  var cantidadFlechas = regex(_dibujaFlechasHasta, vt?variables:versions, vt);
			  
			  for(var i = 0; i < Number(cantidadFlechas); i++) {
				ctx.lineWidth = 2;
				ctx.beginPath();
				var centroX = (i*largoSeparacion)+divicion+(largoSeparacion/2),
				  centroY = inicialFinalY,
				  startAngle = Math.PI * 1.2,
				  endAngle = Math.PI * 1.8,
				  r = largoSeparacion/2;
				ctx.arc(centroX, centroY, r, startAngle, endAngle, false);
				ctx.stroke();
				var sx = Math.cos(endAngle)*r+centroX,
				  sy = Math.sin(endAngle)*r+centroY;
				ctx.lineTo(sx, sy-10);
				ctx.moveTo(sx, sy);
				ctx.lineTo(sx-10, sy);
				ctx.stroke();
				ctx.closePath();
			  }
			}catch(e){
			  console.log(e);
			}
			break;
		}
	  }
  
	  function dibujaNumeros() {
		var divicion = _anchoCanvas / _posiciones;
		switch(_marcarPosiciones) {
		  case 'todas':
			break;
		  case 'inicial y final':
			break;
		  case 'proporcional':
			try {
			  var divicion = _anchoCanvas / _posiciones;
			  var largoRecta = _anchoCanvas - (divicion * 2);
			  var proporcion = regex(_proporcion, vt?variables:versions, vt);
			  proporcion = eval(proporcion);
			  var limite = regex(_limite, vt?variables:versions, vt);
			  limite = eval(limite);
			  var espacio = largoRecta/(limite/proporcion);
			  ctx.font = `${15}px Arial`;
			  ctx.fillStyle = 'black';
			  for(var i = 0, separacion = 0; i < (limite/proporcion)+1; i++) {
				ctx.beginPath();
				var x = (i*espacio)+divicion;
				if(Number.isInteger(separacion)) {
				  var endY = inicialFinalY+(Number(_altoPosiciones)+40/2);
				  var width = ctx.measureText(String(separacion)).width;
				  ctx.fillText(String(separacion), x-(width/2), endY);
				} 
				ctx.stroke();
				ctx.closePath();
				separacion=separacion+proporcion;
			  }
			} catch(e) {
			  console.log(e);
			}
			break;
		}
	  }
  
	  function dibujaElementoRepetitivo() {
		switch(_escalaFlechas) {
		  case 'principal':
			break;
		  case 'secundaria':
			try {
			  var divicion = _anchoCanvas / _posiciones;
			  var largoRecta = _anchoCanvas - (divicion * 2);
			  var proporcion = regex(_proporcion, vt?variables:versions, vt);
			  proporcion = eval(proporcion);
			  var limite = regex(_limite, vt?variables:versions, vt);
			  limite = eval(limite);
			  var espacios = limite/proporcion;
			  var largoSeparacion = largoRecta/espacios;
			  var cantidadFlechas = regex(_dibujaFlechasHasta, vt?variables:versions, vt);
			  var img = new Image();
			  img.src = conoImgSrc;
			  img.onload = function() {
				for(var i = 1; i < Number(cantidadFlechas)+1; i++) {
				  var imgX = (i*largoSeparacion)+divicion-(img.width/2);
				  var imgY = inicialFinalY-(largoSeparacion/2)-10-img.height;
				  ctx.drawImage(img, imgX, imgY);
				}
			  }
			}catch(e){
			  console.log(e);
			}
		  break;
		}
	  }
  
	  function dibujaRango() {
		switch(_escalaFlechas) {
		  case 'principal':
			break;
		  case 'secundaria':
			try {
			  var divicion = _anchoCanvas / _posiciones;
			  var largoRecta = _anchoCanvas - (divicion * 2);
			  var proporcion = regex(_proporcion, vt?variables:versions, vt);
			  proporcion = eval(proporcion);
			  var limite = regex(_limite, vt?variables:versions, vt);
			  limite = eval(limite);
			  var largo = regex(_rangoCorchete, vt?variables:versions, vt);
			  largo = eval(largo);
			  var espacios = limite/proporcion;
			  var largoSeparacion = largoRecta/espacios;
			  var inicioFinalRango = inicialFinalY+50;
			  ctx.beginPath();
			  ctx.arc(divicion+10, inicioFinalRango-10, 10, Math.PI * 0.5, Math.PI);
			  ctx.moveTo(divicion+10, inicioFinalRango);
			  var terminoX = (largoSeparacion*Number(largo))+divicion;
			  ctx.lineTo((terminoX/2)-10+(divicion/2), inicioFinalRango);
			  ctx.arc((terminoX/2)-10+(divicion/2), inicioFinalRango+10, 10, Math.PI * 1.5, Math.PI * 2);
			  ctx.arc((terminoX/2)+10+(divicion/2), inicioFinalRango+10, 10, Math.PI, Math.PI * 1.5);
			  ctx.moveTo((terminoX/2)+10+(divicion/2), inicioFinalRango);
			  ctx.lineTo(terminoX-10, inicioFinalRango);
			  ctx.arc(terminoX-10, inicioFinalRango-10, 10, Math.PI * 0.5, 0, true);
			  ctx.stroke();
			  ctx.closePath();
			  var texto = regex(_textoRango, vt?variables:versions, vt);
			  var anchoTexto = ctx.measureText(texto).width;
			  var textoX = (terminoX+divicion-anchoTexto)/2;
			  var textoY = inicioFinalRango+30;
			  ctx.fillText(texto, textoX, textoY);
			}catch(e){
			  console.log(e);
			}
			break;
		}
	  }
}

function igualPerimetro(config) {
	const { container, params, variables, versions, vt } = config;
  
	container.width = params.cuadro * 10;
	container.height = params.cuadro * 5;
	container.style.border = params.borderWidth+"px solid  #000";
	
	var ctx = container.getContext('2d');
	
	for(var i = 1; i < 10; i++) { //lineas verticales
	  ctx.beginPath();
	  ctx.moveTo(i * params.cuadro, container.height);
	  ctx.lineTo(i * params.cuadro, 0);
	  ctx.strokeStyle = "black";
	  ctx.lineWidth=2;
	  ctx.stroke();
	  ctx.closePath();
	}
  
	for(var i = 1; i < 5; i++) {
	  ctx.beginPath();
	  ctx.moveTo(container.width, i * params.cuadro);
	  ctx.lineTo(0, i * params.cuadro);
	  ctx.strokeStyle = "black";
	  ctx.lineWidth=2;
	  ctx.stroke();
	  ctx.closePath();
	}
  
	try {
	  var varAncho, varAlto;
	  if(vt) {
		varAlto = variables.find(function(item) {
		  return item.var === params.alto
		});
		varAncho = variables.find(function(item) {
		  return item.var === params.ancho
		});
	  } else {
		varAlto = versions.find(function(item) {
		  return item.var === params.alto
		});
		varAncho = versions.find(function(item) {
		  return item.var === params.ancho
		});
	  }
	  
	  var alto = vt ? varAlto.vt : varAlto.val;
	  var ancho = vt ? varAncho.vt : varAncho.val;
	  dibujaRectangulo(ctx, ancho * params.cuadro, alto * params.cuadro, params.cuadro);
  
	} catch(error) {
	  console.log('explota');
	}
  
	function dibujaRectangulo(ctx, largox, largoy, lado) {
	  ctx.translate(0,0);
	  var x,y;
	  y = largoy / lado === 1 ? 2 * lado : lado;
	  x = (10 * lado)/2 - (Math.trunc((largox / lado) / 2) * lado);
	  ctx.beginPath();
	  ctx.rect(x, y, largox, largoy);
	  ctx.strokeStyle = "red";
	  ctx.lineWidth=4;
	  ctx.stroke();
	}
}

function tablaPosicional(config) {
  const { container, params, variables, versions, vt } = config;
  var imgSrcTablaCentena = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/tabla_CDU.svg';
  var imgSrcTablaUMil = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/tabla_UMCDU.svg';
  var imgSrcFlechaAbajo = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/flecha_fija.svg';
  var imgSrcSignoMas = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/num_sig_mas.svg';
  var srcFuente = 'https://desarrolloadaptatin.blob.core.windows.net/fuentes/LarkeNeueThin.ttf';
  var { _soloTabla,_umil,_centena,_decena,_unidad,_miles,_centenas,_decenas,_numero,_textoUnidades,_textoNumeroPalabras,_margenElementos } = params;
 
  var vars = vt ? variables : versions;
  try {
    if(_umil !== 'Seleccione') {
      _umil = regex(`$${_umil}`, vars, vt);
      _miles = regex(`$${_miles}`, vars, vt);
    } else {
      _umil = '0';
      _miles = '0000';
    }
    _centena = regex(`$${_centena}`, vars, vt);
    _decena = regex(`$${_decena}`, vars, vt);
    _unidad = regex(`$${_unidad}`, vars, vt);
    _centenas = regex(`$${_centenas}`, vars, vt);
    _decenas = regex(`$${_decenas}`, vars, vt);
    _numero = regex(`$${_numero}`, vars, vt);
  } catch(error) {
    console.log(error);
  }

  _textoUnidades = Number(_textoUnidades);
  _textoNumeroPalabras = Number(_textoNumeroPalabras);
  _margenElementos = Number(_margenElementos);
  Promise.all([
    cargaImagen(imgSrcTablaCentena), 
    cargaImagen(imgSrcTablaUMil), 
    cargaImagen(imgSrcFlechaAbajo),
    cargaImagen(imgSrcSignoMas),
    cargaFuente('LarkeNeueThinFuente', srcFuente)
  ]).then(function(result){
    var imgTablaCentena = result[0], 
    imgTablaUMil = result[1], 
    imgFlechaAbajo = result[2], 
    imgSignoMas = result[3];
    
    var ctx = container.getContext('2d');
    var tabla = _umil !== '0' ? imgTablaUMil : imgTablaCentena;
    container.height = _soloTabla == 'no' ? 
      tabla.height+_textoUnidades+_textoNumeroPalabras+(imgFlechaAbajo.height*2)+(_margenElementos*5) :
      tabla.height;
    container.width = tabla.width;
    ctx.drawImage(tabla, 0, 0);

    var diviciones = _umil !== '0' ? 4 : 3;
    var anchoSeparaciones = container.width / diviciones;
    var numeros = _umil !== '0' ? [_umil, _centena, _decena, _unidad] : [_centena, _decena, _unidad];
    var numerosSuma = _umil !== '0' ? [_miles, _centenas, _decenas, _unidad] : [_centenas, _decenas, _unidad];
    for(var i = 1; i < diviciones+1; i++){
      var centroSeccion = (anchoSeparaciones * i) - (anchoSeparaciones/2);
      var centroSeparacion = anchoSeparaciones * i;
      dibujaNumeros(numeros[i-1], centroSeccion);
      _soloTabla == 'no' && insertaFlecha(centroSeccion);
      _soloTabla == 'no' && dibujaNumerosSuma(numerosSuma[i-1], centroSeccion);
      i+1 !== diviciones+1 && _soloTabla == 'no' && insertaSignosMas(centroSeparacion);
    }

    dibujaFlechaCentro(centroSeccion);
    dibujaNumeroFinal();

    function dibujaNumeros(numero, centroSeccion) {
      var altoBox = (tabla.height/1.8);
      var altoTexto = altoBox*0.65;
      var yTexto = tabla.height-(altoBox/2)+(altoTexto/2);
      ctx.font = `${altoTexto}pt LarkeNeueThinFuente`;
      var anchoTexto = ctx.measureText(numero).width;
      var xTexto = centroSeccion-(anchoTexto/2);
      ctx.fillStyle = '#F58220';
      ctx.fillText(numero, xTexto, yTexto);
    }

    function insertaFlecha(centroSeccion) {
      var x = centroSeccion - (imgFlechaAbajo.width / 2)
      var y = tabla.height + _margenElementos;
      ctx.drawImage(imgFlechaAbajo, x, y);
    }

    function dibujaNumerosSuma(numero, centroSeccion) {
      ctx.font = `${_textoUnidades}pt LarkeNeueThinFuente`;
      var anchoTexto = ctx.measureText(numero).width;
      var xTexto = centroSeccion-(anchoTexto/2);
      var yTexto = tabla.height+imgFlechaAbajo.height+(_margenElementos*2)+_textoUnidades;
      ctx.fillStyle = '#F58220';
      ctx.fillText(numero, xTexto, yTexto);
    }
    
    function insertaSignosMas(centroSeparacion) {
      var x = centroSeparacion - (imgSignoMas.width/2);
      var y = tabla.height+(_margenElementos*2)+imgFlechaAbajo.height+(_textoUnidades/2)-(imgSignoMas.height/2);
      ctx.drawImage(imgSignoMas, x, y);
    }

    function dibujaFlechaCentro() {
      var x = (container.width/2) - (imgFlechaAbajo.width / 2);
      var y = tabla.height+(_margenElementos*3)+imgFlechaAbajo.height+_textoUnidades;
      ctx.drawImage(imgFlechaAbajo, x, y);
    }

    function dibujaNumeroFinal() {
      ctx.font = `${_textoNumeroPalabras}pt LarkeNeueThinFuente`;
      ctx.textAlign="center"; 
      var x = container.width / 2;
      var y = tabla.height+_textoUnidades+_textoNumeroPalabras+(imgFlechaAbajo.height*2)+(_margenElementos*4);
      ctx.fillStyle = '#F58220';
      ctx.fillText(_numero, x, y);
    }
  }).catch(function(error){
    console.log(error);
  });
}

function valorPosicional(config) {
  const { container, params, variables, versions, vt } = config;
  var { _tipo,_texto,_numeroPalabras,_marca,_separacionNumeros,_miles,_centenas,_decenas,_unidades,_altoTexo,_margenTopBottom } = params;
  var imgSrcFlechaAbajo = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/flecha_fija.svg';
  var imgSrcSignoMas = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/num_sig_mas.svg';
  var srcFuente = 'https://desarrolloadaptatin.blob.core.windows.net/fuentes/LarkeNeueThin.ttf';

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
    } else if(_tipo === 'Texto'){
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

function bloquesMultibase(config) {
  const { container, params, variables, versions, vt } = config;
  var { 
    _separacion,
    _miles,
    _heightWidthMiles,
    _centenas,
    _heightWidthCentenas,
    _aumentoCentenas,
    _decenas,
    _unidades,
    _heightWidthUnidades,
    _aumentoUnidades,
    _distribucion,
    _canvasWidth,
    _canvasHeight } = params;
  var srcBloqueUMil = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/umil.svg';
  var srcBloqueCentena = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/centena.svg';
  var srcBloqueDecena = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/decena.svg';
  var srcBloqueUnidad = 'https://desarrolloadaptatin.blob.core.windows.net/imagenesprogramacion/img_Funcionalidades_temp/unidad.svg';

  _separacion = Number(_separacion);
  _heightWidthMiles = Number(_heightWidthMiles);
  _heightWidthCentenas = Number(_heightWidthCentenas);
  _heightWidthUnidades = Number(_heightWidthUnidades);

  var vars = vt ? variables : versions;

  try {
    _miles = regex(`$${_miles}`, vars, vt);
    _centenas = regex(`$${_centenas}`, vars, vt);
    _decenas = regex(`$${_decenas}`, vars, vt);
    _unidades = regex(`$${_unidades}`, vars, vt);
  } catch(error) {
    console.log(error);
  }
  _separacion = Number(_separacion);
  _heightWidthMiles = Number(_heightWidthMiles);
  _heightWidthCentenas = Number(_heightWidthCentenas);
  _aumentoCentenas = Number(_aumentoCentenas);
  _heightWidthUnidades = Number(_heightWidthUnidades);
  _aumentoUnidades = Number(_aumentoUnidades);
  _canvasWidth = Number(_canvasWidth);
  _canvasHeight = Number(_canvasHeight);
  _miles = Number(_miles);
  _centenas = Number(_centenas);
  _decenas = Number(_decenas);
  _unidades = Number(_unidades);
  var ctx = container.getContext('2d');
  Promise.all([
    cargaImagen(srcBloqueUMil),
    cargaImagen(srcBloqueCentena),
    cargaImagen(srcBloqueDecena),
    cargaImagen(srcBloqueUnidad)
  ]).then(function(result) {
    var imgBloqueUMil = result[0],
    imgBloqueCentena = result[1],
    imgBloqueDecena = result[2],
    imgBloqueUnidad = result[3];
    var heightDecenas = _heightWidthCentenas,
               widthDecenas = _heightWidthCentenas*imgBloqueDecena.width/imgBloqueDecena.height;
    var bloques = [{ 
        tipo:'Miles',
        cantidad:_miles,
        dimension:_heightWidthMiles,
        img:imgBloqueUMil
    },{ 
        tipo:'Centenas',
        cantidad:_centenas,
        dimension:_heightWidthCentenas,
        aumento:_aumentoCentenas,
        img:imgBloqueCentena
    },{
        tipo:'Decenas',
        cantidad:_decenas,
        dimension: {
          height:heightDecenas,
          width:widthDecenas
        },
        img:imgBloqueDecena
    },{
        tipo:'Unidades',
        cantidad:_unidades,
        dimension:_heightWidthUnidades,
        aumento:_aumentoUnidades,
        img:imgBloqueUnidad
    }];
    container.height = _canvasHeight;
    container.width = _canvasWidth;
    var xStart = calculaInicioCentro();
    bloques.forEach(function(item){
      if(item.cantidad > 0) {
        if(_distribucion === 'ordenado') {
          switch(item.tipo) {
            case 'Miles':
              xStart = dibujaMiles(xStart, imgBloqueUMil, item.dimension);
              break;
            case 'Centenas':
              xStart = dibujaCientos(xStart);
              break;
            case 'Decenas':
              xStart = dibujaDecenas(xStart);
              break;
            case 'Unidades':
              xStart = dibujaUnidades(xStart, imgBloqueUnidad, item.dimension);
              break;
          }
        } else {
          if(item.tipo === 'Decenas') {
            xStart = dibujaBloqueEnLinea(item.img, item.cantidad, xStart, item.dimension.width, item.dimension.height);
          } else {
            xStart = dibujaBloqueEnLinea(item.img, item.cantidad, xStart, item.dimension, item.dimension);
          }
        }
      }
    });

  function calculaInicioCentro() {
    var anchoTotal = 0;
    if(_distribucion === 'ordenado') {
      for(let bloque of bloques) {
        if(bloque.cantidad > 0) {
          switch(bloque.tipo) {
            case 'Miles':
              if(bloque.cantidad === 1) {
                anchoTotal += _heightWidthMiles+_separacion;
              } else if(bloque.cantidad === 2 ||  bloque.cantidad === 4 || bloque.cantidad === 6) {
                anchoTotal += _heightWidthMiles*2+_separacion*2;
              } else {
                anchoTotal += _heightWidthMiles*3+_separacion*3;
              }
              break;
            case 'Centenas':
              anchoTotal += bloque.cantidad > 5 ? 
                ((bloque.cantidad-2)*_aumentoCentenas)+_heightWidthCentenas*2+_separacion*2:
                (bloque.cantidad-1)*_aumentoCentenas+_heightWidthCentenas+_separacion;
              break;
            case 'Decenas':
              anchoTotal += bloque.cantidad < 6 ? 
                bloque.cantidad*bloque.dimension.width+_separacion*bloque.cantidad: 
                6*bloque.dimension.width+_separacion*6;
              break;
            case 'Unidades':
              if(bloque.cantidad === 1) {
                anchoTotal += _heightWidthUnidades+_separacion;
              } else if(bloque.cantidad === 2 ||  bloque.cantidad === 4 || bloque.cantidad === 6) {
                anchoTotal += _heightWidthUnidades*2+_separacion*2;
              } else {
                anchoTotal += _heightWidthUnidades*3+_separacion*3;
              }
              break;
          }
        }
      }
    } else {
      for(let bloque of bloques) {
        if(bloque.cantidad > 0 && bloque.tipo === 'Decenas') {
          anchoTotal += (bloque.dimension.width*bloque.cantidad)+(bloque.cantidad*_separacion)
        } else if(bloque.cantidad > 0) {
          anchoTotal += (bloque.dimension*bloque.cantidad)+(bloque.cantidad*_separacion)
        }
      }
    }
    
    return container.width/2-(anchoTotal+_separacion)/2;
  }
            
  function dibujaMiles(xStart, imgBloqueUMil, dimension) {
    switch(_miles) {
      case 1:
        var { x } = dibujaBloqueEnPosicionUno(imgBloqueUMil, dimension);
        break;
      case 2:
        dibujaBloqueEnPosicionCuatro(1, imgBloqueUMil, dimension)
        var { x } = dibujaBloqueEnPosicionCuatro(4, imgBloqueUMil, dimension);
        break;
      case 3:
        dibujaBloqueEnPosicionNueve(1, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(5, imgBloqueUMil, dimension);
        var {x} = dibujaBloqueEnPosicionNueve(9, imgBloqueUMil, dimension);
        break;
      case 4:
        dibujaBloqueEnPosicionCuatro(1, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionCuatro(2, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionCuatro(3, imgBloqueUMil, dimension);
        var {x} = dibujaBloqueEnPosicionCuatro(4, imgBloqueUMil, dimension);
        break;
      case 5:
        dibujaBloqueEnPosicionNueve(1, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(3, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(5, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(7, imgBloqueUMil, dimension);
        var {x} = dibujaBloqueEnPosicionNueve(9, imgBloqueUMil, dimension);
        break;
      case 6:
        dibujaBloqueEnPosicionNueve(1, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(2, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(4, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(5, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(7, imgBloqueUMil, dimension);
        var {x} = dibujaBloqueEnPosicionNueve(8, imgBloqueUMil, dimension);
        break;
      case 7:
        dibujaBloqueEnPosicionNueve(1, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(3, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(4, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(5, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(6, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(7, imgBloqueUMil, dimension);
        var {x} = dibujaBloqueEnPosicionNueve(9, imgBloqueUMil, dimension);
        break;
      case 8:
        dibujaBloqueEnPosicionNueve(1, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(2, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(3, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(4, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(6, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(8, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(7, imgBloqueUMil, dimension);
        var {x} = dibujaBloqueEnPosicionNueve(9, imgBloqueUMil, dimension);
        break;
      case 9:
        dibujaBloqueEnPosicionNueve(1, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(2, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(3, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(4, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(5, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(6, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(8, imgBloqueUMil, dimension);
        dibujaBloqueEnPosicionNueve(7, imgBloqueUMil, dimension);
        var {x} = dibujaBloqueEnPosicionNueve(9, imgBloqueUMil, dimension);
        break;
    }
    return x+_heightWidthMiles;
  }

  function dibujaBloqueEnPosicionNueve(posicion, imagen, dimensiones) { //posicion 1-9
    var x, y;
    if(posicion==1 || posicion==4 || posicion==7) {
      x = _separacion+xStart;
    } else if(posicion==2 || posicion==5 || posicion==8) {
      x = _separacion*2+dimensiones+xStart;
    } else {
      x = _separacion*3+dimensiones*2+xStart;
    }
    if(posicion==1 || posicion==2 || posicion==3) {
      y = container.height/2 - dimensiones/2 - _separacion - dimensiones;
    } else if(posicion==4 || posicion==5 || posicion==6) {
      y = container.height/2 - dimensiones/2;
    } else {
      y = container.height/2 + dimensiones/2 + _separacion;
    }
    ctx.drawImage(imagen, x, y, dimensiones, dimensiones);
    return {x,y};
  }

  function dibujaBloqueEnPosicionCuatro(posicion, imagen, dimensiones) {
    if(posicion==1 || posicion==3) {
      x = _separacion+xStart;
    } else {
      x = _separacion*2+dimensiones+xStart;
    }
    if(posicion==1 || posicion==2) {
      y = container.height/2 - _separacion/2 - dimensiones;
    } else {
      y = container.height/2 + _separacion/2;
    }
    ctx.drawImage(imagen, x, y, dimensiones, dimensiones);
    console.log('estas malditas variables no sirven de nada', x, y);
    return {x,y};
  }

  function dibujaBloqueEnPosicionUno(imagen, dimensiones) {
    var x = _separacion+xStart;
    var y = container.height/2-dimensiones/2;
    ctx.drawImage(imagen, x, y, dimensiones, dimensiones);
    return {x,y};
  }

  function dibujaCientos(xInicial) {
    var heightTotal1 = _centenas > 5 ? 
      (_aumentoCentenas*4)+_heightWidthCentenas:
      (_aumentoCentenas*_centenas-1)+_heightWidthCentenas;
    var yInicial1 = container.height/2 - heightTotal1/2;
    for(var i=0,x,y; i<_centenas; i++) {
      if(i >= 5) {
          x = _separacion*2 + xInicial + (_aumentoCentenas * 3) + _heightWidthCentenas + (_aumentoCentenas * (i-4));     
          y = yInicial1 +  _separacion + (_aumentoCentenas * (i-5));
      } else {
          x = _separacion + xInicial + (_aumentoCentenas * i);
          y = yInicial1 +_separacion + (_aumentoCentenas * i);
      }
      ctx.drawImage(imgBloqueCentena, x, y, _heightWidthCentenas, _heightWidthCentenas);
    }
    return x+_heightWidthCentenas;
  }

  function dibujaDecenas(xInicial) {
    var yPrimera = _decenas < 6 ?
      container.height/2-heightDecenas/2 :
      container.height/2-(heightDecenas+widthDecenas*(_decenas-5)+_separacion*(_decenas-6))/2
    for(var i=0,x,x2,y2; i<_decenas; i++){
      if(i>=6) {
          x2 = _separacion + xInicial;
          y2 = yPrimera + _separacion*(i-5) + widthDecenas*(i-5) + heightDecenas;
          ctx.save();
          ctx.translate(x2,y2);
          ctx.rotate(-Math.PI/2);
          ctx.drawImage(imgBloqueDecena, 0, 0, widthDecenas, heightDecenas);
          ctx.restore();
      } else {
          x = (widthDecenas * i) + _separacion + (_separacion * i) + xInicial;
          ctx.drawImage(imgBloqueDecena, x, yPrimera, widthDecenas, heightDecenas);
      }
      
    }
    return x+widthDecenas;
  }

  function dibujaUnidades(xInicial, imgBloqueUnidad, dimension) {
    switch(_unidades) {
      case 1:
          var { x } = dibujaBloqueEnPosicionUno(imgBloqueUnidad, dimension);
          break;
      case 2:
          dibujaBloqueEnPosicionCuatro(1, imgBloqueUnidad, dimension)
          var { x } = dibujaBloqueEnPosicionCuatro(4, imgBloqueUnidad, dimension);
          break;
      case 3:
          dibujaBloqueEnPosicionNueve(1, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(5, imgBloqueUnidad, dimension);
          var {x} = dibujaBloqueEnPosicionNueve(9, imgBloqueUnidad, dimension);
          break;
      case 4:
          dibujaBloqueEnPosicionCuatro(1, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionCuatro(2, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionCuatro(3, imgBloqueUnidad, dimension);
          var {x} = dibujaBloqueEnPosicionCuatro(4, imgBloqueUnidad, dimension);
          break;
      case 5:
          dibujaBloqueEnPosicionNueve(1, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(3, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(5, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(7, imgBloqueUnidad, dimension);
          var {x} = dibujaBloqueEnPosicionNueve(9, imgBloqueUnidad, dimension);
          break;
      case 6:
          dibujaBloqueEnPosicionNueve(1, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(2, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(4, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(5, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(7, imgBloqueUnidad, dimension);
          var {x} = dibujaBloqueEnPosicionNueve(8, imgBloqueUnidad, dimension);
          break;
      case 7:
          dibujaBloqueEnPosicionNueve(1, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(3, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(4, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(5, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(6, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(7, imgBloqueUnidad, dimension);
          var {x} = dibujaBloqueEnPosicionNueve(9, imgBloqueUnidad, dimension);
          break;
      case 8:
          dibujaBloqueEnPosicionNueve(1, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(2, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(3, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(4, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(6, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(8, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(7, imgBloqueUnidad, dimension);
          var {x} = dibujaBloqueEnPosicionNueve(9, imgBloqueUnidad, dimension);
          break;
      case 9:
          dibujaBloqueEnPosicionNueve(1, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(2, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(3, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(4, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(5, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(6, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(8, imgBloqueUnidad, dimension);
          dibujaBloqueEnPosicionNueve(7, imgBloqueUnidad, dimension);
          var {x} = dibujaBloqueEnPosicionNueve(9, imgBloqueUnidad, dimension);
          break;
    }
    return x+_heightWidthMiles;
  }

  function dibujaBloqueEnLinea(img, cantidad, xInicio, dimensionx, dimensiony) {
      var y = container.height/2 - dimensiony/2;
      for(var i = 0, x; i < cantidad; i++) {
        x = xInicio+(_separacion*i)+(i*dimensionx);
        ctx.drawImage(img, x, y, dimensionx, dimensiony);
      }
      return x + _separacion + dimensionx;
  }
  }).catch(function(error) {
      console.log(error)
  });
}