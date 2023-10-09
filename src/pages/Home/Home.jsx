import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import jwt from 'jwt-decode';
import styles from './Home.module.scss';
import { useEffect, useState, useRef } from 'react';
import Chat from '../../components/Chat/Chat';

const Home = () => {
	const cookies = new Cookies();
	let token;
	const [handleSession, setHandleSession] = useState(false);
	const [msj, setMsj] = useState('');
	const [mensajes, setMensajes] = useState([]);
	const [cargando, setCargando] = useState(true);

	useEffect(() => {
		const returnData = async () => {
			const rawResponse = await fetch(
				`${
					import.meta.env.PROD
						? import.meta.env.VITE_VERCEL_PROD
						: import.meta.env.VITE_APP_PROD
				}/messages`,
				{
					method: 'GET',
				}
			);

			const { err, message, messages } = await rawResponse.json();

			if (err) {
				alert(message, 'error');
				console.log(err);
			} else {
				setCargando(false);
				setMensajes(messages);
			}
		};

		returnData();
	}, []);

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

	if (cookies.get('jwt_authorizacion') === undefined) {
		alert('Vuelva a iniciar sesión', 'error');
		setTimeout(() => {
			location.href = '/login';
		}, 1000);
	} else {
		token = jwt(cookies.get('jwt_authorizacion'));
	}

	setInterval(() => {
		if (cookies.get('jwt_authorizacion') === undefined) {
			alert('Vuelva a iniciar sesión', 'error');
			setTimeout(() => {
				location.href = '/login';
			}, 1000);
		} else {
			fetch(
				`${
					import.meta.env.PROD
						? import.meta.env.VITE_VERCEL_PROD
						: import.meta.env.VITE_APP_PROD
				}/new-message`
			);
		}
	}, 1000 * 60 * 1);

	const handleSes = () => {
		handleSession ? setHandleSession(false) : setHandleSession(true);
	};

	const disconnect = () => {
		cookies.remove('jwt_authorizacion');
		location.href = '/';
	};

	const sendMessage = async () => {
		const rawResponse = await fetch(
			`${
				import.meta.env.PROD
					? import.meta.env.VITE_VERCEL_PROD
					: import.meta.env.VITE_APP_PROD
			}/new-message`,
			{
				method: 'POST',
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Credentials': 'true',
				},
				body: JSON.stringify({
					user_id: token.user_id,
					username: token.username,
					msj,
				}),
			}
		);

		const { err, message } = await rawResponse.json();

		if (err) {
			alert(message, 'error');
		} else {
			console.log(message);
			location.reload();
		}
	};

	const chatParent = useRef(null);

	useEffect(() => {
		const domNode = chatParent.current;
		if (domNode) {
			domNode.scrollTop = domNode.scrollHeight;
		}
	});

	return (
		<>
			<header className={styles.header}>
				<h1>ChatBox</h1>
				{token ? (
					<div onClick={handleSes} className={styles.userIcon__container}>
						<span>{token.username.charAt(0)}</span>
					</div>
				) : (
					''
				)}
				{handleSession ? (
					<div className={styles.closedSession}>
						<span>{token.username}</span>
						<hr />
						<button onClick={disconnect}>Disconnect</button>
					</div>
				) : (
					''
				)}
			</header>
			<div className={styles.container}>
				<div className={styles.messages__container}>
					<div ref={chatParent} className={styles.messages}>
						{cargando ? (
							<h2>Cargando chats...</h2>
						) : (
							mensajes.map((mensaje) => {
								let you;
								const existToken = token !== undefined;

								if (existToken) {
									you = mensaje.user_id === token.user_id;
								}

								return (
									<Chat
										key={mensaje.chat_id}
										uFisrtCharacter={mensaje.username}
										message={mensaje.text}
										you={you}
									/>
								);
							})
						)}
					</div>
				</div>
				<div className={styles.sendMessage__container}>
					<input
						type="text"
						placeholder="Send your message here..."
						maxLength={100}
						onChange={(e) => setMsj(e.target.value)}
					/>
					<button onClick={sendMessage}>
						<i className="fas fa-paper-plane"></i>
					</button>
				</div>
			</div>
			<ToastContainer />
		</>
	);
};

export default Home;
