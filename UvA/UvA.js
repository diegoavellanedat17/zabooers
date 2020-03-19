// Este archivo verificará si el usuario queingresa es un administrador o un usuario y lo redirige a la página correspondiente
// Cuando es un administrador lo redirije a PersonalDashBoard o a UsersDashboard
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

// se verificará si es administradorpara redifirjir a la página.
db=firebase.firestore()

function getUserData(){
return new Promise((resolve,reject)=>{
    firebase.auth().onAuthStateChanged(user => {
        const userData={
            uid:user.uid,
            email:user.email,
            name:user.displayName
        }
        resolve(userData)
    });
})
}


function RedirijirUsuario(userData){
// buscar el uid en la collecion de usuarios 


var consulta_usuarios=db.collection('UvA').where("uid","==",userData.uid)
consulta_usuarios.get()
.then(function(querySnapshot){
    if(querySnapshot.empty){
        //Caso 1 no existe por que es la primera vez que ingresa
        console.log('Caso 1')
        //redirigir a la Página de usuarios
        // crear en la base de datos
        var randomNumber=getRndInteger(100,300)
        var asosiate_name= userData.name.toLowerCase();
        asosiate_name=asosiate_name.replace(/\s/g, '');
        asosiate_name=asosiate_name+randomNumber
        db.collection('UvA').add({
             uid:userData.uid,
             name:userData.name,
             email:userData.email,
             permiso:'user',
             asosiate_name:asosiate_name

        })
        // .then(function() {
        //     console.log("Document successfully written!");
        // })
        // .catch(function(error) {
        //     console.error("Error writing document: ", error);
        // });
        setTimeout(function(){window.location = '../Users/users.html';  }, 2000);


    }

    else{

        querySnapshot.forEach(function(doc){
            const permisos=doc.data().permisos
            console.log(permisos)
            if(permisos==='admin'){
                //Caso 3 Es administrador
                console.log('Caso 3 ')
                //window.location = '../personalDashboard.html'; //After successful login, user will be redirected to home.html
                firebase.auth().signOut()
                window.location = '../index.html'; //After successful login, user will be redirected to home.html
            }     
            else{
                //Caso 2 es usuario y no es la primera vez que entra
                console.log('Caso 2')
                //setTimeout(function(){ window.location = '../userDashboard.html';  }, 3500);
                window.location = '../Users/users.html'; //After successful login, user will be redirected to home.html
            }
        })


    }

})
.catch(error=> {
    console.log(error)
    //window.location = '../login/login.html'; //After successful login, user will be redirected to home.html
})
}

getUserData()
.then(userData=>{
    console.log(userData)
    RedirijirUsuario(userData)
})
.catch(error=>{
    console.error(error)
    //window.location = '../login/login.html'; //After successful login, user will be redirected to home.html

})

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }