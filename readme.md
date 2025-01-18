# AzureFunction-PowerAutomateProxy
This repository contains an Azure Function that acts as an HTTP Proxy to authenticate and forward requests to a Power Automate Flow. The function is designed to validate incoming requests and then route them to a Power Automate Flow, ensuring that only authenticated requests are processed.

## Features

- Forwards all headers received from the incoming request.
- Adds custom header `Flow-Key` (from environment variables). 
- Handles `GET`, `POST`, and `OPTIONS` method.
- Appends query parameters from the incoming request to the external URL.
- Configurable via environment variables to avoid hardcoding sensitive data like URLs and keys.
- Proper error handling and logging for easy debugging.

## Deploy to your Azure Environment

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fitweedie%2FAzureFunction-PowerAutomateProxy%2Frefs%2Fheads%2Fmain%2Fazuredeploy.json" target="_blank"><img src="https://aka.ms/deploytoazurebutton" /></a>

This repository contains an Azure Function that acts as a proxy for Power Automate.


## Development Instructions

### Prerequisites flow Local Development

- [Node.js](https://nodejs.org/en/download/)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [GitHub Codespaces](https://docs.github.com/en/codespaces/getting-started/quickstart) (optional for development)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (for deployment)
- Logic App URL and `Flow-Key`

### Local Development

1. **Clone the repository**:
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2. **Install dependencies**:
    Make sure you have all the necessary dependencies installed:
    ```bash
    npm install
    ```

3. **Create a `.env` file**:
    Create a `.env` file in the root of your project directory with the following contents:

    ```env
    FLOW_URL=https://prod-21.uksouth.logic.azure.com/workflows/your-logic-app-url
    FLOW_KEY=your-flow-key-value
    ```

4. **Run the function locally**:
    Start the Azure Functions runtime locally:
    ```bash
    func start
    ```

    Your function will be available at: `http://localhost:7071/api/proxy`.

5. **Test the function**:
    Use a tool like `curl`, Postman, or your browser to send a `GET` or `POST` request to the function.

    Example with `curl`:
    ```bash
    curl -X GET http://localhost:7071/api/proxy -H "X-MS-CLIENT-PRINCIPAL-ID: custom-id"
    ```


### Deploy new version
From the project root folder run the following in PowerShell
`.\.github\workflows\deploy.ps1`

1. **Read the current version number from the file**

    - The script reads the current version number from the `versionNumber.txt` file located in the [workflows](http://_vscodecontentref_/1) directory.

2. **Split the version number and increment the last part**

    - The script splits the version number into its components (major, minor, patch).
    - It increments the patch version by 1.
    - It then constructs the new version number.

3. **Update the version number in the file**

    - The script writes the new version number back to the `versionNumber.txt` file.

4. **Update the packageUri in azuredeploy.json**

    - The script reads the `azuredeploy.json` file.
    - It updates the `packageUri` field with the new version number.
    - It writes the updated content back to the `azuredeploy.json` file.

5. **Commit the changes and push the new tag**

    - It commits the changes with a message indicating the new version number.
    - It creates a new git tag for the new version.
    - It pushes the new tag and the changes to the remote repository.

### Configuration

- The external Power Automate Flow URL is set using the `FLOW_URL` environment variable.
- The `Flow-Key` header is added using the `FLOW_KEY` environment variable.
- The function automatically forwards all incoming headers to the external endpoint.

### Environment Variables

| Variable Name    | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `FLOW_URL`  | The URL for the external Logic App you are proxying to.   |
| `FLOW_KEY`       | The Flow-Key header used for authentication/identification. |

### Testing

- To test the function, you can browse to the end point, or send HTTP requests using `curl`, Postman, or any tool of your choice to the locally running or deployed function endpoint.
- The function will log incoming headers, query parameters, and errors for easier debugging.

### Contributing

Feel free to open issues or submit pull requests if you want to contribute to this project.

### License

This project is licensed under the MIT License.


## To Do
[ ] Add storagee account with managed identity
[ ] Add ability to talk to storager accoutn and get json file