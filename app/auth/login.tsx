import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../modules/auth/Auth.store';

export default function Login() {
	const router = useRouter();
	const { setTokens } = useAuthStore();

	function handleLogin() {
		setTokens('aaaa', 'bbbb');
	}

	return (
		<View>
			<Pressable className='h-10 w-24 bg-primary-normal' onPress={handleLogin}>
				<Text>Login</Text>
			</Pressable>
		</View>
	);
}
