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
var _TIPO_INPUT_ = '',
    _VALIDACIONES_INPUT_TABLA_ = null;
var tmpProgreso, tmpTotal, hiddenBarraDatos = window.parent.parent.barraProgreso;

const feedCorrectas = ['¡Muy Bien!', '¡Excelente!', '¡Sigue así!'];
const feedIncorrectas = ['¡Atención!', '¡Pon Atención!', 'Cuidado'];

//boton responder
var btnRespuesta = document.getElementById('btnResponder');
btnRespuesta.setAttribute("onClick", "answer();");

if (hiddenBarraDatos) {
    var datosBarraDeProgreso = JSON.parse(hiddenBarraDatos.value);
    tmpProgreso = datosBarraDeProgreso.tmpProgreso ?
        datosBarraDeProgreso.tmpProgreso : [];
    tmpTotal = datosBarraDeProgreso.tmpTotal ?
        Number(datosBarraDeProgreso.tmpTotal) : 0;
} else {
    tmpProgreso = localStorage.getItem('tmpProgreso') ?
        JSON.parse(localStorage.getItem('tmpProgreso')) : [];
    tmpTotal = localStorage.getItem('tmpTotal') ?
        Number(localStorage.getItem('tmpTotal')) : 0;
}

barraDeProgreso();
$(document).ready(function() {
    $('.contenido input[type=text]').on("cut copy paste contextmenu drop", function(e) {
        e.preventDefault();
    });
});

function validaRespuesta() { //Validar respuesta
    let respuesta, respuestaObj;
    if (_TIPO_INPUT_ === 'radio') {
        respuesta = document.querySelector('input[name="answer"]:checked');
        respuestaObj = JSON.parse(respuesta.getAttribute('data-content'));
        feed = respuestaObj ? respuestaObj.feedback : "<p>Debes seleccionar una respuesta</p>";
        errFre = respuestaObj ? respuestaObj.errFrec : true;
    } else if (_TIPO_INPUT_ === 'input') {
        var inputs = document.querySelectorAll(".contenido input[name='answer']");
        if (inputs.length === 1 && !_VALIDACIONES_INPUT_TABLA_) { //si solo hay un input de texto
            evaluaInputTexto(inputs[0]);
        } else { //si hay mas de un input de texto
            /*for(var input of inputs) {
            	coloreaInputTexto(input);
            }*/
            evaluaInputsEjercicio();
        }
    }
}

function evaluaInputTexto(inputElement) {
    var content = JSON.parse(b64_to_utf8(inputElement.getAttribute('data-content')));
    var match = false;
    switch (content.tipoInput) {
        case 'numero':
            var resp = inputElement.value.replace(/\s/g, '');
            for (var answer of content.answers) {
                if (resp === answer.respuesta) {
                    feed = answer.feedback;
                    errFre = answer.errFrec;
                    match = true;
                    break;
                }
            }
            break;
        case 'texto':
            var resp = inputElement.value
            for (var answer of content.answers) {
                if (String(resp).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") === String(answer.respuesta).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) {
                    feed = answer.feedback;
                    errFre = answer.errFrec;
                    match = true;
                    break;
                }
            }
            break
        case 'texto-numerico':
            var resp = inputElement.value;
            for (var answer of content.answers) {
                var numberArr = answer.respuesta.length === 3 ? ('0' + answer.respuesta).split('') : answer.respuesta.split('');
                if (checkWord(resp, numberArr)) {
                    feed = answer.feedback;
                    errFre = answer.errFrec;
                    match = true;
                    break;
                }
            }
            break
    }
    if (!match) {
        feed = content.feedbackDefecto;
        errFre = content.errFrecDefecto;
    }
}

