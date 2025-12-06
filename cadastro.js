// cadastro.js
// Controle de abas, máscaras e envio para o backend

document.addEventListener("DOMContentLoaded", () => {
    inicializarAbas();
    inicializarMascaras();
    inicializarCepAuto();
    inicializarNavegacaoPassos();
    inicializarSubmit();
});

// ----------------- ABAS -----------------
function inicializarAbas() {
    const tabs = document.querySelectorAll(".cadastro-tab");
    const panels = {
        identificacao: document.getElementById("tab-identificacao"),
        pessoaJuridica: document.getElementById("tab-pessoaJuridica"),
        pessoaFisica: document.getElementById("tab-pessoaFisica"),
        endereco: document.getElementById("tab-endereco"),
        contatos: document.getElementById("tab-contatos"),
    };

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const alvo = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove("active"));
            Object.values(panels).forEach(p => p.classList.remove("active"));

            tab.classList.add("active");
            panels[alvo].classList.add("active");
        });
    });
}

// ----------------- MÁSCARAS -----------------
function inicializarMascaras() {
    if (!window.Inputmask) return;

    const documento = document.getElementById("documento");
    const tipoPessoa = document.getElementById("tipoPessoa");
    const dataConstituicao = document.getElementById("dataConstituicao");
    const dataNascimento = document.getElementById("dataNascimento");
    const contratoSocial = document.getElementById("contratoSocial");
    const telefone = document.getElementById("telefone");
    const cepPrincipal = document.getElementById("cepPrincipal");
    const cepCobranca = document.getElementById("cepCobranca");

    const im = window.Inputmask;

    // Função para aplicar máscara dinâmica no documento
    const aplicarMascaraDocumento = () => {
        if (!documento) return;
        im.remove(documento);

        if (tipoPessoa.value === "pj") {
            im("99.999.999/9999-99").mask(documento); // CNPJ
        } else {
            im("999.999.999-99").mask(documento); // CPF
        }
    };

    if (tipoPessoa && documento) {
        aplicarMascaraDocumento();
        tipoPessoa.addEventListener("change", aplicarMascaraDocumento);
    }

    if (dataConstituicao) {
        im("99/99/9999").mask(dataConstituicao);
    }
    if (dataNascimento) {
        im("99/99/9999").mask(dataNascimento);
    }
    if (contratoSocial) {
        // ############/##
        im("999999999999/99").mask(contratoSocial);
    }
    if (telefone) {
        im("(99) 99999-9999").mask(telefone);
    }
    if (cepPrincipal) {
        im("99999-999").mask(cepPrincipal);
    }
    if (cepCobranca) {
        im("99999-999").mask(cepCobranca);
    }
}

// ----------------- CEP AUTOMÁTICO (ViaCEP) -----------------
function inicializarCepAuto() {
    const mapeamentos = [
        {
            cep: "cepPrincipal",
            logradouro: "logradouroPrincipal",
            bairro: "bairroPrincipal",
            cidade: "cidadePrincipal",
            uf: "ufPrincipal",
        },
        {
            cep: "cepCobranca",
            logradouro: "logradouroCobranca",
            bairro: "bairroCobranca",
            cidade: "cidadeCobranca",
            uf: "ufCobranca",
        },
    ];

    mapeamentos.forEach(map => {
        const cepInput = document.getElementById(map.cep);
        if (!cepInput) return;

        cepInput.addEventListener("blur", async () => {
            const cepLimpo = cepInput.value.replace(/\D/g, "");
            if (cepLimpo.length !== 8) return;

            try {
                const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                const dados = await resp.json();

                if (dados.erro) return;

                const logradouro = document.getElementById(map.logradouro);
                const bairro = document.getElementById(map.bairro);
                const cidade = document.getElementById(map.cidade);
                const uf = document.getElementById(map.uf);

                if (logradouro && !logradouro.value) logradouro.value = dados.logradouro || "";
                if (bairro && !bairro.value) bairro.value = dados.bairro || "";
                if (cidade && !cidade.value) cidade.value = dados.localidade || "";
                if (uf && !uf.value) uf.value = dados.uf || "";
            } catch (e) {
                console.error("Erro ao buscar CEP:", e);
            }
        });
    });
}

