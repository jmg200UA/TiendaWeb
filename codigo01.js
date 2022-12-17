sessionStorage['num_pagina']=0;
sessionStorage['fotoactual']=0;

function pedirCategorias(){
    let xhr=new XHMLHttpRequest();
    let url='api/categorias';
    
    //Para recibir informacion se hace con GET
    //Modificar la base de datos se hace con POST
    //Para eliminar un articulo es con DELETE
    
    xhr.open('GET', url, true); //El tercer parametro indica si quieres que sea una peticion asincrona o no
    xhr.onerror=function(){
        console.log('ERROR');
    }
    xhr.onload=function(){
        console.log(xhr.reponseText);
        let r=JSON.parse(xhr.reponseText);
        /*
        let html='';
        r.FILAS.forEach(function(e){
            console.log(e.id+' '+e.nombre);
            html+=`<li>${e.id} - ${e.nombre}</li>`;
        });
        document.querySelector('#categorias').innerHTML=html;
        */
       document.querySelector('#categorias').innerHTML='';
       r.FILAS.forEach(function(e){
            let li=document.createElement('li');
            li.innerHTML=`${e.id} - ${e.nombre}`;
            document.querySelector('#categorias').appendChild(li);
       });
    }
    xhr.send();
}

/*function hacerLogin(frm){
    let xhr=new XMLHttpRequest();
    let url ='api/usuarios/login';
    let fd=new FormData(frm);

    xhr.open('POST', url, true);

    xhr.onload=function(){
        console.log(xhr.reponseText);
    };

    xhr.send(fd);
    return false;
}*/

function pedirInfoArticulo(){
	let xhr=new XMLHttpRequest(),
		url='api/articulos/1', /*api/articulos/ID_articulo*/
		autorizacion='usuario2:a0c696e672fc38b8899753ee0b077e10f5daa522ef5834af7d36859bf26159d4087eb98ca40ff664518dc9ac9b9edb7910b8e9e5f6d15bb1fee42f0aa3d73d6f'

	xhr.open('GET',url,true); /*true porque la queremos asincrona*/

	xhr.onload=function(){
		console.log(xhr.responseText);
		let r=JSON.parse(xhr.responseText);
		console.log(r);
		/*document.querySelector('#info-articulo').innerHTML=xhr.responseText;*/
	};

	xhr.setRequestHeader('Authorization', autorizacion);
	xhr.send();	
}





function pedirInfoArticulo2(){
	let url = 'api/articulos/2',
		usu= JSON.parse(sessionStorage['usuario']),
		cabecera;

		cabecera= usu.login + ':' +usu.token;

		fetch(url,{headers:{'Authorization': cabecera}}).then(function(respuesta){
			if(respuesta.ok){
				respuesta.json().then(function(datos){
					document.querySelector('#info-articulo-2').innerHTML=JSON.stringify(datos);
				});
			}
			else console.log('ERROR en la petición fetch');
		});
}

function mensajeModal(html){
	let div= document.createElement('div');

	//div.id='capa-fondo';
	div.setAttribute('id','capa-fondo');
	div.innerHTML= html;

	document.querySelector('body').appendChild(div);
}

function cerrarMensajeModal(){
	document.querySelector('#capa-fondo').remove();
}













//practica

function hacerLogin(frm){
	let url='api/usuarios/login',
		fd= new FormData(frm);

	fetch(url, {method:'POST',
				body:fd}).then(function(respuesta){
		if(respuesta.ok){
			respuesta.json().then(function(datos){
				console.log(datos);

				console.log(JSON.stringify(datos));
				sessionStorage['usuario']= JSON.stringify(datos);


				//texto del mensaje
				let html= '';

				html += '<article>';
				html += '<h2>HACER LOGIN </h2>';
				html += '<p> El usuario ' +  datos.login + ' se ha logueado correctamente';
				//html += '<p>La operacion de login se ha realizado correctamente';
				html += '<footer><a href="index.html"><button onclick="cerrarMensajeModal();">Aceptar</a></button>'
				html += '</article>';

				mensajeModal(html);

			});
		}
		else{
			console.log('Error en la peticion fetch');

			let html= '';

				html += '<article>';
				html += '<h2>ERROR LOGIN </h2>';
				html += '<p> El usuario o contraseña no son correctos';
				//html += '<p>La operacion de login se ha realizado correctamente';
				html += '<footer><a href="login.html"><button onclick="cerrarMensajeModal();">Aceptar</a></button>'
				html += '</article>';

				mensajeModal(html);
		} 
	});

	return false;
}