function coloreaInputTextoPorDefecto(inputElement) {
    var content = JSON.parse(inputElement.getAttribute('data-content'));
    var match = false;
    switch (content.tipoInput) {
        case 'numero':
            var resp = inputElement.value.replace(/\s/g, '');
            b64_to_utf8(content.correctas).split(',').forEach(function(correcta) {
                if (resp === correcta) {
                    inputElement.classList.add('inputTexto-correcto');
                    match = true;
                }
            })
            break;
        case 'texto':
            var resp = inputElement.value;
            b64_to_utf8(content.correctas).split(',').forEach(function(correcta) {
                var numberArr = correcta.length === 3 ? ('0' + answer.respuesta).split('') : answer.respuesta.split('');
                if (checkWord(resp, numberArr)) {
                    inputElement.classList.add('inputTexto-correcto');
                }
            });
    }
    if (!match) {
        inputElement.classList.add('inputTexto-incorrecto');
    }
}

function evaluaInputsEjercicio() {
    let { respuestas, errFrecDefecto, feedbackDefecto } = _VALIDACIONES_INPUT_TABLA_;
    for (let i = 0; i < respuestas.length; i++) {
        let { validaciones, errFrec, feedback } = respuestas[i], coincidenTodas = true;
        validaciones.forEach(function(val, index) {
            let input = document.getElementById(val.inputId);
            let content = JSON.parse(input.getAttribute('data-content'))
            switch (content.tipoInput) {
                case 'numero':
                    if (input.value.replace(/\s/g, '') !== val.valor && val.valor !== '-any-') {
                        coincidenTodas = false;
                    }
                    break;
                case 'texto':
                    var numberArr = correcta.length === 3 ? ('0' + val.valor).split('') : val.valor.split('');
                    if (!checkWord(input.value, numberArr) && val.valor !== '-any-') {
                        coincidenTodas = false
                    }
            }
        })
        if (coincidenTodas) {
            feed = feedback;
            errFre = errFrec;
            if (errFre !== null) {
                coloreaInputsTextoPorCoincidencia(respuestas[i]) //colorear input
            } else {
                $(".contenido input[name='answer']").addClass('inputTexto-correcto')
            }
            break;
        }
    }
    if (errFre === '') {
        feed = regexFunctions(feedbackDefecto);
        errFre = errFrecDefecto;
        var inputs = document.querySelectorAll(".contenido input[name='answer']");
        for (var input of inputs) {
            coloreaInputTextoPorDefecto(input);
        }
    }
}

function coloreaInputsTextoPorCoincidencia(coincidencia) { // colorea inputs de acuerdo a 
    let { validaciones, errFrec, feedback } = coincidencia
    validaciones.forEach(function(val, index) {
        var { color, inputId } = val
        var input = document.getElementById(inputId)
        if (color === 'ok') {
            input.classList.add('inputTexto-correcto')
        } else if (color === 'bad') {
            input.classList.add('inputTexto-incorrecto')
        } else {
            if (input.value.replace(/\s/g, '') == color.correcta) {
                input.classList.add('inputTexto-correcto')
            } else {
                input.classList.add('inputTexto-incorrecto')
            }
        }
    })
}

function answer() {
    validaRespuesta();
    var feedHtml = regex(feed, versionBody.vars, false);
    feedHtml = regexFunctions(feedHtml);
    if (respGeneral < 2 && !check) {
        if (!errFre) { //la respuesta correcta no tiene error frecuente
            check = true;
            muestraFeedback(!errFre, feedHtml);
        } else {
            if (!respGeneral) {
                muestraFeedback(!errFre, feedHtml);
            } else {
                openModalGlosa(document.getElementById('glosa').innerHTML);
            }
        }
        respGeneral++;
        enviar();
    }
}

