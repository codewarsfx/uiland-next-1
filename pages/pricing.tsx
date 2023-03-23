import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';
import PriceCard from '../components/PriceCard';
import { UserContext } from '../context/authContext';

export default function Pricing() {
	const user = useContext(UserContext);
	const [isActive, setIsActive] = useState(1);
	const [country, setCountry] = useState('Abia');

	const setUserCountry = async () => {
		if (navigator) {
			let latitude, longitude;
			navigator.geolocation.getCurrentPosition(async function (position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				try {
					const response = await axios(
						`http://api.geonames.org/countryCodeJSON?lat=${latitude}&lng=${longitude}&username=codewarsfx`
					);
	
					if (response) {
						// setCountry(response.data.countryName);
					}
				} catch (error) {
					console.log('an error occurred while trying to retrieve country');
				}
			});
		
		} 
	};

	const priceForCountry = (country, period) => {
		console.log("price for",country)
		const pricePerPeriod = {
			Annual: country === 'Nigeria' ? 9000 : 48,
			BiAnnual: country === 'Nigeria' ? 5000 : 22,
			Quaterly: country === 'Nigeria' ? 2000 : 15
		}

		return pricePerPeriod[period]
	}

	const Plan1 = [
		{
			type: 'Free',
			price: '0' ,
			description: 'per user/month billed annually',
			title: 'For small teams',
			info1: 'Browse 	All Screens Per Company',
			info2: 'Unlimited Filter and Search results',
			info3: 'Unlimited Collections',
			info4: 'Unlimited Single Downloads',
			planId: '',
		},
		{
			type: 'Annual',
			price: priceForCountry(country,'Annual'),
			description: 'per user/month billed annually',
			title: 'For small teams',
			info1: 'Browse All Screens Per Company',
			info2: 'Unlimited Filter and Search results',
			info3: 'Unlimited Collections',
			info4: 'Unlimited Single Downloads',
			info5: 'Batch Downloads',
			info6: 'Version Travel',
			planId: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_ID_ANNUALY,
		},
	];

	const Plan2 = [
		{
			type: 'Free',
			price: '0',
			description: 'per user/month billed bi-annually',
			title: 'For small teams',
			info1: 'Browse 	All	 Screens Per Company',
			info2: 'Unlimited Filter and Search results',
			info3: 'Unlimited Collections',
			info4: 'Unlimited Single Downloads',

			planId: '',
		},
		{
			type: 'BiAnnual',
			price: priceForCountry(country,'BiAnnual'),
			description: 'per user/month billed bi-annually',
			title: 'For small teams',
			info1: 'Browse All Screens Per Company',
			info2: 'Unlimited Filter and Search results',
			info3: 'Unlimited Collections',
			info4: 'Unlimited Single Downloads',
			info5: 'Batch Downloads',
			info6: 'Version Travel',
			planId: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_ID_BINUALLY,
		},
	];
	const Plan3 = [
		{
			type: 'Free',
			price: '0',
			description: 'per user/month billed quaterly',
			title: 'For small teams',
			info1: 'Browse 	All	 Screens Per Company',
			info2: 'Unlimited Filter and Search results',
			info3: 'Unlimited Collections',
			info4: 'Unlimited Single Downloads',
			planId: '',
		},
		{
			type: 'Quaterly',
			price: priceForCountry(country,'Quaterly'),
			description: 'per user/month billed quaterly',
			title: 'For small teams',
			info1: 'Browse All Screens Per Company',
			info2: 'Unlimited Filter and Search results',
			info3: 'Unlimited Collections',
			info4: 'Unlimited Single Downloads',
			info5: 'Batch Downloads',
			info6: 'Version Travel',
			planId: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_ID_QUATERLY,
		},
	];
	useEffect(() => {
		async function getSubscriptionInfo() {
			const data = await fetch('/api/paystackwebhook');

			const result = await data.json();
		}

		getSubscriptionInfo();
	}, []);

	//track users' location information
	useEffect(() => {
		// let userCity: string;
		// let userCountry: string;
		// let userTimeZone: string;
		// if (Intl) {
		// 	//gets the Continent information and city and returns a string
		// 	//"Africa/Nigeria"
		// 	userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		// 	//reomves the slash and converts the string to an array
		// 	let tzArr = userTimeZone.split('/');
		// 	//gets the last element of the array which is the name of the city
		// 	userCity = tzArr[tzArr.length - 1];
		// 	//checks the dictionary and returns the country name
		// 	userCountry = timeZoneCityToCountry[userCity];
		// 	//adds the country name to the useState
		// 	setCountry(timeZoneCityToCountry[userCity]);
		// 	console.log(country);
		// }
		//get user Location
		setUserCountry()
	}, []);

	const buttonDetails = [
		{ id: 1, text: 'Annual' },
		{ id: 2, text: 'Bi-Annual' },
		{ id: 3, text: 'Quaterly' },
	];

	return (
		<PricingWrapper>
			<section className='pricing-text'>
				<h1 className='pricing-text-primary'>Get Inspired by UI designs</h1>
				<p className='pricing-text-sec'>
					Designed to make your design journey easier <br />
					Start today
				</p>
			</section>
			<section className='price-tabs'>
				{buttonDetails.map((details) => {
					return (
						<button
							onClick={() => setIsActive(details.id)}
							key={details.id}
							className={`price-btn price-btn--${
								isActive === details.id ? 'active' : ''
							}`}
						>
							{details.text}
						</button>
					);
				})}
			</section>
			<section className='pricing-text pricing-text--description'>
				<h3>
					{/* For subscribers outside Nigeria , please check the{' '}
					<a
						href='https://www.cbn.gov.ng/rates/ExchRateByCurrency.asp'
						style={{ textDecoration: 'underline', textAlign: 'center' }}
						target='_blank'
						rel='noreferrer'
					>
						Official Central Bank of Nigeria Exchange Rates
					</a> */}
					{/* If Uiland doesn&lsquo;t help you in your design process, just tell us
					and we&lsquo;ll refund your money in full&#128157; */}
				</h3>
			</section>
			<section className='price-cards'>
				<section
					className={`price-cards-annual price-card-annual--${
						isActive === 1 ? 'active' : ''
					}`}
				>
					{Plan1.map((items, id) => {
						return (
							<PriceCard
								key={id}
								type={items.type}
								price={items.price}
								description={items.description}
								title={items.title}
								info1={items.info1}
								info2={items.info2}
								info3={items.info3}
								info4={items.info4}
								info5={items.info5}
								info6={items.info6}
								planId={items.planId}
								country={country}
							/>
						);
					})}
				</section>
				<section
					className={`price-cards-annual price-card-annual--${
						isActive === 2 ? 'active' : ''
					}`}
				>
					{Plan2.map((items, id) => {
						return (
							<PriceCard
								key={id}
								type={items.type}
								price={items.price}
								description={items.description}
								title={items.title}
								info1={items.info1}
								info2={items.info2}
								info3={items.info3}
								info4={items.info4}
								info5={items.info5}
								info6={items.info6}
								planId={items.planId}
								country={country}
							/>
						);
					})}
				</section>
				<section
					className={`price-cards-annual price-card-annual--${
						isActive === 3 ? 'active' : ''
					}`}
				>
					{Plan3.map((items, id) => {
						return (
							<PriceCard
								key={id}
								type={items.type}
								price={items.price}
								description={items.description}
								title={items.title}
								info1={items.info1}
								info2={items.info2}
								info3={items.info3}
								info4={items.info4}
								info5={items.info5}
								info6={items.info6}
								planId={items.planId}
								country={country}
							/>
						);
					})}
				</section>
			</section>
		</PricingWrapper>
	);
}

