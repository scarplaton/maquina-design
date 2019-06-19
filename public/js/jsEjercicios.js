var numeroIntento = 1;
var hiddenParent = window.parent.parent.varHidden; //Comunicacón con frame para resolver ejercicio
var hiddenTutorial = window.parent.parent.varTutorial; //Comunicacón con frame por video tutorial
var hiddenSegundoError = window.parent.parent.varSegundoError; //Comunicacón con frame Segundo error
var hiddenCierraFeed = window.parent.parent.cerrarFeedbackHijo; //Comunicacón con frame Segundo error
var hiddenPressConsulta = window.parent.parent.pressConsulta; //Comunicacón con frame Segundo error


$('#hiddenIntento').attr('onchange', 'cambio(this)');

function cambio(elemento){
	numeroIntento = $(elemento).val();
	respGeneral = parseInt($(elemento).val())-1;
}
	
function enviar(){
	var fechaTerminoIntento = new Date();
	var vercionEjercicio = window.location.href.substring(window.location.href.search(idEjercicio)+(String(idEjercicio).length+1),window.location.href.search(".html"));
	
	Date.prototype.yyyymmdd = function() {
	  var mm = this.getMonth() + 1; // getMonth() is zero-based
	  var dd = this.getDate();

	  return [this.getFullYear(),
			  (mm>9 ? '' : '0') + mm,
			  (dd>9 ? '' : '0') + dd
			 ].join('-');
	};

	var date = new Date();
	
	/*---captura valores de los elementos-----*/
		var values = "";
		if(_TIPO_INPUT_ === 'radio') {
			values = "Valor radio= "+ $("input[name=answer]:checked").val();
		} else {
			var inputs = document.querySelectorAll(".contenido input[name='answer']");
			for(var input of inputs) {
				values += 'Valor input= '+input.value+' ';		
			}
		}
	/*---------------------------------------*/
	var envioIntento = JSON.stringify({ 
		"idejercicioversion":vercionEjercicio,
		"correcto" : check ? 1 : 0, 
		"estarea" : 0 , 
		"idtareaiematricula" :0 , 
		"tiempoInicio" : ""+date.yyyymmdd()+" "+fechaEntrada+"", 
		"tiempoRespuesta" : ""+date.yyyymmdd()+" "+fechaTerminoIntento.toLocaleTimeString()+"", 
		"feedback": check ? 'Respuesta Correcta' : 
												numeroIntento < 2 ? feed.replace(/(\\n)|(\\t)/g, '').trim() :
																						'', 
		"codigoErrorComun" : errFre ? errFre : 0, 
		"respuesta": values,
		"glosa": numeroIntento === 2 ? 
				$('#glosa').text()
				.replace(/(\s\s)/g, '')
				.replace(/(\\n)|(\\t)/g, '')
				.trim() : null
	});
	console.log(envioIntento);

	/*----Comunicacion de frame a página padre----*/
		$(hiddenParent).val(envioIntento).trigger('change');
		$(hiddenParent).val(envioIntento).trigger('click');
	/*--------------------------------------------*/
	numeroIntento++;
}

function cerrarFeed(){//siguiente ejerccio respuesta correctas
	$(hiddenCierraFeed).val(true).trigger('change');
	$(hiddenCierraFeed).val(true).trigger('click');        
}

function pressConsulta(){
	$(hiddenPressConsulta).val("1").trigger('change');
	$(hiddenPressConsulta).val("1").trigger('click');
}
	
function cerrarFeedGlosa(){//siguiente ejercicio respuesta incorrecta por segunda vez
	$(hiddenSegundoError).val(true).trigger('change');
	$(hiddenSegundoError).val(true).trigger('click');
}
	
function sgteGlosa(){
	$("#imagenBotonRespuesta").css("visibility","hidden");	
	$(hiddenTutorial).val(true).trigger('change');
}

$(document).on("cut copy paste contextmenu",function(e) {
	e.preventDefault();
});

/*---------VALIDACIÓN INGRESO A EJERCICIO--------*/

	/*document.addEventListener('contextmenu', event => event.preventDefault());

	$(document).keydown(function(event){ // previene f12
			if(event.keyCode==123){
				return false;
			}
			else if(event.ctrlKey && event.shiftKey && event.keyCode==73){        
				return false;  //previene ctrl+shift+i
			}
			else if(event.ctrlKey && event.keyCode==85){        
				return false;  //previene control u
			}
			else if(event.ctrlKey && event.keyCode==67){        
				return false;  //previene control c
			}
			else if(event.ctrlKey && event.keyCode==74){        
				return false;  //previene control j
			}
			else if(event.shiftKey && event.keyCode==123){        
				return false;  //previene shift+f12 (firefox)
			}
			else if(event.ctrlKey && event.shiftKey && event.keyCode==81){        
				return false;  //previene contro+shift+q (firefox)
			}
			else if(event.shiftKey && event.keyCode==118){        
				return false;  //previene shift+f7 (firefox)
			}	
			else if(event.ctrlKey && event.shiftKey && event.keyCode==75){        
				return false;  //previene ctrl+shift+k (firefox)
			}	
			else if(event.ctrlKey && event.shiftKey && event.keyCode==74){        
				return false;  //previene ctrl+shift+j (firefox)
			}	
			else if(event.ctrlKey && event.shiftKey && event.keyCode==83){        
				return false;  //previene ctrl+shift+s (firefox)
			}	
			else if(event.ctrlKey && event.shiftKey && event.keyCode==67){        
				return false;  //previene ctrl+shift+c (firefox)
			}		
			else if(event.keyCode==27){        
				return false;  //previene escape(Opera)
			}
	});

	function validaFormato(elemento){ 
		var sinEspacios = $(elemento).val().replace(/ /g,"");
		var array = sinEspacios.split("");
		var res = "";		
		
		if(sinEspacios.length <= 3){
			$(elemento).val(sinEspacios);
			return false;
		}
		
		if(sinEspacios.length == 5){
			$(array).each(function(i){
				if(i == 2){
					res += " "+this;
				}else{
					res += this;
				}
			});
			$(elemento).val(res);
			return false;
		}
		if(sinEspacios.length == 6){
			$(array).each(function(i){
				if(i == 3){
					res += " "+this;
				}else{
					res += this;
				}
			});
			$(elemento).val(res);
			return false;
		}		
		
		if(sinEspacios.length == 4){
			$(array).each(function(i){
				if(i == 1){
					res += " "+this;
				}else{
					res += this;
				}
			});
			$(elemento).val(res);
			return false;
		}			
				
		if(sinEspacios.length == 7){
			$(array).each(function(i){
				if(i == 1 || i == 4){
					res += " "+this;
				}else{
					res += this;
				}
			});
			$(elemento).val(res);
			return false;
		}		
	}

	function validaNumero(elEvento){ 
	var evento = window.event || elEvento;
	var teclaPresionada = String.fromCharCode(evento.charCode);
	var soloFlechas = evento.charCode;
	if(soloFlechas == 37 || soloFlechas == 38 || soloFlechas == 39 || soloFlechas == 40){
		return false;
	}
	var soloNumero = new RegExp(/[0-9]/g);
	if(!soloNumero.test(teclaPresionada) || $(elEvento).val().length > 8){
		evento.preventDefault();
	}		
}
		*/