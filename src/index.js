const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const username = loginForm.querySelector('[name=username]')?.value;
	const password = loginForm.querySelector('[name=password]')?.value;
	const data = {username, password};

	fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data),
		credentials: 'include'
	})
		.then(res => {
			if (res.status === 200) {
				alert('Logged in successfully');
				console.table(res);
			} else {
				console.log(res);
			}
		})
		.catch(err => {
			console.error(err);
			alert('Error logging in please try again');
		});
});

const registerForm = document.querySelector('#register-form');

registerForm.addEventListener('submit', (e) => {
e.preventDefault();
	const username = registerForm.querySelector('[name=username]')?.value;
	const password = registerForm.querySelector('[name=password]')?.value;
	const data = {username, password};

	fetch('/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data),
	})
		.then(res => {
			if (res.status === 200) {
				alert('Registered successfully');
				console.table(res);
			} else {
				console.log(res);
			}
		})
		.catch(err => {
			console.error(err);
			alert('Error registering please try again');
		});
});