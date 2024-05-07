import Cookies from 'js-cookie';
import jwtdecode from 'jwt-decode';

const TokenKey = 'token';

export function getToken() {
	return Cookies.get(TokenKey);
}

export function setToken(token) {
	return Cookies.set(TokenKey, token);
}

export function removeToken() {
	return Cookies.remove(TokenKey);
}

export function getTokenInfo() {
	return jwtdecode(Cookies.get(TokenKey));
}
