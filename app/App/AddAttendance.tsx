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
import { JWT_Claims } from '../../modules/auth/Auth.interface';
import jwtDecode from 'jwt-decode';
import {
	AttendanceType,
	CheckAttendanceTodayType,
} from '../../modules/app/Attendance/Attendance.interface';
import { useQuery } from 'react-query';
import QueryString from 'query-string';
import { Query_CheckLeave_API_Response } from '../../modules/app/Leave/Leave.interface';

let camera: Camera | null;

const CAMERA_QUALITY = 0.2;
const CAMERA_SCALE = 0.3;

export default function CameraScreen() {
	const router = useRouter();

	const { accessToken } = useAuthStore();
	const claims: JWT_Claims = jwtDecode(accessToken ?? '');

	const checkAttendanceTodayQuery = useQuery(
		[
			'CheckAttendanceToday',
			{
				NationalId: claims.NationalId,
				date: dayjs().startOf('day').toISOString(),
			},
		],
		async () => {
			const params = QueryString.stringify({
				NationalId: claims.NationalId,
				date: dayjs().startOf('day').toISOString(),
			});
			const res = await API.get(`Attendances/CheckAttendanceToday?${params}`);

			const checkAttendanceTodayType: CheckAttendanceTodayType = res.data;

			return checkAttendanceTodayType;
		}
	);

	const [permissions, requestPermissions] = Camera.useCameraPermissions();
	const [cameraType, setCameraType] = useState(CameraType.back);
	// const [attendanceType, setAttendanceType] = useState<AttendanceType>('Start');
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [QRData, setQRData] = useState<string | undefined>(undefined);
	const isQRScanned = QRData !== undefined;

	const checkLeaveQuery = useQuery(
		[
			'Check',
			{
				NationalId: claims.NationalId,
				date: dayjs().startOf('day').toISOString(),
			},
		],
		async () => {
			const params = QueryString.stringify({
				NationalId: claims.NationalId,
				date: dayjs().startOf('day').toISOString(),
			});
			const res = await API.get(`Leaves/Check?${params}`);

			const { IsOnLeave }: Query_CheckLeave_API_Response = res.data;

			return IsOnLeave;
		}
	);

	async function handleTakePhoto(QRData: string) {
		if (camera === null) {
			return;
		}

		if (
			checkAttendanceTodayQuery.isLoading ||
			checkAttendanceTodayQuery.isError ||
			checkAttendanceTodayQuery.data === 'Ended'
		) {
			return;
		}

		await camera.takePictureAsync({
			quality: CAMERA_QUALITY,
			scale: CAMERA_SCALE,
			onPictureSaved: async (photo) => {
				logger('photo from params: ', photo);

				setImageUri(photo.uri);

				try {
					const formData = new FormData();
					const newImageUri = `file:///${photo.uri.split('file:/').join('')}`;

					const imgData = {
						name: 'Image.jpeg',
						type: mime.getType(newImageUri) ?? 'image/jpeg',
						uri: newImageUri,
					};

					logger(imgData);

					// checkAttendanceTodayQuery.data can ONLY be 'Empty' or 'Started' here
					const attendanceType: AttendanceType =
						checkAttendanceTodayQuery.data === 'Empty'
							? 'Start'
							: checkAttendanceTodayQuery.data === 'Started'
							? 'End'
							: 'End';

					formData.append('EmployeeNationalId', claims.NationalId);
					formData.append('QrHash', QRData ?? '');
					formData.append(`${attendanceType}Timestamp`, dayjs().toISOString());
					formData.append(`${attendanceType}Image`, imgData as any);

					logger({ formData });

					const uploadRes = await API.post(
						`Attendances/${attendanceType}`,
						formData,
						{
							headers: { 'Content-Type': 'multipart/form-data' },
						}
					);

					router.replace('/App');
					Toast.show('Đã chấm công!');
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

	if (checkLeaveQuery.isLoading || checkLeaveQuery.isError) {
		return <Text>Đang kiểm tra ngày nghỉ phép...</Text>;
	}

	if (checkLeaveQuery.data) {
		return <Text>Hôm nay là ngày nghỉ phép!</Text>;
	}

	// if (dayjs().day() === 0 || dayjs().day() === 6) {
	// 	return <Text>Hôm nay là ngày nghỉ!</Text>;
	// }

	if (
		checkAttendanceTodayQuery.isLoading ||
		checkAttendanceTodayQuery.isError
	) {
		return <Text>Đang kiểm tra trạng thái hôm nay...</Text>;
	}

	if (checkAttendanceTodayQuery.data === 'Ended') {
		return <Text>Đã kết thúc chấm công ngày hôm nay!</Text>;
	}

	return (
		<View className='flex h-full w-full flex-col items-center justify-start border-green-900 bg-yellow-50'>
			<Pressable onPress={() => router.back()}>
				<Text>Back To Home</Text>
			</Pressable>

			<View className='flex h-8 w-20 flex-row bg-green-300'>
				<Pressable
					className='h-full w-full'
					onPress={() =>
						setCameraType((camType) =>
							camType === CameraType.front ? CameraType.back : CameraType.front
						)
					}
				>
					<Text>Đổi Camera</Text>
				</Pressable>
				<Text>Buổi: {checkAttendanceTodayQuery.data}</Text>
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
					type={cameraType}
					ref={(r) => {
						camera = r;
					}}
					onBarCodeScanned={async (e) => {
						if (isQRScanned) {
							return;
						}

						// Toast.show(`Đã quét! ${e.data}`);
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
