
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

//gsutil cors set cors.json gs://bloggeekplatzi1.appspot.com
//storage.googleapis.com/bloggeekplatzi1.appspot.com



firebase.initializeApp(firebaseConfig);
database= firebase.database();
db=firebase.firestore()
var storage = firebase.storage();

// Actualizar Nombre de usuario

//Variables con la info del usuario

// borrar datoss

function BuscarParaBorrar(){
    
  
            var ref=database.ref('zaboo_bb');
            ref.orderByChild("ID").equalTo('zaboo122').limitToLast(50).on("child_added", function(snapshot) {
                console.log(snapshot.key);
                ref.child(snapshot.key).remove()
            });

}
// borrar
//BuscarParaBorrar();

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
getUserData()
.then(userData=>{
    
    $(".user-name").text(userData.name)
    WelcomeAdmin()
})
.catch(error=>{
    console.error(error)
    //window.location = '../login/login.html'; //After successful login, user will be redirected to home.html

})
  
firebase.auth().onAuthStateChanged(user => {
    name=user.displayName
 });
// Buscar si ya está asociado con algun chat de zaboo 
function WelcomeAdmin(userData){

                        $(".user-items").empty()
                        $(".user-items").append(
                            `
                        <div class="alert alert-success mt-5 col-12 mr-3 ml-3 " role="alert">
                        <h4 class="alert-heading">Hi Admin!</h4>
                        <p>Hello my boss <i class="material-icons icon">chat</i> </p>
                        <hr>
                        <p class="mb-0">Don't forget Zaboo is your friend when ever you need it</p>
                        </div>`
                    )
}

// Fin de actualizar nombre de usuario
$(".logout").click(function(){
    console.log("Cerrar Sesión")
    firebase.auth().signOut()
     window.location = '../index.html'; 

});
                    
$(".users").click(function(){
    $(".user-items").empty()
    console.log('click usuarios')
    //consultar todos los usarios y colocar sus respectivas tarjetas
    var consulta_usuariosZaboo=db.collection('usuariosZaboo')
    consulta_usuariosZaboo.get()
        .then(function(querySnapshot){

            querySnapshot.forEach(function(user_zaboo){
                const chat_id=user_zaboo.data().chat_id
                const name=user_zaboo.data().nombre
                // se declaran asi para que sean variables globales
                dispositivos=user_zaboo.data().dispositivos
                dispositivos_legibles=user_zaboo.data().dispositivos_legibles
                tokens= user_zaboo.data().tokens
                asosiate=user_zaboo.data().asosiate_name
                console.log(user_zaboo.data())
                
                userCardTemplate(chat_id,name,tokens,asosiate)
                //en user zaboo tenemos los datos de los usuarios, aca se puede empezar a generar las tarjetas
                })
        }) 
            
        .catch(error=>{
                    console.log(error)
        })

    })


function userCardTemplate(chat_id,name,tokens,asosiate){
    
    $(".user-items").append(
        `<div class="card mt-3 mr-1 ml-1 shadow col-sm-12  col-lg-5" id="${chat_id}">

        <div class="card-body">
          <div class="row mb-3">

            <div class="col-6 user-image" >
              <img src="https://api.adorable.io/avatars/187/${name}@adorable.io.png" style="width: 4rem; border-radius: 50%; border: 2px solid #3665C1;"/>
            </div>

            <div class="info col-6" >
              <h5 class="card-title  d-flex justify-content-end">${name}</h5>
              <h6 class="card-subtitle mb-2 text-muted  d-flex justify-content-end">Chat ID: ${chat_id} </h6>
            </div>

          </div>

          <div class="col-12" style="border-top:solid 1px rgb(212, 212, 212)">
        
          <div class="row">
          <p class="card-text text-muted " style="font-size: small; width: 90%;" >Asosiate : <span>${asosiate}</span> </p> <i class="material-icons icon d-flex justify-content-end">email</i>
          </div>
           
          </div>

          <div class="col-12" style="border-top:solid 1px rgb(212, 212, 212); border-bottom:solid 1px rgb(212, 212, 212);">
        
            <div class="row">
            <p class="card-text text-muted " style="font-size: small; width: 90%;" >Tokens: <span>${tokens}</span> </p> <i class="material-icons icon d-flex justify-content-end">vpn_key</i>
            </div>
             
          </div>
          <div class="col-12 mt-3" >
        
     
           <i class="material-icons icon d-flex justify-content-end" style="color: rgb(48, 161, 38); cursor:pointer;" onClick="user_click(this.id)" id="${chat_id}">question_answer</i>
              
          </div>
          
        </div>
      </div>`
    )
}

function user_click(clicked_id){

    console.log(clicked_id)
    $('.modal-users-title').empty()
    consultarMensajesUsuario(clicked_id)
    $('#modal-users').modal();
}

function consultarMensajesUsuario(chat_id){
    var title=0
    $(".modal-body-users").empty()
    // Pasarlo a INT
    var user_chat=parseInt(chat_id)
    var ref=this.database.ref('messages');// Esta variable hace referencia a los mensajes 
    ref.orderByChild("chat_id").equalTo(user_chat).on("child_added", function(snapshot) {
        var mensaje=snapshot.val().mensaje
        var hora = snapshot.val().hora
        var fecha=convertDate(hora)
        var respuesta=snapshot.val().respuesta
        var usuario=snapshot.val().usuario

        if(title===0){
            $('.modal-users-title').append(`<p class"col-12"> ${usuario}</p> 
            <small class"col-12"> ${user_chat}</small> 
            `)
            title=1;
        }

        $(".modal-body-users").append(`
        <div class="incoming_msg ml-2">
        <div class="row">
          <div class="received_msg " >
            <div class="received_withd_msg">
              <p>${mensaje}</p>
            </div>
          </div>
        </div>

        <div class="outgoing_msg mr-2">
          <div class="sent_msg">
            <p>${respuesta}</p>
              <span class="time_date"> ${fecha}</span> </div>
          </div>
        </div>`)

    });
}

function convertDate(timestamp){

    // Months array
    var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
   
    // Convert timestamp to milliseconds
    var date = new Date(timestamp*1000);
   
    // Year
    var year = date.getFullYear();
   
    // Month
    var month = months_arr[date.getMonth()];
   
    // Day
    var day = date.getDate();
   
    // Hours
    var hours = date.getHours();
   
    // Minutes
    var minutes = "0" + date.getMinutes();
   
    // Seconds
    var seconds = "0" + date.getSeconds();
   
    // Display date time in MM-dd-yyyy h:m:s format
    var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    
    return convdataTime
    
   }