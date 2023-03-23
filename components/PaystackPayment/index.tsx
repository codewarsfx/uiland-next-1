import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { usePaystackPayment } from 'react-paystack';
import { PaystackProps } from 'react-paystack/dist/types';
import { UserContext } from '../../context/authContext';
import styled from 'styled-components';
import Script from 'next/script';

type referenceObj = {
	message: string;
	reference: string;
	status: 'sucess' | 'failure';
	trans: string;
	transaction: string;
	trxref: string;
};
const PaystackPayment = ({ plan, country, toggle,period }) => {
	const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_TEST_KEY;
	const user = useContext(UserContext);
	const router = useRouter();

	const getLink = (period) => {
		switch (period) { 
			case 'Annual':
				return 'https://uiland.lemonsqueezy.com/checkout/buy/f0629080-64bc-4b7e-8a0a-4571eed6eb6b'
			case 'BiAnnual':
				return 'https://uiland.lemonsqueezy.com/checkout/buy/2ec9e879-5b26-4b67-b3ce-15dadf9cc304'
			case 'Quaterly':
				return 'https://uiland.lemonsqueezy.com/checkout/buy/b2412321-6b91-4081-a6e7-836d677d5c3e'

		}
	}

	/**
 * @description returns the data to input state
 * @param {Object}  returns object after success message
 * @param {String} 
 * @returns {None} returns none
 * 
 * {
    "reference": "Q23457987777",
    "trans": "5676788899990",
    "status": "success",
    "message": "Approved",
    "transaction": "5676788899990",
    "trxref": "Q23457987777",
    "fallback": false,
    "bank": "UNITED BANK FOR AFRICA",
    "return": "{\"redirecturl\":\"?trxref=Q23457987777&reference=Q23457987777\",\"trans\":\"5676788899990\",\"trxref\":\"Q23457987777\",\"reference\":\"Q23457987777\",\"status\":\"success\",\"message\":\"Success\",\"response\":\"Approved\",\"fallback\":false,\"bank\":\"UNITED BANK FOR AFRICA\"}",
    "redirecturl": "?trxref=Q23457987777&reference=Q23457987777"
}
 */
	const config: PaystackProps = {
		email: user?.user_metadata.email,
		plan: plan,
		amount: 0,
		publicKey,
	};

	const initializePayment = usePaystackPayment(config);

	const onSuccess = async (reference: referenceObj) => {
		const download = await fetch('/api/paystack', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(reference.reference),
		});

		const data = await download.json();

		//prevents it from immediately redirecting back to home
		if (data.message === 'Verification successful') {
			setTimeout(() => {
				router.push('/');
			}, 200);
		}
	};

	const onClose: Function = () => {
		alert('Payment cancelled.');
	};
	const submit = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		if (!user) {
			toggle()
			return
		}
		initializePayment(onSuccess, onClose);
	};

	//fix to enable Supabase user

	return (
		<div className='App'>
			<div className='container'>
				<div className='item'></div>
				<div className='checkout-form'>
					{country === 'Nigeria' ? (
						<div onClick={submit}>
							<PaymentCta>Get started</PaymentCta>
						</div>
					) : (
						<div>
							<PaymentCta>
							<a href={getLink(period)} className="lemonsqueezy-button" >Get Started</a><Script src="https://assets.lemonsqueezy.com/lemon.js" defer></Script>
							</PaymentCta>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const PaymentCta = styled.div`
	width: 100%;
	font-size: 16px;
	padding: 0.8em 0;
	border: 1px solid #aaa;
	background-color: #fff;
	border-radius: 0.5em;
	text-align: center;
	margin-top: 1em;
	color: black !important;
	cursor: pointer;
`;

export default PaystackPayment;
