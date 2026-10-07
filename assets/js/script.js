// URL вебхука n8n (Production). Токенов и секретов здесь нет и быть не должно.
var LEAD_WEBHOOK_URL = 'https://n8n.ezi.ru/webhook/hqzap-lead';

var leadForm = document.getElementById('lead-form');

// Плашка «Запросить прайс-лист»: ведёт к форме и ставит галочку
document.querySelectorAll('[data-price-request]').forEach(function (link) {
  link.addEventListener('click', function () {
    var price = document.getElementById('f-price');
    if (price) price.checked = true;
  });
});

if (leadForm) {
  var statusEl = leadForm.querySelector('.form-status');
  var submitBtn = leadForm.querySelector('button[type="submit"]');

  function setStatus(text, isError) {
    statusEl.textContent = text;
    statusEl.classList.toggle('is-error', !!isError);
  }

  leadForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Встроенная проверка браузера: обязательные поля, формат почты, согласие
    if (!leadForm.reportValidity()) return;

    var f = leadForm.elements;

    // Honeypot заполнен — это бот: делаем вид, что всё ок, ничего не отправляем
    if (f.website.value) {
      leadForm.reset();
      setStatus('Спасибо! Заявка отправлена.');
      return;
    }

    var payload = {
      name: f.name.value.trim(),
      phone: f.phone.value.trim(),
      email: f.email.value.trim(),
      question: f.question.value.trim(),
      price_list: f.price_list.checked,
      consent: f.consent.checked,
      page: location.href
    };

    submitBtn.disabled = true;
    setStatus('Отправляем…');

    fetch(LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        leadForm.reset();
        setStatus('Спасибо! Заявка отправлена, мы свяжемся с вами в ближайшее время.');
      })
      .catch(function () {
        setStatus('Не удалось отправить заявку. Позвоните нам: +7 963 710-70-10.', true);
      })
      .then(function () {
        submitBtn.disabled = false;
      });
  });
}
