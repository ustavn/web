import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Booking = lazy(() => import('./booking'));
const Calendar = lazy(() => import('./Calendar'));
const Chat = lazy(() => import('./Chat'));
const CRM = lazy(() => import('./crm'));
const Ecommerce = lazy(() => import('./ecommerce'));
const Email = lazy(() => import('./email'));
const Projects = lazy(() => import('./projects'));
const SocialFeed = lazy(() => import('./SocialFeed'));
const Tasks = lazy(() => import('./tasks'));
const FileManager = lazy(() => import('./FileManager'));

export default function Apps() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="booking" element={<Booking />} />
				<Route path="calendar" element={<Calendar />} />
				<Route path="chat" element={<Chat />} />
				<Route path="crm/*" element={<CRM />} />
				<Route path="ecommerce/*" element={<Ecommerce />} />
				<Route path="email/*" element={<Email />} />
				<Route path="projects/*" element={<Projects />} />
				<Route path="social" element={<SocialFeed />} />
				<Route path="tasks/*" element={<Tasks />} />
				<Route path="file" element={<FileManager />} />
			</Route>
		</Routes>
	);
}
