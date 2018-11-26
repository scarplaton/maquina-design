//datos ejercicio
var contenidoBody = JSON.parse(document.body.getAttribute('data-content').replace(/\'/g, '\"'));
var versionBody = JSON.parse(document.body.getAttribute('data-version').replace(/\'/g, '\"'));

$(document).ready(function(){
	dibujaHtml();
	print();
});

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

function regexFunctions(text, doubleQuotes) {
	var result = text.replace(/(?=\{).*?(\})/g, function(coincidencia){ //coincidencia => '{funcion()}'
			var final = coincidencia.length - 2;
			var funcion = coincidencia.substr(1,final);
			return eval(funcion);
	});
	return result;
}
//funciones para poner texto en texto
function fraccion(entero, numerador, denominador) {
	return `<table style="margin:0 4px;display: inline-block;vertical-align: middle;">
	<tbody>
		<tr>
			${entero > 0 ? `<td rowspan="2">
				<span style="font-size:25px;color:black;">${entero}</span>
			</td>` : ''}
			<td style="border-bottom: 2px solid black;">
				<span style="font-size:18px;color:black;">&nbsp;${numerador}&nbsp;</span>
			</td>
		</tr>
		<tr>
			<td>
				<span style="font-size:18px;color:black;">&nbsp;${denominador}&nbsp;</span>
			</td>
		</tr>
	</tbody>
</table>`;
}

function shuffle(arr, t = 10) { 
	for (let i = 0; i < t; i++) { 
		arr = arr.sort(() => (.5 - Math.random()));
	}; 
	return arr 
}

const FUNCIONES = [	
	{ name:'General', tag:'general', fns:[ 
		{ id:'Insertar Texto', action:insertarTexto }, 
		{ id:'Insertar Input', action:insertarInput },
		{ id:'Insertar Input Fraccion', action:insertarInputFraccion } ] },
	{ name:'Datos', tag:'datos', fns:[ { id:'Grafico Datos', action:graficoDatos } ] },
	{ name:'Numeracion', tag:'numeracion', fns:[{ id:'Recta 2', action:recta }] },  
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
			var dataContent = { feedback: item.params.feedback, esCorrecta, opcion: `Opcion ${index+1}`, errFrec: item.params.errFrec };
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
	const { container, params, variables, versions, vt } = config, vars = vt ? variables : versions, 
		{ inputType, value1, value2, value3, value4, error2, error3, error4, feed0, feed1, feed2, feed3, feed4 } = params
	let ans = [value1, value2, value3, value4], err = [null, error2, error3, error4], fee = [feed1, feed2, feed3, feed4], 
		r = [], n = '', e = '', f = '', c = ''
	
	if (container) {
		switch(inputType) {
			case 'input': { c = '<input type="text" placeholder="Respuesta"></input>'; break }
			case 'radio': {
				ans.forEach((m, i) => { 
					n = eval(replace(m, vars, vt)); e = err[i]; f = fee[i] != '' ? fee[i] : feed0
					r.push(`<li key="${i}"><input name="ans" value="${n}" type="radio" error="${e}" feed="${f}"/><label>&nbsp;&nbsp;${n}</label></li>`)	
				}); c = shuffle(r).join('')
				break
			}
			case 'checkbox': {
				ans.forEach((m, i) => { 
					n = eval(replace(m, vars, vt)); e = err[i]; f = fee[i] != '' ? fee[i] : feed0
					r.push(`<li key="${i}"><input name="ans" value="${n}" type="checkbox" error="${e}" feed="${f}"/><label>&nbsp;&nbsp;${n}</label></li>`)
				}); c = shuffle(r).join('')
				break
			}
			case 'select': {
				ans.slice(0, 3).forEach((m, i) => { 
					n = eval(replace(m, vars, vt)); e = err[i]; f = fee[i] != '' ? fee[i] : feed0
					r.push(`<option key="${i}" value="${n}" error="${e}" feed="${f}">${n}</option>`)
				}); c = `<select><option selected disabled value="null">Seleccionar respuesta</option>${shuffle(r).join('')}</select>`
				break
			}
			case 'textarea': { c = '<textarea placeholder="Respuesta"></textarea>'; break }
		}
		container.innerHTML = `<form id="answer" feed="${feed0}" type="${inputType}">${c}</form>`
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
function graficoDatos(config) 
{
    const { container, params, variables, versions, vt } = config
    const { axisColor, axisWidth, borderColor, borderRadius, borderWidth, background, fontColor, extra, lineColor, lineWidth, chartBorder,
        chartPosition, chartColor, chartValues, chartTags, titleValue, titleSize, titleColor, axisTitleX, axisTitleY, margin, titleTop, fontSize,
        scaleMax, scaleMin, scaleInterval, scaleColor, scaleWidth, dataTag, withAxis, limitVal, highlightBar } = params

    if (!container) return
    let maxWidth = container.parentElement.offsetWidth, responsive = params.width < maxWidth,
        width = responsive ? params.width : maxWidth - 15, height = responsive ? params.height : width

    container.width = width
    container.height = height

    let vars = vt ? variables : versions
    let values = replace(chartValues, vars, vt).split(',')
    let state = {
        axis: { color: axisColor, scale: 'auto', title_x: axisTitleX, title_y: axisTitleY, width: axisWidth },
        border: { color: borderColor, radius: borderRadius, width: borderWidth, margin:margin },
        canvas: { color: background, ctx: container.getContext('2d'), height: height, width: width },
        chart: { border: { color: chartBorder, width: 2 }, color: chartColor.split(','), length: values.length, 
                margin: { x:margin == 'si' ? 70 : 50, y:margin == 'si' ? 90 : 60 }, padding: { x:10, y:10 }, position: chartPosition, 
                values: values, tags: replace(chartTags, vars, vt).split(','), dataTag: dataTag, withAxis: withAxis == 'si' ? true : false },
        extra: { limit: extra == 'limite', projection: extra == 'proyeccion', highlightBar: highlightBar ? highlightBar.split(',') : '' },
        font: { align: 'center', color: fontColor, family: 'arial', size: fontSize },
        line: { color: lineColor, value: 10, width: lineWidth, limitVal:replace(limitVal, vars, vt).split(',') },
        scale: { max:Number(scaleMax), min:Number(scaleMin), interval:Number(scaleInterval), color:scaleColor, width:scaleWidth }, 
        title: { color: titleColor, size: titleSize, value: titleValue, top:titleTop }
    }

    const { chart } = state
    const { x, y } = chart.margin

    let data = {
        ctx: container.getContext('2d'), height: height - 2*y, len: chart.length, 
        max: Math.max(...chart.values), width: width - 2*(x + 10), x0: x, y0: height - y,
        dx: Math.min(Math.floor((width - 2*(x + 10))/(3/2*chart.length)), 100),
        dy: Math.min(Math.floor((height - 2*(y - 5))/(4/3*chart.length)), 60)
    }

    data.cx = data.x0 + 2*chart.padding.x + data.width/data.len/2 - data.dx/2
    data.cy = data.y0 - chart.padding.y - data.height/data.len/2 - data.dy/2    

    data.ctx.translate(0, margin == 'si' ? 0 : 10)
    data.ctx.save()

    generarColumnas(data, state)
    generarEjes(container, state)
    if (state.extra.projection) 
        proyectarColumnas(data, state)
    if (state.extra.limit) 
        limitarColumnas(data, state)
    insertarTextos(data, state)
    insertarValores(data, state)

	function generarEjes(canvas, state) {

	    let ctx = canvas.getContext('2d')

	    const { axis, chart, font, title } = state
	    const { height, width } = state.canvas
	    const { x, y } = chart.margin 
	    const { padding } = chart

	    ctx.beginPath()
	    ctx.moveTo(x, y - 2*padding.y)
	    ctx.lineTo(x, height - y) //EJE VERTICAL
	    ctx.lineTo(width - x + 2*padding.x, height - y) //EJE HORIZONTAL
	    
	    if (chart.withAxis) {
	        //EJE VERTICAL
	        ctx.moveTo(x + width/110, y - 2*padding.y + width/110)
	        ctx.lineTo(x, y - 2*padding.y)
	        ctx.lineTo(x - width/110, y - 2*padding.y + width/110)
	        //EJE HORIZONTAL
	        ctx.moveTo(width - x + 2*padding.x - width/110, height - y - width/110) 
	        ctx.lineTo(width - x + 2*padding.x, height - y)
	        ctx.lineTo(width - x + 2*padding.x - width/110, height - y + width/110)
	    }

	    ctx.lineWidth = axis.width
	    ctx.strokeStyle = axis.color
	    ctx.stroke()

	    ctx.textAlign = font.align
	    ctx.font = font.size + 'px ' + font.family
	    ctx.fillText(axis.title_x, width/2, height - x/2 + Number(font.size) - 12) //INSERTAR TITULO X

	    ctx.rotate(3*Math.PI/2)
	    ctx.fillText(axis.title_y, - height/2, y/2 - Number(font.size)/3) //INSERTAR TITULO Y

	    ctx.rotate(Math.PI/2)
	    ctx.fillStyle = title.color
	    ctx.font = title.size + 'px ' + font.family
	    ctx.fillText(title.value, width/2, title.top) //INSERTAR TITULO

	    ctx.closePath()
	}
	function generarColumnas(data, state) {

	    const { canvas, chart, scale, font, extra } = state
	    const { dx, dy, height, len, max, width, x0, y0 } = data
	    const { ctx } = canvas
	    const limit = Math.max(scale.max, max)

	    ctx.beginPath()
	    ctx.clearRect(0, 0, canvas.width, canvas.height)
	    ctx.strokeStyle = scale.color == '' ? 'transparent' : scale.color
	    ctx.lineWidth = scale.width

	    extra.highlightBar && resaltarBarras(data, state)

	    if (chart.position == 'vertical') 
	    {
	        if (scale.interval > 0) {
	            ctx.textAlign = 'right'
	            ctx.font = 14 + 'px ' + font.family

	            if (scale.width > 0)
	            for (let i = scale.min; i <= limit; i += scale.interval) { 
	                let dy = height/limit * i, y = y0 - dy //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	                ctx.moveTo(chart.margin.x, y)
	                ctx.lineTo(canvas.width - chart.margin.x + 2*chart.padding.x, y)
	            }
	            ctx.stroke()
	            ctx.closePath()

	            ctx.beginPath()
	            ctx.fillStyle = font.color
	            for (let i = scale.min; i <= limit; i += scale.interval) {
	                let dy = height/limit * i, y = y0 - dy //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	                ctx.fillText(i, x0 - 7, y + 5) //INSERTAR TEXTO
	            }
	            ctx.closePath()
	        }

	        ctx.beginPath()
	        ctx.fillStyle = chart.color[0]
	        for (let i = 0, x = data.cx; i < len; i++, x += width/len) {
	            let dy = height/limit * chart.values[i], y = y0 - dy //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	            ctx.fillRect(x, y, dx, dy) //DIBUJAR COLUMNA      
	            ctx.moveTo(x, y0) 
	            ctx.lineTo(x, y)
	            ctx.lineTo(x + dx, y)
	            ctx.lineTo(x + dx, y0) //BORDES COLUMNA
	        }
	    } 
	    else 
	    {
	        if (scale.interval > 0) {
	            ctx.textAlign = 'right'
	            ctx.font = 14 + 'px ' + font.family

	            if (scale.width > 0)
	            for (let i = scale.min; i <= limit; i += scale.interval) { 
	                let dx = width/limit * i, x = x0 + dx //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	                ctx.moveTo(x, chart.margin.y - 2*chart.padding.y)
	                ctx.lineTo(x, y0)
	            }
	            ctx.stroke()
	            ctx.closePath()

	            ctx.beginPath()
	            ctx.fillStyle = font.color
	            ctx.textAlign = font.align
	            for (let i = scale.min; i <= limit; i += scale.interval) {
	                let dx = width/limit * i, x = x0 + dx //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	                ctx.fillText(i, x, y0 + 24) //INSERTAR TEXTO
	            }
	            ctx.closePath()
	        }

	        ctx.fillStyle = chart.color[0]
	        for (let i = 0, y = data.cy; i < len; i++, y -= height/len) {
	            let dx = width/limit * chart.values[i], x = x0 //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	            ctx.fillRect(x, y, dx, dy) //DIBUJAR COLUMNA
	            ctx.moveTo(x, y) 
	            ctx.lineTo(x + dx, y)
	            ctx.lineTo(x + dx, y + dy)
	            ctx.lineTo(x, y + dy) //BORDES COLUMNA
	        }
	    }

	    ctx.strokeStyle = chart.border.color
	    ctx.lineWidth = chart.border.width
	    ctx.stroke()
	    ctx.closePath()
	}
	function proyectarColumnas(data, state) {

	    const { chart, line, scale } = state
	    const { ctx, height, len, max, width, x0, y0 } = data
	    const limit = Math.max(scale.max, max)
	   
	    ctx.beginPath()
	    if (chart.position == 'vertical') 
	    {
	        for (let i = 0, x = data.cx; i < len; i++, x += width/len) {
	            let dy = height/limit * chart.values[i], y = y0 - dy //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	            ctx.moveTo(x0, y) 
	            ctx.lineTo(x, y) //PROYECCION COLUMNA
	        }
	    }
	    else
	    {
	        for (let i = 0, y = data.cy; i < len; i++, y -= height/len) {
	            let dx = width/limit * chart.values[i], x = x0 //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	            ctx.moveTo(x + dx, y0) 
	            ctx.lineTo(x + dx, y) //PROYECCION COLUMNA
	        }
	    }

	    ctx.strokeStyle = line.color
	    ctx.setLineDash([5, 1])
	    ctx.lineWidth = line.width
	    ctx.stroke()
	    ctx.closePath()
	}
	function limitarColumnas(data, state) {
	    const { chart, line, scale, canvas } = state
	    const { ctx, height, len, max, width, x0, y0 } = data
	    const limit = Math.max(scale.max, max)

	    let values = line.limitVal
	    if (values.length) 
	    {
	        ctx.beginPath()
	        if (chart.position == 'vertical') 
	        {
	            for (let i = 0, x = data.cx; i < max; i++, x += width/len) {
	                let dy = height/limit * values[i], y = y0 - dy //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	                ctx.moveTo(x0, y) 
	                ctx.lineTo(canvas.width - chart.margin.x + 2*chart.padding.x, y) //PROYECCION COLUMNA
	            }
	        }
	        else
	        {
	            for (let i = 0, y = data.cy; i < max; i++, y -= height/len) {
	                let dx = width/limit * values[i], x = x0 //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	                ctx.moveTo(x + dx, y0) 
	                ctx.lineTo(x + dx,  chart.margin.y - 2*chart.padding.y + canvas.height/110) //PROYECCION COLUMNA
	            }
	        }
	        ctx.strokeStyle = line.color
	        ctx.setLineDash([5, 1])
	        ctx.lineWidth = line.width
	        ctx.stroke()
	        ctx.closePath()
	    }
	}
	function insertarTextos(data, state) {

	    const { chart, font } = state
	    const { ctx, dx, dy, height, len, width, x0, y0 } = data
	    
	    ctx.beginPath()
	    ctx.font = 14 + 'px ' + font.family
	    ctx.fillStyle = font.color

	    if (chart.position == 'vertical') 
	    {
	        ctx.textAlign = font.align    
	        for (let i = 0, x = data.cx + dx/2; i < len; i++, x += width/len) {
	            ctx.fillText(chart.tags.length > i ? chart.tags[i] : '', x, y0 + 19) //INSERTAR TEXTO
	        }
	    }
	    else 
	    {
	        ctx.textAlign = 'right'
	        for (let i = 0, y = data.cy; i < len; i++, y-= height/len) {
	            ctx.fillText(chart.tags.length > i ? chart.tags[i] : '', x0 - 5, y + dy/2 + 5) //INSERTAR TEXTO 
	        }
	    }

	    ctx.closePath()
	}
	function insertarValores(data, state) {
	    const { chart, font, scale } = state
	    const { ctx, dx, dy, height, len, max, width, x0, y0 } = data
	    
	    if (chart.dataTag != '' && chart.dataTag) {
	        ctx.save()
	        ctx.fillStyle = font.color
	        
	        let dataTags = chart.dataTag.split(',')
	    
	        ctx.beginPath()
	        let fontSize = 14
	        ctx.font = fontSize + 'px ' + font.family
	        const limit = Math.max(scale.max, max)
	        ctx.textAlign = font.align

	        if (chart.position == 'vertical') {
	            for (let i = 0, x = data.cx + dx/2; i < len; i++, x += width/len) {
	                if (dataTags[i] == '0') {
	                    let dy = height/limit * chart.values[i], y = y0 - dy//TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	                    ctx.fillText(chart.values[i], x, y - 10) //INSERTAR TEXTO
	                }
	            }
	        } else {
	            for (let i = 0, y = data.cy + dy/2 + fontSize/2; i < len; i++, y -= height/len) {
	                if (dataTags[i] == '0') {
	                    let dx = width/limit * chart.values[i], x = x0 + dx//TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	                    ctx.fillText(chart.values[i], x + 15, y) //INSERTAR TEXTO
	                }
	            }
	        }
	        
	    } else {
	        ctx.fillStyle = 'transparent'
	    }
	    
	    ctx.closePath()
	    ctx.restore()
	    ctx.save()
	}
	function resaltarBarras(data, state) {

	    const { canvas, chart, scale, extra } = state
	    const { dx, dy, height, len, max, width, x0, y0 } = data
	    const { ctx } = canvas
	    const limit = Math.max(scale.max, max)

	    let hightBar = extra.highlightBar

	    if (chart.position == 'vertical') {
	        ctx.beginPath()
	        ctx.fillStyle = 'rgba(212,230,192, 0.6)'
	        for (let i = 0, x = data.cx/1.1; i < len; i++, x += width/len) {
	            if (!isNaN(hightBar[i]) && hightBar[i].length === 1 && eval(hightBar[i]) === 0) {
	                let dy = height/limit * chart.values[i], y = y0 - dy //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	                ctx.fillRect(x, y - height/limit, dx*1.2, dy + height/limit*1.4) //DIBUJAR COLUMNA
	            }
	        }
	    } else {
	        ctx.beginPath()
	        ctx.fillStyle = 'rgba(212,230,192, 0.6)'
	        for (let i = 0, y = data.cy; i < len; i++, y -= height/len) {
	            if (!isNaN(hightBar[i]) && hightBar[i].length === 1 && eval(hightBar[i]) === 0) {
	                let dx = width/limit * chart.values[i], x = x0 //TAMAÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“O DE LA COLUMNA
	                ctx.fillRect(x - x*0.4, y - height/len*0.1, dx + x*0.8, dy + height/len*0.2) //DIBUJAR COLUMNA
	            }
	        }
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
