import Constants from 'expo-constants';
import axios from 'axios';
import { useAuthStore } from '../modules/auth/Auth.store';
import { Auth_API_Response } from '../modules/auth/Auth.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { manifest, expoConfig } = Constants;

// NOTE: DOESN'T WORK
// const BASE_URL = `https://${manifest?.debuggerHost
// 	?.split(':')
// 	.shift()}:5000/api`;

const BASE_URL = `https://6465-2402-800-63a8-e0cd-684e-2531-c555-3105.ngrok-free.app/api`;

export const AuthAPI = axios.create({
	baseURL: `${BASE_URL}/Auth`,
	headers: {
		'Content-Type': 'application/json',
	},
});

export const API = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

API.interceptors.request.use(
	async (config) => {
		const { accessToken, refreshToken } = useAuthStore.getState();

		config.headers['Accept'] = 'application/json';
		// config.headers['Content-Type'] = 'application/json';
		config.headers['Authorization'] = `Bearer ${accessToken}`;

		return config;
	},
	(error) => Promise.reject(error)
);

API.interceptors.response.use(
	(res) => res,
	async (error) => {
		const originalConfig = error.config;

		if (error.response) {
			// NOTE: Access Token expired
			if (error.response.status === 401 && !originalConfig._retry) {
				originalConfig._retry = true;

				const { accessToken, refreshToken } = useAuthStore.getState();

				try {
					const refreshRes = await API.post('Auth/Refresh', {
						AccessToken: accessToken,
						RefreshToken: refreshToken,
					});
					const { AccessToken, RefreshToken }: Auth_API_Response =
						refreshRes.data;
					AsyncStorage.setItem('AccessToken', AccessToken);
					API.defaults.headers.common[
						'Authorization'
					] = `Bearer ${accessToken}`;

					return API(originalConfig);
				} catch (_error: any) {
					if (_error.response && _error.response.data) {
						return Promise.reject(_error.response.data);
					}

					return Promise.reject(_error);
				}
			}

			// NOTE: Unauthorized
			if (error.response.status === 403 && error.response.data) {
				return Promise.reject(error.response.data);
			}
		}

		return Promise.reject(error);
	}
);
