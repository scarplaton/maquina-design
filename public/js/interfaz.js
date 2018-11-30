//regex para funciones dentro de un texto (?=\{).*?(\})
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

handleHeader();

//boton responder
var btnRespuesta =  document.getElementById('btnResponder');
btnRespuesta.setAttribute("onClick", "answer();");

var tmpTitulo = localStorage.getItem('tmpTitulo') ? 
	JSON.parse(localStorage.getItem('tmpProgreso')) : 'Título por defecto';
var tmpProgreso = localStorage.getItem('tmpProgreso') ? 
	JSON.parse(localStorage.getItem('tmpProgreso')) : [];
var tmpTotal = localStorage.getItem('tmpTotal') ?
	Number(localStorage.getItem('tmpTotal')) : 5;

$('#modalGlosa').find('.modal-dialog.modal-lg').css({ //cambia el tamaño del modal
	'max-width': $('section.contenido .container').css('width')
});

$('.tituloEncabezado').text(tmpTitulo); //pone titulo e mision

$(document).ready(function(){
  habilitaBotonResponder();
	barraDeProgreso(tmpTotal, tmpProgreso.length+1);
	$( window ).resize(function() {
		barraDeProgreso(tmpTotal, tmpProgreso.length+1);
	});
});

function validaRespuesta() { //Validar respuesta
	let respuesta, respuestaObj;
	if(document.querySelector('input[name="answer"]:checked')) {
		respuesta = document.querySelector('input[name="answer"]:checked');
		respuestaObj = JSON.parse(respuesta.getAttribute('data-content'));
		feed = respuestaObj ? respuestaObj.feedback : "<p>Debes seleccionar una respuesta</p>";
		errFre = respuestaObj ? respuestaObj.errFrec : true;
	} else if ($('input[type=text]:not([disabled])')) {
		if($('input[type=text]:not([disabled])').length === 1) {
			var input = document.querySelector('.contenido input');
			var opc = JSON.parse(input.getAttribute('data-content'));
			for(var item of opc.feeds){
				var resp = regex(item.respuesta, versionBody.vars, false);
				if(resp !== "") {
					if(input.value === resp || resp === 'default') {
						feed = item.feedback;
						errFre = item.errFrec;
						break;
					}
				}
			}
		} else {
			errFre = false;
			$('input[type=text]:not([disabled])').each(function(){
				var opc = JSON.parse(this.getAttribute('data-content').replace(/\'/g, '\"'));
				if(this.value !== opc.esCorrecta) {
					todasCorrectas = false;
					feed = opc.feedbackBad;
					errFre = true;
					return false;
				} else {
					feed = opc.feedbackGood;
				}
			});
		}
	}
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

function habilitaBotonResponder() {
	var tipo = $('input:not([type=hidden],[disabled])').first().attr('type');
	if(tipo === 'text') {
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
		$('input[type=text]:not([disabled])').keyup(checkTexts).focusout(checkTexts);
	}
	if(tipo === 'radio') {
		if($('.radio-div').length > 0) {
			$(document).on('click', '.radio-div', function(){
				var divSeleccionada = document.querySelector('div.radio-div.radio-div__selected');
				if(divSeleccionada) {
					divSeleccionada.classList.remove('radio-div__selected');
					$(divSeleccionada).find(':radio').removeAttr("checked");
				}
				$(this).addClass('radio-div__selected');
				$(this).find(':radio').attr("checked","checked");
				if(!check || respGeneral >= 2) {
					btnRespuesta.disabled = false;
				}
			});
		} else {
			$('input[type=radio][name=answer]').change(function(){
				btnRespuesta.disabled = false;
			});
		}
	}
}

function barraDeProgreso(cantidadEjercicios, ejercicioActual) {
	var porcentajeAvance = ejercicioActual * 100 / cantidadEjercicios;
	var progress = document.getElementById('progress');
	progress.setAttribute('width', porcentajeAvance+'%');
	var svg = document.getElementById("progressbar").getBoundingClientRect();
	var circulo = document.getElementById('progressfinal');
	circulo.setAttribute('cx', svg.width - 5);
	if(cantidadEjercicios===ejercicioActual) {
		circulo.setAttribute('fill', '#2ab04a');
	}
}

function handleHeader() {
	function controlaEncabezado(x) {
    if (x.matches) {
			setTimeout(function(){
				$('header.encabezado').css({
					'top':'-50px'
				});
			}, 3000);
			$('header').hover(function(){
				$('header.encabezado').css({
					'top':'0'
				});
			}, function(){
				$('header.encabezado').css({
					'top':'-50px'
				});
			});
    } else {
			$('header.encabezado').addClass('d-none');
    }
	}
	var x = window.matchMedia("(max-width: 1365px)");
	controlaEncabezado(x);
	x.addListener(controlaEncabezado);
}
//muestgra feeedbacks
function muestraFeedback(esCorrecta, feedback) {
	var x = window.matchMedia("(max-width: 768px)");
	var arrCorrecta = ["PatoFeedBack_00007.png","PataFeedBack_00007.png"];//Imagen feedback si es correcto
	var arrIncorrecta = ["PatoFeedBack_00001.png","PataFeedBack_00001.png"];
	if(x.matches) { //mostrar feedback en modal
		btnCloseModal.setAttribute("onClick", "cerrarFeed()");
		if(esCorrecta) {
			var rando = Math.floor((Math.random() *  arrCorrecta.length));
			openModalFeedback(feedback, arrCorrecta[rando]);
			$('section.contenido').find('input').prop('disabled', true);
		} else {
			var rando = Math.floor((Math.random() *  arrIncorrecta.length));
			openModalFeedback(feedback, arrIncorrecta[rando]);
			btnCloseModal.setAttribute("onClick", "closeModalFeedback();");
		}
	} else { //mostrar feedback en footer
		$('#btnResponder').html('Continuar');
		$('footer.pie').find('span').html(feedback);
		$('#imgfeedback').removeClass('d-none');
		$('#btnConsulta').addClass('d-none');
		$('section.contenido').find('input').prop('disabled', true);
		if(esCorrecta) {
			var rando = Math.floor((Math.random() *  arrCorrecta.length));
			var src = `https://desarrolloadaptatin.blob.core.windows.net/feedbacksimg/${arrCorrecta[rando]}`;
			feedbackCorrecta(src);
		} else {
			var rando = Math.floor((Math.random() *  arrIncorrecta.length));
			var src = `https://desarrolloadaptatin.blob.core.windows.net/feedbacksimg/${arrIncorrecta[rando]}`;
			feedbackIncorrecta(src);
		}
	}
}

function feedbackCorrecta(src) {
	$('footer.pie').addClass('pieCorrecta');
	$('#btnResponder').addClass('respCorrecta');
	$('#imgfeedback').attr('src', src);
	var mensaje = rachaCorrectas();
	if(mensaje) {
		$('footer.pie').find('span').parent().append(mensaje);
	}
	btnRespuesta.setAttribute("onClick", "cerrarFeed();");
}

function rachaCorrectas() {
	var correctos = 0;
	for(var i = tmpProgreso.length-1; i > -1; i--) {
		if(tmpProgreso[i].correcto) {
			correctos++;
		} else {
			break;
		}
	}
	return correctos+1 > 1 
		? `<span>Tienes una racha de <b>${correctos+1}</b> respuestas correctas.</span>` 
		: null;
}

function feedbackIncorrecta(src) {
	$('footer.pie').addClass('pieIncorrecta');
	$('#btnResponder').addClass('respIncorrecta');
	$('#imgfeedback').attr('src', src);
	btnRespuesta.setAttribute("onClick", "continuarEjercicio();");
}

function continuarEjercicio() {
	$('footer.pie').removeClass('pieIncorrecta pieCorrecta');
	$('#btnResponder').removeClass('respIncorrecta respCorrecta');
	$('footer.pie').find('span').css('color', '');
	$('footer.pie').find('span').html("<span></span>");
	$('#btnResponder').html('Responder');
	$('#btnConsulta').removeClass('d-none');
	$('#imgfeedback').addClass('d-none');
	btnRespuesta.setAttribute("onClick", "answer();");
	btnRespuesta.disabled = true;
	//limpia inputs
	$('section.contenido').find('input').prop('disabled', false).val('');
	$('input:checked').prop('checked', false);
	$('.radio-div__selected').removeClass('radio-div__selected');
}
//handle modals
function openModalFeedback(feedback, img) {
	var src = `https://desarrolloadaptatin.blob.core.windows.net/feedbacksimg/${img}`;
	$('#modalFeedback').find('img').attr('src',src);
	$('#modalFeedback').find('span').html(feedback);
	$('#modalFeedback').modal({
		backdrop: 'static',
    keyboard: false
	});
	$('#modalFeedback').modal('show');
}

function closeModalFeedback() {
	$('#modalFeedback').modal('hide');
	$('section.contenido').find('input').prop('disabled', false).val('');
	$('input:checked').prop('checked', false);
	$('.radio-div__selected').removeClass('radio-div__selected');
}

function openModalGlosa() {
	$('#modalGlosa').modal({
		backdrop: 'static',
    keyboard: false
	});
	$('#modalGlosa').modal('show');
}

function closeModalGlosa() {
	$('#modalGlosa').modal('hide');
}