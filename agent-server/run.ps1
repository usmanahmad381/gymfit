# One-command bootstrap for the GymFit agent server.
# Usage (from the agent-server folder):  .\run.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$py = ".\.venv\Scripts\python.exe"
if (-not (Test-Path $py)) {
  Write-Host "Creating virtualenv + installing dependencies..." -ForegroundColor Cyan
  python -m venv .venv
  & $py -m pip install --quiet --upgrade pip
  & $py -m pip install --quiet -r requirements.txt
}

# Load .env into a hashtable so we can check what's configured.
$envVars = @{}
if (Test-Path ".env") {
  Get-Content ".env" | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') { $envVars[$matches[1].Trim()] = $matches[2].Trim() }
  }
}

if ([string]::IsNullOrWhiteSpace($envVars["OPENAI_API_KEY"])) {
  Write-Host "ERROR: OPENAI_API_KEY is empty in agent-server\.env." -ForegroundColor Red
  Write-Host "Open agent-server\.env, paste your OpenAI key, and run this script again." -ForegroundColor Yellow
  exit 1
}

if ([string]::IsNullOrWhiteSpace($envVars["GYMFIT_VECTOR_STORE_ID"])) {
  Write-Host "No vector store yet - running ingestion (one-time)..." -ForegroundColor Cyan
  & $py ingest.py
}

Write-Host "Starting GymFit agent server on http://localhost:8000 ..." -ForegroundColor Green
& $py -m uvicorn server:app --port 8000
