const CACHE_NAME = "controle-financeiro-v3";

const ARQUIVOS_CACHE = [
    "./",
    "./inicio.html",
    "./index.html",
    "./manifest.json",
    "./css/inicio.css",
    "./css/style.css",
    "./js/script.js",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// ========================================
// INSTALAÇÃO DO SERVICE WORKER
// ========================================

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ARQUIVOS_CACHE);
            })
    );

    self.skipWaiting();
});


// ========================================
// ATIVAÇÃO
// Remove caches antigos
// ========================================

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((nomesCaches) => {
            return Promise.all(
                nomesCaches.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );

    self.clients.claim();
});


// ========================================
// INTERCEPTAÇÃO DAS REQUISIÇÕES
// ========================================

self.addEventListener("fetch", (event) => {

    // Trabalha apenas com requisições GET
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((respostaCache) => {

                // Se o arquivo estiver no cache,
                // retorna o arquivo salvo
                if (respostaCache) {
                    return respostaCache;
                }

                // Caso contrário, busca na internet
                return fetch(event.request)
                    .then((respostaRede) => {

                        // Não salva respostas inválidas
                        if (
                            !respostaRede ||
                            respostaRede.status !== 200 ||
                            respostaRede.type === "error"
                        ) {
                            return respostaRede;
                        }

                        // Faz uma cópia da resposta
                        const respostaParaCache = respostaRede.clone();

                        // Salva no cache
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(
                                    event.request,
                                    respostaParaCache
                                );
                            });

                        return respostaRede;
                    })
                    .catch(() => {

                        // Se estiver offline e for uma página,
                        // tenta abrir a tela inicial
                        if (event.request.mode === "navigate") {
                            return caches.match("./inicio.html");
                        }

                    });
            })
    );
});