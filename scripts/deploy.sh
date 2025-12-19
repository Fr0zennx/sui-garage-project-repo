#!/bin/bash

# Speedrun Sui Deployment Script
# Bu script Move paketini deploy eder ve Package ID'yi frontend/.env dosyasına yazar

echo "🚀 Speedrun Sui Deployment Script"
echo "=================================="
echo ""

# Move paketini build et
echo "📦 Move paketi build ediliyor..."
sui move build

if [ $? -ne 0 ]; then
    echo "❌ Build başarısız oldu!"
    exit 1
fi

echo "✅ Build başarılı!"
echo ""

# Deploy işlemi
echo "🌐 Testnet'e deploy ediliyor..."
echo "⚠️  İşlemi onaylamak için cüzdanınızı kontrol edin"
echo ""

# Deploy komutunu çalıştır ve output'u kaydet
DEPLOY_OUTPUT=$(sui client publish --gas-budget 100000000 2>&1)

# Deploy başarılı mı kontrol et
if [ $? -ne 0 ]; then
    echo "❌ Deploy başarısız oldu!"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo "$DEPLOY_OUTPUT"
echo ""

# Package ID'yi extract et
PACKAGE_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP 'PackageID:\s*\K0x[a-fA-F0-9]+' | head -1)

if [ -z "$PACKAGE_ID" ]; then
    # Alternatif pattern dene
    PACKAGE_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP '"packageId":\s*"\K0x[a-fA-F0-9]+' | head -1)
fi

if [ -z "$PACKAGE_ID" ]; then
    echo "⚠️  Package ID otomatik olarak bulunamadı."
    echo "Lütfen yukarıdaki output'tan Package ID'yi manuel olarak kopyalayın"
    echo "ve frontend/.env dosyasına VITE_PACKAGE_ID olarak ekleyin."
    exit 0
fi

echo "✅ Deploy başarılı!"
echo "📝 Package ID: $PACKAGE_ID"
echo ""

# Frontend .env dosyasını güncelle
ENV_FILE="frontend/.env"

if [ -f "$ENV_FILE" ]; then
    # .env dosyası varsa güncelle
    if grep -q "VITE_PACKAGE_ID" "$ENV_FILE"; then
        # VITE_PACKAGE_ID varsa değiştir
        sed -i "s|VITE_PACKAGE_ID=.*|VITE_PACKAGE_ID=$PACKAGE_ID|" "$ENV_FILE"
        echo "✅ $ENV_FILE güncellendi"
    else
        # VITE_PACKAGE_ID yoksa ekle
        echo "VITE_PACKAGE_ID=$PACKAGE_ID" >> "$ENV_FILE"
        echo "✅ $ENV_FILE'a Package ID eklendi"
    fi
else
    # .env dosyası yoksa oluştur
    echo "VITE_PACKAGE_ID=$PACKAGE_ID" > "$ENV_FILE"
    echo "✅ $ENV_FILE oluşturuldu"
fi

echo ""
echo "🎉 İşlem tamamlandı!"
echo ""
echo "Şimdi frontend'i başlatabilirsiniz:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Transaction'ları görüntülemek için:"
echo "  https://suiscan.xyz/testnet/object/$PACKAGE_ID"

