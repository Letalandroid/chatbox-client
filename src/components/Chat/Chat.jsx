import styles from './Chat.module.scss';

const Chat = ({ uFisrtCharacter, message, you }) => {

    return (
			<div className={you ? styles.you__container : styles.chat__container}>
				<div
					className={
						you ? styles.userIconYou__container : styles.userIcon__container
					}>
					<span>{uFisrtCharacter.charAt(0)}</span>
				</div>
				<div className={styles.message}>
					<span>{message}</span>
				</div>
			</div>
		);
}

export default Chat;