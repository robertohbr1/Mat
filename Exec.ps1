$ErrorActionPreference = 'Stop'

Write-Host 'Iniciando projeto...'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error 'Node.js nao encontrado. Instale o Node.js para continuar.'
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error 'npm nao encontrado. Instale o Node.js (inclui npm) para continuar.'
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

if (-not (Test-Path (Join-Path $projectRoot 'node_modules'))) {
  Write-Host 'Dependencias nao encontradas. Executando npm install...'
  npm install
}

Write-Host 'Executando npm run dev...'
npm run dev
