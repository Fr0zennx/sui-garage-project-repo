# Speedrun Sui Setup Script (PowerShell)
# Projeyi kurmak için gerekli tüm adımları gerçekleştirir

Write-Host "🎯 Speedrun Sui Setup" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""

# Sui CLI kontrolü
Write-Host "🔍 Sui CLI kontrol ediliyor..." -ForegroundColor Yellow
$suiCmd = Get-Command sui -ErrorAction SilentlyContinue

if (-not $suiCmd) {
    Write-Host "❌ Sui CLI bulunamadı!" -ForegroundColor Red
    Write-Host "Lütfen Sui CLI'yı yükleyin: https://docs.sui.io/build/install"
    exit 1
}

$suiVersion = sui --version
Write-Host "✅ Sui CLI bulundu: $suiVersion" -ForegroundColor Green
Write-Host ""

# Node.js kontrolü
Write-Host "🔍 Node.js kontrol ediliyor..." -ForegroundColor Yellow
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeCmd) {
    Write-Host "❌ Node.js bulunamadı!" -ForegroundColor Red
    Write-Host "Lütfen Node.js yükleyin: https://nodejs.org/"
    exit 1
}

$nodeVersion = node --version
Write-Host "✅ Node.js bulundu: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Move paketini build et
Write-Host "📦 Move paketi build ediliyor..." -ForegroundColor Yellow
sui move build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Move build başarısız oldu!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Move paketi başarıyla build edildi" -ForegroundColor Green
Write-Host ""

# Frontend dependencies
Write-Host "📥 Frontend dependencies yükleniyor..." -ForegroundColor Yellow
Push-Location frontend

if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json bulunamadı!" -ForegroundColor Red
    Pop-Location
    exit 1
}

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install başarısız oldu!" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "✅ Frontend dependencies yüklendi" -ForegroundColor Green
Write-Host ""

# .env dosyası kontrolü
if (-not (Test-Path ".env")) {
    Write-Host "📝 .env dosyası oluşturuluyor..." -ForegroundColor Yellow
    "VITE_PACKAGE_ID=YOUR_PACKAGE_ID_HERE" | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "⚠️  .env dosyası oluşturuldu" -ForegroundColor Yellow
    Write-Host "Deploy işleminden sonra Package ID'yi buraya yazmanız gerekecek"
} else {
    Write-Host "✅ .env dosyası mevcut" -ForegroundColor Green
}

Pop-Location

Write-Host ""
Write-Host "🎉 Setup tamamlandı!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Sonraki adımlar:" -ForegroundColor Cyan
Write-Host "1. Sui Wallet extension'ını yükleyin"
Write-Host "2. Testnet'te bir cüzdan oluşturun"
Write-Host "3. Faucet'ten test token alın (Discord: https://discord.gg/sui)"
Write-Host "4. Deploy scripti çalıştırın: .\scripts\deploy.ps1"
Write-Host "5. Frontend'i başlatın: cd frontend; npm run dev"
Write-Host ""
Write-Host "Daha fazla bilgi için README.md dosyasını okuyun"

