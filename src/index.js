const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const File = require('./models/file');

//instancia de express
const app = express();

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

const port = process.env.PORT || 3000;
const url = "mongodb+srv://codenautas:Codenautas2022@cluster0.ql625.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.Promise = global.Promise;
app.use(express.static(path.join(__dirname, 'public')));

//Cargamos el bodyParser: middleware para analizar cuerpos de a través de la URL
app.use(bodyParser.urlencoded({ extended: false }));
//Cualquier tipo de petición lo convertimos a json:
app.use(bodyParser.json());

//Activar el CORS para permitir peticiones AJAX y HTTP desde el frontend.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    //res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Nos conectamos a mongoDB. Opción { useNewUrlParser: true } para utilizar las últimas funcionalidades de mongoDB
mongoose.connect(url, { useNewUrlParser: true }).then(() => {

    console.log('Conexión con la BDD realizada con éxito!!!');

    app.listen(port, () => {
        console.log('servidor ejecutándose en http://localhost:' + port);
    });

});


//PASO 2 POST method route -----------------------------------------------
//Especificamos la dirección par recibir los datos del cliente ('/api/save')
//request: datos recibidos del cliente
//response: respuesta que enviamos al cliente

app.post('/api/save', (request, response) => {

    console.log('respuesta recibida');
    const data = request.body;
    console.log(data);

    var file = new File();

    //Asignamos los valores:
    file.description = data.description;
    file.image = data.image;

    file.save((err, fileStored) => {

        if (err || !fileStored) {
            return response.status(404).send({
                status: 'error',
                message: 'El post no se ha guardado !!!'
            });
        }

        // Devolver una respuesta 
        return response.status(200).send({
            status: 'success',
            fileStored
        });

    });

});

//Subida de imágenes -------------------------------------------------------------

app.post('/api/saveImage', (req, res) => {
    const file = req.files.myFile;
    const fileName = req.files.myFile.name;
    const path = __dirname + '/public/images/' + fileName;
    console.log(path);

    file.mv(path, (error) => {
        if (error) {
            console.error(error);
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ status: 'error', message: error }));
            return;
        }
        return res.status(200).send({ status: 'success', path: 'public/images/' + fileName });
    });



});


//// -----CONSULTA A LA BDD------------------------------------------------

//GET method route
//recibimos la consulta desde el cliente y devolvemos los datos:
app.get('/api/files', (request, response) => {

    var query = File.find({});

    query.sort('-date').exec((err, files) => {

        if (err) {
            return response.status(500).send({
                status: "error",
                message: "Error al extraer los datos"
            });
        }

        //Si no existen artículos:
        if (!files) {
            return response.status(404).send({
                status: "error",
                message: "No hay posts para mostrar"
            });
        }

        return response.status(200).send({
            status: "success",
            files
        });

    });




});