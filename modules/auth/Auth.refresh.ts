/* // api.ts

import {
	TokenRefreshRequest,
	applyAuthTokenInterceptor,
} from 'react-native-axios-jwt';

import { useAuthStore } from './Auth.store';
import { Auth_API_Response } from './Auth.interface';

// 1. Create an axios instance that you wish to apply the interceptor to
export const API = axios.create({ baseURL: BASE_URL });

// 2. Define token refresh function.
const requestRefresh: TokenRefreshRequest = async (
	refreshToken: string
): Promise<string> => {
	const { accessToken } = useAuthStore.getState();
	// Important! Do NOT use the axios instance that you supplied to applyAuthTokenInterceptor
	// because this will result in an infinite loop when trying to refresh the token.
	// Use the global axios client or a different instance
	const response = await axios.post(`${BASE_URL}/Auth/Refresh`, {
		AccessToken: accessToken,
		RefreshToken: refreshToken,
	});

	const AuthResponse: Auth_API_Response = response.data;
	return AuthResponse.AccessToken;
};

// 3. Add interceptor to your axios instance
applyAuthTokenInterceptor(axios, { requestRefresh });
 */
