import { useAuthContext } from '@/common/context';
import { useEffect } from 'react';

export default function useLogout() {
	const { logout } = useAuthContext();

	useEffect(() => {
		const performLogout = async () => {
			try {
				await logout();
			} catch (error) {
				console.error('Logout error:', error);
			}
		};
		performLogout();
	}, [logout]);
}
