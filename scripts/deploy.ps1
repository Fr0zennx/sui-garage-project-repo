# Speedrun Sui Deployment Script (PowerShell)
# Bu script Move paketini deploy eder ve Package ID'yi frontend/.env dosyasına yazar

Write-Host "Speedrun Sui Deployment Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Move paketini build et
Write-Host "Move paketi build ediliyor..." -ForegroundColor Yellow
sui move build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build basarisiz oldu!" -ForegroundColor Red
    exit 1
}

Write-Host "Build basarili!" -ForegroundColor Green
Write-Host ""

# Deploy islemi
Write-Host "Testnet'e deploy ediliyor..." -ForegroundColor Yellow
Write-Host "Islemi onaylamak icin cuzdaninizi kontrol edin" -ForegroundColor Yellow
Write-Host ""

# Deploy komutunu çalıştır ve output'u kaydet
$deployOutput = sui client publish --gas-budget 100000000 2>&1 | Out-String

# Deploy basarili mi kontrol et
if ($LASTEXITCODE -ne 0) {
    Write-Host "Deploy basarisiz oldu!" -ForegroundColor Red
    Write-Host $deployOutput
    exit 1
}

Write-Host $deployOutput
Write-Host ""

# Package ID'yi extract et
$packageId = ""
if ($deployOutput -match 'PackageID:\s*(0x[a-fA-F0-9]+)') {
    $packageId = $matches[1]
} elseif ($deployOutput -match '"packageId":\s*"(0x[a-fA-F0-9]+)"') {
    $packageId = $matches[1]
}

if ([string]::IsNullOrEmpty($packageId)) {
    Write-Host "Package ID otomatik olarak bulunamadi." -ForegroundColor Yellow
    Write-Host "Lutfen yukaridaki output'tan Package ID'yi manuel olarak kopyalayin"
    Write-Host "ve frontend\.env dosyasina VITE_PACKAGE_ID olarak ekleyin."
    exit 0
}

Write-Host "Deploy basarili!" -ForegroundColor Green
Write-Host "Package ID: $packageId" -ForegroundColor Cyan
Write-Host ""

# Frontend .env dosyasini guncelle
$envFile = "frontend\.env"

if (Test-Path $envFile) {
    # .env dosyasi varsa guncelle
    $content = Get-Content $envFile -Raw
    if ($content -match 'VITE_PACKAGE_ID') {
        $content = $content -replace 'VITE_PACKAGE_ID=.*', "VITE_PACKAGE_ID=$packageId"
        Set-Content -Path $envFile -Value $content -NoNewline
        Write-Host "$envFile guncellendi" -ForegroundColor Green
    } else {
        Add-Content -Path $envFile -Value "`nVITE_PACKAGE_ID=$packageId"
        Write-Host "$envFile'a Package ID eklendi" -ForegroundColor Green
    }
} else {
    # .env dosyasi yoksa olustur
    "VITE_PACKAGE_ID=$packageId" | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "$envFile olusturuldu" -ForegroundColor Green
}

Write-Host ""
Write-Host "Islem tamamlandi!" -ForegroundColor Green
Write-Host ""
Write-Host "Simdi frontend'i baslatabilirsiniz:"
Write-Host "  cd frontend"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Transaction'lari goruntulemek icin:"
Write-Host "  https://suiscan.xyz/testnet/object/$packageId" -ForegroundColor Cyan

