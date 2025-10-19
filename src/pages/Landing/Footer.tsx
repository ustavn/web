import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo.png';

const Footer = () => {
	return (
		<footer className="bg-dark py-5">
			<Container>
				<Row>
					<Col lg={6}>
						<img src={logo} alt="" className="logo-dark" height="22" />
						<p className="text-light text-opacity-50 mt-4">
							USTA makes it easier to build better websites with
							<br /> great speed. Save hundreds of hours of design
							<br /> and development by using it.
						</p>

						<ul className="social-list list-inline mt-3">
							<li className="list-inline-item text-center">
								<Link
									to=""
									className="social-list-item border-primary text-primary"
								>
									<i className="mdi mdi-facebook"></i>
								</Link>
							</li>
							<li className="list-inline-item text-center">
								<Link to="" className="social-list-item border-danger text-danger">
									<i className="mdi mdi-google"></i>
								</Link>
							</li>
							<li className="list-inline-item text-center">
								<Link to="" className="social-list-item border-info text-info">
									<i className="mdi mdi-twitter"></i>
								</Link>
							</li>
							<li className="list-inline-item text-center">
								<Link
									to=""
									className="social-list-item border-secondary text-secondary"
								>
									<i className="mdi mdi-github"></i>
								</Link>
							</li>
						</ul>
					</Col>
					<Col lg={2} md={4} className="mt-3 mt-lg-0">
						<h5 className="text-light">Company</h5>

						<ul className="list-unstyled ps-0 mb-0 mt-3">
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									About Us
								</Link>
							</li>
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									Documentation
								</Link>
							</li>
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									Blog
								</Link>
							</li>
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									Affiliate Program
								</Link>
							</li>
						</ul>
					</Col>
					<Col lg={2} md={4} className="mt-3 mt-lg-0">
						<h5 className="text-light">Apps</h5>

						<ul className="list-unstyled ps-0 mb-0 mt-3">
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									Ecommerce Pages
								</Link>
							</li>
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									Email
								</Link>
							</li>
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									Social Feed
								</Link>
							</li>
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									Projects
								</Link>
							</li>
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									Tasks Management
								</Link>
							</li>
						</ul>
					</Col>
					<Col lg={2} md={4} className="mt-3 mt-lg-0">
						<h5 className="text-light">Discover</h5>
						<ul className="list-unstyled ps-0 mb-0 mt-3">
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									Help Center
								</Link>
							</li>
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									Our Products
								</Link>
							</li>
							<li className="mt-2">
								<Link to="" className="text-light text-opacity-50">
									Privacy
								</Link>
							</li>
						</ul>
					</Col>
				</Row>
				<Row>
					<Col lg={12}>
						<div className="mt-5">
							<p className="text-light text-opacity-50 mt-4 text-center mb-0">
								© 2018 - {new Date().getFullYear()} USTA. Design and coded by
								Coderthemes
							</p>
						</div>
					</Col>
				</Row>
			</Container>
		</footer>
	);
};

export default Footer;
