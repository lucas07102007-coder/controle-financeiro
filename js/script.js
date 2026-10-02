// ========================================
// CAPITAL INICIAL
// ========================================

const inputCapital = document.getElementById("capitalInicial");
const btnSalvarCapital = document.getElementById("btnSalvarCapital");

const cardCapital = document.getElementById("cardCapital");
const cardEntradas = document.getElementById("cardEntradas");
const cardSaidas = document.getElementById("cardSaidas");
const cardLucro = document.getElementById("cardLucro");
const cardImposto = document.getElementById("cardImposto");
const cardSaldo = document.getElementById("cardSaldo");


// ========================================
// RESUMO MENSAL
// ========================================

const resumoEntradas = document.getElementById("resumoEntradas");
const resumoSaidas = document.getElementById("resumoSaidas");
const resumoLucro = document.getElementById("resumoLucro");
const resumoImposto = document.getElementById("resumoImposto");
const resumoResultado = document.getElementById("resumoResultado");


// ========================================
// GRÁFICOS
// ========================================

const canvasGrafico = document.getElementById("graficoFinanceiro");
let graficoFinanceiro = null;

const canvasGraficoCategorias =
    document.getElementById("graficoCategorias");

let graficoCategorias = null;


// ========================================
// FILTRO
// ========================================

const filtroMes = document.getElementById("filtroMes");
const btnMesAtual = document.getElementById("btnMesAtual");
const btnTodos = document.getElementById("btnTodos");
const textoPeriodo = document.getElementById("textoPeriodo");

let periodoSelecionado = null;


// ========================================
// FORMATAÇÃO DE MOEDA
// ========================================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


// ========================================
// CAPITAL INICIAL
// ========================================

function carregarCapital() {

    const capitalSalvo =
        localStorage.getItem("capitalInicial");

    if (capitalSalvo !== null) {

        const capital =
            Number(capitalSalvo);

        cardCapital.textContent =
            formatarMoeda(capital);

        inputCapital.value =
            capital;
    }
}


function salvarCapital() {

    const capital =
        Number(inputCapital.value);

    if (!capital || capital <= 0) {

        alert(
            "Digite um valor válido para o capital inicial."
        );

        return;
    }

    localStorage.setItem(
        "capitalInicial",
        capital
    );

    cardCapital.textContent =
        formatarMoeda(capital);

    atualizarDashboard();

    alert(
        "Capital inicial salvo com sucesso!"
    );
}


btnSalvarCapital.addEventListener(
    "click",
    salvarCapital
);


// ========================================
// LANÇAMENTOS
// ========================================

const formLancamento =
    document.getElementById("formLancamento");

const inputData =
    document.getElementById("dataLancamento");

const inputDescricao =
    document.getElementById("descricaoLancamento");

const inputTipo =
    document.getElementById("tipoLancamento");

const inputCategoria =
    document.getElementById("categoriaLancamento");

const inputValor =
    document.getElementById("valorLancamento");

const listaLancamentos =
    document.getElementById("listaLancamentos");

const btnAdicionar =
    document.getElementById("btnAdicionar");

    const btnCancelarEdicao =
    document.getElementById("btnCancelarEdicao");

// ========================================
// CATEGORIAS
// ========================================

const categoriasEntrada = [
    "Gain"
];

const categoriasSaida = [
    "Salário",
    "Loss"
];


function atualizarCategorias(
    categoriaSelecionada = ""
) {

    const tipo =
        inputTipo.value;

    let categorias = [];

    if (tipo === "entrada") {

        categorias =
            categoriasEntrada;

    } else {

        categorias =
            categoriasSaida;
    }

    inputCategoria.innerHTML = `
        <option value="">
            Selecione uma categoria
        </option>
    `;

    categorias.forEach(
        (categoria) => {

            const option =
                document.createElement("option");

            option.value =
                categoria;

            option.textContent =
                categoria;

            inputCategoria.appendChild(option);
        }
    );

    if (categoriaSelecionada) {

        if (
            categorias.includes(
                categoriaSelecionada
            )
        ) {

            inputCategoria.value =
                categoriaSelecionada;

        } else {

            inputCategoria.value =
                "Outros";
        }
    }
}


inputTipo.addEventListener(
    "change",
    function () {

        atualizarCategorias();
    }
);


// ========================================
// RECUPERAR LANÇAMENTOS
// ========================================

let lancamentos =
    JSON.parse(
        localStorage.getItem("lancamentos")
    ) || [];


// Compatibilidade com registros antigos

let houveAtualizacaoAntiga = false;

lancamentos.forEach(
    (lancamento) => {

        if (!lancamento.categoria) {

            lancamento.categoria =
                "Outros";

            houveAtualizacaoAntiga =
                true;
        }
    }
);

if (houveAtualizacaoAntiga) {

    localStorage.setItem(
        "lancamentos",
        JSON.stringify(lancamentos)
    );
}


let idEmEdicao = null;


// ========================================
// SALVAR LANÇAMENTOS
// ========================================

function salvarLancamentos() {

    localStorage.setItem(
        "lancamentos",
        JSON.stringify(lancamentos)
    );
}


// ========================================
// FILTRAR LANÇAMENTOS
// ========================================

function obterLancamentosFiltrados() {

    if (!periodoSelecionado) {

        return lancamentos;
    }

    return lancamentos.filter(
        (lancamento) => {

            const mesLancamento =
                lancamento.data.substring(0, 7);

            return (
                mesLancamento ===
                periodoSelecionado
            );
        }
    );
}


// ========================================
// FORMATAR PERÍODO
// ========================================

