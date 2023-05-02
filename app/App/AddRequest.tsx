import { View, Text } from 'react-native';
import React from 'react';
import { TextInput } from '../../components/atoms/Input/TextInput';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '../../components/atoms/Button/Button';
import { useEmployeeStore } from '../../modules/app/Employee/Employee.store';
import {
	AddRequestRequest,
	RequestType,
} from '../../modules/app/Request/Request.interface';
import dayjs from 'dayjs';
import { API } from '../../configs/axios';
import Toast from 'react-native-root-toast';
import SelectInput from '../../components/atoms/Input/SelectInput';
import { logger } from '../../components/Utils';
import { DateInput } from '../../components/atoms/Input/DateInput';
import { useRouter } from 'expo-router';

const addRequestSchema = z
	.object({
		Title: z
			.string()
			.min(5, { message: 'Ít nhất 5 kí tự.' })
			.max(30, { message: 'Nhiều nhất 30 kí tự.' }),

		Description: z.string().max(200, { message: 'Nhiều nhất 200 kí tự.' }),

		Type: z.enum(['Raise', 'Leave', 'Other']),

		NewSalary: z.custom((val) => {
			if (val === undefined) {
				return true;
			}

			if (!Boolean((val as string).match(/^\d{1,9}$/))) {
				return false;
			}

			const n = Number(val);
			if (n >= 999_999_999 || n <= 0) {
				return false;
			}

			return true;
		}),

		StartLeaveDate: z
			.date()
			.min(dayjs().add(1, 'day').startOf('day').toDate())
			.optional(),

		EndLeaveDate: z
			.date()
			.min(dayjs().add(1, 'day').startOf('day').toDate())
			.optional(),
	})
	.refine((obj) => {
		if (obj.Type === 'Raise' && obj.NewSalary === undefined) {
			return false;
		}

		if (obj.Type === 'Leave') {
			if (!Boolean(obj.StartLeaveDate) || !Boolean(obj.EndLeaveDate)) {
				return false;
			}

			if (dayjs(obj.StartLeaveDate).isAfter(dayjs(obj.EndLeaveDate))) {
				return false;
			}
		}

		if (obj.Type === 'Other') {
			if (obj.Description.length <= 10) {
				return false;
			}
		}

		return true;
	});

export default function AddRequest() {
	const router = useRouter();

	const { currentEmployeeNationalId } = useEmployeeStore();
	const methods = useForm({
		defaultValues: {
			Title: '',
			Description: '',
			Type: 'Raise',
			NewSalary: undefined,
			StartLeaveDate: undefined,
			EndLeaveDate: undefined,
		},
		resolver: zodResolver(addRequestSchema),
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const requestType = methods.watch('Type') as RequestType;

	async function onSubmit(rawData: any) {
		console.log(rawData);

		const req: AddRequestRequest = {
			Title: rawData.Title,
			Description: rawData.Description !== '' ? rawData.Description : undefined,
			Type: rawData.Type,

			NewSalary: rawData.Type === 'Raise' ? rawData.NewSalary : undefined,
			StartLeaveDate:
				rawData.Type === 'Leave' ? rawData.StartLeaveDate : undefined,
			EndLeaveDate: rawData.Type === 'Leave' ? rawData.EndLeaveDate : undefined,

			EmployeeNationalId: currentEmployeeNationalId as string,
		};

		console.log(req);

		const res = await API.post('Requests/Create', req);

		if (res.status >= 400) {
			Toast.show(`Error! ${res.status}`);
		} else {
			Toast.show('Đã gửi ý kiến.');
			router.back();
		}
	}

	async function onError(error: any) {
		console.log(`Lỗi!`, error);
		console.log(methods.getValues());
		Toast.show('Có lỗi xảy ra.');
	}

	return (
		<FormProvider {...methods}>
			<View className='mt-4 flex w-full flex-col items-center px-4'>
				<Text className='mb-4 text-h2 font-bold text-primary-normal'>
					Gửi yêu cầu
				</Text>

				<TextInput label='Tiêu đề' name='Title' width='full' mb={4} />

				<SelectInput
					name='Type'
					width='full'
					label='Loại yêu cầu'
					options={[
						{
							value: 'Raise',
							display: 'Tăng lương',
						},
						{
							value: 'Leave',
							display: 'Nghỉ phép',
						},
						{
							value: 'Other',
							display: 'Khác',
						},
					]}
					mb={4}
				/>

				<TextInput
					multiline
					numberOfLines={3}
					label='Nội dung'
					name='Description'
					width='full'
					mb={4}
				/>

				{requestType === 'Raise' ? (
					<TextInput
						keyboardType='number-pad'
						inputMode='numeric'
						name='NewSalary'
						label='Mức lương mới'
						width='full'
					/>
				) : undefined}

				{requestType === 'Leave' ? (
					<View className='w-full'>
						<DateInput
							name='StartLeaveDate'
							label='Từ ngày'
							minDate={dayjs().add(1, 'day').toDate()}
							width='full'
							mb={4}
						/>
						<DateInput
							name='EndLeaveDate'
							label='Đến hết ngày'
							width='full'
							minDate={dayjs().add(1, 'day').toDate()}
							mb={4}
						/>
					</View>
				) : undefined}

				<Button
					title='Gửi'
					width='medium'
					onPress={methods.handleSubmit(onSubmit, onError)}
				/>
			</View>
		</FormProvider>
	);
}
