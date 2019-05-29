var respGeneral = 0, 
rspMalas = 0, 
rspSinFeedBack = 0, 
RespNeg = 0, 
fechaEntrada = (new Date()).toLocaleTimeString(),
idEjercicio = document.body.id, 
nivelF = idEjercicio.substring(0, 2), 
ejeF = idEjercicio.substring(2, 4),
errFre = '', 
feed = '', 
check = false;
var _TIPO_INPUT_ = '';
//boton responder
var btnRespuesta =  document.getElementById('btnResponder');
btnRespuesta.setAttribute("onClick", "answer();");

$(document).ready(function(){
	$('.contenido input[type=text]').on("cut copy paste contextmenu",function(e) {
		e.preventDefault();
 	});
	window.addEventListener("keyup", function(event){
		event.preventDefault();
		if(event.keyCode === 13) {
			!btnRespuesta.disabled && btnRespuesta.click();
		}
	});
});

function validaRespuesta() { //Validar respuesta
	let respuesta, respuestaObj;
	if(_TIPO_INPUT_ === 'radio') {
		respuesta = document.querySelector('input[name="answer"]:checked');
		respuestaObj = JSON.parse(respuesta.getAttribute('data-content'));
		feed = respuestaObj ? respuestaObj.feedback : "<p>Debes seleccionar una respuesta</p>";
		errFre = respuestaObj ? respuestaObj.errFrec : true;
	} else if (_TIPO_INPUT_ === 'input') {
		var inputs = document.querySelectorAll(".contenido input[name='answer']");
		if(inputs.length === 1) {//si solo hay un input de texto
			evaluaInputTexto(inputs[0]);
		} else {//si hay mas de un input de texto
			for(var input of inputs) {
				evaluaInputTexto(input);
				if(errFre !== null) {
					break;
				}
			}
		}
	}
}

function evaluaInputTexto(inputElement) {
	var content = JSON.parse(inputElement.getAttribute('data-content'));
	var match = false;
	switch(content.tipoInput){
		case 'numero':
			var resp = inputElement.value.replace(/\s/g, '');
			for(var answer of content.answers) {
				if(resp === answer.respuesta) {
					feed = answer.feedback;
					errFre = answer.errFrec;
					match = true;
					break;
				}
			}
			break;
		case 'texto':
			var resp = inputElement.value;
			for(var answer of content.answers) {
				var numberArr = answer.respuesta.length === 3 ? ('0'+answer.respuesta).split('') : answer.respuesta.split('');
				if(checkWord(resp, numberArr)) {
					feed = answer.feedback;
					errFre = answer.errFrec;
					match = true;
					break;
				}
			}
			break;
	}
	if(!match) {
		feed = content.feedbackDefecto;
		errFre = content.errFrecDefecto;
	}
}

function answer() { 
	validaRespuesta();
	if (!errFre) { //la respuesta correcta no tiene error frecuente
		check = true;
	} else {
		check = false;
	}
	enviar();
}

//FUNCIONES DE LOS INPUTS DE RESPUESTA
function cambiaRadios(e) {
	_TIPO_INPUT_ = 'radio';
	btnRespuesta.disabled = false;
}
function cambiaRadioImagen(e) {
	_TIPO_INPUT_ = 'radio';
	var seleccionado = document.querySelector('.radio-div_selected');
	if(seleccionado) {
		seleccionado.classList.remove('radio-div_selected');
	}
	e.target.parentElement.classList.add("radio-div_selected");
	btnRespuesta.disabled = false;
}
function seleccionaImagenRadio(e, labelId) {
	document.getElementById(labelId).click();
}
function cambiaInputTexto(e) {
	var theEvent = e || window.event;
	// Handle paste
	if (theEvent.type === 'paste') {
				key = event.clipboardData.getData('text/plain');
	} else {
	// Handle key press
				var key = theEvent.keyCode || theEvent.which;
				key = String.fromCharCode(key);
	}
	var regex = /[a-zA-Z]|\.|ñ|\s/;
	if( !regex.test(key) ) {
		 theEvent.returnValue = false;
		 if(theEvent.preventDefault) theEvent.preventDefault();
	} else {
		_TIPO_INPUT_ = 'input';
		checkTexts();
	}
}
function cambiaInputNumerico(e) {
	var theEvent = e || window.event;
	// Handle paste
	if (theEvent.type === 'paste') {
				key = event.clipboardData.getData('text/plain');
	} else {
	// Handle key press
				var key = theEvent.keyCode || theEvent.which;
				key = String.fromCharCode(key);
	}
	var regex = /[0-9]|\./;
	if( !regex.test(key) ) {
		 theEvent.returnValue = false;
		 if(theEvent.preventDefault) theEvent.preventDefault();
	}
}

function formatearNumero(e) {
	var arrayReverse = String(e.target.value).replace(/\s/g,'').split("").reverse();
	for(var i=0,count=0,valor=''; i < arrayReverse.length; i++) {
		count++;
		if(count === 3 && arrayReverse[i+1]) {
				valor=' '+arrayReverse[i]+valor;
				count=0;
		} else {
				valor=arrayReverse[i]+valor;
		}
	} 
	e.target.value = valor;
	_TIPO_INPUT_ = 'input';
	checkTexts();
}

