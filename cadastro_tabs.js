const tabs = document.querySelectorAll(".cadastro-tab");
const contents = document.querySelectorAll(".cadastro-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(target).classList.add("active");
    });
});

document.querySelectorAll(".proximo").forEach(btn => {
    btn.addEventListener("click", () => {
        const next = btn.dataset.next;

        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        document.querySelector(`[data-tab="${next}"]`).classList.add("active");
        document.getElementById(next).classList.add("active");
    });
});

document.querySelectorAll("[data-prev]").forEach(btn => {
    btn.addEventListener("click", () => {
        const prev = btn.dataset.prev;

        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        document.querySelector(`[data-tab="${prev}"]`).classList.add("active");
        document.getElementById(prev).classList.add("active");
    });
});
