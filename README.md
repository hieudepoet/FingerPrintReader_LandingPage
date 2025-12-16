# Landing Page - Lễ Ra Mắt Trang Thông Tin Điện Tử Xã Thăng Trường

## 📋 Mô Tả Dự Án

Landing Page cao cấp cho Lễ Ra Mắt Trang Thông Tin Điện Tử và Fanpage Xã Thăng Trường - Thành Phố Đà Nẵng với nghi thức 6 lãnh đạo chạm tay kích hoạt.

### 🎨 Công Nghệ Sử Dụng
- **GSAP 3.12.4** - Animation library mạnh mẽ
- **Particles.js** - Hiệu ứng particles động
- **Three.js** - 3D graphics và effects
- **HTML5 Canvas** - Custom animations
- **CSS3 Advanced** - Modern styling và animations

## ✨ Tính Năng

### 1. Giao Diện Chính
- **Background Sáng**: Gam màu đỏ/vàng tươi sáng, không dùng nền đen
- **Animated Rectangles**: 15 khối chữ nhật animation thể hiện công nghệ
- **Particles.js**: Hệ thống particles kết nối động
- **Logo MOCHA35**: Biểu tượng trung tâm với 3 lớp overlay xoay, rings pulse
- **Typography**: 100% Times New Roman font
- **6 Nút Vân Tay**: Chia 2 bên, mỗi bên 3 nút, khoảng cách phù hợp thực tế

### 2. Quy Trình Kích Hoạt
1. **Chờ Kích Hoạt**: 6 nút pulse animation mời gọi
2. **Chạm Tay**: Mỗi lãnh đạo chạm vào 1 nút
3. **Tích Năng Lượng Hạt Nhân**: 
   - 50+ particles ánh sáng tích tụ vào tâm nút
   - Hiệu ứng như năng lượng hạt nhân đang nạp
   - GSAP elastic animation
4. **Đếm Ngược Bùng Nổ**: 
   - Background lửa cháy với 200+ fire particles
   - Số đếm ngược đập vào giữa màn hình (impact effect)
   - 6 nút giữ nguyên vị trí
   - Mỗi giây: tia năng lượng từ 6 nút bắn về vòng tròn trung tâm
5. **Explosion Launch**: 
   - 300+ particles bùng nổ từ tâm
   - Màu đỏ/vàng xen kẽ
6. **Chuyển Trang**: Redirect tới Fanpage

### 3. Hiệu Ứng Âm Thanh
- Nhạc intro nền (loop)
- Sound khi chạm nút
- Sound đếm ngược
- Sound bùng nổ khi launch

## 🚀 Cài Đặt & Sử Dụng

### Yêu Cầu
- Trình duyệt hiện đại (Chrome, Firefox, Edge, Safari)
- Màn hình cảm ứng (khuyến nghị) hoặc chuột

### Cách Chạy
1. Mở file `index.html` bằng trình duyệt
2. Hoặc sử dụng Live Server:
   ```bash
   # Nếu có Python
   python -m http.server 8000
   
   # Nếu có Node.js
   npx http-server
   ```
3. Truy cập: `http://localhost:8000`

## ⚙️ Cấu Hình

### Thay Đổi URL Fanpage
Mở file `script.js` và chỉnh sửa:

```javascript
const CONFIG = {
    fanpageUrl: 'https://www.facebook.com/your-fanpage-url', // Thay URL tại đây
    countdownDuration: 5, // Thời gian đếm ngược (giây)
    enableSound: true, // Bật/tắt âm thanh
    enableMultiTouch: true // Cho phép multi-touch
};
```

### Thêm Âm Thanh
Đặt các file âm thanh vào thư mục `assets/`:
- `intro-music.mp3` - Nhạc nền intro
- `activation.mp3` - Âm thanh khi chạm nút
- `countdown.mp3` - Âm thanh đếm ngược
- `launch.mp3` - Âm thanh bùng nổ

### Thêm Hình Ảnh
Đặt hình ảnh vào thư mục `assets/`:
- `emblem.png` - Quốc huy Việt Nam

## 🎨 Tùy Chỉnh Màu Sắc

Trong file `styles.css`, bạn có thể thay đổi:

```css
/* Màu chủ đạo */
--primary-red: #ff0000;
--primary-gold: #FFD700;
--background-dark: #000000;

/* Hiệu ứng glow */
text-shadow: 0 0 40px rgba(255,215,0,0.8);
box-shadow: 0 0 20px rgba(255,0,0,0.5);
```

## 🔧 Chức Năng Debug

### Reset Ứng Dụng
Nhấn phím **R** để reset về trạng thái ban đầu (dùng cho testing)

### Console Commands
Mở Console (F12) và sử dụng:

```javascript
// Reset ứng dụng
APP.reset();

// Xem trạng thái
console.log(APP.state);

// Thay đổi cấu hình
APP.config.countdownDuration = 10;
```

## 📱 Responsive Design

- **Desktop**: Full HD (1920x1080) trở lên
- **Tablet**: 768px - 1200px
- **Mobile**: Dưới 768px (grid 2 cột)

