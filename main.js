const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true, // Start in fullscreen
    autoHideMenuBar: false, // Show menu bar for zoom access
    frame: true, // Show frame for menu
    backgroundColor: "#000000",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      zoomFactor: 1.0, // Default zoom
    },
    // icon: path.join(__dirname, "assets/mocha35.png"), // Uncomment if you have 256x256+ icon
  });

  // Create menu with zoom options
  const template = [
    {
      label: "View",
      submenu: [
        {
          label: "Zoom In",
          accelerator: "CmdOrCtrl+Plus",
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(currentZoom + 0.1);
          },
        },
        {
          label: "Zoom Out",
          accelerator: "CmdOrCtrl+-",
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(currentZoom - 0.1);
          },
        },
        {
          label: "Reset Zoom",
          accelerator: "CmdOrCtrl+0",
          click: () => {
            mainWindow.webContents.setZoomFactor(1.0);
          },
        },
        { type: "separator" },
        {
          label: "Toggle Fullscreen",
          accelerator: "F11",
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          },
        },
        {
          label: "Reload",
          accelerator: "F5",
          click: () => {
            mainWindow.reload();
          },
        },
      ],
    },
    {
      label: "App",
      submenu: [
        {
          label: "Quit",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Load the index.html
  mainWindow.loadFile("index.html");

  // Open DevTools in development (comment out for production)
  // mainWindow.webContents.openDevTools();

  // Prevent window from being closed accidentally
  mainWindow.on("close", (e) => {
    const choice = require("electron").dialog.showMessageBoxSync(mainWindow, {
      type: "question",
      buttons: ["Hủy", "Thoát"],
      title: "Xác nhận",
      message: "Bạn có chắc muốn thoát ứng dụng?",
      defaultId: 0,
      cancelId: 0,
    });

    if (choice === 0) {
      e.preventDefault();
    }
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Zoom is now handled by menu shortcuts
  // No need to prevent default anymore

  // Enable keyboard shortcuts for development
  mainWindow.webContents.on("before-input-event", (event, input) => {
    // F11 to toggle fullscreen
    if (input.key === "F11") {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
    // Escape to exit fullscreen
    if (input.key === "Escape" && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    }
    // F5 to reload
    if (input.key === "F5") {
      mainWindow.reload();
    }
    // Ctrl+R to reload
    if (input.control && input.key === "r") {
      mainWindow.reload();
    }
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  // On macOS, apps stay active until user quits explicitly
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // Focus on the main window if user tries to open another instance
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