function formatarPeriodo(periodo) {

    if (!periodo) {

        return "Todos os lançamentos";
    }

    const partes =
        periodo.split("-");

    const ano =
        partes[0];

    const mes =
        Number(partes[1]);

    const nomesMeses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    return (
        `${nomesMeses[mes - 1]} de ${ano}`
    );
}


function atualizarTextoPeriodo() {

    if (!periodoSelecionado) {

        textoPeriodo.textContent =
            "Exibindo todos os lançamentos.";

        return;
    }

    textoPeriodo.textContent =
        `Exibindo lançamentos de ${formatarPeriodo(periodoSelecionado)}.`;
}


// ========================================
// FILTROS
// ========================================

function alterarFiltro() {

    if (!filtroMes.value) {

        periodoSelecionado = null;

    } else {

        periodoSelecionado =
            filtroMes.value;
    }

    exibirLancamentos();
    atualizarDashboard();
    atualizarTextoPeriodo();
}


filtroMes.addEventListener(
    "change",
    alterarFiltro
);


function selecionarMesAtual() {

    const hoje =
        new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const mesAtual =
        `${ano}-${mes}`;

    periodoSelecionado =
        mesAtual;

    filtroMes.value =
        mesAtual;

    exibirLancamentos();
    atualizarDashboard();
    atualizarTextoPeriodo();
}


btnMesAtual.addEventListener(
    "click",
    selecionarMesAtual
);


function mostrarTodos() {

    periodoSelecionado = null;

    filtroMes.value = "";

    exibirLancamentos();
    atualizarDashboard();
    atualizarTextoPeriodo();
}


btnTodos.addEventListener(
    "click",
    abrirTelaMeses
);


// ========================================
// ADICIONAR / EDITAR
// ========================================

function adicionarLancamento(event) {

    event.preventDefault();

    const data =
        inputData.value;

    const descricao =
        inputDescricao.value.trim();

    const tipo =
        inputTipo.value;

    const categoria =
        inputCategoria.value;

    const valor =
        Number(inputValor.value);


    if (!data) {

        alert("Selecione uma data.");
        return;
    }

    if (!descricao) {

        alert("Digite uma descrição.");
        return;
    }

    if (!categoria) {

        alert("Selecione uma categoria.");
        return;
    }

    if (!valor || valor <= 0) {

        alert("Digite um valor válido.");
        return;
    }


    if (idEmEdicao !== null) {

        const indice =
            lancamentos.findIndex(
                lancamento =>
                    lancamento.id ===
                    idEmEdicao
            );

        if (indice !== -1) {

            lancamentos[indice] = {

                id: idEmEdicao,
                data: data,
                descricao: descricao,
                tipo: tipo,
                categoria: categoria,
                valor: valor
            };
        }

        idEmEdicao = null;

        btnAdicionar.textContent =
            "Adicionar Lançamento";

        alert(
            "Lançamento atualizado com sucesso!"
        );

    } else {

        const novoLancamento = {

            id: Date.now(),
            data: data,
            descricao: descricao,
            tipo: tipo,
            categoria: categoria,
            valor: valor
        };

        lancamentos.push(
            novoLancamento
        );

        alert(
            "Lançamento adicionado com sucesso!"
        );
    }

    salvarLancamentos();

    exibirLancamentos();

    atualizarDashboard();

    formLancamento.reset();

    atualizarCategorias();
}


formLancamento.addEventListener(
    "submit",
    adicionarLancamento
);


// ========================================
// EXIBIR LANÇAMENTOS
// ========================================

function exibirLancamentos() {

    listaLancamentos.innerHTML = "";

    const lancamentosFiltrados =
        obterLancamentosFiltrados();

    if (
        lancamentosFiltrados.length === 0
    ) {

        listaLancamentos.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align: center;
                        color: #9ca3af;
                    "
                >
                    Nenhum lançamento encontrado
                    neste período.
                </td>
            </tr>
        `;

        return;
    }

    const lancamentosOrdenados =
        [...lancamentosFiltrados].sort(
            (a, b) =>
                new Date(b.data) -
                new Date(a.data)
        );

    lancamentosOrdenados.forEach(
        (lancamento) => {

            const linha =
                document.createElement("tr");

            const partesData =
                lancamento.data.split("-");

            const dataFormatada =
                `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

            const classeTipo =
                lancamento.tipo === "entrada"
                    ? "tipo-entrada"
                    : "tipo-saida";

            const classeValor =
                lancamento.tipo === "entrada"
                    ? "valor-entrada"
                    : "valor-saida";

            const nomeTipo =
                lancamento.tipo === "entrada"
                    ? "Entrada"
                    : "Saída";

            const categoria =
                lancamento.categoria ||
                "Outros";

            linha.innerHTML = `

                <td>
                    ${dataFormatada}
                </td>

                <td>
                    ${lancamento.descricao}
                </td>

                <td class="${classeTipo}">
                    ${nomeTipo}
                </td>

                <td>
                    ${categoria}
                </td>

                <td class="${classeValor}">
                    ${formatarMoeda(lancamento.valor)}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarLancamento(${lancamento.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirLancamento(${lancamento.id})"
                    >
                        Excluir
                    </button>

                </td>
            `;

            listaLancamentos.appendChild(
                linha
            );
        }
    );
}


// ========================================
// EDITAR
// ========================================

