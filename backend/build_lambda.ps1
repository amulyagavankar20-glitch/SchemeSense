# build_lambda.ps1
$ProjectDir = Get-Location
$BuildDir = Join-Path $ProjectDir "build"
$ParentDir = Split-Path $ProjectDir -Parent
$ZipFile = Join-Path $ParentDir "terraform\lambda_function_payload.zip"

# 1. Cleanup old build
if (Test-Path $BuildDir) { Remove-Item -Recurse -Force $BuildDir }
if (Test-Path $ZipFile) { Remove-Item -Force $ZipFile }
New-Item -ItemType Directory -Path $BuildDir

# 2. Copy source code & data to build folder
Write-Host "Preparing build folder..."
Copy-Item -Path "src" -Destination $BuildDir -Recurse
if (Test-Path "data") { 
    New-Item -ItemType Directory -Path "$BuildDir\data" -Force
    if (Test-Path "data\schemes_expanded.json") { Copy-Item -Path "data\schemes_expanded.json" -Destination "$BuildDir\data\" }
}
Copy-Item -Path "app.py" -Destination $BuildDir
Copy-Item -Path "config.py" -Destination $BuildDir
# urls.py is in the parent directory
Copy-Item -Path "$ParentDir\urls.py" -Destination $BuildDir

# 4. Remove bulky & unnecessary files to save space
Write-Host "Pruning build folder..."
Get-ChildItem -Path $BuildDir -Filter "*.pyc" -Recurse | Remove-Item -Force
Get-ChildItem -Path $BuildDir -Filter "__pycache__" -Recurse | Remove-Item -Recurse -Force
Get-ChildItem -Path $BuildDir -Filter "*.dist-info" -Recurse | Remove-Item -Recurse -Force

# 5. Create ZIP
Write-Host "Creating deployment package: $ZipFile"
Compress-Archive -Path "$BuildDir\*" -DestinationPath $ZipFile -Force

Write-Host "Build Complete!"
