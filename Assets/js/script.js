document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       LOGIN
    ====================================================== */
    const formLogin = document.getElementById("loginForm");

    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const cnpj = document.getElementById("cnpjLogin").value.trim();
            const usuario = document.getElementById("usuario").value.trim();
            const senha = document.getElementById("senha").value.trim();

            if (!cnpj || !usuario || !senha) {
                alert("Preencha todos os campos.");
                return;
            }

            window.location.href =
                `empresa.html?cnpj=${encodeURIComponent(cnpj)}&usuario=${encodeURIComponent(usuario)}`;
        });
    }

    /* ======================================================
       POP-PAP — ELEMENTOS
    ====================================================== */
    const btnCriarEmpresa = document.getElementById("btnCriarEmpresa");
    const modal1 = document.getElementById("modalOnboarding");
    const modal2 = document.getElementById("modalStep2");
    const modal3 = document.getElementById("modalStep3");
    const modal4 = document.getElementById("modalStep4");
    const modalSuccess = document.getElementById("modalSuccess");

    // Campos da etapa 2
    const campoRazao = document.getElementById("razaoSocial");
    const campoFantasia = document.getElementById("nomeFantasia");
    const campoCnae = document.getElementById("cnae");
    const campoSituacao = document.getElementById("situacao");
    const campoEndereco = document.getElementById("endereco");

    /* ======================================================
       ABRIR ONBOARDING
    ====================================================== */
    btnCriarEmpresa?.addEventListener("click", (e) => {
        e.preventDefault();
        modal1.classList.remove("hidden");
    });

    /* ======================================================
       ETAPA 1 → ETAPA 2 (CONSULTA DE CNPJ)
    ====================================================== */
    document.getElementById("formStep1")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const cnpj = document.getElementById("cnpjStep1").value.trim();

        if (!cnpj) {
            alert("Informe o CNPJ.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/cnpj/${cnpj}`);
            const resultado = await response.json();

            if (!resultado.ok) {
                alert("Não foi possível consultar o CNPJ.");
                return;
            }

            // Preenche automaticamente os campos
            campoRazao.value = resultado.data.razaoSocial || "";
            campoFantasia.value = resultado.data.nomeFantasia || "";
            campoCnae.value = resultado.data.cnae || "";
            campoSituacao.value = resultado.data.situacao || "";
            campoEndereco.value = resultado.data.endereco || "";

            // Avança para etapa 2
            modal1.classList.add("hidden");
            modal2.classList.remove("hidden");

        } catch (err) {
            console.error("Erro ao consultar backend:", err);
            alert("Erro de comunicação com o servidor.");
        }
    });

    document.getElementById("closeModalStep1")?.addEventListener("click", () => {
        modal1.classList.add("hidden");
    });

    /* ======================================================
       ETAPA 2 → ETAPA 1 (VOLTA)
    ====================================================== */
    document.getElementById("backToStep1")?.addEventListener("click", () => {
        modal2.classList.add("hidden");
        modal1.classList.remove("hidden");
    });

    /* ======================================================
       ETAPA 2 → ETAPA 3
    ====================================================== */
    document.getElementById("formStep2")?.addEventListener("submit", (e) => {
        e.preventDefault();
        modal2.classList.add("hidden");
        modal3.classList.remove("hidden");
    });

    /* ======================================================
       ETAPA 3 → ETAPA 4
    ====================================================== */
    document.getElementById("btnAssinar")?.addEventListener("click", () => {
        if (!document.getElementById("aceiteContrato").checked) return;

        modal3.classList.add("hidden");
        modal4.classList.remove("hidden");
    });

    document.getElementById("backToStep2")?.addEventListener("click", () => {
        modal3.classList.add("hidden");
        modal2.classList.remove("hidden");
    });

    /* ======================================================
       ETAPA 4 → FINAL
    ====================================================== */
    document.getElementById("formStep4")?.addEventListener("submit", (e) => {
        e.preventDefault();
        modal4.classList.add("hidden");
        modalSuccess.classList.remove("hidden");
    });

    /* ======================================================
       FINALIZAÇÃO → ACESSAR PLATAFORMA
    ====================================================== */
    document.getElementById("acessarPlataforma")?.addEventListener("click", () => {
        window.location.href = "./dashboard.html";
    });

});
