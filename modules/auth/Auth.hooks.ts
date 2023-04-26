import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from './Auth.store';

export function useAuthRedirect() {
	const { accessToken, refreshToken, user, setTokens, unsetLogin } =
		useAuthStore();

	const router = useRouter();

	useEffect(() => {
		console.log({ accessToken, refreshToken });
		if (!accessToken) {
			router.replace('/Auth/Login');
		} else {
			router.replace('/App');
		}
	}, [accessToken, refreshToken]);
}
