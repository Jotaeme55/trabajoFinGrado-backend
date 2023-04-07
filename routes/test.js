const {google} = require('googleapis');

const client_id = '631481849383-9rui9kep072lhtlfog104lkuo4duaocd.apps.googleusercontent.com'
const client_secret = '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'
const uri = 'http://localhost:3000/api/v1/auth/google/callback';

const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, uri);

async function obtenerToken(code) {  
    let tok= await oAuth2Client.getToken(code);
    return tok 
}
obtenerToken("4%2F0AVHEtk5kOLeyG-UNygDsNvfy0Qcv2n8YLDfejREGAt7mb5QMgC-GtqtUi6Shsin0a7d_Mg&client_id=631481849383-9rui9kep072lhtlfog104lkuo4duaocd.apps.googleusercontent.com").then(
    (token)=>console.log(token)
)