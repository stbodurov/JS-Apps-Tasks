import { createFormEntity } from './form-helpers.js';

// initialize the application
var app = Sammy('#main', function () {
	// include a plugin
	this.use('Handlebars', 'hbs');

	// define a 'route'
	this.get('#/', homeViewHandler);
	this.get('#/home', homeViewHandler);
	this.get('#/about', aboutViewHandler);
	this.get('#/login', loginHandler);
	this.get('#/register', registerViewHandler);
	this.post('#/register', () => false);
	this.get('#/logout', logoutHandler);
	this.get('#/catalog', catalogHandler);
});
(() => {

	// start the application
	app.run('#/');
})();

async function applyCommon() {
	this.partials = {
		header: await this.load('./templates/common/header.hbs'),
		footer: await this.load('./templates/common/footer.hbs')
	};
	this.username = sessionStorage.getItem('username');
	this.loggedIn = !!sessionStorage.getItem('token');
}

async function homeViewHandler() {
	await applyCommon.call(this);
	this.partial('./templates/home/home.hbs');
}

async function aboutViewHandler() {
	await applyCommon.call(this);
	this.partial('./templates/about/about.hbs');
}
async function loginHandler() {
	await applyCommon.call(this);
	this.partials.loginForm = await this.load('./templates/login/loginForm.hbs');
	this.partial('./templates/login/loginPage.hbs');

	let formRef = document.querySelector('#login-form');

	formRef.addEventListener('submit', (e) => {
		e.preventDefault();

		let form = createFormEntity(formRef, ['username', 'password']);
		let formValue = form.getValue();

	});

	firebase.auth().createUserWithEmailAndPassword(email, password)
		.catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode == 'auth/weak-password') {
				alert('The password is too weak.');
			} else {
				alert(errorMessage);
			}
			console.log(error);
		});
}

async function registerViewHandler() {
	await applyCommon.call(this);
	this.partials.registerForm = await this.load('./templates/register/registerForm.hbs');
	await this.partial('./templates/register/registerPage.hbs');

	let formRef = document.querySelector('[action|="#/register"]');

	console.log(formRef);


	let form = createFormEntity(formRef, ['username', 'password', 'repeatPassword']);

	formRef.addEventListener('submit', (e) => {
		e.preventDefault();

		let formValue = form.getValue();

		console.log(formValue);


		if (formValue.password !== formValue.repeatPassword) {
			return;
		}

		firebase.auth().createUserWithEmailAndPassword(formValue.username, formValue.password)
			.then((response) => {
				console.log(response);

				firebase.auth().currentUser.getIdToken().then((token) => {
					sessionStorage.setItem('token', token);
					sessionStorage.setItem('username', response.user.email);
				})

				this.redirect('#/home');
			}).catch(function (error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				if (errorCode == 'auth/weak-password') {
					alert('The password is too weak.');
				} else {
					alert(errorMessage);
				}
				console.log(error);
			});
	})
}

async function catalogHandler() {
	await applyCommon.call(this);

	this.partial('./templates/catalog/teamCatalog.hbs')
}

async function logoutHandler() {
	sessionStorage.clear();
	firebase.auth().signOut();

	this.redirect('#/home');
}