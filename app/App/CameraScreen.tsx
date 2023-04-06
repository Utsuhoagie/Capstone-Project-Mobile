import { View, Text, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Camera, CameraType } from 'expo-camera';
import axios from 'axios';
import { logger } from '../../components/Utils';
import { API } from '../../configs/axios';
import mime from 'mime';
import RNFetchBlob from 'react-native-fetch-blob';
import { useAuthStore } from '../../modules/auth/Auth.store';
import Toast from 'react-native-root-toast';
import { Button } from '../../components/atoms/Button/Button';
import dayjs from 'dayjs';

let camera: Camera | null;

export default function CameraScreen() {
	const router = useRouter();
	const [camType, setCamType] = useState(CameraType.back);
	const [permissions, requestPermissions] = Camera.useCameraPermissions();

	const [imageUri, setImageUri] = useState<string | null>(null);

	const [QRData, setQRData] = useState<string | undefined>(undefined);
	const isQRScanned = QRData !== undefined;

	async function handleTakePhoto(QRData: string) {
		if (camera === null) {
			return;
		}

		await camera.takePictureAsync({
			onPictureSaved: async (photo) => {
				logger('photo from params: ', photo);

				setImageUri(photo.uri);

				// Get photo from URI
				// const res = await fetch(photo.uri);
				// const img = await res.blob();

				try {
					const formData = new FormData();
					const newImageUri = `file:///${photo.uri.split('file:/').join('')}`;

					const imgData = {
						name: 'Image.jpeg',
						type: mime.getType(photo.uri) ?? 'image/jpeg',
						uri: newImageUri,
					};

					logger(imgData);

					// formData.append('File1', {
					// 	uri: photo.uri,
					// 	name: 'File1.jpeg',
					// 	type: 'image/jpeg',
					// } as any);

					formData.append('Image', imgData as any);
					formData.append('Hash', QRData ?? '');
					formData.append('Timestamp', dayjs().toISOString());

					logger({ formData });

					const uploadRes = await API.post('Files/Attendance', formData, {
						headers: { 'Content-Type': 'multipart/form-data' },
					});
					logger({ uploadRes: uploadRes.data });
				} catch (error) {
					logger(error);
				}
			},
		});
	}

	// Render
	if (!permissions) {
		// Camera permissions are still loading
		return <View />;
	}

	if (!permissions.granted) {
		// Camera permissions are not granted yet
		return (
			<View className='h-60 w-40 bg-slate-500'>
				<Text>Cần được cấp quyền camera để sử dụng chức năng này.</Text>
				<Button width='medium' title='Cấp quyền' onPress={requestPermissions} />
			</View>
		);
	}

	return (
		<View className='flex h-full w-full flex-col items-center justify-start border-green-900 bg-yellow-50'>
			<Text>Camera</Text>
			<Pressable onPress={() => router.back()}>
				<Text>Back To Home</Text>
			</Pressable>

			<View className='h-8 w-20 bg-green-300'>
				<Pressable
					className='h-full w-full'
					onPress={() =>
						setCamType((camType) =>
							camType === CameraType.front ? CameraType.back : CameraType.front
						)
					}
				>
					<Text>Toggle Cam</Text>
				</Pressable>
			</View>
			<View className='h-20 w-20 border border-orange-400'>
				{imageUri !== null && (
					<Image source={{ uri: imageUri }} className='h-full w-full' />
				)}
			</View>
			<View
				className={`h-h-qr-scanner w-w-qr-scanner border-2 ${
					isQRScanned
						? ' border-state-success-normal '
						: ' border-state-error-normal '
				}`}
			>
				<Camera
					className='h-full w-full'
					type={camType}
					ref={(r) => {
						camera = r;
					}}
					onBarCodeScanned={async (e) => {
						if (isQRScanned) {
							return;
						}

						Toast.show(`Đã quét! ${e.data}`);
						setQRData(e.data);
						await handleTakePhoto(e.data);
					}}
				/>
			</View>

			{/* <Button width='medium' title='Chụp' onPress={() => handleTakePhoto} /> */}

			<Button
				width='medium'
				title='Quét lại'
				onPress={() => setQRData(undefined)}
			/>
		</View>
	);
}
