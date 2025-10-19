import { ReactNode, useState } from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { Form, InputGroup } from 'react-bootstrap';

type PasswordInputProps = {
	name: string;
	type?: 'password';
	id?: string;
	label?: string;
	className?: string;
	containerClass?: string;
	errors?: Record<string, { message: string }>;
	placeholder?: string;
	helpText?: string;
	register?: RegisterOptions;
	control?: Control<any>;
	children?: ReactNode;
};

export default function PasswordInput({
	name,
	type = 'password',
	id,
	label,
	className,
	containerClass,
	helpText,
	children,
	errors,
	control,
	register,
	...props
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<>
			<Controller
				name={name}
				control={control}
				render={({ field, fieldState }) => (
					<Form.Group className={containerClass}>
						{label && (
							<>
								{children}
								<Form.Label>{label}</Form.Label>
							</>
						)}
						<InputGroup className="mb-0">
							<Form.Control
								{...props}
								{...field}
								type={showPassword ? 'text' : 'password'}
								value={field.value ?? ''}
								id={id}
								onChange={(e) => {
									field.onChange(e.target.value);
								}}
								className={className}
								isInvalid={Boolean(fieldState.error?.message)}
							/>
							<div
								className={`input-group-text input-group-password ${
									showPassword ? 'show-password' : ''
								}`}
								data-password={showPassword ? 'true' : 'false'}
							>
								<span
									className="password-eye"
									onClick={() => {
										setShowPassword(!showPassword);
									}}
								></span>
							</div>
						</InputGroup>
						{helpText && (
							<Form.Text id={`${name}-help`} muted>
								{helpText}
							</Form.Text>
						)}
						{errors && errors[name] && (
							<Form.Control.Feedback type="invalid" className="d-block">
								{errors[name]['message']}
							</Form.Control.Feedback>
						)}
					</Form.Group>
				)}
			/>
		</>
	);
}