function barraDeProgreso() {
    var anchoBarra = 250; //254 para el espacio del margen
    $("#progressbar").empty();
    var svg = document.getElementById('progressbar');
    var separacion = anchoBarra / (tmpTotal + 1);

    var bordeBarra = crearElemento('rect', {
        x: 2,
        y: 2,
        width: anchoBarra,
        height: 32,
        fill: 'none',
        stroke: '#CCCBCB',
        strokeWidth: '1',
        rx: 5,
        ry: 5
    });
    svg.appendChild(bordeBarra);

    var anchoLinea = Number(anchoBarra - (separacion * 2));
    var lineaBarra = crearElemento('rect', {
        x: separacion,
        y: 17,
        width: anchoLinea,
        height: 2,
        fill: '#E7E5E5',
        rx: 2,
        ry: 2
    });
    svg.appendChild(lineaBarra);

    for (var i = 0; i < tmpTotal; i++) {
        var colorCirculo, rCircle;
        if (tmpProgreso.length > i) {
            rCircle = 4;
            if (tmpProgreso[i].correcto) {
                colorCirculo = tmpProgreso[i].NUMEROINTENTOS === 1 ? '#00AC4D' : '#E2C04D';
            } else {
                colorCirculo = '#E24B4A';
            }
        } else if (tmpProgreso.length === i) {
            rCircle = 8;
            colorCirculo = '#1280B1';
        } else {
            rCircle = 4;
            colorCirculo = '#CCCBCB';
        }
        var cxCircle = separacion * (i + 1) + 2;
        var circle = crearElemento('circle', {
            cx: cxCircle,
            cy: 18,
            r: rCircle,
            fill: colorCirculo,
            stroke: 'none'
        });
        svg.appendChild(circle);
        if (tmpProgreso.length === i) {
            var textPosicion = crearElemento('text', {
                x: cxCircle,
                y: 22,
                fontFamily: 'sans-serif',
                fontSize: '11px',
                textAnchor: 'middle',
                fill: 'white'
            });
            textPosicion.textContent = tmpProgreso.length + 1;
            svg.appendChild(textPosicion);
        }
    }

    function crearElemento(nombre, atributos) {
        var element = document.createElementNS("http://www.w3.org/2000/svg", nombre);
        for (var p in atributos) {
            element.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) {
                return "-" + m.toLowerCase();
            }), atributos[p]);
        }
        return element;
    }
}
//muestgra feeedbacks
function muestraFeedback(esCorrecta, feedback) {
    var x = window.matchMedia("(max-width: 768px)");
    if (x.matches) { //mostrar feedback en modal
        if (esCorrecta) {
            openModalFeedback(feedback, true);
        } else {
            openModalFeedback(feedback, false);
        }
    } else { //mostrar feedback en footer
        var arrCorrecta = ["PatoFeedBack_00007.png", "PataFeedBack_00007.png"]; //Imagen feedback si es correcto
        var arrIncorrecta = ["PatoFeedBack_00001.png", "PataFeedBack_00001.png"];
        $('#btnResponder').html('<span>CONTINUAR</span>');
        $('footer.pie').find('div > span').html(feedback);
        $('#imgfeedback').removeClass('d-none');
        $('#btnConsulta').addClass('d-none');
        $('section.contenido').find('input').prop('disabled', true);
        if (esCorrecta) {
            var rando = Math.floor((Math.random() * arrCorrecta.length));
            var src = `../../../../imagenes_front/patos/${arrCorrecta[rando]}`;
            feedbackCorrecta(src);
        } else {
            var rando = Math.floor((Math.random() * arrIncorrecta.length));
            var src = `../../../../imagenes_front/patos/${arrIncorrecta[rando]}`;
            feedbackIncorrecta(src);
        }
    }
    window.MathJax && MathJax.Hub.Queue(["Typeset", MathJax.Hub]); //dibuja las ecuaciones que fueron inyectadas despues de que cargo la pagina
}

function feedbackCorrecta(src) {
    $('footer.pie').addClass('pieCorrecta');
    $('#btnResponder').addClass('respCorrecta');
    $('#imgfeedback').attr('src', src);
    var racha = rachaCorrectas();
    var textoSpan = feedCorrectas[Math.floor((Math.random() * feedCorrectas.length))];
    if (racha) {
        var textoRacha = `Tienes una racha de <b>${rachaCorrectas()}</b> respuestas correctas.`;
        $('footer.pie').find('div.col-4.col-md-6').html(`<span class="spanFeedback">${textoSpan}</span><p class="textoFeedback">${textoRacha}</p>`);
    } else {
        $('footer.pie').find('div.col-4.col-md-6').html(`<span class="spanFeedback">${textoSpan}</span>`);
    }
    btnRespuesta.setAttribute("onClick", "cerrarFeed();");
}

