/* ========== ABAS ========== */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

/* ========== TOASTS CORPORATIVOS ========== */
function toast(msg, tipo = "success") {
  const container = document.getElementById("toast-container");
  const t = document.createElement("div");
  t.className = `toast toast-${tipo}`;
  t.innerText = msg;
  container.appendChild(t);

  setTimeout(() => t.remove(), 4500);
}

/* ========== LOADING ========== */
function loading(show = true) {
  document.getElementById("loader").classList[show ? "remove" : "add"]("hidden");
}

/* ========== MÁSCARAS ========== */
function aplicarMascara(input, mascara) {
  input.addEventListener("input", e => {
    e.target.value = mascara(e.target.value);
  });
}

const mascaraCNPJ = v =>
  v.replace(/\D/g, "")
   .replace(/(\d{2})(\d)/, "$1.$2")
   .replace(/(\d{3})(\d)/, "$1.$2")
   .replace(/(\d{3})(\d)/, "$1/$2")
   .replace(/(\d{4})(\d)/, "$1-$2")
   .replace(/(-\d{2})\d+?$/, "$1");

const mascaraCPF = v =>
  v.replace(/\D/g, "")
   .replace(/(\d{3})(\d)/, "$1.$2")
   .replace(/(\d{3})(\d)/, "$1.$2")
   .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const mascaraCEP = v =>
  v.replace(/\D/g, "")
   .replace(/(\d{5})(\d)/, "$1-$2")
   .replace(/(-\d{3})\d+?$/, "$1");

const mascaraTelefone = v =>
  v.replace(/\D/g, "")
   .replace(/(\d{2})(\d)/, "($1) $2")
   .replace(/(\d{5})(\d)/, "$1-$2")
   .replace(/(-\d{4})\d+?$/, "$1");

/* ========== VALIDAÇÃO CPF ========== */
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += cpf[i] * (10 - i);
  let d1 = (soma * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== Number(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += cpf[i] * (11 - i);
  let d2 = (soma * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === Number(cpf[10]);
}

/* ========== VALIDAÇÃO CNPJ ========== */
function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, "");
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0, pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let r = (soma % 11 < 2) ? 0 : 11 - soma % 11;
  if (r !== Number(digitos[0])) return false;

  tamanho++;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  r = (soma % 11 < 2) ? 0 : 11 - soma % 11;
  return r === Number(digitos[1]);
}

/* ========== CONSULTA CNPJ — BRASILAPI ========== */
async function consultarCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, "");
  if (!validarCNPJ(cnpj)) return toast("CNPJ inválido", "error");

  loading(true);

  try {
    const resp = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    const data = await resp.json();

    document.getElementById("razao_social").value = data.razao_social ?? "";
    document.getElementById("nome_fantasia").value = data.nome_fantasia ?? "";

    document.getElementById("cep").value = data.cep ?? "";
    document.getElementById("logradouro").value = data.logradouro ?? "";
    document.getElementById("cidade").value = data.municipio ?? "";
    document.getElementById("estado").value = data.uf ?? "";

    document.getElementById("head-razao").innerHTML = `<strong>Razão Social:</strong> ${data.razao_social}`;
    document.getElementById("head-cnpj").innerHTML = `<strong>CNPJ:</strong> ${data.cnpj}`;

    toast("CNPJ consultado com sucesso ✅");

  } catch {
    toast("Falha ao consultar CNPJ", "error");
  }

  loading(false);
}

/* ========== CONSULTA CEP — VIACEP ========== */
async function consultarCEP(cep) {
  cep = cep.replace(/\D/g, "");
  if (cep.length !== 8) return;

  loading(true);

  try {
    const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await resp.json();

    if (data.erro) return toast("CEP não encontrado", "alert");

    document.getElementById("logradouro").value = data.logradouro ?? "";
    document.getElementById("cidade").value = data.localidade ?? "";
    document.getElementById("estado").value = data.uf ?? "";

    toast("Endereço localizado ✅");

  } catch {
    toast("Erro ao consultar CEP", "error");
  }

  loading(false);
}

/* ========== APLICAÇÃO DE MÁSCARAS ========== */
aplicarMascara(document.getElementById("cnpj"), mascaraCNPJ);
aplicarMascara(document.getElementById("cpf"), mascaraCPF);
aplicarMascara(document.getElementById("telefone"), mascaraTelefone);
aplicarMascara(document.getElementById("cep"), mascaraCEP);

/* ========== EVENTOS AUTOMÁTICOS ========== */
document.getElementById("cnpj").addEventListener("blur", e => consultarCNPJ(e.target.value));
document.getElementById("cep").addEventListener("blur", e => consultarCEP(e.target.value));

document.getElementById("cpf").addEventListener("blur", e => {
  if (!validarCPF(e.target.value)) toast("CPF inválido", "error");
});
