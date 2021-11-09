const axios = require('axios');
const { stripIndent } = require('common-tags');
const { escape } = require('querystring');

const appid = 'your api key in Weather API settings';
const lang = 'pt_br';
const unit = 'metric';

function formata({weather, main, sys, name }) {
    const {description} = weather[0];
    const {temp, feels_like, humidity, temp_max, temp_min} = main;
    const {country} = sys;
    
    
    return stripIndent `
    📍 Local: *${name} - ${country}*
    🌈 Temperatura: *${temp.toFixed(0)}°C*
    🌡 ️Sensação térmica: *${feels_like.toFixed(0)}°C*
    \`\`\ *${description}* \`\`\
    
    ⏫ Máxima de: *${temp_max.toFixed(0)}°C*
    ⏬ Mínima de: *${temp_min.toFixed(0)}°C*
    🌪 ️Humidade do ar: *${humidity}%*
    `;
}

exports.handler = function(context, event, callback) {
	const twiml = new Twilio.twiml.MessagingResponse();
	
	const query = escape(event.Body);
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&lang=${lang}&units=${unit}&APPID=${appid}`;
	JSON.stringify(url);
	
	axios
	    .get(url)
	    .then(({data}) => {
            let responseText = `\n\n Encontrei algumas informações 🔍 \n\n`;
            responseText +=  formata(data);
            twiml.message(responseText);
	    })
	    .catch((err) => {
	        console.log(err);
            twiml.message('Não consegui encontrar 😕');
	        twiml.message('Tente digitar novamente o nome do Local.');
	        twiml.message('Por exemplo: *Guarulhos*');
	    })
	    
    .then((response) => {
      callback(null, twiml);
    })
};
