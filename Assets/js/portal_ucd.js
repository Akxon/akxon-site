// ============================================================
// PORTAL UCD – SCRIPT PRINCIPAL
// ============================================================

// Controle do formulário de login
document.addEventListener("DOMContentLoaded", () => {
    
    const formLogin = document.getElementById("loginForm");

    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();

            const cnpj = document.getElementById("cnpjLogin").value.trim();
            const usuario = document.getElementById("usuario").value.trim();
            const senha = document.getElementById("senha").value.trim();

            if (!cnpj || !usuario || !senha) {
                alert("Preencha todos os campos para acessar.");
                return;
            }

            alert("🔐 Validação em desenvolvimento — fluxo de login será implementado.");
        });
    }

    // =============================================
    // LINK "CRIAR AGORA" – DEIXAR NAVEGAR LIVREMENTE
    // =============================================
    // Antes havia aqui um preventDefault que bloqueava a navegação.
    // Agora o link funciona normalmente e abre contratar_ucd.html.
});


// ===================================================================
// ABAIXO ESTÃO AS FUNÇÕES UTILITÁRIAS QUE JÁ EXISTIAM NO SEU SCRIPT
// Mantidas integralmente, pois fazem parte do fluxo de assinatura
// ===================================================================


// Exibe modal de loading
function criarModalLoading() {
    const div = document.createElement("div");
    div.className = "ucd-modal-overlay";
    div.innerHTML = `
        <div class="ucd-modal-card">
            <h2>Processando...</h2>
            <p>Aguarde enquanto consultamos as bases oficiais.</p>
        </div>
    `;
    document.body.appendChild(div);
    return div;
}

// Fecha modal
function fecharModal(modal) {
    if (modal) modal.remove();
}


// ============================================================
// FINALIZAÇÃO DA ASSINATURA — MOSTRAR MENSAGEM FINAL
// ============================================================
async function concluirAssinatura(cnpj, responsavel, codigo, modal) {
    try {
        if (!codigo) {
            alert("Código inválido ou erro na assinatura.");
            return;
        }

        modal.innerHTML = `
            <div class="ucd-modal-card">
                <h2>Empresa ativada com sucesso!</h2>
                <p>O acesso administrativo foi liberado.</p>
                <button id="btnFecharSucesso" class="ucd-btn-primary">Fechar</button>
            </div>
        `;

        document.getElementById("btnFecharSucesso").onclick = () => modal.remove();

    } catch (erro) {
        alert("Erro ao concluir assinatura.");
        console.error(erro);
    }
}



// ============================================================
// FUNÇÃO UTILITÁRIA: CRIAR OVERLAY DE MODAL
// ============================================================
function criarModal() {
    const div = document.createElement("div");
    div.className = "ucd-modal-overlay";
    document.body.appendChild(div);
    return div;
}
