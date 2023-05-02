import { View, Text, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { TextInput } from '../../components/atoms/Input/TextInput';
import { Button } from '../../components/atoms/Button/Button';
import { logger } from '../../components/Utils';
import { CheckIcon, Select } from 'native-base';
import SelectInput from '../../components/atoms/Input/SelectInput';

export default function EXAMPLE() {
	const methods = useForm({
		defaultValues: {
			Field1: '',
			Field2: '',
		},
	});

	return (
		<FormProvider {...methods}>
			<KeyboardAvoidingView className='mt-4 flex w-full flex-col items-center'>
				<TextInput name='Field1' label='Field 1' width='full' />

				<SelectInput
					name='Field2'
					label='Field 2'
					width='full'
					options={[{}]}
				/>

				<Button
					title='Xem form'
					onPress={() => logger(methods.getValues())}
					width='medium'
				/>
			</KeyboardAvoidingView>
		</FormProvider>
	);
}
