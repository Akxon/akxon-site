document.addEventListener("DOMContentLoaded", () => {
    const navbarTarget = document.getElementById("navbar");

    if (navbarTarget) {
        fetch("./Assets/components/navbar.html")
            .then(r => r.text())
            .then(html => navbarTarget.innerHTML = html);
    }
});
