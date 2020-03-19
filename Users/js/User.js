
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
db=firebase.firestore()
var storage = firebase.storage();
// Actualizar Nombre de usuario

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
    VerificarAsociación(userData)
})
.catch(error=>{
    console.error(error)
    //window.location = '../login/login.html'; //After successful login, user will be redirected to home.html

})
  
firebase.auth().onAuthStateChanged(user => {
    name=user.displayName
 });
// Buscar si ya está asociado con algun chat de zaboo 
function VerificarAsociación(userData){
    // buscar el uid en la collecion de usuarios 
    var consulta_palabra=db.collection('UvA').where("uid","==",userData.uid)
    consulta_palabra.get()
    .then(function(querySnapshot){
        if(querySnapshot.empty){
            console.log('No encontre esto en UVA, esto no deberia pasar')
        }
    
        else{
            querySnapshot.forEach(function(doc){
                const nombre_asociar=doc.data().asosiate_name
                console.log(nombre_asociar)
                // Ahora debe buscarse ese nombre en usuarios Zaboo
                var consulta_usuariosZaboo=db.collection('usuariosZaboo').where("asosiate_name","==",nombre_asociar)
                consulta_usuariosZaboo.get()
                .then(function(querySnapshot){
                    if(querySnapshot.empty){
                        console.log('no encontre en usuarios zaboo esto')
                        $(".user-items").empty()
                        $(".user-items").append(
                            `
                        <div class="alert alert-success mt-5 col-12 mr-3 ml-3 " role="alert">
                        <h4 class="alert-heading">Well done!</h4>
                        <p>If you want to see your Zaboo products and the all the features please send the following message to Zaboo <i class="material-icons icon">chat</i> "Asociar ${nombre_asociar}"</p>
                        <hr>
                        <p class="mb-0">Don't forget Zaboo is your friend when ever you need it</p>
                        </div>`
                    )
                    }
                    else{
                        querySnapshot.forEach(function(user_zaboo){
                            const chat_id=user_zaboo.data().chat_id
                            const dispositivos=user_zaboo.data().dispositivos
                            const dispositivos_legibles=user_zaboo.data().dispositivos_legibles
                            const tokens= user_zaboo.data().tokens
                            console.log(dispositivos)
                            console.log(dispositivos_legibles)
                            console.log(tokens)
                            console.log(chat_id)

                            if(!dispositivos){
                                $(".user-items").empty()
                                $(".user-items").append(
                                `<div class="alert alert-warning mt-5 col-12 mr-3 ml-3" role="alert">
                                <h4 class="alert-heading">OH!</h4>
                                You don´t have products asosiate with your chat account yet, please verify your chat is working or buy our products in the website www.zaboo.co
                                </div>`)
                                console.log("no hay dispositivos disponibles")
                            }

                        else{
                            $(".user-items").empty()
                            zaboo_products_template(dispositivos,dispositivos_legibles,chat_id);
                        }

                        })
                    }
                })
                .catch(error=> {
                    console.log(error)
                })
  
            })

        }
    })
    .catch(error=> {
        console.log(error)
    })
    }

// Fin de actualizar nombre de usuario
$(".logout").click(function(){
    console.log("Cerrar Sesión")
    firebase.auth().signOut()
     window.location = '../index.html'; 

});

$(".my_products").click(function(){
    console.log("My products")
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
        console.log(userData)
        $(".user-name").text(userData.name)
        VerificarAsociación(userData)
    })
    .catch(error=>{
        console.error(error)
        //window.location = '../login/login.html'; //After successful login, user will be redirected to home.html
    
    })
});

$(".real_time").click(function(){
    console.log("Real Time")
    $(".user-items").empty()
});
// Settings, like change the name 

$(".settings").click(function(){
    console.log("settings")
    $(".user-items").empty()
    $(".user-items").append( 
    `
    <div class ="mt-5  ml-3"style ="width:100%;"> <h3>Change Name <h3/> </div>
    <div class="input-group mt-2 mb-3 ml-3" style ="width:60%;">
    <input type="text" class="form-control" id="changeName" placeholder="New Name" aria-label="Recipient's username" aria-describedby="basic-addon2">
    <div class="input-group-append">
      <button class="btn btn-outline-secondary" type="button"  onclick="changeName()" >Save </button>
    </div>
    </div>`

  )

});

$(".assistance").click(function(){
    console.log("asistance")

});