function editarLancamento(id) {

    const lancamento =
        lancamentos.find(
            lancamento =>
                lancamento.id === id
        );

    if (!lancamento) {

        alert(
            "Lançamento não encontrado."
        );

        return;
    }

    inputData.value =
        lancamento.data;

    inputDescricao.value =
        lancamento.descricao;

    inputTipo.value =
        lancamento.tipo;

    atualizarCategorias(
        lancamento.categoria ||
        "Outros"
    );

    inputValor.value =
        lancamento.valor;

    idEmEdicao = id;

    btnAdicionar.textContent =
        "Salvar Alterações";

    if (btnCancelarEdicao) {
        btnCancelarEdicao.hidden = false;
    }

    document
        .querySelector(".lancamentos")
        .scrollIntoView({
            behavior: "smooth"
        });

    inputDescricao.focus();
}


// ========================================
// CANCELAR EDIÇÃO
// ========================================

function cancelarEdicao() {

    idEmEdicao = null;

    formLancamento.reset();

    atualizarCategorias();

    btnAdicionar.textContent =
        "Adicionar Lançamento";

    if (btnCancelarEdicao) {
        btnCancelarEdicao.hidden = true;
    }
}


if (btnCancelarEdicao) {

    btnCancelarEdicao.addEventListener(
        "click",
        cancelarEdicao
    );
}

// ========================================
// EXCLUIR
// ========================================

function excluirLancamento(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este lançamento?"
        );

    if (!confirmar) {
        return;
    }

    lancamentos =
        lancamentos.filter(
            lancamento =>
                lancamento.id !== id
        );

    if (idEmEdicao === id) {

        idEmEdicao = null;

        formLancamento.reset();

        atualizarCategorias();

        btnAdicionar.textContent =
            "Adicionar Lançamento";
    }

    salvarLancamentos();

    exibirLancamentos();

    atualizarDashboard();
}


// ========================================
// GRÁFICO FINANCEIRO
// ========================================

function atualizarGrafico() {

    if (!canvasGrafico) {
        return;
    }

    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js não foi carregado."
        );

        return;
    }

    const lancamentosFiltrados =
        obterLancamentosFiltrados();

    const valoresPorDia = {};

    lancamentosFiltrados.forEach(
        (lancamento) => {

            const data =
                lancamento.data;

            if (!valoresPorDia[data]) {

                valoresPorDia[data] = {
                    entradas: 0,
                    saidas: 0
                };
            }

            if (
                lancamento.tipo ===
                "entrada"
            ) {

                valoresPorDia[data]
                    .entradas +=
                    Number(
                        lancamento.valor
                    );
            }

            if (
                lancamento.tipo ===
                "saida"
            ) {

                valoresPorDia[data]
                    .saidas +=
                    Number(
                        lancamento.valor
                    );
            }
        }
    );

    const datas =
        Object
            .keys(valoresPorDia)
            .sort(
                (a, b) =>
                    new Date(a) -
                    new Date(b)
            );

    const labels =
        datas.map(
            (data) => {

                const partes =
                    data.split("-");

                return (
                    `${partes[2]}/${partes[1]}`
                );
            }
        );

    const dadosEntradas =
        datas.map(
            (data) =>
                valoresPorDia[data]
                    .entradas
        );

    const dadosSaidas =
        datas.map(
            (data) =>
                valoresPorDia[data]
                    .saidas
        );

    if (graficoFinanceiro) {

        graficoFinanceiro.destroy();

        graficoFinanceiro = null;
    }

    graficoFinanceiro =
        new Chart(
            canvasGrafico,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {
                            label: "Entradas",

                            data:
                                dadosEntradas,

                            borderColor:
                                "#22c55e",

                            backgroundColor:
                                "rgba(34, 197, 94, 0.15)",

                            tension: 0.3,

                            fill: false,

                            pointRadius: 5,

                            pointHoverRadius: 7
                        },

                        {
                            label: "Saídas",

                            data:
                                dadosSaidas,

                            borderColor:
                                "#ef4444",

                            backgroundColor:
                                "rgba(239, 68, 68, 0.15)",

                            tension: 0.3,

                            fill: false,

                            pointRadius: 5,

                            pointHoverRadius: 7
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        mode: "index",

                        intersect: false
                    },

                    plugins: {

                        legend: {

                            display: true,

                            labels: {

                                color:
                                    "#d1d5db"
                            }
                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
                                            context.dataset.label +
                                            ": " +
                                            formatarMoeda(
                                                context.raw
                                            )
                                        );
                                    }
                            }
                        }
                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                color:
                                    "#9ca3af",

                                callback:
                                    function (
                                        valor
                                    ) {

                                        return (
                                            formatarMoeda(
                                                valor
                                            )
                                        );
                                    }
                            },

                            grid: {

                                color:
                                    "#374151"
                            }
                        },

                        x: {

                            ticks: {

                                color:
                                    "#d1d5db"
                            },

                            grid: {

                                display:
                                    false
                            }
                        }
                    }
                }
            }
        );
}


// ========================================
// GASTOS POR CATEGORIA
// ========================================

