// Import necessary modules
const { app } = require('@azure/functions'); // Azure Functions SDK
const axios = require('axios'); // HTTP client for making requests
const querystring = require('querystring'); // Utility to handle query strings
require('dotenv').config(); // Load environment variables from .env file

// Load environment variables for Logic App URL and Flow-Key
const FLOW_URL = process.env.FLOW_URL; // The external Logic App URL
const FLOW_KEY = process.env.FLOW_KEY; // Flow-Key for authentication or identification

app.http('proxy', {
    methods: ['GET', 'POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // Log headers for debugging
        context.log('Request Headers:', request.headers);

        if (request.method === 'OPTIONS') {
            return {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            };
        }

        try {
            // Get developer message
            try {
                const devMessageResponse = await axios.get('https://mightora-developer-messaging.azurewebsites.net/api/HttpTrigger?appname=flowproxy');
                const devMessage = devMessageResponse.data.message;
                context.log('Developer Message:', devMessage);
            } catch (error) {
                // Ignore errors from this call
            }

            // Extract and log incoming request headers for debugging purposes
            const incomingHeaders = request.headers;
            context.log('Received Headers:', incomingHeaders);
            const headersObject = Object.fromEntries(incomingHeaders.entries());
            context.log('Headers Object:', headersObject);

            // Extract and log query parameters from the request URL
            const queryParams = request.query;
            context.log('Received Query Parameters:', queryParams);

            // Convert URLSearchParams to a plain object
            const paramsObject = Object.fromEntries(queryParams.entries());
            const queryString = querystring.stringify(paramsObject);
            context.log('Query String:', queryString);

            // Construct the full URL for the external Logic App call
            // Append query string if it exists
            const fullUrl = queryString ? `${FLOW_URL}&${queryString}` : FLOW_URL;

            // Construct headers to send to the external Logic App
            const headersToSend = {
                'Flow-Key': FLOW_KEY || '', // Include the Flow-Key from environment variables
                'incoming': JSON.stringify(headersObject) || '',
                ...incomingHeaders // Include all original incoming headers
            };

            // Make the HTTP request to the external Logic App
            const response = await axios({
                method: request.method.toLowerCase(), // Use the request method (GET or POST)
                url: fullUrl, // Full URL including query parameters
                headers: headersToSend, // Headers including all incoming and custom ones
                data: request.method === 'POST' ? request.body : undefined, // Include body for POST requests
                responseType: 'arraybuffer', // Expect binary data (e.g., files) as response
                timeout: 60000 // Timeout after 60 seconds if no response
            });

            // Return the response from the external service
            return {
                status: response.status, // Return the status code from the external request
                headers: {
                    ...response.headers, // Forward headers from the external response
                },
                body: response.data // Return the binary response data
            };

        } catch (error) {
            // Log and handle errors
            context.log(`Error occurred: ${error.message}`);
            return {
                status: error.response ? error.response.status : 500, // Return the status code if available, or default to 500
                body: error.message || "Error processing request" // Provide the error message
            };
        }
    }
});
