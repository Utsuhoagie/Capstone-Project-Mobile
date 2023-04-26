import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import React from 'react';
import { Controller, useController, useFormContext } from 'react-hook-form';
import {
	TextInput as RNTextInput,
	TextInputProps as RNTextInputProps,
	Text,
	View,
	Pressable,
	Button as RNButton,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { CalendarIcon } from '../../../assets/Icons/CalendarIcon';

export interface DateInputProps extends RNTextInputProps {
	name: string;
	label: string;
	width: 'medium' | 'full';
	minDate?: Date;
	maxDate?: Date;

	mb?: number;
}

export const DateInput = ({
	name,
	label,
	width,
	minDate,
	maxDate,
	mb,
	className,
	editable,
	...props
}: DateInputProps) => {
	const { formState, getValues } = useFormContext();
	const controller = useController({ name });
	const error = formState.errors[name];

	// Value is either '' or ISO string
	const value = controller.field.value;
	const isValueEmpty = value === '';
	const valueDate = isValueEmpty ? dayjs().toDate() : dayjs(value).toDate();
	const displayDate = isValueEmpty ? '' : dayjs(value).format('DD/MM/YYYY');

	const isEditable = Boolean(editable === true || editable === undefined);

	function handleOpenDatePicker() {
		DateTimePickerAndroid.open({
			value: valueDate,
			onChange: (e, d) => {
				if (e.type === 'dismissed') {
					return;
				}

				controller.field.onChange(d);
			},
			mode: 'date',
			minimumDate: minDate,
			maximumDate: maxDate,
		});
	}

	return (
		<View
			className='flex w-full flex-col'
			style={{ marginBottom: mb ? mb * 4 : 0 }}
		>
			<Text className='mb-1 text-body text-neutral-gray-9'>{label}</Text>

			<Pressable
				// {...props}
				// editable={false}
				android_ripple={{ color: '#00005f', radius: isEditable ? 180 : 0 }}
				onPress={isEditable ? handleOpenDatePicker : undefined}
				className={
					' relative h-[46px] rounded border border-primary-dark-2 p-2 ' +
					(width === 'medium' ? ' w-w-input-medium ' : ' w-full ') +
					(isEditable ? ' bg-neutral-white ' : ' bg-neutral-gray-4 ') +
					className
				}
				// value={value ? `${value}` : ''}
				// onChangeText={onChange}
			>
				<Text
					className={
						' my-auto ' +
						(isEditable ? 'text-neutral-black' : 'text-neutral-gray-5')
					}
				>
					{displayDate}
				</Text>

				<View className='absolute right-2 top-1/2 translate-y-1/2'>
					<CalendarIcon size={24} />
				</View>
			</Pressable>

			{error && (
				<Text className='mt-1 h-5 text-body text-state-error-normal'>
					{error.message?.toString()}
				</Text>
			)}
		</View>
	);
};
