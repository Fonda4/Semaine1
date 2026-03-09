document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch(`http://localhost:3000/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Login failed', { response: response });
    }
    return response.json();
  })
  .then(data => {
    console.log("Login successful", data);
    const decodedUsername = decodeFakeToken(data.token);
    document.getElementById('welcomeMessage').style.display = 'block';
    document.getElementById('usernameDisplay').textContent = decodedUsername;
    document.getElementById('errorMessage').textContent = '';
  })
  .catch(error => {
    console.error('Login failed', error);
    document.getElementById('welcomeMessage').style.display = 'none';
    document.getElementById('username').textContent = '';
    document.getElementById('errorMessage').textContent = 'Login failed';
  });
});

function decodeFakeToken(token) {
  // a based-64 encoded string 
  // decode the string
  const decoded = atob(token);
  console.log("Decoded username '", decoded, "'");
  return decoded;
}

decodeFakeToken("fake.token.here");