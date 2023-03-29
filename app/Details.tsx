import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function Details() {
	const router = useRouter();
	return (
		<View className='flex h-12 w-12 flex-row items-center justify-center border-green-900 bg-yellow-50'>
			<Text>Details</Text>
			<Pressable onPress={() => router.back()}>
				<Text>Back To Home</Text>
			</Pressable>
		</View>
	);
}