## 🎯 Tối Ưu Hóa

### Performance
- Canvas animation với requestAnimationFrame
- CSS animations thay vì JavaScript
- Lazy loading cho audio files

### Touch Optimization
- Multi-touch support
- Touch event handlers
- Fallback cho mouse events

## 📂 Cấu Trúc Thư Mục

```
project/
├── index.html          # File HTML chính
├── styles.css          # CSS styling và animations
├── script.js           # JavaScript logic
├── README.md           # Tài liệu hướng dẫn
└── assets/            # Thư mục chứa media (tạo thủ công)
    ├── intro-music.mp3
    ├── activation.mp3
    ├── countdown.mp3
    ├── launch.mp3
    └── emblem.png
```

## 🎬 Quy Trình Sự Kiện

1. **Chuẩn Bị**:
   - Kiểm tra kết nối internet
   - Test âm thanh trước
   - Mở fullscreen (F11)

2. **Trong Sự Kiện**:
   - 6 lãnh đạo đứng trước màn hình
   - Đồng thời đặt tay lên 6 nút
   - Chờ đếm ngược và chuyển trang

3. **Sau Sự Kiện**:
   - Nhấn R để reset nếu cần demo lại

## 🐛 Xử Lý Lỗi

### Âm thanh không phát
- Trình duyệt chặn autoplay → Click vào trang trước
- File âm thanh không tồn tại → Kiểm tra thư mục assets/

### Nút không hoạt động
- Kiểm tra Console (F12) xem có lỗi
- Thử refresh trang (Ctrl + F5)
- Kiểm tra touch events trên thiết bị

### Hiệu ứng lag
- Giảm số lượng particles trong script.js
- Tắt một số animation trong CSS

## 📞 Hỗ Trợ

Nếu cần hỗ trợ kỹ thuật, vui lòng:
1. Kiểm tra Console log (F12)
2. Chụp màn hình lỗi
3. Ghi lại các bước tái hiện lỗi

## 📝 Ghi Chú

- Dự án được tối ưu cho màn hình cảm ứng lớn
- Khuyến nghị sử dụng Chrome hoặc Edge
- Test kỹ trước sự kiện chính thức
- Chuẩn bị phương án dự phòng (video backup)

## 🎉 Credits

Thiết kế và phát triển cho Lễ Ra Mắt Trang Thông Tin Điện Tử Xã Thăng Trường - TP. Đà Nẵng
Ban Công Tác 35 - Ngày 17/12/2025

- Màn hình cảm ứng (khuyến nghị) hoặc chuột

### Phương Án 1: Development Server với Vite (Khuyến Nghị) ⚡
**Hot Reload - Tự động cập nhật khi edit code!**

1. **Cài đặt Node.js** (nếu chưa có): https://nodejs.org/
2. **Cài dependencies**:
   ```bash
   npm install
   ```
3. **Chạy dev server**:
   ```bash
   npm run dev
   ```
4. **Edit code** → Trang tự động cập nhật ngay lập tức!
5. Server mở tại: http://localhost:3000

📖 Xem chi tiết: [START-DEV-SERVER.md](START-DEV-SERVER.md)

### Phương Án 2: Chạy Trực Tiếp (Không Hot Reload)
1. Mở file `index.html` bằng trình duyệt
2. Hoặc dùng Live Server extension trong VS Code
3. Hoặc chạy Python server:
   ```bash
   python -m http.server 8000
   ```

### Testing
- **Chạm/Click** 6 nút để xem hiệu ứng
- **Nhấn phím R** để reset và test lại

## ⚙️ Cấu Hình

### 1. Thay URL Fanpage
Mở file `script.js`, dòng 2:
```javascript
const CONFIG = {
    fanpageUrl: 'https://www.facebook.com/your-page', // Thay URL tại đây
    countdownDuration: 5, // Số giây đếm ngược
    enableSound: true,
    enableMultiTouch: true
};
```

### 2. Thêm Background Image
Đặt ảnh background vào `assets/background.jpg`
- Gam màu đỏ/vàng chủ đạo
- Kích thước khuyến nghị: 1920x1080 trở lên
- Format: JPG hoặc PNG

### 3. Thêm Quốc Huy
Đặt ảnh quốc huy vào `assets/emblem.png`
- Format: PNG (nền trong suốt)
- Kích thước: 200x200px trở lên

### 4. Thêm Âm Thanh (Tùy chọn)
Đặt các file MP3 vào thư mục `assets/`:
- `intro-music.mp3` - Nhạc nền intro
- `activation.mp3` - Âm thanh khi chạm nút
- `countdown.mp3` - Âm thanh đếm ngược
- `launch.mp3` - Âm thanh bùng nổ

📁 Xem chi tiết: [assets/README.md](assets/README.md)

## 🎨 Thiết Kế Mới