function hacerLogout(frm){ //winfow.location('url');
    let xhr= new XMLHttpRequest();
    let url = 'api/usuarios/logout';
    let usu= JSON.parse(sessionStorage['usuario']);
    let autorizacion= usu.login + ':' + usu.token;
    let html='';


    xhr.open('POST', url, false);

    xhr.onload=function(){
        console.log(usu.login + " ha cerrado la sesión");
        delete sessionStorage['usuario'];
        console.log("Logout exitoso");
        html += '<article>';
		html += '<h2>HACER LOGOUT </h2>';
		html += '<p> Te deslogueaste con éxito';
		html += '<footer><a href="index.html"><button onclick="cerrarMensajeModal();">Aceptar</a></button>'
		html += '</article>';

		mensajeModal(html);

    };

    xhr.setRequestHeader('Authorization', autorizacion);
    xhr.send();
    return false;
}

function registrado(){

	let html='';
	let usu= '';
		if(sessionStorage['usuario']!=null){
			usu=JSON.parse(sessionStorage['usuario']);
		}

	if(document.body.getAttribute('data-pagina')!='inicio'){
		html += '<li><a href="index.html"> <span class="icon-home"></span> <span class="t"> Inicio </span></a></li>';
	}

	if(document.body.getAttribute('data-pagina')!='buscar'){
		html += '<li><a href="buscar.html"> <span class="icon-search"></span><span class="t"> Buscar </span></a></li>';
	}

	if(sessionStorage['usuario']){
		if(document.body.getAttribute('data-pagina')=='login') window.location.href="index.html";
		if(document.body.getAttribute('data-pagina')=='registro') window.location.href="index.html";
		if(document.body.getAttribute('data-pagina')!='nuevo'){
			html += '<li><a href="nuevo.html"> <span class="icon-doc-new"></span> <span class="t"> Nuevo artículo </span></a></li>';
		}
		html += '<li><span class="icon-logout"><button onclick="hacerLogout();">Logout </button> (' + usu.login + ')</span></li>';
		
		//html += '<li><a href="index.html"><button onclick="hacerLogout();">Logout</button></a></li>';
		
	}
	else{
		if(document.body.getAttribute('data-pagina')=='nuevo'){
			window.location.href="index.html";
		}
		if(document.body.getAttribute('data-pagina')!='login'){
			html += '<li><a href="login.html"> <span class="icon-login"></span> <span class="t"> Login </span></a></li>';
		}

		if(document.body.getAttribute('data-pagina')!='registro'){
			html += '<li><a href="registro.html"> <span class="icon-user-add"></span> <span class="t"> Registro </span></a></li>';
		}
	}

	document.querySelector('body>nav>ul').innerHTML = html;
}

function hacerRegistro(frm){
	let url='api/usuarios/registro',
		fd= new FormData(frm);

	fetch(url, {method:'POST',
				body:fd}).then(function(respuesta){
		if(respuesta.ok){
			respuesta.json().then(function(datos){
				console.log(datos);

				console.log(JSON.stringify(datos));
				


				//texto del mensaje
				let html= '';

				html += '<article>';
				html += '<h2>HACER REGISTRO </h2>';
				html += '<p> El usuario ' +  datos.LOGIN + ' se ha registrado correctamente';
				//html += '<p>La operacion de login se ha realizado correctamente';
				html += '<footer><a href="login.html"><button onclick="cerrarMensajeModal()">Aceptar</a></button>'
				html += '</article>';

				document.querySelector('#reset').click();

				mensajeModal(html);

			});
		}
		else{
			console.log('Error en la peticion fetch');
		}	
		 
	});

	return false;
}

/*function verDisponibilidad(){
    let xhr=new XMLHttpRequest();
    let url ='api/usuarios/document.getElementById("usuario");';
    

    xhr.open('GET', url, true);

    xhr.onload=function(){
    	
        console.log(xhr.responseText);

        let html= '';

				html += '<article>';
				html += '<h2>ERROR LOGIN </h2>';
				html += '<p> El nickname no está disponible';
				
				html += '<footer><button onclick="cerrarMensajeModal();">Aceptar</button>'
				html += '</article>';

				mensajeModal(html);


    };
    

    xhr.send();
    return false;
}*/

function contraseñas(){
	let html= '';
	if(document.getElementById("contrasena").value!=document.getElementById("contrasena2").value){
		

		html = '<p id="alerta"> Las contraseñas no son iguales';
		document.querySelector('#aviso').innerHTML=html;
				
	}
	else{
		html='';
		document.querySelector('#aviso').innerHTML=html;
	} 

}

function verDisponibilidad(){
	let url='api/usuarios/' + document.getElementById("usuario").value;

	fetch(url).then(function(respuesta){
		if(respuesta.ok){
				respuesta.json().then(function(datos){
					if(datos.DISPONIBLE==true){
					console.log("login disponible");
					}
					else{
						console.log("login no disponible");
						let html= '';

						html += '<article>';
						html += '<h2>ERROR LOGIN </h2>';
						html += '<p> El usuario no está disponible';
						//html += '<p>La operacion de login se ha realizado correctamente';
						html += '<footer><a href="registro.html"><button onclick="cerrarMensajeModal();">Aceptar</a></button>'
						html += '</article>';

						

						mensajeModal(html);
					} 
					
					console.log(datos);
					
					
					

				});
		}
		else{
			console.log('Error en la peticion fetch');

			
		} 
	});

	return false;
}

