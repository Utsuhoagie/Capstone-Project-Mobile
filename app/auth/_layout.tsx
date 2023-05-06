import { View, Text, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import { Slot } from 'expo-router';

export default function AuthLayout() {
	return (
		<View className='flex flex-col items-center pt-4'>
			<View className='mb-4 h-40 w-40 bg-state-error-bright' />
			<Text className='mb-4 text-h1 font-bold text-primary-dark-2'>
				App Name
			</Text>
			<KeyboardAvoidingView
				behavior='position'
				contentContainerStyle={{ width: '100%' }}
			>
				<Slot />
			</KeyboardAvoidingView>
		</View>
	);
}
