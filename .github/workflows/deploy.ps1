# Read the current version number from the file
$versionFilePath = ".\.github\workflows\versionNumber.txt"
$currentVersion = Get-Content $versionFilePath

# Split the version number and increment the last part
$versionParts = $currentVersion -split '\.'
$versionParts[2] = [int]$versionParts[2] + 1
$newVersion = "$($versionParts[0]).$($versionParts[1]).$($versionParts[2])"

# Update the version number in the file
Set-Content $versionFilePath $newVersion

# Update the packageUri in azuredeploy.json
$azureDeployFilePath = "azuredeploy.json"
$packageUri = "https://github.com/itweedie/AzureFunction-PowerAutomateProxy/releases/download/v$newVersion/function-app.zip"
(Get-Content $azureDeployFilePath) -replace "https://github.com/itweedie/AzureFunction-PowerAutomateProxy/releases/download/v\d+\.\d+\.\d+/function-app.zip", $packageUri | Set-Content $azureDeployFilePath

# Commit the changes and push the new tag
git add .
git commit -m "Update version number to $newVersion"
git tag -a "v$newVersion" -m "Release version $newVersion"
git push origin "v$newVersion"
git push origin