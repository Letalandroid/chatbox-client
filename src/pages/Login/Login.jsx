import { useState } from 'react';
import styles from './Login.module.scss';
import InputForm from '../../components/InputTextForm/InputForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';

const Login = () => {
	const [uname, setUName] = useState('');
	const [pssw, setPssw] = useState('');
	let valida = true;
	const cookies = new Cookies();

	const alert = (text, type) => {
		switch (type) {
			case 'error':
				toast.error(text);
				break;
			case 'success':
				toast.success(text);
				break;
			default:
				toast.info(text);
				break;
		}
	};

	if (cookies.get('jwt_authorizacion') !== undefined) {
		alert('Usuario ya registrado anteriormente');
		setTimeout(() => {
			location.href = '/';
		}, 1000);
	}

	function contieneCaracteresEspeciales(cadena) {
		const expresionRegular =
			/[\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\;\:\'\"\<\>\,\.\?\/\\]/;

		return expresionRegular.test(cadena);
	}

	const validateUser = () => {
		if (uname.length > 10) {
			alert('Nombre de usuario muy largo, máximo 10 caractéres.');
			valida = false;
		}
		if (contieneCaracteresEspeciales(uname)) {
			alert(
				'No se permiten el uso de caractéres especiales en el campo username.'
			);
			valida = false;
		}
	};

	const validatePssw = () => {
		if (contieneCaracteresEspeciales(pssw)) {
			alert(
				'No se permiten el uso de caractéres especiales en el campo password.'
			);
			valida = false;
		}
	};

	const fetchData = async (username, password) => {
		const rawResponse = await fetch(
			`${import.meta.env.VITE_VERCEL_PROD}/login`,
			{
				method: 'POST',
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Credentials': 'true',
				},
				body: JSON.stringify({ username, password }),
			}
		);

		const { auth, message, token } = await rawResponse.json();

		if (!auth) {
			alert(message, 'error');
		} else {
			alert(message, 'success');
			cookies.set('jwt_authorizacion', token, {
				expires: new Date(Date.now() + 5 * 60 * 1000),
			});

            setTimeout(() => {
							location.href = '/';
						}, 1000);
		}
	};

	const sendData = () => {
		validateUser();
		validatePssw();

		if (valida) {
			fetchData(uname, pssw);
		}
	};

	return (
		<>
			<header className={styles.header}>
				<h1>Login</h1>
			</header>
			<main className={styles.container}>
				<div className={styles.login__container}>
					<InputForm setValue={setUName} name={'username'} />
					<InputForm setValue={setPssw} pssw name={'password'} />
					<button onClick={sendData} className={styles.btn_login}>
						Login
					</button>
					<p className={styles.go__login}>
						¿Aún no tienes cuenta? <a href="/register">Regístrate</a>
					</p>
					<ToastContainer />
				</div>
			</main>
		</>
	);
};

export default Login;
