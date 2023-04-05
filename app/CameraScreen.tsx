import { View, Text, Pressable, Button, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Camera, CameraType } from 'expo-camera';
import axios from 'axios';
import { logger } from '../components/Utils';
import { API } from '../configs/axios';
import mime from 'mime';
import RNFetchBlob from 'react-native-fetch-blob';
import { useAuthStore } from '../modules/auth/Auth.store';

let camera: Camera | null;

export default function CameraScreen() {
	const router = useRouter();
	const [camType, setCamType] = useState(CameraType.back);
	const [permissions, requestPermissions] = Camera.useCameraPermissions();

	const [imageUri, setImageUri] = useState<string | null>(null);

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
			quality: 0.4,
			onPictureSaved: async (photo) => {
				logger('photo from params: ', photo);

				setImageUri(photo.uri);

				// Get photo from URI
				const res = await fetch(photo.uri);
				const img = await res.blob();

				try {
					const formData = new FormData();
					const newImageUri = `file:///${photo.uri.split('file:/').join('')}`;

					const imgData = {
						name: 'File1.jpeg',
						type: mime.getType(photo.uri) ?? 'image/jpeg',
						uri: newImageUri,
					};

					logger(imgData);

					// formData.append('File1', {
					// 	uri: photo.uri,
					// 	name: 'File1.jpeg',
					// 	type: 'image/jpeg',
					// } as any);

					formData.append('File1', imgData as any);

					logger({ formData });

					const uploadRes = await API.post('Files/Upload', formData, {
						headers: { 'Content-Type': 'multipart/form-data' },
					});
					logger({ uploadRes: uploadRes.data });

					// const { accessToken } = useAuthStore.getState();

					// const uploadRes = await RNFetchBlob.fetch(
					// 	'POST',
					// 	`https://c429-2402-800-63a8-e037-b59a-5c8d-9b07-be17.ap.ngrok.io/api/Files/Upload`,
					// 	{
					// 		'Content-Type': 'multipart/form-data',
					// 		'Authorization': `Bearer ${accessToken}`,
					// 	},
					// 	[
					// 		{
					// 			name: 'File1',
					// 			data: RNFetchBlob.wrap(photo.uri),
					// 		},
					// 	]
					// );
					// const json = uploadRes.data;
					// debug_log(json);

					// const uploadRes = await API.post('Files/Upload', formData, {
					// 	headers: { 'Content-Type': 'multipart/form-data' },
					// });
					// const json = uploadRes.data;
					// debug_log({ uploadRes: json });
				} catch (error) {
					logger(error);
				}
			},
		});
	}

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

	return (
		<View className='flex h-full w-full flex-col items-center justify-start border-green-900 bg-yellow-50'>
			<Text>Camera</Text>
			<Pressable onPress={() => router.back()}>
				<Text>Back To Home</Text>
			</Pressable>

			<View className='h-12 w-20 bg-green-300'>
				<Pressable className='h-full w-full' onPress={toggleCamType} />
			</View>

			{imageUri !== null && (
				<View className='h-20 w-20 border border-orange-400'>
					<Image source={{ uri: imageUri }} className='h-full w-full' />
				</View>
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

					logger('about to call Files/Test');

					try {
						const res = await API.get('Files/Test', {
							headers: {
								'Content-Type': 'application/json',
							},
						});

						logger({ data: res.data, status: res.status });
					} catch (error) {
						logger({ The_Error: error });
					}
				}}
			>
				<Text>Test</Text>
			</Pressable>

			<Pressable className='h-12 bg-blue-700 p-4' onPress={handleTakePhoto}>
				<Text>Take photo</Text>
			</Pressable>
		</View>
	);
}
