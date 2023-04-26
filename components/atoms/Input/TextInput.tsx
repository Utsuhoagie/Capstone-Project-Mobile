import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
	TextInput as RNTextInput,
	TextInputProps as RNTextInputProps,
	Text,
	View,
} from 'react-native';

export interface TextInputProps extends RNTextInputProps {
	name: string;
	label: string;
	width: 'medium' | 'full';

	mb?: number;
}

export const TextInput = ({
	name,
	label,
	width,
	mb,
	className,
	...props
}: TextInputProps) => {
	const { formState, getValues } = useFormContext();

	const error = formState.errors[name];

	return (
		<View
			className='flex w-full flex-col'
			style={{ marginBottom: mb ? mb * 4 : 0 }}
		>
			<Text className='mb-1 text-body text-neutral-gray-9'>{label}</Text>

			<Controller
				name={name}
				render={({ field: { value, onChange } }) => (
					<RNTextInput
						{...props}
						className={
							' rounded border border-primary-dark-2 p-2 ' +
							(width === 'medium' ? ' w-w-input-medium ' : ' w-full ') +
							(props.editable === false
								? ' bg-neutral-gray-4 '
								: ' bg-neutral-white ') +
							className
						}
						value={value ? `${value}` : ''}
						onChangeText={onChange}
					/>
				)}
			/>

			{error && (
				<Text className='mt-1 h-5 text-body text-state-error-normal'>
					{error.message?.toString()}
				</Text>
			)}
		</View>
	);
};