function atualizarGraficoCategorias() {

    if (!canvasGraficoCategorias) {
        return;
    }

    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js não foi carregado."
        );

        return;
    }

    const lancamentosFiltrados =
        obterLancamentosFiltrados();

    const gastosPorCategoria = {};

    lancamentosFiltrados.forEach(
        (lancamento) => {

            if (
                lancamento.tipo !==
                "saida"
            ) {
                return;
            }

            const categoria =
                lancamento.categoria ||
                "Outros";

            if (
                !gastosPorCategoria[
                    categoria
                ]
            ) {

                gastosPorCategoria[
                    categoria
                ] = 0;
            }

            gastosPorCategoria[
                categoria
            ] +=
                Number(
                    lancamento.valor
                );
        }
    );

    const categorias =
        Object.keys(
            gastosPorCategoria
        );

    const valores =
        categorias.map(
            (categoria) =>
                gastosPorCategoria[
                    categoria
                ]
        );

    if (graficoCategorias) {

        graficoCategorias.destroy();

        graficoCategorias = null;
    }

    if (categorias.length === 0) {

        graficoCategorias =
            new Chart(
                canvasGraficoCategorias,
                {

                    type: "doughnut",

                    data: {

                        labels: [
                            "Nenhuma saída registrada"
                        ],

                        datasets: [
                            {

                                data: [1],

                                backgroundColor: [
                                    "#374151"
                                ],

                                borderWidth: 0
                            }
                        ]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio:
                            false,

                        cutout:
                            "65%",

                        plugins: {

                            legend: {

                                display:
                                    true,

                                labels: {

                                    color:
                                        "#d1d5db"
                                }
                            },

                            tooltip: {

                                enabled:
                                    false
                            }
                        }
                    }
                }
            );

        return;
    }

    const cores = [

        "#ef4444",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#06b6d4",
        "#3b82f6",
        "#8b5cf6",
        "#ec4899",
        "#64748b"
    ];

    graficoCategorias =
        new Chart(
            canvasGraficoCategorias,
            {

                type:
                    "doughnut",

                data: {

                    labels:
                        categorias,

                    datasets: [
                        {

                            label:
                                "Gastos",

                            data:
                                valores,

                            backgroundColor:
                                categorias.map(
                                    (
                                        _,
                                        indice
                                    ) =>
                                        cores[
                                            indice %
                                            cores.length
                                        ]
                                ),

                            borderColor:
                                "#111827",

                            borderWidth: 2,

                            hoverOffset: 8
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "65%",

                    plugins: {

                        legend: {

                            display: true,

                            position:
                                "bottom",

                            labels: {

                                color:
                                    "#d1d5db",

                                padding: 18
                            }
                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        const valor =
                                            Number(
                                                context.raw
                                            );

                                        const total =
                                            valores.reduce(
                                                (
                                                    acumulador,
                                                    valorAtual
                                                ) =>
                                                    acumulador +
                                                    valorAtual,
                                                0
                                            );

                                        const percentual =
                                            total > 0
                                                ? (
                                                    (
                                                        valor /
                                                        total
                                                    ) *
                                                    100
                                                ).toFixed(1)
                                                : "0.0";

                                        return (
                                            context.label +
                                            ": " +
                                            formatarMoeda(
                                                valor
                                            ) +
                                            " (" +
                                            percentual +
                                            "%)"
                                        );
                                    }
                            }
                        }
                    }
                }
            }
        );
}


// ========================================
// ATUALIZAR DASHBOARD
// ========================================

function atualizarDashboard() {

    const capitalInicial =
        Number(
            localStorage.getItem(
                "capitalInicial"
            )
        ) || 0;

    let totalEntradas = 0;
    let totalSaidas = 0;

    const lancamentosFiltrados =
        obterLancamentosFiltrados();

    lancamentosFiltrados.forEach(
        (lancamento) => {

            if (
                lancamento.tipo ===
                "entrada"
            ) {

                totalEntradas +=
                    Number(
                        lancamento.valor
                    );
            }

            if (
                lancamento.tipo ===
                "saida"
            ) {

                totalSaidas +=
                    Number(
                        lancamento.valor
                    );
            }
        }
    );


    // ========================================
    // LUCRO LÍQUIDO
    // ========================================

    const lucroLiquido =
    totalEntradas -
    totalSaidas;


    // ========================================
    // IMPOSTO
    // ========================================

    const imposto =
        lucroLiquido > 0
            ? lucroLiquido * 0.15
            : 0;


    // ========================================
    // RESULTADO FINAL
    // ========================================

    const resultadoFinal =
        lucroLiquido -
        imposto;


    // ========================================
    // SALDO ATUAL
    // ========================================

    const saldoAtual =
        capitalInicial +
        totalEntradas -
        totalSaidas -
        imposto;


    // ========================================
    // CARDS
    // ========================================

    cardCapital.textContent =
        formatarMoeda(
            capitalInicial
        );

    cardEntradas.textContent =
        formatarMoeda(
            totalEntradas
        );

    cardSaidas.textContent =
        formatarMoeda(
            totalSaidas
        );

    cardLucro.textContent =
        formatarMoeda(
            lucroLiquido
        );

    cardImposto.textContent =
        formatarMoeda(
            imposto
        );

    cardSaldo.textContent =
        formatarMoeda(
            saldoAtual
        );


    // ========================================
    // RESUMO
    // ========================================

    resumoEntradas.textContent =
        formatarMoeda(
            totalEntradas
        );

    resumoSaidas.textContent =
        formatarMoeda(
            totalSaidas
        );

    resumoLucro.textContent =
        formatarMoeda(
            lucroLiquido
        );

    resumoImposto.textContent =
        formatarMoeda(
            imposto
        );

    resumoResultado.textContent =
        formatarMoeda(
            resultadoFinal
        );


    atualizarGrafico();

    atualizarGraficoCategorias();


    // ========================================
    // CORES
    // ========================================

    if (lucroLiquido > 0) {

        cardLucro.style.color =
            "#22c55e";

    } else if (lucroLiquido < 0) {

        cardLucro.style.color =
            "#ef4444";

    } else {

        cardLucro.style.color =
            "white";
    }


    if (saldoAtual > 0) {

        cardSaldo.style.color =
            "#22c55e";

    } else if (saldoAtual < 0) {

        cardSaldo.style.color =
            "#ef4444";

    } else {

        cardSaldo.style.color =
            "white";
    }


    resumoEntradas.style.color =
        "#22c55e";

    resumoSaidas.style.color =
        "#ef4444";


    if (lucroLiquido > 0) {

        resumoLucro.style.color =
            "#22c55e";

    } else if (lucroLiquido < 0) {

        resumoLucro.style.color =
            "#ef4444";

    } else {

        resumoLucro.style.color =
            "white";
    }


    if (resultadoFinal > 0) {

        resumoResultado.style.color =
            "#22c55e";

    } else if (resultadoFinal < 0) {

        resumoResultado.style.color =
            "#ef4444";

    } else {

        resumoResultado.style.color =
            "white";
    }
}