function pedirCategorias(){
	let url='api/categorias';

	fetch(url).then(function(respuesta){
		if(respuesta.ok){ //Si la respuesta la tenemos...
			respuesta.json().then(function(datos){
				console.log(datos);
				if(datos.RESULTADO=='OK'){
					let html='';
						datos.FILAS.forEach(function(e){
							html += `<option>${e.id} - ${e.nombre}</option>`;
						});
						document.querySelector('#listacat').innerHTML=html;
				}
				else console.log('ERROR: '+ datos.DESCRIPCION);
			});
		}
		else console.log("Error en la peticion Fetch");
	});
}

/*function subirFichero(frm){
	let url = 'api/articulos/3/foto',
		xhr = new XMLHttpRequest();
		fd = new FormData(frm),
		autorizacion;

	autorizacion = 'usuario2:a0c696e672fc38b8899753ee0b077e10f5daa522ef5834af7d36859bf26159d4087eb98ca40ff664518dc9ac9b9edb7910b8e9e5f6d15bb1fee42f0aa3d73d6f'

	xhr.open('POST', url, true);
	xhr.onload= function(){
		console.log(xhr.responseText());
	};

	xhr.setRequestHeader('Authorization', autorizacion);

	xhr.send(fd);
} */ 

function cargarFoto(inp){
	let fr=new FileReader(),
	html ='';

	if(inp.files[0]!=null){
		let kb=inp.files[0].size/1024/1024;
		if (kb<=0.3) {
			fr.onload= function(){

			inp.parentNode.querySelector('img').src=fr.result;
			};

			fr.readAsDataURL(inp.files[0]);
		}
		else {
			html += '<article>';
			html += '<h2> SUBIDA FOTO </h2>';
			html += '<p> Tamaño mayor a 300kb';
			html += '<footer><button onclick="cerrarMensajeModal();">Aceptar</button>'
			html += '</article>';

			mensajeModal(html);
		}
	}
		
	
}

function añadirFoto(){
	let html='';
	
	
	html += '<label for="foto"><img alt="noimg"  src="imagenes/no-imagen.jpg"></label>';
	html += '<input id="foto" hidden="" type="file" name="foto"  accept="image/*" onchange="cargarFoto(this);"/><br>';

	document.querySelector('#foto').innerHTML+=html;
	html='';
	
							
}

function enviarFoto(btn){
	let url='api/articulos/'+ sessionStorage['idnuevo'] + '/foto',
		usu=JSON.parse(sessionStorage['usuario']),
		fd= new FormData();

	fd.append('fichero', btn.parentNode.querySelector('input').files[0]);

	fetch(url, {method:'POST',
				body:fd,
				headers:{'Authorization':usu.login + ':' + usu.token}}).then(function(respuesta){
					if(respuesta.ok){
						respuesta.json().then(function(datos){
							console.log(datos);
						});
					}
					else console.log("Error en la peticion fetch");
				});

	return false;


}

function subirArticulo(frm){
	let url='api/articulos',
		usu=JSON.parse(sessionStorage['usuario']),
		fd= new FormData(frm),
		html='';
	

	fetch(url, {method:'POST',
				body:fd,
				headers:{'Authorization':usu.login + ':' + usu.token}}).then(function(respuesta){
					if(respuesta.ok){
						respuesta.json().then(function(datos){
							console.log(datos);
							console.log(JSON.stringify(datos));
							if(datos.RESULTADO=='OK'){
								sessionStorage['idnuevo']=datos.ID;
								
								document.querySelector('#dalefoto').click();

								html += '<article>';
								html += '<h2> SUBIDA ARTÍCULO </h2>';
								html += '<p> Artículo subido correctamente';
								//html += '<p>La operacion de login se ha realizado correctamente';
								html += '<footer><a href="login.html"><button onclick="cerrarMensajeModal();">Aceptar</a></button>'
								html += '</article>';

								

								mensajeModal(html);
							}
							
						});
					}
					else console.log("Error en la peticion fetch");
				});

	return false;
}

function borrarArticulo(){
	let split = location.search.split("=")[1];
		url='api/articulos/'+ split,
		usu=JSON.parse(sessionStorage['usuario']);
	

	fetch(url, {method: 'DELETE',
				headers:{'Authorization':usu.login + ':' + usu.token}}).then(function(respuesta){
					if(respuesta.ok){
						respuesta.json().then(function(datos){
							console.log(datos);
							console.log(JSON.stringify(datos));
							console.log("Se ha borrado el articulo");
							
						});
					}
					else console.log("Error en la peticion fetch");
				});

	return false;
}

