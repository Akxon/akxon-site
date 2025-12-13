/* =============================================================================
   UCD APP — Controle do POP-PAP (Etapas 1 → 4)
   Caminho: /Assets/js/ucd_app.js
============================================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const modal1 = document.getElementById("modalOnboarding");
    const modal2 = document.getElementById("modalStep2");
    const modal3 = document.getElementById("modalStep3");
    const modal4 = document.getElementById("modalStep4");
    const modalSuccess = document.getElementById("modalSuccess");

    const btnCriarEmpresa = document.getElementById("btnCriarEmpresa");

    /* -------------------------------------------------------------------------
       ABRIR ETAPA 1
    ------------------------------------------------------------------------- */
    btnCriarEmpresa.addEventListener("click", () => {
        modal1.classList.remove("hidden");
    });

    /* -------------------------------------------------------------------------
       ETAPA 1 → CONSULTA CNPJ
    ------------------------------------------------------------------------- */
    document.getElementById("formStep1").addEventListener("submit", async (e) => {
        e.preventDefault();

        const cnpj = document.getElementById("cnpjStep1").value.trim();

        const resp = await fetch(`http://localhost:3000/integracoes/onboarding/${cnpj}`);
        const data = await resp.json();

        if (!data.sucesso) {
            alert("Não foi possível consultar CNPJ.");
            return;
        }

        const r = data.receita;

        document.getElementById("razaoSocial").value = r.razaoSocial || "";
        document.getElementById("nomeFantasia").value = r.nomeFantasia || "";
        document.getElementById("cnae").value = r.cnaePrincipal || "";
        document.getElementById("situacao").value = r.situacaoCadastral || "";
        document.getElementById("endereco").value = r.endereco || "";

        modal1.classList.add("hidden");
        modal2.classList.remove("hidden");
    });

    /* -------------------------------------------------------------------------
       ETAPA 2 → GERAR CONTRATO
    ------------------------------------------------------------------------- */
    document.getElementById("formStep2").addEventListener("submit", async (e) => {
        e.preventDefault();

        const cnpj = document.getElementById("cnpjStep1").value.trim();
        const responsavel = document.getElementById("responsavel").value.trim();

        const resp = await fetch(
            `http://localhost:3000/api/contrato?cnpj=${cnpj}&responsavel=${responsavel}`
        );

        const data = await resp.json();

        if (!data.ok) {
            alert("Erro ao gerar contrato.");
            return;
        }

        document.getElementById("contratoPDF").src = "data:text/html;base64," + btoa(data.html);

        modal2.classList.add("hidden");
        modal3.classList.remove("hidden");
    });

    /* -------------------------------------------------------------------------
       ETAPA 3 → ACEITE
    ------------------------------------------------------------------------- */
    document.getElementById("btnAssinar").addEventListener("click", () => {
        modal3.classList.add("hidden");
        modal4.classList.remove("hidden");
    });

    /* -------------------------------------------------------------------------
       ETAPA 4 → VERIFICAR CÓDIGO E FINALIZAR
    ------------------------------------------------------------------------- */
    document.getElementById("formStep4").addEventListener("submit", (e) => {
        e.preventDefault();

        modal4.classList.add("hidden");
        modalSuccess.classList.remove("hidden");
    });

    /* FINALIZAR */
    document.getElementById("acessarPlataforma")?.addEventListener("click", () => {
        window.location.href = "portal_ucd.html";
    });

});
