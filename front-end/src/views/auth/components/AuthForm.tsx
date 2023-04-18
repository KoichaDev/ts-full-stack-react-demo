import { useState, useId, useEffect } from 'react';
import useAuthLoginMutation from '../hooks/useAuth';

import Button from '@/components/common/Button';
import styles from './AuthForm.module.scss';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

type Auth = {
	username: string;
	password: string;
};

const initState: Auth = {
	username: '',
	password: '',
};

const AuthForm = () => {
	const [auth, setAuth] = useState(initState);
	const { loginAuthMutation } = useAuthLoginMutation();

	const usernameId = useId();
	const passwordId = useId();

	const isError = loginAuthMutation.isError;
	const errorMessage = loginAuthMutation.error?.response.data.error.message;

	useEffect(() => {
		if (errorMessage !== undefined) {
			toast(`❌ ${errorMessage}!`, {
				position: 'top-center',
				autoClose: 2500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'colored',
			});
		}
	}, [isError, errorMessage]);

	const handleChangeUsername = (e: ChangeEvent) => {
		const enteredUsername = e.target.value;
		setAuth((prevState) => {
			return { ...prevState, username: enteredUsername };
		});
	};

	const handleChangePassword = (e: ChangeEvent) => {
		const enteredPassword = e.target.value;

		setAuth((prevState) => {
			return { ...prevState, password: enteredPassword };
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const payload = {
			username: auth.username,
			password: auth.password,
		};

		loginAuthMutation.mutate(payload);

		setAuth(initState);
	};

	return (
		<>
			<form
				className={`${styles['auth-form']}`}
				onSubmit={handleSubmit}>
				<label
					htmlFor={usernameId}
					className='text-lg text-gray-400'>
					Username:{' '}
				</label>
				<input
					type='text'
					id={usernameId}
					value={auth.username}
					onChange={handleChangeUsername}
					placeholder='username...'
				/>

				<label
					htmlFor={passwordId}
					className='text-lg text-gray-400 text-red-900'>
					Password
				</label>

				<input
					type='password'
					id={passwordId}
					value={auth.password}
					onChange={handleChangePassword}
					placeholder='password...'
				/>
				<Button
					type='submit'
					variant='primary'>
					Enter
				</Button>
			</form>
		</>
	);
};

export default AuthForm;
