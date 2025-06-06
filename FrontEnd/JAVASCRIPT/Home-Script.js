const calendarDays = document.getElementById('calendarDays');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

const modal = document.getElementById('eventModal');
const closeModal = document.querySelector('.close');
const eventForm = document.getElementById('eventForm');
const eventDateInput = document.getElementById('eventDate');
const eventNameInput = document.getElementById('eventName');
const eventDescriptionInput = document.getElementById('eventDescription');
const eventLocationInput = document.getElementById('eventLocation');

let currentDate = new Date();

console.log(window.sessionStorage.getItem('user'))

function renderCalendar(date) {
  calendarDays.innerHTML = '';
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  monthYear.textContent = `${monthNames[month]} ${year}`;


  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    calendarDays.appendChild(empty);
  }

  for (let day = 1; day <= lastDay; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.textContent = day;

    dayDiv.addEventListener('click', () => {
      const fullDate = new Date(year, month, day);
      openEventModal(fullDate);
    });

    calendarDays.appendChild(dayDiv);
  }
}

function openEventModal(date) {
  const formatted = date.toISOString().split('T')[0];
  eventDateInput.value = formatted;
  eventNameInput.value = '';
  eventDescriptionInput.value = '';
  eventLocationInput.value = '';
  modal.style.display = 'block';
}


closeModal.onclick = () => {
  modal.style.display = 'none';
};


window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};


eventForm.onsubmit = function (e) {
  e.preventDefault();

  const data = eventDateInput.value;
  const nome = eventNameInput.value;
  const descricao = eventDescriptionInput.value;
  const local = eventLocationInput.value;
  const user = JSON.parse(window.sessionStorage.getItem('user'))


  axios.post('http://localhost:3000/new-event',{
      title: nome,
      description: descricao,
      date: data,
      user: user,
      location: local
  })
    .then(response => {
      console.log('Evento cadastrado:', response.data);
    })
    .catch(error => {
      console.error('Erro ao cadastrar o evento:', error);
    });
  modal.style.display = 'none';
};

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);
