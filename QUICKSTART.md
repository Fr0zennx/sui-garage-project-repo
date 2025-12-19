# ⚡ Hızlı Başlangıç Rehberi

Bu rehber, projeyi 5 dakikada çalıştırmak için gereken minimum adımları içerir.

## 🎯 Ön Gereksinimler

1. ✅ [Sui CLI](https://docs.sui.io/build/install) yüklü
2. ✅ [Node.js](https://nodejs.org/) (v18+) yüklü
3. ✅ [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet) browser extension yüklü

## 🚀 3 Adımda Başlat

### 1️⃣ Setup (Kurulum)

**Windows PowerShell:**
```powershell
.\scripts\setup.ps1
```

**Linux/Mac/Git Bash:**
```bash
chmod +x scripts/*.sh
./scripts/setup.sh
```

**Manuel:**
```bash
sui move build
cd frontend
npm install
```

### 2️⃣ Deploy (Yayınlama)

**Önce test token alın:**
- [Sui Discord](https://discord.gg/sui)'a katılın
- `#testnet-faucet` kanalında: `!faucet <YOUR_WALLET_ADDRESS>`

**Deploy edin:**

**Windows PowerShell:**
```powershell
.\scripts\deploy.ps1
```

**Linux/Mac/Git Bash:**
```bash
./scripts/deploy.sh
```

**Manuel:**
```bash
sui move build
sui client publish --gas-budget 100000000
# Package ID'yi kopyalayın ve frontend/.env dosyasına yazın:
# VITE_PACKAGE_ID=0xYOUR_PACKAGE_ID
```

### 3️⃣ Run (Çalıştır)

```bash
cd frontend
npm run dev
```

Tarayıcıda açın: http://localhost:5173

## 🎮 Kullanım

1. **"Connect Wallet"** butonuna tıklayın
2. Sui Wallet'ta bağlantıyı onaylayın
3. **"Speedrun'ı Başlat"** butonuna tıklayın
4. Transaction'ı onaylayın
5. **Başarı!** 🎉

## 🐛 Sorunlar mı var?

### Sui CLI bulunamıyor
```bash
# Cargo ile yükle
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

### Test token yok
- Discord faucet kullanın: https://discord.gg/sui
- `#testnet-faucet` kanalında: `!faucet <ADDRESS>`

### "Insufficient funds" hatası
- Cüzdanınızda SUI token var mı kontrol edin
- Faucet'ten daha fazla token alın

### Cüzdan bağlanmıyor
- Sui Wallet extension yüklü mü?
- Testnet seçili mi?
- Browser'ı yenileyin

### Package ID hatası
- Deploy sonrası Package ID'yi `frontend/.env` dosyasına yazdınız mı?
- Format: `VITE_PACKAGE_ID=0xABC123...`

## 📚 Detaylı Bilgi

Daha fazla bilgi için [README.md](README.md) dosyasını okuyun.

## 🔗 Linkler

- 📖 [Sui Docs](https://docs.sui.io/)
- 💬 [Discord](https://discord.gg/sui)
- 🔍 [Suiscan Explorer](https://suiscan.xyz/testnet)
- 🎓 [Move Tutorial](https://examples.sui.io/)

---

**İyi kodlamalar! 🚀**