### Màu Sắc
- **Màu chủ đạo**: Đỏ đậm (#8B0000, #DC143C)
- **Điểm nhấn**: Vàng (#FFD700)
- **Background**: Ảnh tùy chỉnh với overlay đỏ mờ

### Vân Tay Sinh Trắc Học
- **SVG fingerprint pattern** chi tiết với 10 đường cong
- **Hiệu ứng khi chạm**:
  - Phóng to 1.15x với elastic bounce
  - Vòng sáng vàng quay quanh (ring-2)
  - 50+ particles năng lượng tích tụ vào tâm
  - Glow effect đỏ + vàng kết hợp
  - Border tăng từ 4px → 5px

### Hiệu Ứng Đặc Biệt
- **Particles.js**: 80 hạt kết nối động màu đỏ/vàng
- **Canvas Animation**: 
  - Năng lượng hạt nhân (50 particles/nút)
  - Lửa cháy (200 particles)
  - Explosion (300 particles)
- **GSAP**: Elastic bounce, smooth transitions
- **Vite Hot Reload**: Tự động cập nhật khi edit code

## 🔧 Chức Năng Debug

### Reset Ứng Dụng
Nhấn phím **R** để reset về trạng thái ban đầu (dùng cho testing)

### Console Commands
Mở Console (F12) và sử dụng:

```javascript
// Reset ứng dụng
APP.reset();

// Xem trạng thái
console.log(APP.state);

// Thay đổi cấu hình
APP.config.countdownDuration = 10;
```

## 📱 Responsive Design

- **Desktop Large**: 1920px+ (tối ưu)
- **Desktop**: 1400px - 1920px
- **Laptop**: 1200px - 1400px
- **Tablet**: 768px - 1200px

## 🎯 Tối Ưu Hóa

### Performance
- Canvas animation với requestAnimationFrame (60fps)
- CSS animations thay vì JavaScript khi có thể
- GSAP cho smooth transitions
- Vite build optimization cho production

### Touch Optimization
- Multi-touch support (6 người chạm cùng lúc)
- Touch event handlers
- Fallback cho mouse events
- Khoảng cách nút phù hợp cho thực tế

## 📂 Cấu Trúc Thư Mục

```
project/
├── index.html              # File HTML chính
├── styles.css              # CSS styling và animations
├── script.js               # JavaScript logic
├── package.json            # NPM dependencies
├── vite.config.js          # Vite configuration
├── README.md               # Tài liệu chính
├── START-DEV-SERVER.md     # Hướng dẫn dev server
├── .gitignore              # Git ignore rules
└── assets/                 # Thư mục media
    ├── README.md           # Hướng dẫn assets
    ├── background.jpg      # Background image (thêm vào)
    ├── emblem.png          # Quốc huy (thêm vào)
    ├── intro-music.mp3     # Nhạc intro (tùy chọn)
    ├── activation.mp3      # Sound activation (tùy chọn)
    ├── countdown.mp3       # Sound countdown (tùy chọn)
    └── launch.mp3          # Sound launch (tùy chọn)
```

## 🎬 Quy Trình Sự Kiện

1. **Chuẩn Bị**:
   - Kiểm tra kết nối internet
   - Test âm thanh trước
   - Mở fullscreen (F11)
   - Chạy dev server hoặc mở file HTML

2. **Trong Sự Kiện**:
   - 6 lãnh đạo đứng trước màn hình
   - Đồng thời đặt tay lên 6 nút
   - Chờ đếm ngược và chuyển trang

3. **Sau Sự Kiện**:
   - Nhấn R để reset nếu cần demo lại

## 🐛 Xử Lý Lỗi

### Âm thanh không phát
- Trình duyệt chặn autoplay → Click vào trang trước
- File âm thanh không tồn tại → Kiểm tra thư mục assets/

### Nút không hoạt động
- Kiểm tra Console (F12) xem có lỗi
- Thử refresh trang (Ctrl + F5)
- Kiểm tra touch events trên thiết bị

### Hiệu ứng lag
- Giảm số lượng particles trong script.js
- Tắt một số animation trong CSS
- Sử dụng trình duyệt Chrome để performance tốt nhất

### Hot reload không hoạt động
- Restart dev server (Ctrl + C, rồi `npm run dev`)
- Kiểm tra file đã save chưa
- Clear cache trình duyệt (Ctrl + Shift + Delete)

## 📦 Build cho Production

Khi sẵn sàng deploy:

```bash
npm run build
```

File tối ưu sẽ được tạo trong thư mục `dist/`
- HTML, CSS, JS đã minified
- Assets đã optimized
- Sẵn sàng upload lên hosting

Preview build:
```bash
npm run preview
```

## 📝 Ghi Chú

- Dự án được tối ưu cho màn hình cảm ứng lớn
- Khuyến nghị sử dụng Chrome hoặc Edge
- Test kỹ trước sự kiện chính thức
- Chuẩn bị phương án dự phòng (video backup)
- Sử dụng Vite dev server để edit code real-time

## 🎉 Credits

Thiết kế và phát triển cho Lễ Ra Mắt Trang Thông Tin Điện Tử Xã Thăng Trường - TP. Đà Nẵng

Ban Công Tác 35 - Ngày 17/12/2025

---

**Powered by:**
- Vite ⚡
- GSAP 💫
- Particles.js ✨
- Three.js 🎨
- HTML5 Canvas 🖼️
