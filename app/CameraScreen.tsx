import { View, Text, Pressable, Button, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Camera, CameraType } from 'expo-camera';
import { BASE_URL } from '..';
import axios from 'axios';

let camera: Camera | null;

export default function CameraScreen() {
	const router = useRouter();
	const [camType, setCamType] = useState(CameraType.back);
	const [permissions, requestPermissions] = Camera.useCameraPermissions();

	const [imageUri, setImageUri] = useState<string | null>(null);

	if (!permissions) {
		// Camera permissions are still loading
		return <View />;
	}

	if (!permissions.granted) {
		// Camera permissions are not granted yet
		return (
			<View className='h-60 w-40 bg-slate-500'>
				<Text>We need your permission to show the camera</Text>
				<Button onPress={requestPermissions} title='Grant permissions' />
			</View>
		);
	}

	function toggleCamType() {
		setCamType((camType) =>
			camType === CameraType.back ? CameraType.front : CameraType.back
		);
	}

	async function handleTakePhoto() {
		if (camera === null) {
			return;
		}

		const photo = await camera.takePictureAsync({
			onPictureSaved: async (photo) => {
				console.log(photo);
				setImageUri(photo.uri);

				const res = await fetch(photo.uri);

				// console.log({ res });

				const img = await res.blob();

				const uploadRes = await fetch(`${BASE_URL}/Files/Upload`, {
					method: 'POST',
					body: img,
				});

				console.log({ uploadRes: await uploadRes.json() });

				// console.log(img.toString());
			},
		});
	}

	return (
		<View className='flex h-full w-full flex-col items-center justify-center gap-4 border-green-900 bg-yellow-50'>
			<Text>Camera</Text>
			<Pressable onPress={() => router.back()}>
				<Text>Back To Home</Text>
			</Pressable>

			<View className='h-12 w-20 bg-green-300'>
				<Pressable className='h-full w-full' onPress={toggleCamType} />
			</View>

			{imageUri !== null && (
				<Image
					source={{ uri: imageUri }}
					className='h-20 w-20 border border-orange-400'
				/>
			)}

			<Camera
				className='h-80 w-full'
				type={camType}
				ref={(r) => {
					camera = r;
				}}
			>
				<View className='h-full w-full border-4 border-red-900'></View>
			</Camera>

			<Pressable
				className='h-12 w-12 bg-blue-300'
				onPress={async () => {
					// const res = await axios.post(
					// 	'https://127.0.0.1:5000/api/Files/Upload',
					// 	{
					// 		data: 'aaaa',
					// 	},
					// 	{
					// 		headers: {
					// 			'Content-type': 'application/json',
					// 		},
					// 	}
					// );

					const res = await fetch(`${BASE_URL}/api/Auth/Login`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: 'aaaa',
					});

					const status = res.ok;
					console.log({ status });
				}}
			></Pressable>

			<Pressable className='h-12 bg-blue-700 p-4' onPress={handleTakePhoto}>
				<Text>Take photo</Text>
			</Pressable>
		</View>
	);
}
