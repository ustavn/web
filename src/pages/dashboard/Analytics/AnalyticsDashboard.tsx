import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Statistics from './Statistics';
import SessionsChart from './SessionsChart';
import CountrySessionsChart from './CountrySessionsChart';
import ViewsChart from './ViewsChart';
import BrowsersChart from './BrowsersChart';
import OsChart from './OsChart';
import Channels from './Channels';
import Social from './Social';
import Engagement from './Engagement';
import { CustomDatePicker } from '@/components';

const AnalyticsDashboard = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	return (
		<>
			<Row>
				<Col>
					<div className="page-title-box">
						<div className="page-title-right">
							<form className="d-flex">
								<div className="input-group">
									<CustomDatePicker
										value={selectedDate}
										inputClass="form-control-light"
										onChange={(date) => {
											setSelectedDate(date);
										}}
									/>
								</div>
								<button className="btn btn-primary ms-2">
									<i className="mdi mdi-autorenew"></i>
								</button>
							</form>
						</div>
						<h4 className="page-title">Analytics</h4>
					</div>
				</Col>
			</Row>

			<Row>
				<Col xl={3} lg={4}>
					<Statistics />
				</Col>

				<Col xl={9} lg={8}>
					<SessionsChart />
				</Col>
			</Row>

			<Row>
				<Col>
					<CountrySessionsChart />
				</Col>
			</Row>

			<Row>
				<Col xl={4} lg={12}>
					<ViewsChart />
				</Col>
				<Col xl={4} lg={6}>
					<BrowsersChart />
				</Col>
				<Col xl={4} lg={6}>
					<OsChart />
				</Col>
			</Row>

			<Row>
				<Col xl={4} lg={6}>
					<Channels />
				</Col>
				<Col xl={4} lg={6}>
					<Social />
				</Col>
				<Col xl={4} lg={6}>
					<Engagement />
				</Col>
			</Row>
		</>
	);
};

export { AnalyticsDashboard };
