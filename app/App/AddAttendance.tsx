import { View, Text, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Camera, CameraType } from 'expo-camera';
import axios from 'axios';
import { logger } from '../../components/Utils';
import { API, handleErrorAPI } from '../../configs/axios';
import mime from 'mime';
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
import { useMutation, useQuery } from 'react-query';
import QueryString from 'query-string';
import { Query_CheckLeave_API_Response } from '../../modules/app/Leave/Leave.interface';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

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

	const addAttendanceMutation = useMutation(
		'Attendance',
		async ({
			formData,
			attendanceType,
		}: {
			formData: FormData;
			attendanceType: AttendanceType;
		}) => {
			try {
				const uploadRes = await API.post(
					`Attendances/${attendanceType}`,
					formData,
					{
						headers: { 'Content-Type': 'multipart/form-data' },
					}
				);
			} catch (error) {
				handleErrorAPI(error);
			}
		}
	);

	async function handleTakePhoto(QRData: string) {
		// return;

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

				addAttendanceMutation.mutate({ formData, attendanceType });

				router.replace('/App');
				Toast.show('Đã chấm công!');
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
		return (
			<View className='flex h-full w-full flex-col items-center justify-start'>
				<Text className='text-h2 font-semibold text-primary-normal'>
					Chấm công
				</Text>
				<View className='mx-5 mt-4 flex w-fit flex-row items-center rounded-lg bg-state-warning-bright p-2'>
					<MaterialIcons name='warning' color='orange' size={32} />
					<Text className='ml-2'>Hôm nay là ngày nghỉ phép!</Text>
				</View>
			</View>
		);
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
		return (
			<View className='flex h-full w-full flex-col items-center justify-start'>
				<Text className='text-h2 font-semibold text-primary-normal'>
					Chấm công
				</Text>
				<View className='mx-5 mt-4 flex w-fit flex-row items-center rounded-lg bg-state-success-bright p-2'>
					<MaterialIcons name='check' color='green' size={32} />
					<Text className='ml-2'>Đã kết thúc chấm công ngày hôm nay!</Text>
				</View>
			</View>
		);
	}

	if (addAttendanceMutation.isLoading) {
		return <Text className='m-auto'>Đang chấm...</Text>;
	}

	return (
		<View className='flex h-full w-full flex-col items-center justify-start'>
			<Text className='text-h2 font-semibold text-primary-normal'>
				Chấm công (
				{checkAttendanceTodayQuery.data === 'Empty' ? 'Bắt đầu' : 'Kết thúc'})
			</Text>

			{/* <View className='flex h-8 w-20 flex-row bg-green-300'>
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
			</View> */}

			<View className='mx-5 mt-4 flex w-fit flex-row items-center rounded-lg bg-primary-bright-5 p-2'>
				<MaterialIcons name='info' color='blue' size={32} />
				<Text className='ml-2'>
					Chú ý: Hình sẽ được chụp tự động khi quét được mã QR. Bạn nên chụp sao
					cho thấy được cả khuôn mặt và mã QR trong hình.
				</Text>
			</View>

			<Pressable
				android_ripple={{ radius: 28 }}
				className='mt-8 rounded-lg border border-neutral-gray-7 bg-neutral-gray-1'
				onPress={() =>
					setCameraType((camType) =>
						camType === CameraType.front ? CameraType.back : CameraType.front
					)
				}
			>
				<Ionicons name='camera-reverse-outline' size={44} />
			</Pressable>

			{/* <View className='h-20 w-20 border border-orange-400'>
				{imageUri !== null && (
					<Image source={{ uri: imageUri }} className='h-full w-full' />
				)}
			</View> */}

			<View
				className={`mt-8 h-h-qr-scanner w-w-qr-scanner rounded border-2 ${
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

			{/* <Button
				width='medium'
				title='Quét lại'
				onPress={() => setQRData(undefined)}
			/> */}
			<Pressable className='h-20 w-80' onPress={() => setQRData(undefined)} />
		</View>
	);
}
