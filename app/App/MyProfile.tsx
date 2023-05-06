import { View, Text, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API } from '../../configs/axios';

import dayjs, { Dayjs } from 'dayjs';
import { logger } from '../../components/Utils';
import {
	Employee_API_Response,
	mapToEmployee,
} from '../../modules/app/Employee/Employee.interface';
import Toast from 'react-native-root-toast';
import { useEmployeeStore } from '../../modules/app/Employee/Employee.store';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';
import { TextInput } from '../../components/atoms/Input/TextInput';
import { Button } from '../../components/atoms/Button/Button';
import {
	createImageFromUri,
	isIntValid,
	preprocessFileListToFirstFile,
	preprocessStringToOptionalDate,
} from '../../modules/app/form/Form.utils';
import { ScrollView } from 'react-native';
import { Image } from 'react-native';
import { useAuthStore } from '../../modules/auth/Auth.store';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { DateInput } from '../../components/atoms/Input/DateInput';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

interface UpdateEmployeeSelfFormIntermediateValues {
	BirthDate?: Date;
	Address: string;
	Phone: string;
	// Email: string;
	Image?: File;
}

const updateEmployeeSchema = z.object({
	BirthDate: z.preprocess(
		preprocessStringToOptionalDate,
		z
			.date()
			.min(dayjs().subtract(55, 'year').toDate(), {
				message: 'Tối đa 55 tuổi.',
			})
			.max(dayjs().subtract(18, 'year').toDate(), {
				message: 'Tối thiểu 18 tuổi.',
			})
			.optional()
	),

	Address: z
		.string()
		.min(5, { message: 'Địa chỉ quá ngắn.' })
		.max(200, { message: 'Địa chỉ quá dài.' }),

	Phone: z.string().regex(/^\d{10,11}$/, {
		message: 'Số điện thoại phải có 10 hoặc 11 số.',
	}),

	Email: z.string().email({ message: 'Email không hợp lệ.' }),

	Image: z.preprocess(
		preprocessFileListToFirstFile,
		z.custom((val) => {
			if (val instanceof File || val === undefined) {
				return true;
			}
			return false;
		})
	),
});

