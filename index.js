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

var database, collection;

app.listen(3000, () => {
    console.log("Listening on 3000...");

    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("clientes");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });

});

//LISTADO DE CLIENTES 
app.get("/cliente",(request,response)=>{

    console.log("get request done!");

    collection.find({}).toArray((error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        response.send(result);

    });

});

//LISTA UN CLIENTE POR ID
app.get("/cliente/:id",(request,response)=>{

    console.log("get request done!");

    collection.findOne({ "_id": new ObjectId(request.params.id) },(error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        response.send(result);

    });

});

//LISTA USUARIOS TIPO EDITORIAL QUE NO HAN SIDO APROBADOS
app.get("/porAprobar",(request,response)=>{

    console.log("get request done!");

    collection.find({"aprobado":false}).toArray((error, result) =>{

        if(error){
            return response.status(500).send(error);
        }

        response.send(result);

    });

});

//GUARDA UN CLIENTE
app.post("/cliente", (request, response) => {

    console.log("post request done!");

    collection.insertOne(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
        console.log("get request done!");
    });
});

//APRUEBA UN USUARIO
app.put("/cliente/:id",(request,response)=>{

    
    collection.updateOne({"_id": new ObjectId(request.params.id)},{$set:{"aprobado":true}} ,(error, result) =>{

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

    collection.deleteOne({"_id": new ObjectID(request.params.id)}, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
        console.log("delete request done!");
    });
});