function rachaCorrectas() {
    var correctos = 0;
    for (var i = tmpProgreso.length - 1; i > -1; i--) {
        if (tmpProgreso[i].correcto) {
            correctos++;
        } else {
            break;
        }
    }
    return correctos + 1 > 1 ?
        correctos + 1 :
        null;
}

function feedbackIncorrecta(src) {
    $('footer.pie').addClass('pieIncorrecta');
    $('#btnResponder').addClass('respIncorrecta');
    $('#imgfeedback').attr('src', src);
    var textoSpan = feedIncorrectas[Math.floor((Math.random() * feedCorrectas.length))];
    $('footer.pie').find('div.col-4.col-md-6').html(`<span class="spanFeedback">${textoSpan}</span><p class="textoFeedback">${feed}</p>`);
    btnRespuesta.setAttribute("onClick", "continuarEjercicio();");
}

function continuarEjercicio() { //permite continuar con el segundo intento en DESKTOP O TABLET
    $('footer.pie').removeClass('pieIncorrecta pieCorrecta');
    $('#btnResponder').removeClass('respIncorrecta respCorrecta');
    $('footer.pie').find('div.col-4.col-md-6').html('').css('color', '');
    $('#btnResponder').html('<span>RESPONDER</span>');
    $('#btnConsulta').removeClass('d-none');
    $('#imgfeedback').addClass('d-none');
    btnRespuesta.setAttribute("onClick", "answer();");
    btnRespuesta.disabled = true;
    //limpia inputs
    if (_TIPO_INPUT_ === 'radio') {
        $('input:checked')[0].checked = false;
        $('.radio-div_selected').removeClass('radio-div_selected');
        $('section.contenido').find('input').prop('disabled', false);
    } else if (_TIPO_INPUT_ === 'input') {
        var inputsCount = document.querySelectorAll(".contenido input[name='answer']").length;
        if (inputsCount === 1) {
            $('section input[type=text]').val('');
            $('section input[type=text]').prop('disabled', false);
        } else {
            $('section.contenido').find('input:not(.inputTexto-correcto)[type=text]').val('');
            $('input.inputTexto-incorrecto').prop('disabled', false);
            $('.inputTexto-incorrecto').removeClass('inputTexto-incorrecto');
        }
    }

}
//handle modals
function openModalFeedback(feedback, correcto) {
    var textoSpan, textoFeedback = "",
        btnClass, btnAction;
    if (correcto) {
        textoSpan = feedCorrectas[Math.floor((Math.random() * feedCorrectas.length))];
        var racha = rachaCorrectas();
        if (racha) {
            textoFeedback = `Tienes una racha de <b>${rachaCorrectas()}</b> respuestas correctas.`
        }
    } else {
        textoSpan = feedIncorrectas[Math.floor((Math.random() * feedCorrectas.length))];
        textoFeedback = feedback;
    }
    $('#modalFeedback div.col-12').first().html(`<span class="spanFeedback">${textoSpan}</span><p class="textoFeedback">${textoFeedback}</p>`);
    $('#modalFeedback div.modal-content').addClass(correcto ? 'modalFeedbackOK' : 'modalFeedbackError');
    btnClass = correcto ? 'btnCerrarFeedGood' : 'btnCerrarFeedBad';
    btnAction = correcto ? 'cerrarFeed()' : 'closeModalFeedback()'
    $('#btnCloseModal')
        .attr('onclick', btnAction)
        .removeClass('btnCerrarFeedBad btnCerrarFeedGood')
        .addClass(btnClass);
    $('section.contenido').find('input').prop('disabled', true);
    $('#modalFeedback').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#modalFeedback').modal('show');
}

