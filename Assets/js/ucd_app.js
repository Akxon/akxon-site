console.log('UCD Frontend iniciado');

document.querySelector('.ucd-login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    window.location.href = 'dashboard.html';
});
