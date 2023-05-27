import { View, Text, KeyboardAvoidingView, Image } from 'react-native';
import React from 'react';
import { Slot } from 'expo-router';

export default function AuthLayout() {
	return (
		<KeyboardAvoidingView
			behavior='position'
			contentContainerStyle={{ width: '100%' }}
		>
			<View className='flex flex-col items-center pt-10'>
				{/* <View className='mb-4 h-40 w-40 bg-state-error-bright' />
				<Text className='mb-4 text-h1 font-bold text-primary-dark-2'>
					App Name
				</Text> */}
				<View className='mb-4 h-48 w-48 rounded border border-primary-dark-1 shadow'>
					<Image
						className='h-full w-full rounded'
						source={require('../../assets/Logo.png')}
					/>
				</View>

				<Slot />
			</View>
		</KeyboardAvoidingView>
	);
}