function closeModalFeedback() {//esta funcion permite continuar con el segundo intento en MOBILE 
	$('#modalFeedback').modal('hide');
	if(_TIPO_INPUT_ === 'radio') {
		$('input:checked')[0].checked = false;
		$('.radio-div__selected').removeClass('radio-div__selected');
		$('section.contenido').find('input').prop('disabled', false);
	} else if(_TIPO_INPUT_ === 'input') {
		var inputsCount = document.querySelectorAll(".contenido input[name='answer']").length;
		if(inputsCount === 1) {
			$('section input[type=text]').val('');
			$('section input[type=text]').prop('disabled', false);
		} else {
			$('section.contenido').find('input:not(.inputTexto-correcto)[type=text]').val('');
			$('input.inputTexto-incorrecto').prop('disabled', false);
			$('.inputTexto-incorrecto').removeClass('inputTexto-incorrecto');
		}
	}
	btnRespuesta.disabled = true;
}

function openModalGlosa() {
    $('#modalGlosa').on('shown.bs.modal', function() {
        svgGlosa.forEach(svg => {
            svgPanZoom(svg, {
                zoomEnabled: true,
                minZomm: 1,
                maxZoom: 2,
                customEventsHandler: eventsHandler,
                beforePan: beforePan
            })
        })
    })
    $('#modalGlosa').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#modalGlosa').modal('show')
}

//FUNCIONES DE LOS INPUTS DE RESPUESTA
function cambiaRadios(e) {
    _TIPO_INPUT_ = 'radio';
    btnRespuesta.disabled = false;
}

function cambiaRadioImagen(e) {
    _TIPO_INPUT_ = 'radio';
    var seleccionado = document.querySelector('.radio-div_selected');
    if (seleccionado) {
        seleccionado.classList.remove('radio-div_selected');
    }
    e.target.parentElement.classList.add("radio-div_selected");
    btnRespuesta.disabled = false;
}

function seleccionaImagenRadio(e, labelId) {
    document.getElementById(labelId).click();
}

function cambiaInputTexto(e) {
    var validacion = (e.keyCode >= 65 && e.keyCode <= 90) //letra mayuzc
        ||
        (e.keyCode >= 97 && e.keyCode <= 122) //letra minusc
        ||
        (e.keyCode == 241 || e.keyCode == 209) //ñ y Ñ
        ||
        (e.keyCode == 225 || e.keyCode == 233 || e.keyCode == 237 || e.keyCode == 243 || e.keyCode == 250) //áéíóú
        ||
        (e.keyCode == 193 || e.keyCode == 201 || e.keyCode == 205 || e.keyCode == 211 || e.keyCode == 218) //ÁÉÍÓÚ
        ||
        (e.keyCode == 32) //espacio
    if (!validacion) {
        e.preventDefault();
        return false;
    }
}

function cambiaInputNumerico(e) {
    var validacion = e.keyCode >= 48 && e.keyCode <= 57
    if (!validacion) {
        e.preventDefault();
        return false;
    }
}

function formatearNumero(e) {
    var arrayReverse = String(e.target.value).replace(/\s/g, '').split("").reverse();
    for (var i = 0, count = 0, valor = ''; i < arrayReverse.length; i++) {
        count++;
        if (count === 3 && arrayReverse[i + 1]) {
            valor = ' ' + arrayReverse[i] + valor;
            count = 0;
        } else {
            valor = arrayReverse[i] + valor;
        }
    }
    e.target.value = valor;
    checkTexts();
}

function checkTexts() {
    var todasRespondidas = true;
    let inputs = document.querySelectorAll('input[type=text]:not([disabled])')
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === '') {
            todasRespondidas = false;
            break
        }
    }
    if (!check || respGeneral >= 2) {
        btnRespuesta.disabled = !todasRespondidas;
    }
    _TIPO_INPUT_ = 'input';
}

/*
CODIGO DE GABY PARA VERIFICAR PALABRAS
*/

let palabras = {
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

function checkWord(_word, numberArr) {
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