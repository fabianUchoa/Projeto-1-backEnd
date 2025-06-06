
function loginUser(){
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;
    
    if(email==null||password==null){
        alert('O campo senha e email devem ser preenchidos.');
        return;
    }
    getUserLogin(email, password)

}

function getUserLogin(email, password){
    axios.post('http://localhost:3000/login', {
        email: email,
        password: password
    })
      .then(response => {
        console.log('Login realizado com sucesso:', response.data);
        window.location.href = "../HTML/Home-Page.html";
        window.sessionStorage.setItem('user', JSON.stringify(response.data));
      })
      .catch(error => {
        console.error('Erro na ao fazer login:', error);
      });
}

const userModal = document.getElementById('userModal');
const openUserModal = document.getElementById('createNewUser');
const closeUserModal = document.querySelector('.close-user');
const userForm = document.getElementById('userForm');

openUserModal.onclick = () => {
  userModal.style.display = 'block';
};

closeUserModal.onclick = () => {
  userModal.style.display = 'none';
};

window.onclick = (event) => {
  if (event.target === userModal) {
    userModal.style.display = 'none';
  }
};

userForm.onsubmit = function (e) {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;

     e.preventDefault();

    if(password != confirmPassword){
        alert('As senhas não coincidem.')
        return;
    }


    axios.post('http://localhost:3000/new-user',{
        name: name,
        email: email,
        password: password 
    })
      .then(response => {
        console.log('Usuário cadastrado:', response.data);
        window.location.href = "../HTML/Home-Page.html";
        window.sessionStorage.setItem('user', JSON.stringify(response.data));
      })
      .catch(error => {
        console.error('Erro ao cadastrar o usuário:', error);
      });

 

  userModal.style.display = 'none';
  userForm.reset();
};