function cambiaInputAlfanumerico(e) {
	var theEvent = e || window.event;
	// Handle paste
	if (theEvent.type === 'paste') {
				key = event.clipboardData.getData('text/plain');
	} else {
	// Handle key press
				var key = theEvent.keyCode || theEvent.which;
				key = String.fromCharCode(key);
	}
	var regexNumero = /[0-9]|\./;
	var regexTexto = /[a-zA-Z]|\.|ñ|\s/;
	if( !regexNumero.test(key) && !regexTexto.test(key) ) {
		 theEvent.returnValue = false;
		 if(theEvent.preventDefault) theEvent.preventDefault();
	} else {
		_TIPO_INPUT_ = 'input';
		checkTexts();
	}
}

function checkTexts() {
	var todasRespondidas = true;
	$('input[type=text]:not([disabled])').each(function(){
		if($(this).val() == ''){
			todasRespondidas = false;
			return false;
		}
	});
	if(!check || respGeneral >= 2) {
		btnRespuesta.disabled = !todasRespondidas;
	}
}

/*
CODIGO DE GABY PARA VERIFICAR PALABRAS
*/

let palabras= {
	"0": ["", "", "", "", ""], //unidad, prefijo unidad, decena, centena
	"1": ["uno", "on", "diez", "cien"],
	"2": ["dos", "do", "veinte", "doscientos"],
	"3": ["tres", "tre", "treinta", "trescientos"],
	"4": ["cuatro", "cator", "cuarenta", "cuatrocientos"],
	"5": ["cinco", "quin", "cincuenta", "quinientos"],
	"6": ["seis", "", "sesenta", "seiscientos"],
	"7": ["siete", "", "setenta", "setecientos"],
	"8": ["ocho", "", "ochenta", "ochocientos"],
	"9": ["nueve", "", "noventa", "novecientos"]
};
let regularExpression = {
	"0": ["", "", "", "", ""], 
	"1": ["uno", "on", "die[sz]", "[csz]ien"],
	"2": ["do[sz]", "do", "[vb]einte", "do[csz]{1,2}iento[sz]"],
	"3": ["tre[sz]", "tre", "treinta", "tre[szc]{1,2}iento[sz]"],
	"4": ["[ckq]uatro", "[ckq]ator", "[ckq]uarenta", "[ckq]uatro[szc]{1,2}iento[sz]"],
	"5": ["[csz]in[ck]o", "(quin|kin)", "[csz]in[cqk]uenta", "(quin|kin)iento[sz]"],
	"6": ["[scz]ei[sz]", "", "[scz]e[scz]enta", "[scz]ei[scz]{1,2}iento[sz]"],
	"7": ["[scz]iete", "", "[scz]etenta", "[scz]ete[szc]{1,2}iento[sz]"],
	"8": ["o[sc]ho", "", "o[sc]henta", "o[sc]ho[scz]{1,2}iento[sz]"],
	"9": ["nue[vb]e", "", "no[vb]enta", "no[vb]e[scz]{1,2}iento[sz]"]
};
function checkWord(_word, numberArr){
	let umil = numberArr[0]
	let centena = numberArr[1]
	let decena = numberArr[2]
	let unidad = numberArr[3]
	let word = _word.toLowerCase().trim();
	let rgx = ''
	if (unidad > 0) {
			//uno, dos, tres...
			if (decena == 0) {
					rgx = regularExpression[unidad][0];
			} else if (decena == 1) {
					//once doce, trece, catorce, quince
					if (unidad > 0 && unidad < 6) {
							rgx = regularExpression[unidad][1] + "[scz]e"
					}
					// dieciseis, diecisiete, dieciocho, diecinueve
					else if (unidad >= 6) {
							rgx = "die[csz]i" + regularExpression[unidad][0]
					}
			}
			//veinituno, veintidos, veintitres....
			else if (decena == 2) {
					rgx = "[vb]einti" + regularExpression[unidad][0];
			}
			// treinta y uno, cuarenta y dos, cincuenta y tres...
			else if (decena > 2) {
					rgx = regularExpression[decena][2] + " y " + regularExpression[unidad][0]
			}
	} else if (unidad == 0) {
			//veinte, treinta, cuarenta...
			if (decena > 0) {
					rgx = regularExpression[decena][2]
			}
	}
	//cien, doscientos, trescientos...
	if (centena > 0) {
			if (centena == 1) {
					if (decena == 0 && unidad == 0) rgx = regularExpression[centena][3] + " " + rgx;
					if (decena != 0 || unidad != 0) rgx = "[szc]iento " + rgx
			} else if (centena > 1) {
					rgx = regularExpression[centena][3] + " " + rgx;
			}
	}
	//mil, dos mil, tres mil
	if (umil == 1) rgx = "mil " + rgx;
	else if (umil > 1) rgx = regularExpression[umil][0] + " mil " + rgx;

	rgx = rgx.trim();
	rgx = rgx.replace(/^/, '^')
	rgx = rgx + '$'
	let newRgx = new RegExp(rgx);
	return newRgx.test(word)
}