document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const cnpj = params.get("cnpj");
  const usuario = params.get("usuario");

  // Segurança — impede acesso direto
  if (!cnpj || !usuario) {
    window.location.href = "index.html";
    return;
  }

  // Exibição da empresa
  document.getElementById("nomeEmpresa").textContent =
    `Ambiente Empresarial — ${usuario}`;

  document.getElementById("cnpjEmpresa").textContent =
    `CNPJ: ${cnpj}`;

  // Normaliza CNPJ (remove máscara)
  const limpar = v => v.replace(/\D/g, "");

  // Mapeamento de logos por empresa
  const logoMap = {
    "45564318000133": "./assets/img/akxon_logo.png",
    "12345678000199": "./assets/img/empresa2_logo.png"
  };

  const logo = logoMap[limpar(cnpj)] ?? "./assets/img/akxon_logo.png";

  document.getElementById("logoEmpresa").src = logo;

  // Logout
  window.voltarLogin = () => window.location.href = "index.html";
});