const PricingWrapper = styled.div`
	width: 90%;
	margin: 3em auto 3em;

	.pricing-text-primary {
		font-size: 30px;
		font-weight: bold;
		text-align: center;
		color: var(--text-color-dark);
		margin: 0;
		@media (min-width: 760px) {
			font-size: 48px;
		}
	}

	.pricing-text-sec {
		font-size: 16px;
		color: var(--text-color-dark-secondary);
		line-height: 1.5;
		text-align: center;
		margin: 0.5em;
		@media (min-width: 760px) {
			font-size: 20px;
		}
	}

	.price-tabs {
		margin: 2em auto;
		border-radius: 0.5em;
		border: 1px solid #ddd;
		display: flex;
		width: 330px;
		justify-content: space-between;
	}

	.price-btn {
		color: #666;
		border: none;
		padding: 0.9em 2.1em;
		font-weight: 500;
		margin: 0;
		font-size: 14px;
		background-color: inherit;
		border-radius: 0.5em;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.pricing-text--description {
		font-size: 18px;
		text-align: center;
		margin-bottom: 2em;
	}

	.price-btn--active {
		background-color: var(--primary-color);
		color: var(--text-color-light);
	}

	.price-cards-annual {
		position: absolute;
		display: none;
		width: 90%;
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
