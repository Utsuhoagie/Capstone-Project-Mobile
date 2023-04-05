import React from 'react';
import { Controller } from 'react-hook-form';
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
}

export const TextInput = ({
	name,
	label,
	width,
	className,
	...props
}: TextInputProps) => {
	return (
		<View className='flex flex-col'>
			<Text className='mb-1 text-body text-neutral-gray-9'>{label}</Text>

			<Controller
				name={name}
				render={({ field: { value, onChange } }) => (
					<RNTextInput
						{...props}
						className={
							' rounded border border-primary-dark-2 bg-neutral-white p-1 ' +
							(width === 'medium' ? ' w-w-input-medium ' : ' w-full ') +
							className
						}
						value={value}
						onChangeText={onChange}
					/>
				)}
			/>
		</View>
	);
};
