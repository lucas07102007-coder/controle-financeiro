const { app, BrowserWindow } = require("electron");
const path = require("path");

function criarJanela() {
    const janela = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        title: "Controle Financeiro",
        icon: path.join(__dirname, "icons", "icon-512.png"),
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Abre primeiro a tela "Bem Vindo, Daniel!"
    janela.loadFile("inicio.html");
}

app.whenReady().then(() => {
    criarJanela();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            criarJanela();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});