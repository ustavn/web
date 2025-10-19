import { useState } from 'react';
import { Card, Row, Col, Nav, Badge, Form, ButtonGroup, Button } from 'react-bootstrap';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import { BookingData } from './data';

const BookingApp = () => {
	const [activeTab, setActiveTab] = useState('new');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedFilter, setSelectedFilter] = useState('review-today');
	const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

	// Mock data counts
	const tabCounts = {
		new: 45,
		verification: 23,
		approval: 12,
		processed: 156
	};

	const filters = [
		{ key: 'review-today', label: 'Review today', active: true },
		{ key: 'expired', label: 'Expired', active: false },
		{ key: 'upcoming', label: 'Upcoming', active: false },
		{ key: 'unassigned', label: 'Unassigned', active: false }
	];

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedBookings(BookingData.map(booking => booking.id));
		} else {
			setSelectedBookings([]);
		}
	};

	const handleSelectBooking = (bookingId: string, checked: boolean) => {
		if (checked) {
			setSelectedBookings(prev => [...prev, bookingId]);
		} else {
			setSelectedBookings(prev => prev.filter(id => id !== bookingId));
		}
	};

	const filteredBookings = BookingData.filter(booking => {
		const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			booking.orderId.toLowerCase().includes(searchTerm.toLowerCase());
		
		let matchesFilter = true;
		switch (selectedFilter) {
			case 'review-today':
				matchesFilter = booking.status === 'new';
				break;
			case 'expired':
				matchesFilter = booking.status === 'expired';
				break;
			case 'upcoming':
				matchesFilter = booking.status === 'upcoming';
				break;
			case 'unassigned':
				matchesFilter = booking.status === 'unassigned';
				break;
		}

		return matchesSearch && matchesFilter;
	});

	return (
		<>
			<PageBreadcrumb title="Booking Management" subName="Apps" />
			
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							{/* Header Tabs */}
							<Nav variant="tabs" className="nav-bordered mb-4">
								<Nav.Item>
									<Nav.Link 
										active={activeTab === 'new'} 
										onClick={() => setActiveTab('new')}
										className="d-flex align-items-center gap-2"
									>
										New
										{tabCounts.new > 0 && (
											<Badge bg="danger" className="ms-1">
												{tabCounts.new}
											</Badge>
										)}
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link 
										active={activeTab === 'verification'} 
										onClick={() => setActiveTab('verification')}
										className="d-flex align-items-center gap-2"
									>
										Verification Due
										{tabCounts.verification > 0 && (
											<Badge bg="warning" className="ms-1">
												{tabCounts.verification}
											</Badge>
										)}
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link 
										active={activeTab === 'approval'} 
										onClick={() => setActiveTab('approval')}
										className="d-flex align-items-center gap-2"
									>
										Approval Due
										{tabCounts.approval > 0 && (
											<Badge bg="info" className="ms-1">
												{tabCounts.approval}
											</Badge>
										)}
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link 
										active={activeTab === 'processed'} 
										onClick={() => setActiveTab('processed')}
										className="d-flex align-items-center gap-2"
									>
										Processed
										{tabCounts.processed > 0 && (
											<Badge bg="success" className="ms-1">
												{tabCounts.processed}
											</Badge>
										)}
									</Nav.Link>
								</Nav.Item>
							</Nav>

							{/* Search and Filters */}
							<Row className="mb-4">
								<Col md={6}>
									<div className="position-relative">
										<i className="mdi mdi-magnify position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ fontSize: '18px' }}></i>
										<Form.Control
											type="text"
											placeholder="Search bookings..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="ps-5"
										/>
									</div>
								</Col>
								<Col md={6}>
									<div className="d-flex gap-2">
										{filters.map((filter) => (
											<Button
												key={filter.key}
												variant={selectedFilter === filter.key ? 'primary' : 'outline-primary'}
												size="sm"
												onClick={() => setSelectedFilter(filter.key)}
											>
												{filter.label}
											</Button>
										))}
									</div>
								</Col>
							</Row>

							{/* Action Buttons */}
							<Row className="mb-4">
								<Col xs={12}>
									<ButtonGroup className="mb-2">
										<Button variant="primary" size="sm">
											<i className="mdi mdi-plus me-1"></i>
											Add
										</Button>
										<Button variant="secondary" size="sm" disabled={selectedBookings.length === 0}>
											<i className="mdi mdi-pencil me-1"></i>
											Edit
										</Button>
										<Button variant="danger" size="sm" disabled={selectedBookings.length === 0}>
											<i className="mdi mdi-delete me-1"></i>
											Delete
										</Button>
										<Button variant="success" size="sm" disabled={selectedBookings.length === 0}>
											<i className="mdi mdi-refresh me-1"></i>
											Update
										</Button>
										<Button variant="warning" size="sm" disabled={selectedBookings.length === 0}>
											<i className="mdi mdi-close me-1"></i>
											Cancel
										</Button>
									</ButtonGroup>
								</Col>
							</Row>

							{/* Table */}
							<div className="table-responsive">
								<table className="table table-centered table-striped table-hover">
									<thead>
										<tr>
											<th>
												<Form.Check
													type="checkbox"
													checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
													onChange={(e) => handleSelectAll(e.target.checked)}
												/>
											</th>
											<th>Order ID</th>
											<th>Customer Name</th>
											<th>Booking Time</th>
											<th>Amount</th>
											<th>Appointment Time</th>
											<th>Services</th>
											<th>Status</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{filteredBookings.map((booking) => (
											<tr key={booking.id}>
												<td>
													<Form.Check
														type="checkbox"
														checked={selectedBookings.includes(booking.id)}
														onChange={(e) => handleSelectBooking(booking.id, e.target.checked)}
													/>
												</td>
												<td>
													<strong>{booking.orderId}</strong>
												</td>
												<td>{booking.customerName}</td>
												<td>{booking.bookingTime}</td>
												<td>
													<span className="fw-semibold">${booking.amount}</span>
												</td>
												<td>{booking.appointmentTime}</td>
												<td>
													<div className="d-flex flex-wrap gap-1">
														{booking.services.map((service, index) => (
															<Badge key={index} bg="light" text="dark" className="px-2 py-1">
																{service}
															</Badge>
														))}
													</div>
												</td>
												<td>
													<Badge bg={booking.status === 'new' ? 'danger' : booking.status === 'expired' ? 'warning' : 'success'}>
														{booking.status}
													</Badge>
												</td>
												<td>
													<ButtonGroup size="sm">
														<Button variant="outline-primary" size="sm">
															<i className="mdi mdi-pencil"></i>
														</Button>
														<Button variant="outline-danger" size="sm">
															<i className="mdi mdi-delete"></i>
														</Button>
													</ButtonGroup>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Pagination */}
							<Row className="mt-4">
								<Col xs={12}>
									<div className="d-flex justify-content-between align-items-center">
										<div className="text-muted">
											Showing 1 to {filteredBookings.length} of {filteredBookings.length} entries
										</div>
										<div className="d-flex gap-1">
											<Button variant="outline-primary" size="sm">Previous</Button>
											<Button variant="primary" size="sm">1</Button>
											<Button variant="outline-primary" size="sm">2</Button>
											<Button variant="outline-primary" size="sm">3</Button>
											<Button variant="outline-primary" size="sm">Next</Button>
										</div>
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default BookingApp;
