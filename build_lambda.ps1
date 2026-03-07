# build_lambda.ps1
$ProjectDir = Get-Location
$BuildDir = Join-Path $ProjectDir "build"
$ZipFile = Join-Path $ProjectDir "terraform\lambda_function_payload.zip"

# 1. Cleanup old build
if (Test-Path $BuildDir) { Remove-Item -Recurse -Force $BuildDir }
if (Test-Path $ZipFile) { Remove-Item -Force $ZipFile }
New-Item -ItemType Directory -Path $BuildDir

# 2. Install dependencies to build folder
Write-Host "Installing dependencies..."
pip install -r requirements.txt --target $BuildDir

# 3. Copy source code
Write-Host "Copying source code..."
Copy-Item -Path "src" -Destination $BuildDir -Recurse
Copy-Item -Path "app.py" -Destination $BuildDir
Copy-Item -Path "config.py" -Destination $BuildDir

# 4. Remove bulky & unnecessary files to save space
Write-Host "Pruning build folder..."
Get-ChildItem -Path $BuildDir -Filter "*.pyc" -Recurse | Remove-Item -Force
Get-ChildItem -Path $BuildDir -Filter "__pycache__" -Recurse | Remove-Item -Recurse -Force
Get-ChildItem -Path $BuildDir -Filter "*.dist-info" -Recurse | Remove-Item -Recurse -Force

# 5. Create ZIP
Write-Host "Creating deployment package: $ZipFile"
Compress-Archive -Path "$BuildDir\*" -DestinationPath $ZipFile -Force

Write-Host "Build Complete!"
