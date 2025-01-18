const { app } = require('@azure/functions');

app.http('Trigger2', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // Log headers for debugging
        context.log('Request Headers:', request.headers);

        const incomingHeaders = request.headers;

        const headersObject = Object.fromEntries(incomingHeaders.entries());
        context.log('Received Headers:', headersObject);

        // Send headers back as plain text to debug
        return {
            body: `2Headers received:\n${JSON.stringify(headersObject, null, 2)}`,
            headers: {
                'Content-Type': 'text/html'
            }
        };
    }
});