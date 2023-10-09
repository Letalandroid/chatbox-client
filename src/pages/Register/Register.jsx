import { useState } from 'react';
import styles from './Register.module.scss';
import InputForm from '../../components/InputTextForm/InputForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';

const Register = () => {
	const [uname, setUName] = useState('');
	const [pssw, setPssw] = useState('');
	const [r_pssw, setR_Pssw] = useState('');
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
		if (pssw !== r_pssw) {
			alert('Las contraseñas no coniciden.');
			valida = false;
		}

		if (contieneCaracteresEspeciales(pssw)) {
			alert(
				'No se permiten el uso de caractéres especiales en el campo password.'
			);
			valida = false;
		}
	};

	const fetchData = async (username, password) => {
		const rawResponse = await fetch(
			`${
				import.meta.env.PROD
					? import.meta.env.VITE_VERCEL_PROD
					: import.meta.env.VITE_APP_PROD
			}/login`,
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

		const data = await rawResponse.json();

		if (data.err) {
			alert(data.message, 'error');
		} else {
			alert(data.message, 'success');
			cookies.set('jwt_authorizacion', data.token, {
				expires: new Date(Date.now() + 5 * 60 * 1000)
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
				<h1>Register</h1>
			</header>
			<main className={styles.container}>
				<div className={styles.register__container}>
					<InputForm setValue={setUName} name={'username'} />
					<InputForm setValue={setPssw} pssw name={'password'} />
					<InputForm setValue={setR_Pssw} pssw name={'repeat_password'} />
					<button onClick={sendData} className={styles.btn_register}>
						Register
					</button>
					<p className={styles.go__login}>¿Ya tienes cuenta? <a href='/login'>Logueate</a></p>
					<ToastContainer />
				</div>
			</main>
		</>
	);
};

export default Register;
