import { View, Text } from 'react-native';
import React from 'react';
import { TextInput } from '../../components/atoms/Input/TextInput';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '../../components/atoms/Button/Button';
import { useEmployeeStore } from '../../modules/app/Employee/Employee.store';
import { AddFeedbackRequest } from '../../modules/app/Feedback/Feedback.interface';
import dayjs from 'dayjs';
import { API } from '../../configs/axios';
import Toast from 'react-native-root-toast';

const addFeedbackSchema = z.object({
	Title: z
		.string()
		.min(5, { message: 'Ít nhất 5 kí tự.' })
		.max(30, { message: 'Nhiều nhất 30 kí tự.' }),

	Description: z
		.string()
		.min(10, { message: 'Ít nhất 10 kí tự.' })
		.max(200, { message: 'Nhiều nhất 200 kí tự.' }),
});

export default function AddFeedback() {
	const { currentEmployeeNationalId } = useEmployeeStore();
	const methods = useForm({
		defaultValues: { Title: '', Description: '' },
		resolver: zodResolver(addFeedbackSchema),
	});

	async function onSubmit(rawData: any) {
		const req: AddFeedbackRequest = {
			Title: rawData.Title,
			Description: rawData.Description,
			CreatedDate: dayjs().toISOString(),
			EmployeeNationalId: currentEmployeeNationalId as string,
		};

		const res = await API.post('Feedbacks/Create', req);

		if (res.status > 299) {
			Toast.show(`Error! ${res.status}`);
		} else {
			Toast.show('Đã gửi ý kiến.');
		}
	}

	async function onError(error: any) {
		Toast.show(`Lỗi! ${JSON.stringify(error)}`);
	}

	return (
		<FormProvider {...methods}>
			<View className='mt-4 flex w-full flex-col items-center px-4'>
				<Text className='mb-4 text-h2 font-bold text-primary-normal'>
					Đóng góp ý kiến
				</Text>

				<TextInput label='Tiêu đề' name='Title' width='full' mb={8} />

				<TextInput
					multiline
					numberOfLines={10}
					label='Nội dung'
					name='Description'
					width='full'
					mb={8}
				/>

				<Button
					title='Gửi'
					width='medium'
					onPress={methods.handleSubmit(onSubmit, onError)}
				/>
			</View>
		</FormProvider>
	);
}