function infoBorrar(){
let html='';
	
	html += '<div>'
	html += '<p> ¿Estás seguro de que quieres borrar el artículo? </p>' 
	html +=	'</div>';	
	html += '<footer><a href="index.html"> <button onclick="borrarArticulo();">Confirmar</button></a><button onclick="cerrarMensajeModal();">Cancelar</button>';	
	

	mensajeModal(html);
}

function infoModificar(){
let html='';
	

	html += '<form onsubmit="return modificarArticulo(this);">';
				//<fieldset>
	html += '<div>'
	html +=	'<label for="descripcion">Descripción<span class="aster">*</span> </label>';
	html += '<textarea name="descripcion" id="descripcion" placeholder="Descripción artículo"  cols="23" rows="7" minlength="1" maxlength="300" required >' + sessionStorage['descrip'] + '</textarea>';
	html += '</div>';
	html += '<div>';
	html += '<label for="precio">Precio </label>';
	html += '<input type="number"  name="precio" id="precio" min="0"  value=' + sessionStorage['precio'] + '  step="0.01" placeholder="Introduce el precio" />'; 
	html +=	'</div>';	
	html += '<footer><input type="submit" value="Confirmar"/><button onclick="cerrarMensajeModal();">Cancelar</button>';	
				// </fieldset>
	html += '</form>';

	mensajeModal(html);
}

function modificarArticulo(frm){
	let split = location.search.split("=")[1];
		url='api/articulos/'+ split,
		fd= new FormData(frm),
		usu=JSON.parse(sessionStorage['usuario']),
		html2='',
		html3='';
	

	fetch(url, {method: 'POST',
				body:fd,
				headers:{'Authorization':usu.login + ':' + usu.token}}).then(function(respuesta){
					if(respuesta.ok){
						respuesta.json().then(function(datos){
							console.log(datos);
							console.log(JSON.stringify(datos));
							console.log("Se ha modificado el articulo");

							//sessionStorage['modiprecio']=datos.precio;
							
							html2 += '<p id="prec"><span class="icon-euro"></span>' + document.querySelector('#precio').value +'</p>';
							document.querySelector('#prec').innerHTML=html2;

							html3 += '<p id="descr">' + document.querySelector('#descripcion').value + '</p>';
							document.querySelector('#descr').innerHTML=html3;


							let html= '';

							html += '<article>';
							html += '<h2>MODIFICAR ARTÍCULO</h2>';
							html += '<p> Artículo modificado con éxito';
							//html += '<p>La operacion de login se ha realizado correctamente';
							html += '<footer><button onclick="cerrarMensajeModal()">Aceptar</button>'
							html += '</article>';
							mensajeModal(html);

						});
					}
					else console.log("Error en la peticion fetch");
				});

	return false;
}

function InfoArticulo(){
	let url = 'api/articulos',
		html='';

		

		fetch(url).then(function(respuesta){
			if(respuesta.ok){
				respuesta.json().then(function(datos){
					console.log(datos);
					paginacion(datos.FILAS.length);
					
					sessionStorage['tam']=datos.FILAS.length;
					
					/*datos.FILAS.forEach(function(e){
						 html += `<article><h3>${e.nombre}</h3>`;
						 html += `<a href="articulo.html?idart=${e.id}"><img alt="imgbd" src="fotos/articulos/${e.imagen}"></a>`;
						 html += `<div><p><span class="icon-camera"></span>${e.nfotos}</p>`;
						 html += `<p><span class="icon-euro"></span>${e.precio}</p>`;
						 html += `<p><span class="icon-eye"></span>${e.veces_visto}</p>`;
						 html += `<p><span class="icon-eyedropper-1">${e.nsiguiendo}</span></p>`;
						 html += `</div>`;
						 html += `<p>${e.descripcion}</p>`;
						 html += `</article>`;
			            console.log(e);
			       });
					document.querySelector('#art').innerHTML=html;*/
				});
			}
			else console.log('ERROR en la petición fetch');
		});
}

function seguirArticulo(){
	let split = location.search.split("=")[1];
		url='api/articulos/' + split + '/seguir/true',
		usu=JSON.parse(sessionStorage['usuario']),
		html='',
		html2='';

	fetch(url, {method:'POST',
				headers:{'Authorization':usu.login + ':' + usu.token}}).then(function(respuesta){
		if(respuesta.ok){
			respuesta.json().then(function(datos){
				sessionStorage['n_siguiendo']=parseInt(sessionStorage['n_siguiendo'])+1;
				html2 += '<p id="nsig"><span class="icon-eyedropper-1">' + sessionStorage['n_siguiendo'] + '</span></p>';
				document.querySelector('#nsig').innerHTML=html2;
				console.log(datos);
				console.log("Seguiste el articulo");
				html = '<button onclick="DejarDeSeguirArticulo();">Dejar de seguir</button>';
						 document.querySelector('#seg').innerHTML=html;

				
				
			});
		}
		else console.log("Error en la peticion fetch");
	});

}

