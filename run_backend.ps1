# Run SchemeSense backend (dev mode: no auth required for testing)
$env:SCHEMESENSE_DEV = "1"
Set-Location $PSScriptRoot
python -m uvicorn app:app --host 0.0.0.0 --port 5000
