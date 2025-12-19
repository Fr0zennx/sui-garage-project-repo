#!/bin/bash

# Speedrun Sui Setup Script
# Projeyi kurmak için gerekli tüm adımları gerçekleştirir

echo "🎯 Speedrun Sui Setup"
echo "====================="
echo ""

# Sui CLI kontrolü
echo "🔍 Sui CLI kontrol ediliyor..."
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI bulunamadı!"
    echo "Lütfen Sui CLI'yı yükleyin: https://docs.sui.io/build/install"
    exit 1
fi

SUI_VERSION=$(sui --version)
echo "✅ Sui CLI bulundu: $SUI_VERSION"
echo ""

# Node.js kontrolü
echo "🔍 Node.js kontrol ediliyor..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js bulunamadı!"
    echo "Lütfen Node.js yükleyin: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js bulundu: $NODE_VERSION"
echo ""

# Move paketini build et
echo "📦 Move paketi build ediliyor..."
sui move build

if [ $? -ne 0 ]; then
    echo "❌ Move build başarısız oldu!"
    exit 1
fi

echo "✅ Move paketi başarıyla build edildi"
echo ""

# Frontend dependencies
echo "📥 Frontend dependencies yükleniyor..."
cd frontend

if [ ! -f "package.json" ]; then
    echo "❌ package.json bulunamadı!"
    exit 1
fi

npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install başarısız oldu!"
    exit 1
fi

echo "✅ Frontend dependencies yüklendi"
echo ""

# .env dosyası kontrolü
if [ ! -f ".env" ]; then
    echo "📝 .env dosyası oluşturuluyor..."
    echo "VITE_PACKAGE_ID=YOUR_PACKAGE_ID_HERE" > .env
    echo "⚠️  .env dosyası oluşturuldu"
    echo "Deploy işleminden sonra Package ID'yi buraya yazmanız gerekecek"
else
    echo "✅ .env dosyası mevcut"
fi

cd ..

echo ""
echo "🎉 Setup tamamlandı!"
echo ""
echo "📚 Sonraki adımlar:"
echo "1. Sui Wallet extension'ını yükleyin"
echo "2. Testnet'te bir cüzdan oluşturun"
echo "3. Faucet'ten test token alın (Discord: https://discord.gg/sui)"
echo "4. Deploy scripti çalıştırın: ./scripts/deploy.sh"
echo "5. Frontend'i başlatın: cd frontend && npm run dev"
echo ""
echo "Daha fazla bilgi için README.md dosyasını okuyun"

