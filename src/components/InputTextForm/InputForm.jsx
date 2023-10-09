import styles from './InputForm.module.scss'

const InputForm = ({ name, pssw, setValue}) => {
	return (
		<p className={styles.container__label}>
			<label>{name.replace('_', ' ')}:</label>
			<input onChange={(e) => setValue(e.target.value)} required type={pssw ? 'password' : 'text'} name={name} />
		</p>
	);
};

export default InputForm;