// ========================================
// INICIALIZAÇÃO
// ========================================

carregarCapital();

atualizarCategorias();

selecionarMesAtual();

// ========================================
// BACKUP E RESTAURAÇÃO
// ========================================

const btnExportarBackup =
    document.getElementById("btnExportarBackup");

const btnImportarBackup =
    document.getElementById("btnImportarBackup");

const inputImportarBackup =
    document.getElementById("inputImportarBackup");


// ========================================
// EXPORTAR BACKUP
// ========================================

function exportarBackup() {

    const capitalInicial =
        Number(
            localStorage.getItem("capitalInicial")
        ) || 0;

    const dadosBackup = {

        sistema: "Controle Financeiro",

        versao: "1.0",

        dataBackup:
            new Date().toISOString(),

        capitalInicial:
            capitalInicial,

        lancamentos:
            lancamentos
    };


    const conteudoJSON =
        JSON.stringify(
            dadosBackup,
            null,
            2
        );


    const arquivo =
        new Blob(
            [conteudoJSON],
            {
                type: "application/json"
            }
        );


    const url =
        URL.createObjectURL(arquivo);


    const link =
        document.createElement("a");


    const hoje =
        new Date();


    const dataFormatada =
        hoje
            .toISOString()
            .split("T")[0];


    link.href = url;

    link.download =
        `backup-controle-financeiro-${dataFormatada}.json`;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);


    alert(
        "Backup exportado com sucesso!"
    );
}


// ========================================
// ABRIR SELETOR DE ARQUIVO
// ========================================

function abrirImportacaoBackup() {

    inputImportarBackup.value = "";

    inputImportarBackup.click();
}


// ========================================
// IMPORTAR BACKUP
// ========================================

function importarBackup(event) {

    const arquivo =
        event.target.files[0];


    if (!arquivo) {
        return;
    }


    const leitor =
        new FileReader();


    leitor.onload =
        function (evento) {

            try {

                const dados =
                    JSON.parse(
                        evento.target.result
                    );


                // ========================================
                // VALIDAR BACKUP
                // ========================================

                if (
                    !dados ||
                    dados.sistema !==
                        "Controle Financeiro" ||
                    !Array.isArray(
                        dados.lancamentos
                    )
                ) {

                    alert(
                        "Este arquivo não é um backup válido do Controle Financeiro."
                    );

                    return;
                }


                const capitalImportado =
                    Number(
                        dados.capitalInicial
                    );


                if (
                    isNaN(capitalImportado) ||
                    capitalImportado < 0
                ) {

                    alert(
                        "O capital inicial do backup é inválido."
                    );

                    return;
                }


                // ========================================
                // VALIDAR LANÇAMENTOS
                // ========================================

                const lancamentosValidos =
                    dados.lancamentos.every(
                        (lancamento) => {

                            return (

                                lancamento &&

                                lancamento.id !==
                                    undefined &&

                                typeof
                                    lancamento.data ===
                                    "string" &&

                                typeof
                                    lancamento.descricao ===
                                    "string" &&

                                (
                                    lancamento.tipo ===
                                        "entrada" ||

                                    lancamento.tipo ===
                                        "saida"
                                ) &&

                                Number(
                                    lancamento.valor
                                ) > 0

                            );
                        }
                    );


                if (!lancamentosValidos) {

                    alert(
                        "O arquivo possui lançamentos inválidos."
                    );

                    return;
                }


                // ========================================
                // CONFIRMAR RESTAURAÇÃO
                // ========================================

                const confirmar =
                    confirm(
                        "Atenção!\n\n" +
                        "Ao importar este backup, os dados atuais serão substituídos.\n\n" +
                        "Deseja continuar?"
                    );


                if (!confirmar) {
                    return;
                }


                // ========================================
                // RESTAURAR CAPITAL
                // ========================================

                localStorage.setItem(
                    "capitalInicial",
                    capitalImportado
                );


                // ========================================
                // RESTAURAR LANÇAMENTOS
                // ========================================

                lancamentos =
                    dados.lancamentos.map(
                        (lancamento) => {

                            return {

                                id:
                                    lancamento.id,

                                data:
                                    lancamento.data,

                                descricao:
                                    lancamento.descricao,

                                tipo:
                                    lancamento.tipo,

                                categoria:
                                    lancamento.categoria ||
                                    "Outros",

                                valor:
                                    Number(
                                        lancamento.valor
                                    )
                            };
                        }
                    );


                salvarLancamentos();


                // ========================================
                // CANCELAR POSSÍVEL EDIÇÃO
                // ========================================

                idEmEdicao = null;

                formLancamento.reset();

                atualizarCategorias();

                btnAdicionar.textContent =
                    "Adicionar Lançamento";


                // ========================================
                // ATUALIZAR CAPITAL
                // ========================================

                inputCapital.value =
                    capitalImportado;

                cardCapital.textContent =
                    formatarMoeda(
                        capitalImportado
                    );


                // ========================================
                // ATUALIZAR SISTEMA
                // ========================================

                exibirLancamentos();

                atualizarDashboard();

                atualizarTextoPeriodo();


                alert(
                    "Backup importado com sucesso!"
                );

            } catch (erro) {

                console.error(
                    "Erro ao importar backup:",
                    erro
                );

                alert(
                    "Não foi possível importar o arquivo. Verifique se o backup é válido."
                );
            }
        };


    leitor.onerror =
        function () {

            alert(
                "Não foi possível ler o arquivo selecionado."
            );
        };


    leitor.readAsText(arquivo);
}