function DejarDeSeguirArticulo(){
	let split = location.search.split("=")[1];
		url='api/articulos/' + split + '/seguir/false',
		usu=JSON.parse(sessionStorage['usuario']),
		html='',
		html2='';


	fetch(url, {method:'POST',
				headers:{'Authorization':usu.login + ':' + usu.token}}).then(function(respuesta){
		if(respuesta.ok){
			respuesta.json().then(function(datos){
				sessionStorage['n_siguiendo']=parseInt(sessionStorage['n_siguiendo'])-1;
				html2 += '<p id="nsig"><span class="icon-eyedropper-1">' + sessionStorage['n_siguiendo'] + '</span></p>';
				document.querySelector('#nsig').innerHTML=html2;
				console.log(datos);
				console.log("Dejaste de seguir el articulo");
				html = '<button onclick="seguirArticulo();">Seguir</button>';
						document.querySelector('#seg').innerHTML=html;


				


			});
		}
		else console.log("Error en la peticion fetch");
	});

}

function botonSeguir(){
	let split = location.search.split("=")[1];
		url = 'api/articulos/' + split,
		html='',
		usu= JSON.parse(sessionStorage['usuario']); 

		

		fetch(url,{headers:{'Authorization': usu.login + ':' +usu.token}}).then(function(respuesta){
			if(respuesta.ok){
				respuesta.json().then(function(datos){
					//comprobar si esta siguiendo
					datos.FILAS.forEach(function(e){
						
						sessionStorage['siguiendo']=e.estoy_siguiendo;
					});
					
					if(sessionStorage['siguiendo']==1){
						 html = '<button onclick="DejarDeSeguirArticulo();">Dejar de seguir</button>';
						 document.querySelector('#seg').innerHTML=html;
					}
					else{
						html = '<button onclick="seguirArticulo();">Seguir</button>';
						document.querySelector('#seg').innerHTML=html;
					}
					
				});
			}
			else console.log('ERROR en la petición fetch');
		});

		return false;
}

function MostrarInfoArticulo(){
	let split = location.search.split("=")[1],
		url = 'api/articulos/' + split,
		html='';

		let usu= '';
		if(sessionStorage['usuario']!=null){
			usu=JSON.parse(sessionStorage['usuario']);
		}

		

		fetch(url).then(function(respuesta){
			if(respuesta.ok){
				respuesta.json().then(function(datos){
					
					console.log(datos);
					datos.FILAS.forEach(function(e){
						sessionStorage['numfotos']=e.nfotos;
					});
					
					if(usu.login==datos.FILAS[0].vendedor) MostrarPreguntasArticulo(1);
					else if (sessionStorage['guardada']==1) MostrarPreguntasArticulo(3);
					else  MostrarPreguntasArticulo(0);

					if(usu.login && usu.login!=datos.FILAS[0].vendedor) paraPregunta(1);
					else if (!usu.login) paraPregunta(2);

					
					MostrarFotosArticulo(2);
					if (usu.login) botonSeguir();

					sessionStorage['precio']=datos.FILAS[0].precio;
					sessionStorage['descrip']=datos.FILAS[0].descripcion;


					if(usu.login==datos.FILAS[0].vendedor){
						html +='<button onclick="infoBorrar();"> Borrar artículo </button>';
						html +='<button onclick="infoModificar();"> Modificar artículo </button>';
						document.querySelector('#borrar').innerHTML=html;
						html ='';
					}
					datos.FILAS.forEach(function(e){
						 sessionStorage['n_siguiendo']=e.nsiguiendo;
						 html += `<article><h3><strong>${e.nombre}</strong></h3>`;
						 html += `<div><p><span class="icon-camera"></span>${e.nfotos}</p>`;
						 html += `<div id="pagart"><button onclick="MostrarFotosArticulo(0);" >Anterior</button><button onclick="MostrarFotosArticulo(1);" >Siguiente</button></div>`;
						 html += `<p><span class="icon-calendar"></span>${e.fecha.split(" ")[0]}</p>`;
						 html += `<p id="prec"><span class="icon-euro"></span>${e.precio}</p>`;
						 html += `<p><span class="icon-eye"></span>${e.veces_visto}</p>`;
						 html += `<p id="nsig"><span class="icon-eyedropper-1">${e.nsiguiendo}</span></p>`;
						 html += `<p><a href="#preg"><span class="icon-help-circled">${e.npreguntas}</span></a></p>`;
						 html += `</div>`;
						 html += `<p id="descr">${e.descripcion}</p>`;
						 html += `<p><img alt="imgbd2" src="fotos/usuarios/${e.foto_vendedor}"></p><p> ${e.vendedor} </p>`;
						 html += `</article>`;
			            document.querySelector('#artart').innerHTML=html;
			            html='';
			            
			       });
					
					
				});
			}
			else console.log('ERROR en la petición fetch');
		});

		return false;
}

