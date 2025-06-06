const calendarDays = document.getElementById('calendarDays');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

const modal = document.getElementById('eventModal');
const closeModal = document.querySelector('.close');
const eventForm = document.getElementById('eventForm');
const user = JSON.parse(window.sessionStorage.getItem('user'))

let currentDate = new Date();



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
  document.getElementById('eventDate').value = formatted;
  document.getElementById('eventName').value = '';
  document.getElementById('eventDescription').value = '';
  document.getElementById('eventLocation').value = '';
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

  const data = document.getElementById('eventDate').value;
  const nome = document.getElementById('eventName').value;
  const descricao = document.getElementById('eventDescription').value;
  const local = document.getElementById('eventLocation').value;



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

document.getElementById('eventosCadastrados').addEventListener('click', function(e) {
  e.preventDefault();
  getEvents()
});

function getEvents(){
      axios.get(`http://localhost:3000/user/events`,{
        params: { userId: user._id }
      })
      .then(response => {
        console.log('Eventos listados:', response.data);
        openEventListModal(response.data);
      })
      .catch(error => {
        console.error('Erro ao listar eventos o usuário:', error);
      });
}

function openEventListModal(events) {
  const modal = document.getElementById("eventListModal");
  const container = document.getElementById("eventListContainer");
  document.getElementById("contentTitle").innerHTML = "Eventos cadastrados";
  container.innerHTML = "";

  events.forEach(evento => {
    const div = document.createElement("div");
    div.className = "event-item";
    div.innerHTML = `
      <span><strong>${evento.title}</strong> - ${evento.date.split('T')[0]} - ${evento.location}</span>
      <div class="event-actions">
        <button class="delete-btn" onclick="deleteEvent('${evento._id}')">Excluir</button>
      </div>
    `;
    container.appendChild(div);
  });

  modal.style.display = "flex";
}

function closeEventListModal() {
  document.getElementById("eventListModal").style.display = "none";
}

function deleteEvent(id) {
  if (confirm("Deseja realmente excluir este evento?")) {
      axios.delete(`http://localhost:3000/events/delete`,{
        params: {eventId:id }
      })
      .then(response => {
        console.log('Evento deletado:', response.data);
        getEvents(); 
      })
      .catch(error => {
        console.error('Erro ao deletar evento:', error);
      });
    
    
  }
}

document.getElementById('logsRegistradas').addEventListener('click', function(e) {
  e.preventDefault();
  getLogs()
});


function getLogs(){
  axios.get(`http://localhost:3000/logs`,)
      .then(response => {
        console.log('Logs registradas:', response.data);
        openLogModal(response.data);
      })
      .catch(error => {
        console.error('Erro ao resgatar as logs:', error);
      });
}


function openLogModal(logs){
  const modal = document.getElementById("eventListModal");
  const container = document.getElementById("eventListContainer");
  document.getElementById("contentTitle").innerHTML = "Logs registrados";
  container.innerHTML = "";

  logs.forEach(log => {
    const div = document.createElement("div");
    console.log(log)
    div.className = "event-item";
    div.innerHTML = `
      <span><strong>${log.action}</strong> - ${log.createdAt.split('T')[0]} - <strong>${user.email}</strong> <br>${log.message}</span>
    `;
    container.appendChild(div);
  });

  modal.style.display = "flex";
}