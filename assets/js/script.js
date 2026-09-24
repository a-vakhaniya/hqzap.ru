var contactForm = document.querySelector('#contact form');
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    alert('Демо-форма: в рабочей версии заявка уйдёт в Telegram-бот и таблицу.');
  });
}