function MostrarFotosArticulo(num){
	let split = location.search.split("=")[1],
		url = 'api/articulos/' + split + '/fotos',
		html='',
		i=sessionStorage['fotoactual'];

		

		fetch(url).then(function(respuesta){
			if(respuesta.ok){
				respuesta.json().then(function(datos){
					
					console.log(datos);
					JSON.stringify(datos);

					if (num==2) {
							html = '<a><img alt="imgbd" src="fotos/articulos/' + datos.FILAS[0].fichero + '"></a>'; 
							
							document.querySelector('#fotillo').innerHTML=html;
					}

					else if(num==0){
						if(i>0){
							i--;
							sessionStorage['fotoactual']=i;
							html = '<a><img alt="imgbd" src="fotos/articulos/' + datos.FILAS[i].fichero + '"></a>'; 
							
							document.querySelector('#fotillo').innerHTML=html;
							
						}
					}
					else if (num==1){
						if(i<sessionStorage['numfotos']-1){
							i++;
							sessionStorage['fotoactual']=i;
							html = '<a><img alt="imgbd" src="fotos/articulos/' + datos.FILAS[i].fichero + '"></a>'; 
							
							document.querySelector('#fotillo').innerHTML=html;
							
						}
					}
					
					console.log(datos);
				});
			}
			else console.log('ERROR en la petición fetch');
		});
}


function MostrarPreguntasArticulo(num){
	let split = location.search.split("=")[1],
		url = 'api/articulos/' + split + '/preguntas',
		//usu= JSON.parse(sessionStorage['usuario']),
		html='';
		let i=0;

		

		fetch(url).then(function(respuesta){
			if(respuesta.ok){
				respuesta.json().then(function(datos){
					console.log(datos);
					
					if(num==1){
						while(i<datos.FILAS.length){
							html='';
							html += '<div id="preguntas"><p><strong>Pregunta: </strong>' + datos.FILAS[i].pregunta + '</p></div>';
							
							
							if(datos.FILAS[i].respuesta!=null){
								html += '<div><p><strong>Respuesta: </strong>' + datos.FILAS[i].respuesta + '</p></div><br>';
								
							} 
							else comprobarRespuesta();
							sessionStorage['idpreg']=datos.FILAS[i].id;
							
							document.querySelector('#preg').innerHTML+=html;
								
							i++;	
						}	
					}
					else{
						
						while(i<datos.FILAS.length){
							html='';
							if(num==3){
									html += '<div><p><strong>Pregunta: </strong>' + datos.FILAS[i].pregunta + '</p></div>';
							
							
								if(datos.FILAS[i].respuesta!=null){
									html += '<div><p><strong>Respuesta: </strong>' + datos.FILAS[i].respuesta + '</p></div><br>';
									
								}
								else html += '<div><p> Sin respuesta </p></div><br>';
								

								document.querySelector('#preg').innerHTML+=html;
								break;
							}
							html += '<div><p><strong>Pregunta: </strong>' + datos.FILAS[i].pregunta + '</p></div>';
							
							
							if(datos.FILAS[i].respuesta!=null){
								html += '<div><p><strong>Respuesta: </strong>' + datos.FILAS[i].respuesta + '</p></div><br>';
								
							}
							else html += '<div><p> Sin respuesta </p></div><br>';
							

							document.querySelector('#preg').innerHTML+=html;	
							i++;

						}	
					}	

				});
			}
			else console.log('ERROR en la petición fetch');
		});
}

function comprobarRespuesta(){
let html='';
	
		

		html= '<button id="responder" onclick="paraRespuesta();">Responder</button>'

		document.querySelector('#resp').innerHTML=html;
		html='';
	
}

function paraRespuesta(){
let html='';
	
	html += '<form onsubmit="return hacerRespuesta(this);">';
	html +=	'<label><strong>Hacer Respuesta: </strong></label>';
	html +=	'<textarea name="texto" placeholder="escribe tu respuesta aquí"></textarea>';
	html +=	'<div><input type="reset"><input type="submit"></div>';
	html +=	'</form>';

	document.querySelector('#resp').innerHTML=html;
}

function paraPregunta(num){
let html='';
	
	if(num==1){
		html += '<form  onsubmit="return hacerPregunta(this);">';
		html +=	'<label><strong>Hacer Pregunta: </strong></label>';
		html +=	'<textarea name="texto" placeholder="escribe tu pregunta aquí"></textarea>';
		html +=	'<div><input type="reset" id="res"><input type="submit"></div>';
		html +=	'</form>';

		document.querySelector('#hacerpreg').innerHTML=html;
	}
	else if(num==2){
		html += '<p> No estas logueado, haz <a href="login.html"> login </a> para poder realizar una pregunta </p>';
		document.querySelector('#hacerpreg').innerHTML=html;
	}
}