export default function MyProfile() {
	const router = useRouter();

	const { currentEmployee } = useEmployeeStore();
	const {
		NationalId,
		FullName,
		Gender,
		BirthDate,
		Address,
		Email,
		Phone,
		PositionName,
		EmployedDate,
		ExperienceYears,
		Salary,
		ImageFileName,
	} = currentEmployee ?? {};
	const [imageUri, setImageUri] = useState<string | undefined>(undefined);

	const methods = useForm<UpdateEmployeeSelfFormIntermediateValues>({
		defaultValues: {
			BirthDate: BirthDate,
			Address: Address,
			Phone: Phone,
			Image: undefined,
			// Image: currentEmployee?.ImageFileName,
		},
	});

	const queryClient = useQueryClient();
	const updateSelfMutation = useMutation(
		'UpdateSelf',
		// async ({
		// 	formData,
		// 	BirthDate,
		// }: {
		// 	formData: FormData;
		// 	BirthDate?: string;
		// }) => {
		async (formData: FormData) => {
			try {
				// const BirthDate = formData.get('BirthDate');

				/* console.log(
					'mutation BirthDate = ' + BirthDate,
					`Employees/UpdateSelf/${NationalId}` +
						(BirthDate ? `?BirthDate=${BirthDate}` : '')
				);
				return; */

				const res = await API.put(
					// `Employees/UpdateSelf/${NationalId}` +
					// 	(BirthDate ? `?BirthDate=${BirthDate}` : ''),
					`Employees/UpdateSelf/${NationalId}`,
					formData,
					{ headers: { 'Content-Type': 'multipart/form-data' } }
				);

				if (res.status >= 400) {
					return;
				}

				Toast.show('Profile updated!');
				router.push('/App');
			} catch (error) {
				logger('Error!', error);
			}
		},
		{
			onSuccess: () => queryClient.invalidateQueries(),
		}
	);

	function handleSubmit(rawData: UpdateEmployeeSelfFormIntermediateValues) {
		logger(rawData);

		const { Address, Phone, BirthDate: _BirthDate, Image } = rawData;
		const BirthDate = _BirthDate ? dayjs(_BirthDate).toISOString() : undefined;

		const formData = new FormData();
		formData.append('NationalId', NationalId as string);
		formData.append('Address', Address);
		formData.append('Phone', Phone);
		if (BirthDate) {
			formData.append('BirthDate', BirthDate);
		}
		if (Image) {
			formData.append('Image', Image);
		}

		logger(formData);
		logger('BirthDate = ', BirthDate);
		updateSelfMutation.mutate(formData);
	}

	return (
		<FormProvider {...methods}>
			<KeyboardAvoidingView
				/* className='mt-4 flex w-full flex-col items-center px-4' */
				className='w-full px-4'
				behavior='position'
			>
				<Text className='text-center text-h3 font-bold text-primary-normal'>
					Hồ sơ cá nhân
				</Text>

				<View className='flex flex-row items-center justify-center'>
					<Image
						className='my-2 mr-2 h-36 w-36'
						source={{
							// uri: photoUri,
							uri: imageUri
								? imageUri
								: `https://5277-125-235-191-73.ngrok-free.app/api/Files/Image/Employees/${ImageFileName}?random=${Math.random()}`,
							// method: 'GET',
							// headers: {
							// 	'Cache-Control': 'no-store',
							// },
							// cache: 'reload',
							// uri: URL.createObjectURL(photoQuery.data),
							// uri: fr.result as string,
							// uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
						}}
					/>

					<Button
						title='Đổi'
						width='small'
						onPress={async () => {
							const result = await ImagePicker.launchImageLibraryAsync({
								quality: 0.3,
								mediaTypes: ImagePicker.MediaTypeOptions.Images,
								aspect: [1, 1],
							});

							if (result.canceled) {
								return;
							}

							const image = result.assets[0];
							setImageUri(image.uri);

							const imageAsFile = createImageFromUri(image.uri);
							methods.setValue('Image', imageAsFile as any);
						}}
					/>
				</View>

				<View className='mb-2 rounded border border-primary-dark-2 bg-secondary-bright-3 p-2 shadow'>
					<Text className='border-b border-b-secondary-dark-1/25 py-1'>
						CMND/CCCD: {NationalId?.slice(0, 3)} {NationalId?.slice(3, 6)}{' '}
						{NationalId?.slice(6, 9)}{' '}
						{NationalId?.length === 12 ? NationalId?.slice(9, 12) : ''}
					</Text>
					<Text className='border-b border-b-secondary-dark-1/25 py-1'>
						Họ tên: {FullName}
					</Text>
					<Text className='border-b border-b-secondary-dark-1/25 py-1'>
						Email: {Email}
					</Text>
					<Text className='border-b border-b-secondary-dark-1/25 py-1'>
						Giới tính: {Gender}
					</Text>
					<Text className='border-b border-b-secondary-dark-1/25 py-1'>
						Vị trí: {PositionName}
					</Text>
					<Text className='border-b border-b-secondary-dark-1/25 py-1'>
						Ngày bắt đầu làm việc: {dayjs(EmployedDate).format('DD/MM/YYYY')}
					</Text>
					<Text className='border-b border-b-secondary-dark-1/25 py-1'>
						Năm kinh nghiệm: {ExperienceYears}
					</Text>
					<Text className='py-1'>
						Lương: {Salary?.toLocaleString('vi-VN')}đ
					</Text>
				</View>

				<TextInput
					keyboardType='number-pad'
					label='Số điện thoại'
					name='Phone'
					width='full'
					mb={1}
				/>
				<TextInput label='Địa chỉ' name='Address' width='full' mb={1} />

				<DateInput
					label='Ngày sinh'
					name='BirthDate'
					width='full'
					minDate={dayjs().subtract(60, 'year').toDate()}
					maxDate={dayjs().subtract(18, 'year').toDate()}
					mb={1}
				/>

				<Button
					className='mx-auto mt-2'
					title='Cập nhật'
					width='medium'
					onPress={methods.handleSubmit(handleSubmit)}
				/>
			</KeyboardAvoidingView>
		</FormProvider>
	);
}