$(".images").click(function(){
    // Create a reference under which you want to list

    $(".user-items").empty()
    
    var imagesReference = storage.ref('zaboo122/')
    var storageRef = firebase.storage().ref();
    imagesReference.listAll()
    .then(function(image_item){
        image_item.items.forEach(function(item){
            var pathReference = storageRef.child(item.fullPath)  
            console.log(pathReference)
            //in
            storageRef.child(item.fullPath).getDownloadURL().then(function(url) {
                // `url` is the download URL for 'images/stars.jpg'
                // This can be downloaded directly:
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function(event) {
                  var blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();
                
                // Or inserted into an <img> element:
                $(".user-items").append(`<img id="${pathReference}" src="${url}" >`)
              }).catch(function(error) {
                // Handle any errors
                console.log(error)
              });
            //out
        })
    },function(error){
        console.error(error)
    })
    

    

});

firebase.auth().onAuthStateChanged(user => {
    if(!user) {
        window.location = '../index.html'; 
    }
});
// template de los productos, consultar el array, recorrerlo e ir haciendo el append
function zaboo_products_template(dispositivos,dispositivos_legibles,chat_id){

    $(".user-items").append(
        `
    <div class="alert alert-success mt-5 col-12 mr-3 ml-3" role="alert">
    <h4 class="alert-heading">Hello Zabooer ${chat_id}!</h4>
    <p>Your products are already update </p>
    <hr>
    <p class="mb-0">Don't forget Zaboo is your friend when ever you need it</p>
    </div>

    `
)
    var len= dispositivos.length;
    for (var i = 0; i < len; i++){
        
        if(dispositivos[i].substring(0,2)==='za'){

            $(".user-items").append(`                            
            <div class="col-sm-12  col-lg-3 card shadow ml-3 mr-3 mt-3 mb-3 id="${dispositivos[i]}" style="width: 20rem; background:linear-gradient(15deg,#EFEDEF 0%, #FFFFFF 100%);">
                <div class="d-flex flex-row-reverse info-card"><i class="material-icons icon" style="color: gray;" data-toggle="tooltip" data-placement="top" title="Zaboo Polly take pictures and scan beacons device">info</i></div>
                <div class="card-image mt-3 mb-0" style="width: 7rem;">
                    <img class="card-img-top mb-0" src="./images/polly_marina.svg" alt="Card image cap">
                </div>
                <div class="card-body" >
                    <h5 class="card-title text-capitalize" style="text-align: center; "> ${dispositivos_legibles[i]} </h5>
                    <hr class="style3 mt-0 mb-0">
                    <br>
                    <p class="card-text text-left  text-muted"><i class="material-icons icon" style="color: #DB5B14;">group_work</i> <small> TIPO : </small> Zaboo Polly</p>
                    <p class="card-text text-left  text-muted text-uppercase"> <i class="material-icons icon" style="color: gray;">lens</i><small> DEVICE_ID : </small > ${dispositivos[i]}</p>
                    <div class="d-flex flex-row-reverse"><a href="#" class="btn btn-outline-success " onClick="product_click(this.id)" id="${dispositivos[i]}" >Go</a></div>
                </div>
        
            </div>
        `)   
        }
        else if (dispositivos[i].substring(0,2)==='ZH'){

            $(".user-items").append(`                            
            <div class="col-sm-12  col-lg-3 card shadow ml-3 mr-3 mt-3 mb-3 id="${dispositivos[i]}" style="width: 20rem; background:linear-gradient(15deg,#EFEDEF 0%, #FFFFFF 100%);">
                <div class="d-flex flex-row-reverse info-card"><i class="material-icons icon" style="color: gray;" data-toggle="tooltip" data-placement="top" title="Zaboo Tig correspond to a device you attach to your personal stuff">info</i></div>
                <div class="card-image mt-3 mb-0" style="width: 7rem;">
                    <img class="card-img-top mb-0" src="./images/tig_verde.svg" alt="Card image cap">
                </div>
                <div class="card-body" >
                    <h5 class="card-title text-capitalize" style="text-align: center; "> ${dispositivos_legibles[i]} </h5>
                    <hr class="style3 mt-0 mb-0">
                    <br>
                    <p class="card-text text-left  text-muted"><i class="material-icons icon" style="color: #DB5B14;">group_work</i> <small> TIPO : </small> Zaboo Tig</p>
                    <p class="card-text text-left  text-muted text-uppercase"> <i class="material-icons icon" style="color: gray;">lens</i><small> DEVICE_ID : </small > ${dispositivos[i]}</p>
                    <div class="d-flex flex-row-reverse"><a href="#" class="btn btn-outline-success " onClick="product_click(this.id)" id="${dispositivos[i]}" >Go</a></div>
                </div>
        
            </div>
        `)

        }
       
    }

}
// cuando se presione un producto en especifico
function product_click(clicked_id){
    console.log(clicked_id)
    $('.modal-producto-title').empty()
    $('.modal-producto-title').append(clicked_id)
    $('#modal-producto').modal();

}

function user_name_update()
{
  console.log("Cambiar nombre de usuario")
  swal({
    title:"Update Username",
    text:"Enter your New Username",
    content:"input",
    
    buttons:{
      cancel:true,
      confirm:"Submit"
    }
  })
  .then(username=>{
    if(username){
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: username,
      })
      .then(function() {
        var displayName = user.displayName;
        getUserName()
        .then(name=>{
        $(document).ready(function(){
        $(".user-name").text(name)
        swal({
          title:"Succesful updating",
          text:"Your new username is " + name,
          icon:"success"
        })


        })  
        })
        .catch(error=>{
            console.log(error)
        })
      }, function(error) {
        console.error(error)
      });
    }
  })

}

function changeName(){

    var new_name = document.getElementById("changeName").value;
    if(!new_name){
        console.log("The name is empty")
    }

    else{
        var user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: new_name,
        })
        .then(function(){
            var displayName = user.displayName;
            getUserData()
            .then(userData=>{
            console.log(userData)
            $(".user-name").text(userData.name)
            
        })
        .catch(error=>{
        console.error(error)

        })

        },function(error){
            console.error(error)
        })


    }
}