function hacerPregunta(frm){ //para la respuesta es igual
	let split = location.search.split("=")[1],
		url='api/articulos/' + split + '/pregunta',
		fd= new FormData(frm),
		usu=JSON.parse(sessionStorage['usuario']),
		html='';

	fetch(url, {method:'POST',
				body:fd,
				headers:{'Authorization':usu.login + ':' + usu.token}}).then(function(respuesta){
					if(respuesta.ok){
						respuesta.json().then(function(datos){
							console.log(datos);

						html += '<article>';
						html += '<h2>PREGUNTA GUARDADA</h2>';
						html += '<p> Se ha guardado correctamente';
						//html += '<p>La operacion de login se ha realizado correctamente';
						html += '<footer><button onclick="cerrarMensajeModal();">Aceptar</button>'
						html += '</article>';

						

						mensajeModal(html);

						document.querySelector('#res').click();

						MostrarInfoArticulo();
						sessionStorage['guardada']=1;
							

						});
					}
					else{
						html += '<article>';
						html += '<h2>ERROR PREGUNTA </h2>';
						html += '<p> No se pudo guardar la pregunta';
						//html += '<p>La operacion de login se ha realizado correctamente';
						html += '<footer><a href="articulo.html"><button onclick="cerrarMensajeModal();">Aceptar</a></button>'
						html += '</article>';

						

						mensajeModal(html);
						console.log("Error en la peticion fetch");
					} 
				});


	return false;
}

function hacerRespuesta(frm){ //para la respuesta es igual
	let split = location.search.split("=")[1],
		url='api/preguntas/' + sessionStorage['idpreg'] + '/respuesta', //el id lo tengo que poner de la pregunta que sea
		fd= new FormData(frm),
		usu=JSON.parse(sessionStorage['usuario']);

		

	fetch(url, {method:'POST',
				body:fd,
				headers:{'Authorization':usu.login + ':' + usu.token}}).then(function(respuesta){
					if(respuesta.ok){
						respuesta.json().then(function(datos){
							console.log(datos);
							MostrarInfoArticulo();
						});
					}
					else console.log("Error en la peticion fetch");
				});


	return false;
}

function paginacion(num,boolean){
	
	let numpags= 1;
	let html='';

	if(num%6!=0) numpags=(Math.trunc(num/6));
	else numpags=(num/6)-1;

	

	sessionStorage['numpags']=numpags;

	let pag=sessionStorage['num_pagina'];

	let url=  'api/articulos?pag=' + sessionStorage['num_pagina'] + '&lpag=6';
	if(boolean==true){
		url= sessionStorage['texto'] + 'pag=' + sessionStorage['num_pagina'] + '&lpag=6';
	}


	
	fetch(url).then(function(respuesta){
			if(respuesta.ok){
				respuesta.json().then(function(datos){
					console.log(datos);
					datos.FILAS.forEach(function(e){
						 html += `<article><h3>${e.nombre}</h3>`;
						 html += `<a href="articulo.html?idart=${e.id}"><img alt="imgbd" src="fotos/articulos/${e.imagen}"></a>`;
						 html += `<div><p><span class="icon-camera"></span>${e.nfotos}</p>`;
						 html += `<p><span class="icon-euro"></span>${e.precio}</p>`;
						 html += `<p><span class="icon-eye"></span>${e.veces_visto}</p>`;
						 html += `<p><span class="icon-eyedropper-1">${e.nsiguiendo}</span></p>`;
						 html += `</div>`;
						 html += `<p>${e.descripcion}</p>`;
						 html += `</article>`;
			            
			       });
				document.querySelector('#art').innerHTML=html;
				html='';
				html += '<button  onclick="aceptarPagina(0);"> Primera </button> ';
				html += '<button  onclick="aceptarPagina(1);"> Anterior </button>';
				html += 'Página actual ' + sessionStorage['num_pagina'] + '/' + numpags;	
				html += '<button onclick="aceptarPagina(2);"> Siguiente </button>';
				html += '<button onclick="aceptarPagina(3);" > Última </button>';

				document.querySelector('#paginas').innerHTML=html;
				});
				

				
			}
			else console.log('ERROR en la petición fetch');
	});
}

function aceptarPagina(pag){
	
	let ses=sessionStorage['num_pagina'];
	let tam=sessionStorage['tam'];
	let numpags=sessionStorage['numpags'];

	if(pag==0 && pag!=ses) sessionStorage['num_pagina']=0;
	else if(pag==1 && ses>0) sessionStorage['num_pagina']--;
	else if(pag==2 && ses+1<numpags) sessionStorage['num_pagina']++;
	else if(pag==3 && pag!=ses) sessionStorage['num_pagina']=numpags;

	

	
	paginacion(tam);
	

	

	//que no se pase del limite

}

