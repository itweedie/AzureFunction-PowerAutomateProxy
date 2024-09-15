const { app } = require('@azure/functions');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

// Load environment variables (assuming process.env is used in your setup)
const LOGIC_APP_URL = process.env.LOGIC_APP_URL;

app.http('Trigger2', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            const incomingHeaders = request.headers;
            //context.log('Received Headers:', incomingHeaders);

            const queryParams = request.query;
            context.log('Received Query Parameters:', queryParams);

            const queryString = querystring.stringify(queryParams);

            // Base URL from environment variable
            console.log("Flow URL: ", LOGIC_APP_URL)
            const baseUrl = LOGIC_APP_URL;

            const fullUrl = queryString ? `${baseUrl}&${queryString}` : baseUrl;

            const headersToSend = {
                'Content-Type': 'application/json',
                'X-MS-CLIENT-PRINCIPAL-ID': incomingHeaders['x-ms-client-principal-id'] || '',
            };

            const response = await axios({
                method: 'get',
                url: fullUrl,
                headers: headersToSend,
                responseType: 'arraybuffer',
                timeout: 60000
            });

            return {
                status: response.status,
                headers: {
                    ...response.headers,
                    'Content-Type': response.headers['content-type'],
                    'Content-Disposition': response.headers['content-disposition'],
                },
                body: response.data
            };

        } catch (error) {
            context.log(`Error occurred: ${error.message}`);
            return {
                status: error.response ? error.response.status : 500,
                body: error.message || "Error processing request"
            };
        }
    }
});
