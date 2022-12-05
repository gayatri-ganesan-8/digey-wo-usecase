var express = require("express"); //requiring express module
var app = express(); //creating express instance
var querystring = require('querystring');
var cors = require('cors')
const axios = require('axios');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const host = '0.0.0.0';
const PORT = process.env.PORT || 8181;

app.use(cors());
app.use(express.json());


var data = querystring.stringify({
    grant_type: "client_credentials",
    client_id: "watson-orchestrate",
    client_secret: "ca81109d-312d-4ed3-9cf0-19398e26ea9d"
});

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.get('/allJobRequisitions', async (req, res) => {
    try {
        const jwt_token = await axios.post('https://keycloak-edu-keycloak.apps.openshift-01.knowis.cloud/auth/realms/education/protocol/openid-connect/token', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        }
        );
        console.log('jwt_token = ' + jwt_token);

        let dept = req.query.department;
        let location = req.query.location;
        let requestCandidateBody = req.body;
        let response;


        console.log('jwt_token.data.access_token : ' + jwt_token.data.access_token);
        


        let config = {
            headers: { 'Authorization': 'Bearer ' + jwt_token.data.access_token },
            params: {
                department: dept,
                location: location
            }
        }
        response = await axios
            .get('https://education-dev.apps.openshift-01.knowis.cloud/getjbr/api/gtjbre/', config)

        console.log('Response before sending back = ' + JSON.stringify(res.data));
        res.send(response.data);

    } catch (error) {
        res.send(error.response.data);
        console.log(error);
    }

});
app.get('/allJobRequisitionsNew', async (req, res) => {
    try {
        const jwt_token = await axios.post('https://keycloak-edu-keycloak.apps.openshift-01.knowis.cloud/auth/realms/education/protocol/openid-connect/token', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        }
        );
        console.log('jwt_token = ' + jwt_token);

        let dept = req.query.department;
        let location = req.query.location;
        let queryStr;
        let response;


        console.log('jwt_token.data.access_token : ' + jwt_token.data.access_token);


        let config = {
            headers: { 'Authorization': 'Bearer ' + jwt_token.data.access_token },
            params: {
                department: dept,
                location: location
            }
        }
        response = await axios
            .get('https://education-dev.apps.openshift-01.knowis.cloud/getjbr/api/gtjbre/getAllJRsNew', config)

        console.log('Response before sending back = ' + JSON.stringify(res.data));
        res.send(response.data);

    } catch (error) {
        res.send(error.response.data);
        console.log(error);
    }

});

app.post('/getJRIdS', async (req, res) => {
    try {
        const jwt_token = await axios.post('https://keycloak-edu-keycloak.apps.openshift-01.knowis.cloud/auth/realms/education/protocol/openid-connect/token', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        }
        );
        console.log('jwt_token = ' + jwt_token);

     
        let requestCandidateBody = req.body;
        let response;


        console.log('jwt_token.data.access_token : ' + jwt_token.data.access_token);
        console.log('requestCandidateBody : ' + JSON.stringify(requestCandidateBody));



        if((!requestCandidateBody) || (isEmptyObject(requestCandidateBody))){
            console.log('Inside !requestCandidateBody');
            requestCandidateBody = null;
        }


        let config = {
            headers: { 'Authorization': 'Bearer ' + jwt_token.data.access_token ,  'content-type' : 'application/json' }
        }
        response = await axios
            .post('https://education-dev.apps.openshift-01.knowis.cloud/getjbr/api/gtjbre/getJRIdS', requestCandidateBody, config)

        console.log('Response before sending back = ' + JSON.stringify(res.data));
        res.send(response.data);

    } catch (error) {
        res.send(error.response.data);
        console.log(error);
    }

});


var server = app.listen(PORT, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', 'localhost', port);
  });