// ========================================
// EVENTOS DOS BOTÕES
// ========================================

if (btnExportarBackup) {

    btnExportarBackup.addEventListener(
        "click",
        exportarBackup
    );
}


if (btnImportarBackup) {

    btnImportarBackup.addEventListener(
        "click",
        abrirImportacaoBackup
    );
}


if (inputImportarBackup) {

    inputImportarBackup.addEventListener(
        "change",
        importarBackup
    );
}

// ========================================
// RELATÓRIOS MENSAIS
// ========================================

const telaMeses =
    document.getElementById("telaMeses");

const telaRelatorioMes =
    document.getElementById("telaRelatorioMes");

const btnVoltarSistema =
    document.getElementById("btnVoltarSistema");

const btnVoltarMeses =
    document.getElementById("btnVoltarMeses");

const anoRelatorios =
    document.getElementById("anoRelatorios");

const botoesMeses =
    document.querySelectorAll(".btn-mes");

const tituloRelatorioMes =
    document.getElementById("tituloRelatorioMes");


// Elementos do relatório

const relatorioCapital =
    document.getElementById("relatorioCapital");

const relatorioEntradas =
    document.getElementById("relatorioEntradas");

const relatorioSaidas =
    document.getElementById("relatorioSaidas");

const relatorioLucro =
    document.getElementById("relatorioLucro");

const relatorioImposto =
    document.getElementById("relatorioImposto");

const relatorioResultado =
    document.getElementById("relatorioResultado");


const relResumoEntradas =
    document.getElementById("relResumoEntradas");

const relResumoSaidas =
    document.getElementById("relResumoSaidas");

const relResumoLucro =
    document.getElementById("relResumoLucro");

const relResumoImposto =
    document.getElementById("relResumoImposto");

const relResumoResultado =
    document.getElementById("relResumoResultado");


const relatorioListaEntradas =
    document.getElementById("relatorioListaEntradas");

const relatorioListaSaidas =
    document.getElementById("relatorioListaSaidas");


const canvasRelatorioFinanceiro =
    document.getElementById("graficoRelatorioFinanceiro");

const canvasRelatorioCategorias =
    document.getElementById("graficoRelatorioCategorias");


let graficoRelatorioFinanceiro = null;
let graficoRelatorioCategorias = null;


// ========================================
// PARTES PRINCIPAIS DO SISTEMA
// ========================================

function obterElementosTelaPrincipal() {

    return Array.from(
        document.querySelector("main").children
    ).filter(elemento => {

        return (
            elemento.id !== "telaMeses" &&
            elemento.id !== "telaRelatorioMes"
        );

    });

}


// ========================================
// ESCONDER TELA PRINCIPAL
// ========================================

function esconderTelaPrincipal() {

    const elementos =
        obterElementosTelaPrincipal();

    elementos.forEach(elemento => {

        elemento.hidden = true;

    });

}


// ========================================
// MOSTRAR TELA PRINCIPAL
// ========================================

function mostrarTelaPrincipal() {

    const elementos =
        obterElementosTelaPrincipal();

    elementos.forEach(elemento => {

        elemento.hidden = false;

    });

}


// ========================================
// PREENCHER ANOS DISPONÍVEIS
// ========================================

function preencherAnosRelatorios() {

    if (!anoRelatorios) {
        return;
    }

    const hoje = new Date();

    const anoAtual =
        hoje.getFullYear();

    const anos = new Set();

    anos.add(anoAtual);


    lancamentos.forEach(lancamento => {

        if (!lancamento.data) {
            return;
        }

        const ano =
            Number(
                lancamento.data.substring(0, 4)
            );

        if (!isNaN(ano)) {

            anos.add(ano);

        }

    });


    const anosOrdenados =
        Array.from(anos).sort(
            (a, b) => b - a
        );


    anoRelatorios.innerHTML = "";


    anosOrdenados.forEach(ano => {

        const option =
            document.createElement("option");

        option.value = ano;

        option.textContent = ano;

        anoRelatorios.appendChild(option);

    });


    if (anos.has(anoAtual)) {

        anoRelatorios.value =
            String(anoAtual);

    }

}


// ========================================
// ABRIR TELA DOS MESES
// ========================================

