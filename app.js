var express = require('express');
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
var port = process.env.PORT || 3000
var app = express();

const host = "http://127.0.0.1:3000";
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));
app.use(bodyParser.json())

//config mercadopago

// SDK de Mercado Pago
const mercadopago = require('mercadopago');
// Agrega credenciales
mercadopago.configure({
    access_token: 'APP_USR-2572771298846850-120119-a50dbddca35ac9b7e15118d47b111b5a-681067803',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});



app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {

    const preference = getPreference(req);
    console.log('::request body: create preference ');
    console.log(preference);
    return mercadopago.preferences.create(preference)
        .then(function (response) {
            console.log('::api request: create preference');
            console.log(response);
            global.id = response.body.id;
            res.render('detail', { id: response.body.id, ...req.query });
        }).catch(function (error) {
            console.log(error);
        });
});

function getPreference(req) {
    const { title, price, unit, img } = req.query;
    console.log("::endpoint /detail");
    console.log(req.query);

    const payer = {
        name: "Lalo",
        surname: "Landa",
        email: "test_user_83958037@testuser.com",
        date_created: new Date().toISOString(),
        phone: {
            area_code: "52",
            number: 5549737300
        },

        identification: {
            type: "DNI",
            number: "12345678"
        },

        address: {
            street_name: "Insurgentes Sur",
            street_number: 1602,
            zip_code: "03940"
        }
    };

    const paymentMethod = {
        "excluded_payment_methods": [
            {
                "id": "amex"
            }
        ],
        "excluded_payment_types": [
            {
                "id": "atm"
            }
        ],
        "installments": 6,
    };


    // Crea un objeto de preferencia
    let preference = {
        items: [
            {
                id: "1234",
                title: title,
                unit_price: Number(price),
                quantity: Number(unit),
                picture_url: host + "/" + img,
                description: "Dispositivo móvil de Tienda e-commerce",
            }
        ],
        back_urls: {
            "success": host + "/success",
            "failure": host + "/failure",
            "pending": host + "/pending"
        },
        payment_methods: paymentMethod,
        payer: payer,
        // notification_url: host + "/webhook",
        external_reference: 'steven.ossaserna@mercadolibre.com.co',
        integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
        auto_return: 'approved',
    };

    return preference;
}

app.get('/success', function (request, response) {
    console.log('::API Success');
    console.log(request.query);
    response.render('success', { ...request.query });
});

app.get('/pending', function (request, response) {
    console.log('::API Pending');
    console.log(request.query);
    response.render('pending', { ...request.query });
});

app.get('/failure', function (request, response) {
    console.log('::API failure');
    console.log(request.query);
    response.render('failure', { ...request.query });
});

app.post('/webhook', function (request, response) {
    console.log('::API webhook');
    console.log(request.body);
    response.json({ Status: 'OK' });
});

app.listen(port);