function infoBusca(){
	let usu='',
		html='';

		
	if(sessionStorage['usuario']!=null){
			usu=JSON.parse(sessionStorage['usuario']);
	}

	
		html += '<form onsubmit="return buscar();">';
		html += '<fieldset>';
		html += '<legend> Formulario de búsqueda </legend>';
		if(sessionStorage['prueba']!=''){
			html += '<div>';
			html += '<label for="articulo">Artículo </label>';
			html += '<input type="text" name="articulo" id="articulo" placeholder="Introduce artículo" size="30"  maxlength="100" value=' + sessionStorage['prueba'] + ' autofocus  />';
			html += '</div>';
		}
		else{
			html += '<div>';
			html += '<label for="articulo">Artículo </label>';
			html += '<input type="text" name="articulo" id="articulo" placeholder="Introduce artículo" size="30"  maxlength="100"  autofocus />';
			html += '</div>';
			
		}
		html += '<div>';
		html += '<label for="vendedor">Vendedor </label>';
		html += '<input type="text" name="vendedor" id="vendedor" placeholder="Introduce vendedor" size="30"  maxlength="30"/>';
		html += '</div>';
		html += '<div>';
		html += '<label for="categoria">Categoría </label>';
		html += '<input type="text" name="categoria" id="categoria" placeholder="Introduce categoria" size="20"  maxlength="100"  />';
		html += '</div>';
		html += '<div>';
		html += '<label for="p-desde">Precio desde </label>';
		html += '<input type="number"  min="0" max="1000"  name="p-desde" id="p-desde" placeholder="Desde(0-1000)"     />';
		html += '</div>';	
		html += '<div>';
		html += '<label for="p-hasta">Precio hasta </label>';
		html += '<input type="number"  min="0" max="9999" name="p-hasta" id="p-hasta" placeholder="Hasta(max 9999)"    />';
		html += '</div>';
		if(usu.login){
			html += '<div>';
			html += '<label for="sigue">Artículos que sigue </label>';
			html += '<input type="checkbox" name="sigue" id="sigue" />';
			html += '</div>';
			html += '<div>';
			html += '<label for="venta">Artículos en venta </label>';
			html += '<input type="checkbox" name="venta" id="venta"/>';
			html += '</div>';
		}
		html += '</fieldset>';
		html += '<input type="submit" value="Buscar"/>';
		html += '<input type="reset" value="Limpiar"/>';
    	html += '</form>';

    	document.querySelector('#bus').innerHTML=html;
		sessionStorage['prueba']='';

}

function busquedaRapida(){
	sessionStorage['prueba']='';
	sessionStorage['prueba']=document.querySelector('#textito').value;
	
}



function buscar(){
	
	 let url = 'api/articulos?';
	 let url2= '';
	 let usu= '';
		if(sessionStorage['usuario']!=null){
			usu=JSON.parse(sessionStorage['usuario']);
		}
	 
	 
		
	 if(document.querySelector('#articulo').value!=''){
	 	url+= 't=' + document.querySelector('#articulo').value + '&';
	 }

	

	 if(document.querySelector('#vendedor').value!=''){
	 	url+= 'v=' + document.querySelector('#vendedor').value + '&';
	 }
	 if(document.querySelector('#categoria').value!=''){
	 	url+= 'c=' + document.querySelector('#categoria').value + '&';
	 }
	 if(document.querySelector('#p-desde').value!=''){
	 	url+= 'pd=' + document.querySelector('#p-desde').value + '&';
	 }
	 if(document.querySelector('#p-hasta').value!=''){
	 	url+= 'ph=' + document.querySelector('#p-hasta').value + '&';
	 }
	 

	 url2=url;

	 if (usu.login) {
	 	fetch(url,
	 		{headers:{'Authorization': usu.login + ':' +usu.token}}).then(function(respuesta){
			if(respuesta.ok){
				respuesta.json().then(function(datos){
					//paginacion(datos.FILAS[0].length);
					console.log(datos);
					
					sessionStorage['texto']=url2;
					paginacion(datos.FILAS.length,true);
					
					
				});
			}
			else console.log('ERROR en la petición fetch');
		});
	 }
	 else{
		fetch(url).then(function(respuesta){
			if(respuesta.ok){
				respuesta.json().then(function(datos){
					//paginacion(datos.FILAS[0].length);
					console.log(datos);
					
					sessionStorage['texto']=url2;
					paginacion(datos.FILAS.length,true);
					
					
				});
			}
			else console.log('ERROR en la petición fetch');
		});
	}

		return false;
}