function abrirTelaMeses() {

    esconderTelaPrincipal();

    telaRelatorioMes.hidden = true;

    telaMeses.hidden = false;

    preencherAnosRelatorios();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ========================================
// VOLTAR PARA O SISTEMA
// ========================================

function voltarParaSistema() {

    telaMeses.hidden = true;

    telaRelatorioMes.hidden = true;

    mostrarTelaPrincipal();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ========================================
// VOLTAR PARA OS MESES
// ========================================

function voltarParaMeses() {

    telaRelatorioMes.hidden = true;

    telaMeses.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ========================================
// NOMES DOS MESES
// ========================================

const nomesMesesRelatorio = [

    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"

];


// ========================================
// FORMATAR DATA
// ========================================

function formatarDataRelatorio(data) {

    const partes =
        data.split("-");

    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


// ========================================
// ABRIR RELATÓRIO DO MÊS
// ========================================

function abrirRelatorioMes(mes) {

    const ano =
        Number(anoRelatorios.value);

    telaMeses.hidden = true;

    telaRelatorioMes.hidden = false;


    tituloRelatorioMes.textContent =
        `Relatório — ${nomesMesesRelatorio[mes]} de ${ano}`;


    gerarRelatorioMensal(
        ano,
        mes
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ========================================
// GERAR RELATÓRIO
// ========================================

function gerarRelatorioMensal(
    ano,
    mes
) {

    const mesFormatado =
        String(mes + 1).padStart(
            2,
            "0"
        );

    const periodo =
        `${ano}-${mesFormatado}`;


    const lancamentosMes =
        lancamentos.filter(
            lancamento => {

                return (
                    lancamento.data &&
                    lancamento.data.substring(
                        0,
                        7
                    ) === periodo
                );

            }
        );


    let totalEntradas = 0;
    let totalSaidas = 0;


    lancamentosMes.forEach(
        lancamento => {

            if (
                lancamento.tipo ===
                "entrada"
            ) {

                totalEntradas +=
                    Number(
                        lancamento.valor
                    );

            }


            if (
                lancamento.tipo ===
                "saida"
            ) {

                totalSaidas +=
                    Number(
                        lancamento.valor
                    );

            }

        }
    );


    const capitalInicial =
        Number(
            localStorage.getItem(
                "capitalInicial"
            )
        ) || 0;


    // Mesma regra utilizada no dashboard atual

    const lucroLiquido =
        totalEntradas -
        totalSaidas -
        capitalInicial;


    const imposto =
        lucroLiquido > 0
            ? lucroLiquido * 0.15
            : 0;


    const resultadoFinal =
        lucroLiquido -
        imposto;


    // ========================================
    // CARDS
    // ========================================

    relatorioCapital.textContent =
        formatarMoeda(
            capitalInicial
        );

    relatorioEntradas.textContent =
        formatarMoeda(
            totalEntradas
        );

    relatorioSaidas.textContent =
        formatarMoeda(
            totalSaidas
        );

    relatorioLucro.textContent =
        formatarMoeda(
            lucroLiquido
        );

    relatorioImposto.textContent =
        formatarMoeda(
            imposto
        );

    relatorioResultado.textContent =
        formatarMoeda(
            resultadoFinal
        );


    // ========================================
    // RESUMO
    // ========================================

    relResumoEntradas.textContent =
        formatarMoeda(
            totalEntradas
        );

    relResumoSaidas.textContent =
        formatarMoeda(
            totalSaidas
        );

    relResumoLucro.textContent =
        formatarMoeda(
            lucroLiquido
        );

    relResumoImposto.textContent =
        formatarMoeda(
            imposto
        );

    relResumoResultado.textContent =
        formatarMoeda(
            resultadoFinal
        );


    // ========================================
    // CORES
    // ========================================

    relatorioEntradas.style.color =
        "#22c55e";

    relatorioSaidas.style.color =
        "#ef4444";


    relatorioLucro.style.color =
        lucroLiquido > 0
            ? "#22c55e"
            : lucroLiquido < 0
                ? "#ef4444"
                : "white";


    relatorioResultado.style.color =
        resultadoFinal > 0
            ? "#22c55e"
            : resultadoFinal < 0
                ? "#ef4444"
                : "white";


    relResumoEntradas.style.color =
        "#22c55e";

    relResumoSaidas.style.color =
        "#ef4444";


    relResumoLucro.style.color =
        lucroLiquido > 0
            ? "#22c55e"
            : lucroLiquido < 0
                ? "#ef4444"
                : "white";


    relResumoResultado.style.color =
        resultadoFinal > 0
            ? "#22c55e"
            : resultadoFinal < 0
                ? "#ef4444"
                : "white";


    // ========================================
    // TABELAS
    // ========================================

    preencherTabelaRelatorio(
        lancamentosMes
    );


    // ========================================
    // GRÁFICOS
    // ========================================

    criarGraficoRelatorioFinanceiro(
        lancamentosMes
    );

    criarGraficoRelatorioCategorias(
        lancamentosMes
    );

}


// ========================================
// TABELAS DO RELATÓRIO
// ========================================

function preencherTabelaRelatorio(
    lancamentosMes
) {

    relatorioListaEntradas.innerHTML = "";

    relatorioListaSaidas.innerHTML = "";


    const entradas =
        lancamentosMes
            .filter(
                lancamento =>
                    lancamento.tipo ===
                    "entrada"
            )
            .sort(
                (a, b) =>
                    new Date(b.data) -
                    new Date(a.data)
            );


    const saidas =
        lancamentosMes
            .filter(
                lancamento =>
                    lancamento.tipo ===
                    "saida"
            )
            .sort(
                (a, b) =>
                    new Date(b.data) -
                    new Date(a.data)
            );


    if (entradas.length === 0) {

        relatorioListaEntradas.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                        text-align: center;
                        color: #9ca3af;
                    "
                >
                    Nenhuma entrada registrada neste mês.
                </td>
            </tr>
        `;

    } else {

        entradas.forEach(
            lancamento => {

                const linha =
                    document.createElement(
                        "tr"
                    );

                linha.innerHTML = `
                    <td>
                        ${formatarDataRelatorio(
                            lancamento.data
                        )}
                    </td>

                    <td>
                        ${lancamento.descricao}
                    </td>

                    <td>
                        ${lancamento.categoria || "Outros"}
                    </td>

                    <td>
                        ${formatarMoeda(
                            lancamento.valor
                        )}
                    </td>
                `;

                relatorioListaEntradas
                    .appendChild(linha);

            }
        );

    }


    if (saidas.length === 0) {

        relatorioListaSaidas.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                        text-align: center;
                        color: #9ca3af;
                    "
                >
                    Nenhuma saída registrada neste mês.
                </td>
            </tr>
        `;

    } else {

        saidas.forEach(
            lancamento => {

                const linha =
                    document.createElement(
                        "tr"
                    );

                linha.innerHTML = `
                    <td>
                        ${formatarDataRelatorio(
                            lancamento.data
                        )}
                    </td>

                    <td>
                        ${lancamento.descricao}
                    </td>

                    <td>
                        ${lancamento.categoria || "Outros"}
                    </td>

                    <td>
                        ${formatarMoeda(
                            lancamento.valor
                        )}
                    </td>
                `;

                relatorioListaSaidas
                    .appendChild(linha);

            }
        );

    }

}


// ========================================
// GRÁFICO FINANCEIRO DO RELATÓRIO
// ========================================

function criarGraficoRelatorioFinanceiro(
    lancamentosMes
) {

    if (
        !canvasRelatorioFinanceiro ||
        typeof Chart === "undefined"
    ) {

        return;

    }


    const valoresPorDia = {};


    lancamentosMes.forEach(
        lancamento => {

            const data =
                lancamento.data;


            if (!valoresPorDia[data]) {

                valoresPorDia[data] = {
                    entradas: 0,
                    saidas: 0
                };

            }


            if (
                lancamento.tipo ===
                "entrada"
            ) {

                valoresPorDia[data]
                    .entradas +=
                    Number(
                        lancamento.valor
                    );

            }


            if (
                lancamento.tipo ===
                "saida"
            ) {

                valoresPorDia[data]
                    .saidas +=
                    Number(
                        lancamento.valor
                    );

            }

        }
    );


    const datas =
        Object.keys(
            valoresPorDia
        ).sort();


    const labels =
        datas.map(
            data => {

                const partes =
                    data.split("-");

                return (
                    partes[2] +
                    "/" +
                    partes[1]
                );

            }
        );


    const entradas =
        datas.map(
            data =>
                valoresPorDia[data]
                    .entradas
        );


    const saidas =
        datas.map(
            data =>
                valoresPorDia[data]
                    .saidas
        );


    if (graficoRelatorioFinanceiro) {

        graficoRelatorioFinanceiro
            .destroy();

    }


    graficoRelatorioFinanceiro =
        new Chart(
            canvasRelatorioFinanceiro,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {
                            label: "Entradas",
                            data: entradas,
                            borderColor: "#22c55e",
                            backgroundColor:
                                "rgba(34, 197, 94, 0.15)",
                            tension: 0.3
                        },

                        {
                            label: "Saídas",
                            data: saidas,
                            borderColor: "#ef4444",
                            backgroundColor:
                                "rgba(239, 68, 68, 0.15)",
                            tension: 0.3
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            labels: {
                                color: "#d1d5db"
                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {
                                color: "#9ca3af"
                            },

                            grid: {
                                color: "#374151"
                            }

                        },

                        x: {

                            ticks: {
                                color: "#d1d5db"
                            },

                            grid: {
                                display: false
                            }

                        }

                    }

                }

            }
        );

}


// ========================================
// GRÁFICO DE CATEGORIAS DO RELATÓRIO
// ========================================

function criarGraficoRelatorioCategorias(
    lancamentosMes
) {

    if (
        !canvasRelatorioCategorias ||
        typeof Chart === "undefined"
    ) {

        return;

    }


    const gastos = {};


    lancamentosMes.forEach(
        lancamento => {

            if (
                lancamento.tipo !==
                "saida"
            ) {

                return;

            }


            const categoria =
                lancamento.categoria ||
                "Outros";


            if (!gastos[categoria]) {

                gastos[categoria] = 0;

            }


            gastos[categoria] +=
                Number(
                    lancamento.valor
                );

        }
    );


    let categorias =
        Object.keys(gastos);

    let valores =
        categorias.map(
            categoria =>
                gastos[categoria]
        );


    let cores = [

        "#ef4444",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#06b6d4",
        "#3b82f6",
        "#8b5cf6",
        "#ec4899"

    ];


    if (graficoRelatorioCategorias) {

        graficoRelatorioCategorias
            .destroy();

    }


    if (categorias.length === 0) {

        categorias = [
            "Nenhuma saída registrada"
        ];

        valores = [1];

        cores = ["#374151"];

    }


    graficoRelatorioCategorias =
        new Chart(
            canvasRelatorioCategorias,
            {

                type: "doughnut",

                data: {

                    labels: categorias,

                    datasets: [

                        {

                            data: valores,

                            backgroundColor:
                                categorias.map(
                                    (_, indice) =>
                                        cores[
                                            indice %
                                            cores.length
                                        ]
                                ),

                            borderColor:
                                "#111827",

                            borderWidth: 2

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    cutout: "65%",

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {
                                color: "#d1d5db"
                            }

                        }

                    }

                }

            }
        );

}


// ========================================
// EVENTOS DOS RELATÓRIOS
// ========================================

if (btnVoltarSistema) {

    btnVoltarSistema.addEventListener(
        "click",
        voltarParaSistema
    );

}


if (btnVoltarMeses) {

    btnVoltarMeses.addEventListener(
        "click",
        voltarParaMeses
    );

}


botoesMeses.forEach(
    botao => {

        botao.addEventListener(
            "click",
            function () {

                const mes =
                    Number(
                        this.dataset.mes
                    );

                abrirRelatorioMes(
                    mes
                );

            }
        );

    }
);