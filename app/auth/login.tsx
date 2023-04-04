import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../modules/auth/Auth.store';
import { useMutation } from 'react-query';
import { API } from '../../configs/axios';
import { Auth_API_Response } from '../../modules/auth/Auth.interface';

export default function Login() {
	const router = useRouter();
	const { setTokens } = useAuthStore();

	const mutation = useMutation('login', async () => {
		const res = await API.post('Auth/Login', {
			Email: 'master@example.com',
			Password: '123456aA',
		});

		if (res.status === 200) {
			const { AccessToken, RefreshToken }: Auth_API_Response = res.data;
			setTokens(AccessToken, RefreshToken);
		}
	});

	function handleLogin() {
		mutation.mutate();
	}

	return (
		<View>
			<Pressable className='h-10 w-24 bg-primary-normal' onPress={handleLogin}>
				<Text>Login</Text>
			</Pressable>
		</View>
	);
}
