import { Row, Col, Button } from 'react-bootstrap';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import MaskedInput from 'react-text-mask';
import { Form, TextInput } from '@/components';
import { countries } from './data';

type ShippingProps = {
	updateShipping: (shippingCost: number) => void;
};

const Shipping = ({ updateShipping }: ShippingProps) => {
	/*
	 * form validation schema
	 */
	const schema = yup.object().shape({
		firstname: yup.string().required('Please enter firstname'),
		lastname: yup.string().required('Please enter lastname'),
		email: yup.string().required('Please enter Email address'),
	});

	return (
		<Row>
			<Col>
				<h4 className="mt-2">Saved Address</h4>
				<p className="text-muted mb-3">
					Fill the form below in order to send you the order's invoice.
				</p>

				<Row>
					<Col md={6}>
						<div className="border p-3 rounded">
							<address className="mb-0 address-lg">
								<div className="form-check">
									<input
										type="radio"
										id="customRadio1"
										name="customRadio"
										className="form-check-input"
										defaultChecked
									/>
									<label
										className="form-check-label font-16 fw-bold"
										htmlFor="customRadio1"
									>
										Home
									</label>
								</div>
								<br />
								<span className="fw-semibold">Stanley Jones</span> <br />
								795 Folsom Ave, Suite 600
								<br />
								San Francisco, CA 94107
								<br />
								<abbr title="Phone">P:</abbr> (123) 456-7890 <br />
							</address>
						</div>
					</Col>

					<Col md={6}>
						<div className="border p-3 rounded">
							<address className="mb-0 address-lg">
								<div className="form-check">
									<input
										type="radio"
										id="customRadio2"
										name="customRadio"
										className="form-check-input"
									/>
									<label
										className="form-check-label font-16 fw-bold"
										htmlFor="customRadio2"
									>
										Office
									</label>
								</div>
								<br />
								<span className="fw-semibold">Stanley Jones</span> <br />
								795 Folsom Ave, Suite 600
								<br />
								San Francisco, CA 94107
								<br />
								<abbr title="Phone">P:</abbr> (123) 456-7890 <br />
							</address>
						</div>
					</Col>
				</Row>

				<h4 className="mt-4">Add New Address</h4>
				<p className="text-muted mb-4">
					Fill the form below so we can send you the order's invoice.
				</p>

				<Form onSubmit={() => {}} schema={schema}>
					<Row>
						<Col md={6}>
							<TextInput
								label="First Name"
								type="text"
								name="firstname"
								placeholder="Enter your first name"
								containerClass={'mb-3'}
								key="firstname"
							/>
						</Col>
						<Col md={6}>
							<TextInput
								label="Last Name"
								type="text"
								name="lastname"
								placeholder="Enter your last name"
								containerClass={'mb-3'}
								key="lastname"
							/>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							<TextInput
								label="Email address"
								type="email"
								name="email"
								placeholder="Enter your email"
								containerClass={'mb-3'}
								key="email"
							/>
						</Col>
						<Col md={6}>
							<div className="form-group mb-3">
								<label className="form-label">Phone</label>
								<MaskedInput
									mask={[
										'(',
										/[1-9]/,
										/\d/,
										/\d/,
										')',
										' ',
										/\d/,
										/\d/,
										/\d/,
										'-',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
									]}
									placeholder="(xxx) xxxx-xxxx"
									className="form-control"
								/>
							</div>
						</Col>
					</Row>
					<Row>
						<Col md={12}>
							<TextInput
								label="Address"
								type="text"
								name="address"
								placeholder="Enter your state"
								containerClass={'mb-3'}
								key="address"
							/>
						</Col>
					</Row>
					<Row>
						<Col md={4}>
							<TextInput
								label="Town / City"
								type="text"
								name="towncity"
								placeholder="Enter your city name"
								containerClass={'mb-3'}
								key="towncity"
							/>
						</Col>
						<Col md={4}>
							<TextInput
								label="State"
								type="text"
								name="state"
								placeholder="Enter your state"
								containerClass={'mb-3'}
								key="state"
							/>
						</Col>
						<Col md={4}>
							<TextInput
								label="Zip / Postal Code"
								type="text"
								name="zippostal"
								placeholder="Enter your zip code"
								containerClass={'mb-3'}
								key="zippostal"
							/>
						</Col>
					</Row>
					<Row>
						<Col md={12}>
							<div className="form-group mb-3">
								<label className="form-label">Country</label>
								<Select
									className="react-select"
									classNamePrefix="react-select"
									options={countries}
								></Select>
							</div>
						</Col>
					</Row>

					<h4 className="mt-4">Shipping Method</h4>
					<p className="text-muted mb-3">
						Fill the form below in order to send you the order's invoice.
					</p>

					<Row>
						<Col md={6}>
							<div className="border p-3 rounded mb-3 mb-md-0">
								<div className="form-check">
									<input
										type="radio"
										id="shippingMethodRadio1"
										name="shippingOptions"
										className="form-check-input"
										defaultChecked
										onChange={() => {
											updateShipping(0);
										}}
									/>
									<label
										className="form-check-label font-16 fw-bold"
										htmlFor="shippingMethodRadio1"
									>
										Standard Delivery - FREE
									</label>
								</div>
								<p className="mb-0 ps-3 pt-1">
									Estimated 5-7 days shipping (Duties and tax may be due upon
									delivery)
								</p>
							</div>
						</Col>
						<Col md={6}>
							<div className="border p-3 rounded">
								<div className="form-check">
									<input
										type="radio"
										id="shippingMethodRadio2"
										name="shippingOptions"
										className="form-check-input"
										onChange={() => {
											updateShipping(25);
										}}
									/>
									<label
										className="form-check-label font-16 fw-bold"
										htmlFor="shippingMethodRadio2"
									>
										Fast Delivery - $25
									</label>
								</div>
								<p className="mb-0 ps-3 pt-1">
									Estimated 1-2 days shipping (Duties and tax may be due upon
									delivery)
								</p>
							</div>
						</Col>
					</Row>

					<Row className="mt-4">
						<Col sm={6}>
							<Link
								to="/apps/ecommerce/shopping-cart"
								className="btn text-muted d-none d-sm-inline-block btn-link fw-semibold"
							>
								<i className="mdi mdi-arrow-left"></i> Back to Shopping Cart
							</Link>
						</Col>
						<Col sm={6} className="text-sm-end">
							<Button variant="danger" type="submit">
								<i className="mdi mdi-cash-multiple me-1"></i> Continue to Payment
							</Button>
						</Col>
					</Row>
				</Form>
			</Col>
		</Row>
	);
};

export default Shipping;
