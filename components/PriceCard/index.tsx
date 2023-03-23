import Link from 'next/link';
import React, { useContext } from 'react';
import { BsCheck } from 'react-icons/bs';

import styled from 'styled-components';
import PaystackPayment from '../PaystackPayment';
import { UserContext } from '../../context/authContext';
import Login from '../Login/login';
import Modal from '../modal';
import useModal from '../../hooks/useModal';
import { useRouter } from 'next/router';

function PriceCard({
	type,
	price,
	description,
	title,
	info1,
	info2,
	info3,
	info4,
	info5,
	info6,
	planId,
	country,
}) {
	const user = useContext(UserContext);
	const { loginToggleModal, isModalLogin } = useModal();
	const router = useRouter();

	//function that redirects to the homepage when the user is logged in and login modal is opened
	//when the user is not logged in
	function pricingToggle() {
		if (user) {
			//pushes logged in user to the homepage
			router.push('/');
		} else {
			//displays login modal
			loginToggleModal();
		}
	}
	return (
		<>
			{isModalLogin && (
				<Modal toggleModal={loginToggleModal}>
					<Login toggleModal={loginToggleModal} />
				</Modal>
			)}
			<PriceCards>
				<h3 className='price-card-type'>{type}</h3>
				<h1 className='price-card-price'>{`${country=== "Nigeria"?"₦":"$"}${price}`}</h1>
				<p className='price-card-description'>{description}</p>
				<div className='price-card-points'>
					<p className='price-point-title'>{title}</p>
					<p className='price-card-point'>
						<span className='price-card-point-icon'>
							<CheckIcon />
						</span>
						{info1}
					</p>
					<p className='price-card-point'>
						<span className='price-card-point-icon'>
							<CheckIcon />
						</span>{' '}
						{info2}
					</p>
					<p className='price-card-point'>
						<span className='price-card-point-icon'>
							<CheckIcon />
						</span>{' '}
						{info3}
					</p>
					<p className='price-card-point'>
						<span className='price-card-point-icon'>
							<CheckIcon />
						</span>{' '}
						{info4}
					</p>
					{info5 && (
						<p className='price-card-point'>
							<span className='price-card-point-icon'>
								<CheckIcon />
							</span>{' '}
							{info5}
						</p>
					)}
					{info6 && (
						<p className='price-card-point'>
							<span className='price-card-point-icon'>
								<CheckIcon />
							</span>{' '}
							{info6}
						</p>
					)}
					{planId === '' ? (
						<PaymentCta onClick={pricingToggle}>Try Now</PaymentCta>
					) : (
						<PaystackPayment period={type} toggle={loginToggleModal} plan={planId} country={country} />
					)}
				</div>
			</PriceCards>
		</>
	);
}
const CheckIcon = styled(BsCheck)`
	color: #bbb;
	font-weight: 600;
`;
const PaymentCta = styled.div`
	width: 100%;
	font-size: 16px;
	padding: 0.8em 0;
	border: 1px solid #aaa;
	background-color: #fff;
	border-radius: 0.5em;
	text-align: center;
	margin-top: 1em;
	cursor: pointer;
	:hover {
		color: black;
	}
`;
const PriceCards = styled.div`
	border: 0.5px solid #ddd;
	padding: 2em;
	cursor: pointer;
	border-radius: 1em;
	width: 90%;
	max-width: 320px;
	margin: 1em auto;
	color: var(--text-color-dark);
	font-weight: 500;
	box-shadow: 0.1px 0.1px 5px #eee;
	transition: all 0.2s ease;

	:hover {
		background-color: var(--primary-color);
		color: #fff;
		box-shadow: 0.1px 0.1px 10px #ddd;

		.price-card-description {
			color: #fff;
		}

		${PaymentCta} {
			color: black;
		}

		.price-card-point-icon {
			background-color: #fff;
		}
	}

	.price-card-type {
		font-size: 18px;
		font-weight: 600;
	}

	.price-card-price {
		font-size: 36px;
		margin: 0.2em 0;
	}

	.price-card-description {
		font-size: 12px;
		color: #777;
		margin: 0;
		font-weight: 600;
	}
	.price-card-points {
		margin: 1em 0;
	}

	.price-point-title {
		font-size: 18px;
		margin: 1.5em 0 0;
	}
	.price-card-point {
		display: flex;
		align-items: center;
		font-size: 18px;
		margin: 1em 0;
	}

	.price-card-point-icon {
		width: 25px;
		height: 25px;
		border-radius: 0.4em;
		border: 1px solid #ccc;
		display: inline-flex;
		background-color: #eee;
		margin-right: 0.5em;
		justify-content: center;
		align-items: center;
	}

	.price-cards {
		position: relative;
	}

	.price-cards-annual {
		position: absolute;
		display: none;
		width: 100%;
		@media (min-width: 760px) {
			max-width: 700px;
			left: 50%;
			transform: translateX(-50%);
		}
	}
	.price-card-annual--active {
		display: block;
		@media (min-width: 760px) {
			display: flex;
		}
	}
`;

export default PriceCard;
