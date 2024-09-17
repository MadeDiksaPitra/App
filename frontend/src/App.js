const handleLogin = async () => {
  const response = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
};

const handleProtectedRequest = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/protected', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  console.log(data);
};
