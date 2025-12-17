# 🚀 Hướng Dẫn Build Electron App

## 📦 Cài Đặt Dependencies

```bash
npm install
```

Hoặc nếu dùng yarn:
```bash
yarn install
```

## 🎯 Các Lệnh Chạy

### 1. Chạy Web (Development)
```bash
npm run dev
```
Mở browser tại: http://localhost:5173

### 2. Chạy Electron App (Test)
```bash
npm run electron
```
Chạy app desktop để test

### 3. Build App Windows (.exe)
```bash
npm run dist:win
```
File output: `dist-electron/Lễ Ra Mắt Xã Thăng Trường Setup 1.0.0.exe`

### 4. Build App Mac (.dmg)
```bash
npm run dist:mac
```

### 5. Build App Linux (.AppImage, .deb)
```bash
npm run dist:linux
```

## 📁 Cấu Trúc File

```
project/
├── main.js              # Electron entry point
├── index.html           # Main HTML
├── styles.css           # Styles
├── script.js            # JavaScript logic
├── assets/              # Images, audio, etc.
├── package.json         # Config & dependencies
└── dist-electron/       # Build output (sau khi build)
```

## ⚙️ Tính Năng Electron App

### ✅ Đã Cấu Hình:
- ✨ **Fullscreen tự động** khi mở app
- 🚫 **Không có menu bar** (giao diện sạch)
- 🖼️ **Borderless window** (không viền)
- 🔒 **Xác nhận trước khi thoát** (tránh tắt nhầm)
- 🎹 **Keyboard shortcuts**:
  - `F11`: Toggle fullscreen
  - `Escape`: Thoát fullscreen
  - `F5` hoặc `Ctrl+R`: Reload app
  - `R`: Reset animation (từ code của bạn)
- 🚷 **Chặn zoom** (Ctrl +/-)
- 🔐 **Single instance** (chỉ chạy 1 app cùng lúc)
- 🎨 **Icon**: Sử dụng logo mocha35.png

## 🎬 Workflow Khuyên Dùng

### Cho Development (Phát triển):
```bash
npm run dev
```
→ Chạy web trên browser, dễ debug

### Cho Testing (Kiểm tra):
```bash
npm run electron
```
→ Test app desktop trước khi build

### Cho Production (Sản xuất):
```bash
npm run dist:win
```
→ Build file .exe để cài đặt

## 📦 File Build Output

Sau khi chạy `npm run dist:win`, bạn sẽ có:

```
dist-electron/
├── win-unpacked/                    # Folder app (không cần cài)
│   └── Lễ Ra Mắt Xã Thăng Trường.exe
└── Lễ Ra Mắt Xã Thăng Trường Setup 1.0.0.exe  # Installer
```

### 2 Cách Sử Dụng:

1. **Installer (Khuyên dùng)**:
   - File: `Lễ Ra Mắt Xã Thăng Trường Setup 1.0.0.exe`
   - Chạy để cài đặt vào máy
   - Tạo shortcut trên Desktop
   - Có thể gỡ cài đặt từ Control Panel

2. **Portable (Không cần cài)**:
   - Folder: `win-unpacked/`
   - Copy cả folder sang máy khác
   - Chạy trực tiếp file `.exe` trong folder

## 🎯 Sử Dụng Cho Event

### Chuẩn Bị:
1. Build app: `npm run dist:win`
2. Copy file installer sang USB
3. Cài đặt trên máy presentation

### Trong Event:
1. Mở app (tự động fullscreen)
2. Bấm 6 nút để kích hoạt
3. Xem countdown và final screen
4. Nhấn `R` để reset và chạy lại

### Thoát App:
- Nhấn `Alt+F4` hoặc close window
- Xác nhận "Thoát" trong dialog

## 🔧 Tùy Chỉnh

### Thay đổi Icon:
Thay file `assets/mocha35.png` bằng icon mới (khuyên dùng 512x512px)

### Thay đổi Tên App:
Sửa trong `package.json`:
```json
"build": {
  "productName": "Tên App Mới"
}
```

### Tắt Xác Nhận Thoát:
Trong `main.js`, comment dòng:
```javascript
// mainWindow.on('close', (e) => { ... });
```

### Bật DevTools (Debug):
Trong `main.js`, uncomment:
```javascript
mainWindow.webContents.openDevTools();
```

## 🐛 Troubleshooting

### Lỗi: "electron command not found"
```bash
npm install
```

### Lỗi: Build failed
- Kiểm tra Node.js version (cần >= 16)
- Xóa `node_modules` và cài lại:
```bash
rm -rf node_modules
npm install
```

### App không fullscreen:
- Nhấn `F11` để toggle
- Hoặc sửa `fullscreen: true` trong `main.js`

### Audio không phát:
- Electron tự động cho phép autoplay
- Không cần user interaction như browser

## 📊 Kích Thước File

- **Installer**: ~150-200 MB
- **Installed**: ~250-300 MB
- **Portable**: ~250-300 MB

(Bao gồm Chromium engine + Node.js runtime)

## 🎉 Hoàn Tất!

Bây giờ bạn có:
- ✅ Web app (chạy trên browser)
- ✅ Desktop app (chạy như app native)
- ✅ Installer (dễ cài đặt)
- ✅ Portable (không cần cài)

**Chúc event thành công! 🎊**
