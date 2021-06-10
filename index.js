const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const { ObjectID } = require("bson");

//const CONNECTION_URL = "mongodb+srv://rolando:Apmt22a5%23@cluster0.mz9nl.mongodb.net/booksa?retryWrites=true&w=majority";

const CONNECTION_URL = "mongodb+srv://rolando:apmt22a5@cluster0.mz9nl.mongodb.net/booksa?retryWrites=true&w=majority"
const DATABASE_NAME = "booksa";


var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


/*app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin")
  }) */

/*
app.listen(3000, () => {
    console.log("Listening on 3000...");
});
*/
//Conexion a la base de datos MongoDB ATLAS

var database, collectionClientes, collectionLibros, collectionGenerosLibros;

app.listen(3000, () => {
    console.log("Listening on 3000...");

    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collectionClientes = database.collection("clientes");
        collectionLibros = database.collection("libros");
        collectionGenerosLibros = database.collection("generosLibro");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });

});
 

/***********************************************************MANEJO DE USUARIOS/CLIENTES************************************************************/
//LISTADO DE CLIENTES 
app.get("/cliente",(request,response)=>{

    console.log("get request done!");

    collectionClientes.find({}).toArray((error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        response.send(result);

    });

});

//LISTA UN CLIENTE POR ID
app.get("/cliente/:id",(request,response)=>{

    console.log("get request done!");

    collectionClientes.findOne({ "_id": new ObjectId(request.params.id) },(error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        response.send(result);

    });

});

//LISTA USUARIOS TIPO EDITORIAL QUE NO HAN SIDO APROBADOS
app.get("/porAprobar",(request,response)=>{

    console.log("get request done!");

    collectionClientes.find({"aprobado":false}).toArray((error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        response.send(result);

    });

});

//GUARDA UN CLIENTE
app.post("/cliente", (request, response) => {

    console.log("post request done!");

    collectionClientes.insertOne(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
        console.log("get request done!");
    });
});

//APRUEBA UN USUARIO
app.put("/aprobarClinte/:id",(request,response)=>{

    
    collectionClientes.updateOne({"_id": new ObjectId(request.params.id)},{$set:{"aprobado":true}} ,(error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        response.send(result);
        console.log("PUT request done!");

    });

});

//ACTUALIZA UN USUARIO
app.put("/cliente/:id",(request,response)=>{

    
    collectionClientes.updateOne({"_id": new ObjectId(request.params.id)},
                                {$set:{"nombres":request.body.nombres,
                                       "apellidos":request.body.apellidos,
                                        "email":request.body.email,
                                        "password":request.body.password,
                                        "direccion":request.body.direccion,
                                        "celuar":request.body.celuar,
                                        "tipo":request.body.tipo,
                                        "aprobado":request.body.aprobado}} ,
                                (error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        response.send(result);
        console.log("PUT request done!");

    });

});


//ELIMINA UN CLIENTE

app.delete("/cliente/:id", (request, response) => {

    //console.log("delete request done!");

    collectionClientes.deleteOne({"_id": new ObjectID(request.params.id)}, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
        console.log("delete request done!");
    });
});


/***********************************************************MANEJO DE LIBROS************************************************************/

//LISTADO DE LIBROS 
app.get("/libros",(request,response)=>{

    console.log("get request done!");

    collectionLibros.find({}).toArray((error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        response.send(result);

    });

});


//LISTA UN LIBRO POR ID
app.get("/libros/:id",(request,response)=>{

    
    collectionLibros.findOne({ "_id": new ObjectId(request.params.id) },(error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        console.log("get request done!");
        response.send(result);

    });

});

//GUARDA UN LIBRO
app.post("/libros", (request, response) => {
   
    collectionLibros.insertOne(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.ops);
        console.log("post request done!");
    });
});


//OBTIENE GENEROS DE UN LIBRO

app.get("/generosLibro/:id",(request,response)=>{

    console.log("get request done!");

    collectionGenerosLibros.find({"idLibro":request.params.id}).toArray((error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        response.send(result);

    });

});

//AGREGA UN GENERO A UN LIBRO
app.post("/generoLibro", (request, response) => {
   
    collectionGenerosLibros.insertOne(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.ops);
        console.log("post request done!");
    });
});

//ACTUALIZA UN LIBRO
app.put("/libros/:id",(request,response)=>{

    
    collectionLibros.updateOne({"_id": new ObjectId(request.params.id)},
                                {$set:{"titulo":request.body.titulo,
                                        "editorial":request.body.editorial,
                                        "stock":  request.body.stock,
                                        "imagen": request.body.imagen}} 
                                ,(error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        response.send(result);
        console.log("PUT request done!");

    });

});

//ELIMINA UN LIBRO

app.delete("/libros/:id", (request, response) => {

    //console.log("delete request done!");

    collectionLibros.deleteOne({"_id": new ObjectID(request.params.id)}, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
        console.log("delete request done!");
    });
});