# AzureFunction-PowerAutomateProxy
This repository contains an Azure Function that acts as an HTTP Proxy to authenticate and forward requests to a Power Automate Flow. The function is designed to validate incoming requests and then route them to a Power Automate Flow, ensuring that only authenticated requests are processed.

## Features

- Forwards all headers received from the incoming request.
- Adds custom header `Flow-Key` (from environment variables). 
- Handles `GET` method.
- Appends query parameters from the incoming request to the external URL.
- Configurable via environment variables to avoid hardcoding sensitive data like URLs and keys.
- Proper error handling and logging for easy debugging.

# Azure Function Power Automate Proxy

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fitweedie%2FAzureFunction-PowerAutomateProxy%2Frefs%2Fheads%2Fmain%2FazureDeployZip.json" target="_blank"><img src="https://aka.ms/deploytoazurebutton" /></a>

This repository contains an Azure Function that acts as a proxy for Power Automate.

## Steps to Connect:

1. **Navigate to the Azure Function**:
   - In the Azure portal, navigate to the resource group where your Azure Function was created.
   - Click on the Function App to open its dashboard.

2. **Open the Deployment Center**:
   - In the left-hand menu, scroll down and click on **Deployment Center**. This is where you can configure continuous deployment.

3. **Select GitHub as the Source**:
   - In the **Deployment Center**, you’ll be asked to choose a source for the code. Select **GitHub** as the source control provider.
   - Click on **Authorize** to grant Azure access to your GitHub account (if not already authorized).

4. **Choose Your Repository and Branch**:
   - Select the GitHub repository you forked earlier.
   - Choose the branch you want to deploy from, typically the default branch (e.g., `main` or `master`).

5. **Set Up Build Provider**:
   - You can choose between **GitHub Actions** or **Kudu** for deploying your code. 
     - **GitHub Actions** provides a more modern CI/CD pipeline.
     - **Kudu** offers a simple and integrated build experience.

6. **Review and Save**:
   - After selecting the repository and branch, review the setup.
   - Click on **Save** to establish the connection.

### 5. Verify the Deployment
After setting up continuous deployment, any new changes pushed to your forked GitHub repository will automatically trigger a deployment to your Azure Function. You can monitor the deployment status and logs in the **Deployment Center**.

- To verify that everything is working, navigate to your Function App URL (found in the Azure portal under the **Overview** tab of your Function App).
- You should see the function running as expected.

### 6. Update and Maintain the Azure Function
Whenever you want to update the Azure Function, simply commit and push your changes to the GitHub repository. The continuous deployment pipeline will automatically redeploy the latest changes to Azure.



## Setup Instructions

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