// ----------------- BOTÕES PRÓXIMO / ANTERIOR -----------------
function inicializarNavegacaoPassos() {
    const ordem = [
        "identificacao",
        "pessoaJuridica",
        "pessoaFisica",
        "endereco",
        "contatos",
    ];
    const btnProximo = document.getElementById("btnProximo");
    const btnAnterior = document.getElementById("btnAnterior");

    const getIndexAtual = () => {
        const atual = document.querySelector(".cadastro-tab.active");
        return ordem.indexOf(atual.dataset.tab);
    };

    const irPara = (indice) => {
        if (indice < 0 || indice >= ordem.length) return;
        const alvo = ordem[indice];
        const tab = document.querySelector(`.cadastro-tab[data-tab="${alvo}"]`);
        if (tab) tab.click();
    };

    if (btnProximo) {
        btnProximo.addEventListener("click", () => {
            const idx = getIndexAtual();
            irPara(idx + 1);
        });
    }

    if (btnAnterior) {
        btnAnterior.addEventListener("click", () => {
            const idx = getIndexAtual();
            irPara(idx - 1);
        });
    }
}

// ----------------- SUBMIT PARA O BACKEND -----------------
function inicializarSubmit() {
    const form = document.getElementById("formEmpresa");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dados = coletarDadosFormulario(form);

        try {
            const resp = await fetch("http://localhost:3000/empresas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });

            if (!resp.ok) {
                const erro = await resp.json().catch(() => null);
                alert(erro?.mensagem || "Erro ao salvar empresa.");
                return;
            }

            const json = await resp.json().catch(() => ({}));
            alert(json.mensagem || "Empresa cadastrada com sucesso.");

            form.reset();
            // volta para a primeira aba
            document.querySelector('.cadastro-tab[data-tab="identificacao"]').click();
        } catch (err) {
            console.error(err);
            alert("Falha de comunicação com o servidor (backend).");
        }
    });
}

// Monta objeto estruturado para enviar ao backend
function coletarDadosFormulario(form) {
    const getVal = (nome) => form.elements[nome]?.value || "";

    return {
        tipoPessoa: getVal("tipoPessoa"),
        documento: getVal("documento"),
        grupoPessoas: getVal("grupoPessoas"),
        situacao: getVal("situacao"),
        razaoSocial: getVal("razaoSocial"),
        nomeFantasia: getVal("nomeFantasia"),
        holding: getVal("holding"),

        pessoaJuridica: {
            naturezaJuridica: getVal("naturezaJuridica"),
            cnae: getVal("cnae"),
            dataConstituicao: getVal("dataConstituicao"),
            regimeTributario: getVal("regimeTributario"),
            inscricaoEstadual: getVal("inscricaoEstadual"),
            inscricaoMunicipal: getVal("inscricaoMunicipal"),
            suframa: getVal("suframa"),
            contratoSocial: getVal("contratoSocial"),
            gln: getVal("gln"),
            tipoEmpresa: getVal("tipoEmpresa"),
            segmento: getVal("segmento"),
        },

        pessoaFisica: {
            dataNascimento: getVal("dataNascimento"),
            naturalidade: getVal("naturalidade"),
            nacionalidade: getVal("nacionalidade"),
            sexo: getVal("sexo"),
            rg: getVal("rg"),
            carteiraProf: getVal("carteiraProf"),
            pis: getVal("pis"),
            nit: getVal("nit"),
            cnh: getVal("cnh"),
            certidao: getVal("certidao"),
            tituloEleitor: getVal("tituloEleitor"),
            reservista: getVal("reservista"),
            estadoCivil: getVal("estadoCivil"),
            nomePai: getVal("nomePai"),
            nomeMae: getVal("nomeMae"),
        },

        enderecos: {
            principal: {
                cep: getVal("cep"),
                tipoLogradouro: getVal("tipoLogradouro"),
                endereco: getVal("endereco"),
                numero: getVal("numero"),
                complemento: getVal("complemento"),
                bairro: getVal("bairro"),
                cidade: getVal("cidade"),
                estado: getVal("estado"),
            },
            cobranca: {
                cep: getVal("cepCobranca"),
                tipoLogradouro: getVal("tipoLogradouroCobranca"),
                endereco: getVal("enderecoCobranca"),
                numero: getVal("numeroCobranca"),
                complemento: getVal("complementoCobranca"),
                bairro: getVal("bairroCobranca"),
                cidade: getVal("cidadeCobranca"),
                estado: getVal("estadoCobranca"),
            },
        },

        contatos: {
            contatoPrincipal: getVal("contatoPrincipal"),
            telefone: getVal("telefone"),
            email: getVal("email"),
            site: getVal("site"),
            operacaoFinanceira: getVal("operacaoFinanceira"),
            contaContabil: getVal("contaContabil"),
        },
    };
}
