import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Apex = lazy(() => import('./apex'));
const Chartjs = lazy(() => import('./chartjs'));
const Sparklines = lazy(() => import('./Sparklines'));

export default function Apps() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="apex/*" element={<Apex />} />
				<Route path="chartjs/*" element={<Chartjs />} />
				<Route path="sparklines" element={<Sparklines />} />
			</Route>
		</Routes>
	);
}
