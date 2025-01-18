methods: ['GET', 'POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // Log headers for debugging
        context.log('Request Headers:', request.headers);

        const incomingHeaders = request.headers;

        const headersObject = Object.fromEntries(incomingHeaders.entries());
        context.log('Received Headers:', headersObject);

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

        // Create response object
        const response = {
            headersReceived: headersObject,
            requestInfo: {
                url: request.url,
                method: request.method,
                query: request.query,
                body: request.body
            },
            requestType: request.method
        };

        // Send JSON response
        return {
            body: JSON.stringify(response, null, 2),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
});