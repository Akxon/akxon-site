const api = "http://localhost:3000";

let pessoaId = null;
let assinaturaId = null;

document.getElementById("btnOnboarding").onclick = async () => {
    const cnpj = document.getElementById("cnpjInput").value.replace(/\D/g, "");
    if (cnpj.length !== 14) {
        alert("CNPJ inválido");
        return;
    }

    const status = document.getElementById("statusOnboarding");
    status.innerText = "Consultando órgãos oficiais...";

    const res = await fetch(`${api}/integracoes/onboarding/${cnpj}`);
    const data = await res.json();

    document.getElementById("dadosEmpresa").classList.remove("hidden");
    document.getElementById("acoesContrato").classList.remove("hidden");

    document.getElementById("rfRazao").innerText = data.receita.razaoSocial;
    document.getElementById("rfFantasia").innerText = data.receita.nomeFantasia;
    document.getElementById("rfSituacao").innerText = data.receita.situacaoCadastral;
    document.getElementById("rfCnae").innerText = data.receita.cnaePrincipal;
    document.getElementById("rfEndereco").innerText =
        `${data.receita.endereco.logradouro} - ${data.receita.endereco.uf}`;

    pessoaId = data.pessoa.id;

    document.getElementById("psId").innerText = pessoaId;
    document.getElementById("psGrupo").innerText = data.pessoa.grupoPessoa;
    document.getElementById("psSituacao").innerText = data.pessoa.situacao;
    document.getElementById("psStatusRel").innerText = data.pessoa.statusRelacionamento;

    status.innerText = "Dados carregados com sucesso";
};

document.getElementById("btnGerarContrato").onclick = async () => {
    const status = document.getElementById("statusContrato");
    status.innerText = "Gerando contrato...";

    const res = await fetch(`${api}/assinaturas/gerar-contrato/${pessoaId}`);
    const data = await res.json();

    assinaturaId = data.assinaturaId;
    status.innerText = "Contrato gerado com sucesso";
};

document.getElementById("btnDownloadPdf").onclick = () => {
    window.open(`${api}/assinaturas/download/${assinaturaId}`);
};

document.getElementById("btnAceiteSimples").onclick = () => {
    document.getElementById("statusAssinatura").innerText =
        "✔ Aceite registrado com sucesso";
};
