// Se crea el archivo de configuracion para realizar la autenticacion por medio de firebase 
const firebaseConfig = {
    apiKey: "AIzaSyDNUbWOOFxuR-1fNYJujWir2xRQU5QF8gg",
    authDomain: "bloggeekplatzi1.firebaseapp.com",
    databaseURL: "https://bloggeekplatzi1.firebaseio.com",
    projectId: "bloggeekplatzi1",
    storageBucket: "bloggeekplatzi1.appspot.com",
    messagingSenderId: "763115962574",
    appId: "1:763115962574:web:287110d9b1615d1c9a509f",
    measurementId: "G-ZMPBZ14S63"
};

firebase.initializeApp(firebaseConfig);

// Lo que queremos es que si un usuario se va a registrar, se meta al formulario de registro
// el cual tiene la clase register-form/ entonces vamos a crear un formulario register form 
// se  supone que aca tenemos el formulario de registro, en caso de que no, se procede a colocarle desde el html un nombre
const formulario=document.forms['form-register']


// tomar el segundo formulario y a este se le hace el login
const authForm=document.forms['form-auth']

const forgotForm=document.forms['form-forgot']

forgotForm.addEventListener('submit',olvidar_contrasena);

formulario.addEventListener('submit', crearUsuario);
//El siguiente escucha es el otro boton
authForm.addEventListener('submit', AutenticarUsuario);

function crearUsuario(event){
	event.preventDefault();
	const email = formulario['email'].value;
	const password = formulario['password'].value;
	const name = formulario['name'].value;
	// se verifica si no lleno algun campo 
	if (!email || !name || !password){
		console.log('Deben llenarse todos los campos')

		swal({
			title:"Warning",
			  text:"You must fill all the fields",
			  icon:"warning"
		  })
	}

	else{
		console.log(`El usuario que quiere crearse es ${name} con email ${email} y contraseña ${password}`)
		// empezamos con el meneito de firebase 
		// como ya tenemos la info vamos a agregarla 
		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(result=>{
			result.user.updateProfile({
				displayName: name
			})
			const configuracion={
				url: 'http://bloggeekplatzi1.firebaseapp.com'
			}
			//Vamos a enviar un correo para que el usuario pueda verificarse 
			result.user.sendEmailVerification(configuracion)
			.catch(error=>{// en caso deque hayaerror en el envío del correo 
			console.error(error)
		})
			// aca cierro la authenticacion hasta que el verifique en su correo 
			firebase.auth().signOut()
			alert("Se envío un correo, porfa ve y dale click")
			swal({
				title:"Check",
				  text:"Please check you email",
				  icon:"success"
			  
			  })
		})
		.catch(error=>{
			alert(error)
			console.error(error)
		})
	}
	

}

function AutenticarUsuario(event){
	event.preventDefault();
	const password = authForm['password'].value;
	const username = authForm['username'].value;
	console.log(`El usuario que quiere entrar es ${username} con  contraseña ${password}`)

  	firebase.auth().signInWithEmailAndPassword(username, password)
    .then(result=>{
    	if(result.user.emailVerified){
    		console.log('Credenciales correctas, brother, bienvenido.');
    	}
      else{
          
        
      	if(confirm("Verifica en tu correo electronico")){
      		const configuracion={
				url: 'http://bloggeekplatzi1.firebaseapp.com'
			}
			//Vamos a enviar un correo para que el usuario pueda verificarse 
			result.user.sendEmailVerification(configuracion)
			.catch(error=>{// en caso deque hayaerror en el envío del correo 
				alert(error)

			console.error(error)
		})

      	console.log('Listo ya lo enviamos')
      	}
      	else{
      		console.log('okay como quieras')
      	}
      	//si va entrar pero se sale
      	firebase.auth().signOut()
      }
  	})
    
    .catch(function (error) {
    alert(error)
	  console.log(error);

    });
}

function olvidar_contrasena(event){
    var auth = firebase.auth();
    event.preventDefault();
    const email = forgotForm['email-address'].value;

    auth.sendPasswordResetEmail(email).then(function() {
        swal({
            title:"Check",
              text:"An email has been sent",
              icon:"success"
          
          })
        // Email sent.
      }).catch(function(error) {
        alert(error)
        console.log(error)
      });
}
// tengo un objeto mirando si hay o no autenticacion, si la hay abre lo otro
firebase.auth().onAuthStateChanged(user => {
  if(user) {
    //window.location = 'personalDashboard.html'; //After successful login, user will be redirected to home.html
    console.log('Usuario permitido')
	window.location = '../UvA/UvA.html'; //After successful login, user will be redirected to home.html
  }
});

