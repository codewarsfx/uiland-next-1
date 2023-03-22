import Head from 'next/head';
import Image from 'next/image';

//Third party libraries
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
// Components
import {
	BottomSheet,
	Button,
	Toast,
	Pill,
} from '../../../../components/uiElements';

import { PopContext } from '../../../../context/PopContext';
import { pillsTypes } from '../../../../components/uiElements/pills';
import ImageCardInfo from '../../../../components/ImageCardInfo';
import Modal from '../../../../components/modal';
import SocialsCard from '../../../../components/SocialsCard';
import Select from '../../../../components/uiElements/select';
import Login from '../../../../components/Login/login';
import ThreeDots from '../../../../components/ThreeDots';
import DeleteIcon from '../../../../components/DeleteIcon';
import SaveIcon from '../../../../components/SaveIcon';
import CloseIcon from '../../../../components/CloseModalIcon';
import AddToBookmark from '../../../../components/AddToBookmark';

//hooks

import useScreenshot from '../../../../hooks/useScreenshot';
import {
	getAllScreens,
	getScreensById,
	getScreensByIdCount,
	getRange,
} from '../../../../supabase';
import { GetStaticPaths, GetStaticProps, GetServerSideProps } from 'next';

import { useEffect, useState, useContext, useRef } from 'react';
import NewsLetter from '../../../../components/NewsLetter';
import withPopContext from '../../../../HOC/withPopContext';
import Redis from 'ioredis';
import DownloadIcon from '../../../../components/DownloadIcon';
import CopyIcon from '../../../../components/CopyIcon';

const SinglePage = ({ screens }) => {
	const {
		headerInfo,
		toggleBottomSheet,
		modalSheet,
		modalSaveImage,
		newtoggleModal,
		submit,
		handleChange,
		selectBookmark,
		input,
		disabled,
		toggleModal,
		isModalopen,
		copy,
		isModalLogin,
		loginToggleModal,
		guideModalState,
		guideModal,
		openBottomSheet,
		closeBottomSheetModal,
		downloadImage,
		copyImage,
		getAlbumId,
		handleAddToBookMark,
		handleDeleteFromBookMark,
		elementsCategoryData,
		inputFilter,
		handleInputFilter,
		filtered,
		getId,
		deleteIndividualBookmark,
		bookmark,
		openBottomSheetModal,
		payingbanner,
		handleClickSubscribeButton,
		buttonTypes,
		Progress,
		toastPendingText,
		toastSuccessText,
		router,
		bookmarkk,
		generateZIP,
		onClickPill,
		pillStatus,
		timeHost,
	} = useScreenshot(screens);

	const [visits, setVisits] = useState<number>();
	const [active, setActive] = useState<number>(1);

	const [perPage, setPerPage] = useState<number>(20);

	const [actualCount, setActualCount] = useState<number>(0);
	const [getPeriod, setGetPeriod] = useState([]);
	// The back-to-top button is hidden at the beginning
	const [showButton, setShowButton] = useState(false);
	const { openNewsLetter, setOpenNewsLetter } = useContext(PopContext);
	const userListRef = useRef(null);

	// useEffect(()=>{
	// 	const path = router.pathname
	// 	const one=1
	// 	const query = router.query
	// 	query.page = one.toString()
	// 	router.push({
	// 		pathname: path,
	// 		query: query,
	// 	  })
	// },[])
	// Triggers fetch for new page
	const handlePagination = (page) => {
		const path = router.pathname;
		const query = router.query;
		query.page = page.selected + 1;
		router.push({
			pathname: path,
			query: query,
		});
		userListRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	console.log(filtered.length);

	//This is used to track the number of times a user has visited the screen. The guide modal
	//is displayed if the user is a first-time user.
	useEffect(() => {
		let numberOfVisits = localStorage.getItem('numberOfVisits');
		//changes the string to a number
		let toNumber = parseInt(numberOfVisits);
		if (!toNumber) {
			toNumber = 0;
		}
		//adds one every time a user visits the page
		let addToNumber = +toNumber + 1;
		setVisits(addToNumber);
		if (addToNumber < 2) {
			guideModal();
		}
		localStorage.setItem('numberOfVisits', String(addToNumber));
	}, []);

	//get actual cunt of screens
	useEffect(() => {
		async function getCount() {
			const count = await getScreensByIdCount(
				router.query.id,
				router.query.version
			);
			setActualCount(count);
		}
		getCount();
	}, [router.query.id, router.query.version]);

	//function for the previous state
	function prevPage() {
		setActive((prev) => {
			let prevPage = prev - 1;
			if (prevPage < 1 || prevPage === 1) {
				prevPage = 1;
			}
			return prevPage;
		});
	}
	//function for the next state
	function nextPage() {
		setActive((next) => {
			let nextPage = next + 1;
			if (nextPage > 7 || nextPage === 7) {
				nextPage = 7;
			}
			return nextPage;
		});
	}

	//state for the various guides
	const guides = [
		{
			id: 1,
			title1: 'SAVE ALL PHOTOS EASILY',
			title2:
				'Look for the icon to save all photos instantly  in just few clicks',
			image: '/assets/img/guide-1.png',
		},
		{
			id: 2,
			title1: 'SHARE YOUR BEST SHOTS',
			title2:
				'Share the best photos or the complete gallery on Facebook,Twitter and Whatsapp',
			image: '/assets/img/guide-2.png',
		},
		{
			id: 3,
			title1: 'DOWNLOAD ALL IMAGES',
			title2: 'Download all images at your comfort and work on them later',
			image: '/assets/img/guide-9.png',
		},
		{
			id: 4,
			title1: 'PICK YOUR FAVOURITES',
			title2:
				'Create a list of Favourite photos to share with your friends ,family, developers and designers',
			image: '/assets/img/guide-4.png',
		},
		{
			id: 5,
			title1: ' DOWNLOAD YOUR FAVOURITES',
			title2:
				'Look for the icon to  download your images instantly  in just a single click',
			image: '/assets/img/guide-5.png',
		},
		{
			id: 6,
			title1: 'COPY YOUR FAVOURITES',
			title2:
				'Look for the icon to copy your images to Figma and download your images instantly  in just a single click',
			image: '/assets/img/guide-6.png',
		},
		{
			id: 7,
			title1: 'FILTER TO YOUR FAVOURITE IMAGES',
			title2:
				'Look for the icon to filter the images  instantly  in just few clicks',
			image: '/assets/img/guide-3.png',
		},
	];
	// This function will scroll the window to the top
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth', // for smoothly scrolling
		});
	};
	useEffect(() => {
		window.addEventListener('scroll', () => {
			if (window.pageYOffset > 800) {
				setShowButton(true);
			} else {
				setShowButton(false);
			}
		});
	}, []);

	useEffect(() => {
		let monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		//this is to remove the last date from the travel history which
		//isnt needed in the UI because it is a date that is used for comparison to find the oldest travel history
		timeHost.pop();

		timeHost.forEach((time) => {
			//gets the month
			const month = new Date(time).getMonth();
			//gets the year
			const year = new Date(time).getFullYear();
			//merges the month and year together and displays the month's name
			const fullDate = monthNames[month] + ' ' + year;
			//map them into the getperiod state
			setGetPeriod((prev) => {
				return [...prev, fullDate];
			});
		});
		//adding this dependency works for now
	}, [timeHost]);

	// 	useEffect(()=>{
	// 	async	function yes(){
	// const ed= await getVersion(router.query.id)
	// 			console.log(ed)	}

	// 		yes()
	// 	},[router.query.id])
	const pageCount = Math.ceil(actualCount / perPage);

	//add canonical tag
	const canonicalUrl = (
		`https://uiland.design` + (router.asPath === '/' ? '' : router.asPath)
	).split('?')[0];

	if (!headerInfo) {
		return 
	}
	return (
		<>
			{/* for SEO */}

			<Head>
				<title>{headerInfo.name} app screens</title>
				<meta
					name='title'
					property='og:title'
					content={`${headerInfo.name} Android app screenshots`}
				/>
				<meta
					name='description'
					content={`${headerInfo.name} Android app screenshots`}
				/>
				<link rel='icon' href='/favicon.ico' />
				<link rel='canonical' href={canonicalUrl} key='canonical' />
				{/* Open Graph / Facebook */}
				<meta property='og:type' content='website' />
				<meta
					property='og:url'
					content={`https://uiland.design/screens/${headerInfo.name.toLowerCase()}/screens/${
						headerInfo.id
					}`}
				/>
				<meta
					property='og:title'
					content={`https://uiland.design/screens/${headerInfo.name.toLowerCase()}/screens/${
						headerInfo.id
					}`}
				/>
				<meta
					name='description'
					property='og:description'
					content={`screenshots of ${headerInfo.name} Android app`}
				/>
				<meta property='og:site_name' content='uiland.design' />
				<meta name='image' property='og:image' content={`${headerInfo.logo}`} />
				{/* Twitter */}
				<meta property='twitter:card' content='summary_large_image' />
				<meta
					property='twitter:url'
					content={`https://uiland.design/screens/${headerInfo.name.toLowerCase()}/screens/${
						headerInfo.id
					}`}
				/>
				<meta property='twitter:site' content='@Uiland' />
				<meta
					property='twitter:title'
					content='Discover hundreds of Mobile apps designs for UI &amp; UX research.'
				/>
				<meta
					property='twitter:description'
					content='Discover hundreds of Mobile apps designs for UI &amp; UX research.'
				/>
				<meta property='twitter:image' content={`${headerInfo.logo}`} />
			</Head>

			{/* {modalSheet && (
				<Modal toggleModal={toggleBottomSheet}>
					<ModalBox>
						<CloseIcon toggle={toggleBottomSheet} />
						<BottomsheetModal>
							<div onClick={downloadImage}>Download Image</div>
							<div onClick={copyImage}>Copy Image</div>
						</BottomsheetModal>
					</ModalBox>
				</Modal>
			)} */}
			{modalSaveImage && (
				<Modal toggleModal={newtoggleModal}>
					<AddToBookmark
						newtoggleModal={newtoggleModal}
						submit={submit}
						handleChange={handleChange}
						bookmarkk={bookmarkk}
						selectBookmark={selectBookmark}
						input={input}
						disabled={disabled}
					/>
				</Modal>
			)}
			{isModalopen && (
				<Modal toggleModal={toggleModal}>
					<SocialModalBox>
						<CloseIcon toggle={toggleModal} />
						<SocialsCard
							id={router.query.id}
							copy={copy}
							name={router.query.name}
						/>
					</SocialModalBox>
				</Modal>
			)}
			{isModalLogin && (
				<Modal toggleModal={loginToggleModal}>
					<Login toggleModal={loginToggleModal} />
				</Modal>
			)}
			{openNewsLetter && (
				<Modal toggleModal={() => setOpenNewsLetter(!openNewsLetter)}>
					<NewsLetter toggleModal={() => setOpenNewsLetter(!openNewsLetter)} />
				</Modal>
			)}
			{guideModalState && (
				<Modal toggleModal={guideModal}>
					<SocialModalBox>
						<GuideBox>
							{guides &&
								guides
									.filter((guide) => guide.id === active)
									.map((result) => (
										<>
											<GuideWrapper>
												<div className='border-bottom'>
													<img src={result?.image} width="468" height="268" alt={`Uiland guide ${result.id}`} />
												</div>

												<GuideBoxContent>
													<h2>{result.title1}</h2>
													<p>{result.title2}</p>
												</GuideBoxContent>
											</GuideWrapper>
										</>
									))}

							<NavigationBox>
								{active !== 1 ? (
									<button onClick={prevPage}>Back</button>
								) : (
									<div></div>
								)}
								<button
									className='active'
									onClick={active === 7 ? guideModal : nextPage}
								>
									{active === 7 ? 'Explore ' : 'Next'}
								</button>
							</NavigationBox>
						</GuideBox>
						<DotWrapper>
							<div className={`dot ${active === 1 && 'active'}`}></div>
							<div className={`dot ${active === 2 && 'active'}`}></div>
							<div className={`dot ${active === 3 && 'active'}`}></div>
							<div className={`dot ${active === 4 && 'active'}`}></div>
							<div className={`dot ${active === 5 && 'active'}`}></div>
							<div className={`dot ${active === 6 && 'active'}`}></div>
							<div className={`dot ${active === 7 && 'active'}`}></div>
						</DotWrapper>
					</SocialModalBox>
				</Modal>
			)}
			<BottomSheet
				openBottomSheet={openBottomSheet}
				closeBottomSheetModal={closeBottomSheetModal}
				downloadImage={downloadImage}
				copyImage={copyImage}
			/>

			<SingleHeader ref={userListRef}>
				<ImageCardInfo
					headerInfo={headerInfo}
					count={filtered?.length}
					actualCount={actualCount}
				/>
			</SingleHeader>

			<SecondHeader>
				<ImageCardWrapper>
					{!getAlbumId?.includes(router.query.id) ? (
						<BookmarkButton
							onClick={handleAddToBookMark}
							title='add to bookmark'
						>
							<img
								src='/assets/img/bookmark-dark.svg'
								alt='bookmark icon'
								className={`effect scale_transition`}
							/>
						</BookmarkButton>
					) : (
						<BookmarkButton onClick={handleDeleteFromBookMark}>
							<img
								src='/assets/img/bookmark-transparent.png'
								alt='bookmark icon'
								className='effect'
							/>
						</BookmarkButton>
					)}
					<div
						className='button_modal'
						onClick={generateZIP}
						title='download all images'
					>
						<img
							src='/assets/img/download-file-icon.svg'
							alt='download-file-icon'
						/>
					</div>
					<div
						className='button_modal'
						onClick={toggleModal}
						title='share online'
					>
						<img src='/assets/img/share.svg' alt='share-icon' />
					</div>
				</ImageCardWrapper>
				{/* <div className='flex-col'>
					<div>
						<h1 className='font_medium'>
							<a
								href={headerInfo.url}
								rel='noopener noreferrer'
								target='_blank'
							>
								Visit Website
							</a>
						</h1>
					</div>
					
				</div> */}
				<Select
					elementsCategoryData={elementsCategoryData}
					inputFilter={inputFilter}
					handleInputFilter={handleInputFilter}
				/>{' '}
			</SecondHeader>

			<CategoryTabContainer>
				<CategoryTabWrapper>
					{
						<>
							{JSON.stringify(getPeriod) !== JSON.stringify([]) &&
								getPeriod.map((result, id, arr) => {
									return (
										<Pill key={id} type={pillsTypes.category}>
											<button
												className={`pills ${pillStatus === id && 'active'}`}
												onClick={() => onClickPill(id, arr)}
												name={result}
											>
												{result}
											</button>
										</Pill>
									);
								})}
						</>
					}
				</CategoryTabWrapper>
			</CategoryTabContainer>

			<ElementsInCategoryContainer>
				{showButton && (
					<ScrollTop onClick={scrollToTop} title='scroll to top'>
						<img src='/assets/img/scroll-arrow.svg' />
					</ScrollTop>
				)}
				{/* todo:populate with filtered data */}

				{filtered?.map((data) => (
					<ScreenShotContent key={data.id}>
						<ScreenshotContainer>
							<Image
								src={data.url}
								alt={`Screenshots of ${headerInfo.name} App`}
								width={1080}
								height={2240}
								placeholder='blur'
								unoptimized
								
								blurDataURL='data:image/png;base64,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'
								
							/>
						</ScreenshotContainer>

						<SecondRow>
							{getId.includes(data.id) ? (
								<DeleteIcon
									deleteIndividualBookmark={deleteIndividualBookmark}
									data={data}
								/>
							) : (
								<SaveIcon bookmark={bookmark} data={data} />
							)}
							<DownloadIcon downloadImage={downloadImage} />
							<CopyIcon copyImage={copyImage} />
							{/* <ThreeDots openBottomSheet={openBottomSheetModal} /> */}
						</SecondRow>
					</ScreenShotContent>
				))}
			</ElementsInCategoryContainer>
			{!payingbanner && (
				<SubscribeBanner>
					<ButtonWrapper onClick={handleClickSubscribeButton}>
						<Button type={buttonTypes.modal}>
							Subscribe to View All Screens
						</Button>
					</ButtonWrapper>
					<GridBackground>
						<img src='/assets/img/grid.svg' alt='grid' />
					</GridBackground>
					<Cloud></Cloud>
				</SubscribeBanner>
			)}
			<Toast
				Progress={Progress}
				pendingText={toastPendingText}
				successText={toastSuccessText}
			/>

			<ReactPaginate
				marginPagesDisplayed={5}
				pageRangeDisplayed={5}
				previousLabel={'< Previous'}
				nextLabel={'Next >'}
				breakLabel={'...'}
				forcePage={(Number(router.query.page) || 1) - 1}
				pageCount={pageCount}
				onPageChange={handlePagination}
				disableInitialCallback={true}
				containerClassName={'paginate-wrap'}
				pageClassName={'paginate-li'}
				pageLinkClassName={'paginate-a'}
				activeClassName={'paginate-active'}
				nextLinkClassName={'paginate-next-a'}
				previousLinkClassName={'paginate-prev-a'}
				breakLinkClassName={'paginate-break-a'}
				disabledClassName={'paginate-disabled'}
			/>
		</>
	);
};
const CategoryTabContainer = styled.section`
	margin: 1.5em 0;
	padding: 1em 0;
	border: 1px solid var(--light-grey-color);
	@media (min-width: 768px) {
		margin: 3em 0;
	}
`;

const CategoryTabWrapper = styled.div`
	display: flex;
	flex-wrap: nowrap;
	overflow-x: scroll;
	gap: 0.8em;

	::-webkit-scrollbar {
		display: none;
	}
`;
const Dot = styled.div`
	height: 20px;
	width: 20px;
	border-radius: 50%;
	.active {
		background-color: white;
	}
`;

const DotWrapper = styled.div`
	display: flex;
	width: 100%;
	gap: 12px;
	align-items: center;
	padding: 12px;
	background: #070707;
	border-radius: 8px;

	justify-content: center;
	.dot {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: grey;
	}
	.dot.active {
		background: white;
	}
`;
const GuideBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;
const GuideWrapper = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.border-bottom {
		border-bottom: 1px solid grey;
	}
	img {
		width: 100%;
		object-fit: cover;
	}
`;
const GuideBoxContent = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: 20px;
	margin: 12px 0;
`;
const NavigationBox = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 12px;
	button {
		display: flex;
		cursor: pointer;
		padding: 12px 20px;
		border: 1px solid #bbbaba;
		border-radius: 6px;
		font-size: 18px;
		font-weight: 500;
		color: black;
		background: white;
	}
	button.active {
		background: var(--primary-color);
		color: white;
	}
`;
const ImageCardWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	flex-direction: row;
`;

const BookmarkButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1.5rem;
	cursor: pointer;

	border-radius: 50%;
	outline: none;
	color: white;
	font-size: 2rem;
	font-weight: 500;
	background: #ffffff;
	border: 2px solid #bac1d8;

	&:hover {
		background-color: grey;
	}

	&:focus {
		outline: none;
	}
`;
const SecondHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 95%;
	margin: 3em auto;
	flex-wrap: wrap;
	gap: 16px;

	@media (min-width: 442px) {
		justify-content: space-between;
	}
`;
const Cloud = styled.div`
	background-image: radial-gradient(
		60.83% 60.83% at 50% 50%,
		#fbfbfb 47.02%,
		hsla(0, 0%, 98%, 0) 100%
	);
	position: absolute;
	top: 0;
	width: 100%;
	left: 0;
	height: 100%;
`;
const ButtonWrapper = styled.div`
	z-index: 3;
`;
const GridBackground = styled.div`
	position: absolute;
	height: 100%;
	img {
		width: 100%;
	}
`;
const SubscribeBanner = styled.div`
	padding-right: 15px;
	padding-left: 15px;
	margin-right: auto;
	margin-left: auto;
	position: relative;
	/* margin-top: -223px; */
	background: linear-gradient(
		rgba(255, 255, 255, 0),
		rgba(255, 255, 255, 1),
		rgb(255, 255, 255)
	);
	height: 200px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #bcbec9;
	border-top-right-radius: 40px;
	border-top-left-radius: 40px;
`;

const BottomsheetModal = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: black;
	font-size: 20px;
	div {
		width: 100%;

		text-align: center;
		padding: 12px;
		font-weight: 500;
	}
	div:first-child {
		border-bottom: 1px solid #dddddd;
	}
`;
const SecondRow = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	background: rgb(0 0 0 / 9%);
	border-radius: 28px;
`;
const Input = styled.input.attrs((props) => ({}))`
	color: black;
	font-size: 1em;
	border: 1px solid grey;
	border-radius: 6px;
	margin-top: 14px;
	width: 100%;
	padding: 12px;
`;
const ScreenShotContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;
const SelectModalBox = styled.div`
	width: 80%;

	background-color: #fff;
	max-width: 37.5rem;
	padding: 1.6rem;
	border-radius: 0.5rem;
	position: relative;
	img {
		width: 5rem;
		transform-origin: 100% 0;
		opacity: 1;
		position: absolute;
		top: 6px;
		right: 6px;
		transform: scale(0.28);
	}
`;
const ModalBox = styled.div`
	width: 80%;
	position: relative;
	background-color: #fff;
	max-width: 37.5rem;
	padding: 1.6rem;
	border-radius: 0.5rem;
	img {
		width: 5rem;
		transform-origin: 100% 0;
		opacity: 1;
		position: absolute;
		top: 4px;
		right: 4px;
		transform: scale(0.28);
	}
`;
const SocialModalBox = styled.div`
	width: 80%;
	position: relative;
	background-color: #fff;
	max-width: 37.5rem;
	padding: 0.5em 1.6rem 1.6rem;
	border-radius: 0.5rem;
`;

const ScreenshotContainer = styled.div`
	border-radius: 0.8em;
	background: linear-gradient(to bottom, white 99%, black 1%);
	overflow: auto;
	border: 1px solid #dce0f1;
	border-radius: 20px;
	position: relative;
	cursor: pointer;
	user-select: none;
	&:hover .target {
		visibility: visible;
	}
	img {
		pointer-events: none;
	}
`;

const Title = styled.div`
	cursor: pointer;
	font-size: 12px;
	font-weight: 300;
	margin: 0;
	padding: 5px;
	border-radius: 5px;
	background: rgba(0, 0, 0, 0.17);
	svg {
		width: 23px;
		height: 23px;
		vertical-align: middle;
	}
	img {
		height: 30px;
		width: 100%;
		transition: all 0.5s ease-out;
	}
`;
const SingleHeader = styled.div`
	display: flex;
	flex-direction: row;
	background: #eaf3ff;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 3em;
	/* padding: 15px; */
	gap: 28px;
`;

const WebLink = styled.a`
	font-weight: 200;
	font-size: 1.3rem;
	text-decoration: none;
	color: var(--primary-color);
`;
const ScrollTop = styled.div`
	position: fixed;
	bottom: 12px;
	padding: 9px;
	-webkit-transform: rotate(270deg);
	-ms-transform: rotate(270deg);
	transform: rotate(270deg);
	-webkit-transform-origin: center;
	-ms-transform-origin: center;
	transform-origin: center;
	cursor: pointer;
	right: 29px;
	z-index: 100;
	height: 50px;
	width: 50px;
	border-radius: 50%;
	border: 1px solid #1d1d1d;
	background-color: white;
	-webkit-transition: all 5ms ease-out;
	transition: all 5ms ease-out;
	img {
		width: 100%;
	}
	:hover {
		transform: rotate(280deg);
	}
`;
const ElementsInCategoryContainer = styled.div`
	position: relative;
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	margin: 1.5em auto;
	gap: 32px;
	width: 90%;
	@media (min-width: 540px) {
		grid-template-columns: repeat(2, 1fr);
	}
	@media (min-width: 768px) {
		width: 95%;

		margin: 0 auto 3em auto;
		gap: 32px;
		grid-template-columns: repeat(4, 1fr);
	}
`;

export const getServerSideProps: GetServerSideProps = async ({
	query,
	params,
}) => {
	let screens;
	const page = query.page || 1;

	const completeID = params.id + page.toString() + query.version;

	const screensCacheObject = {};

	const client = new Redis(process.env.REDIS_URL); //get redis instance

	const CachedResults = JSON.parse(await client.get('screensCachedByID')); //get  screens data

	if (!CachedResults) {
		screens = await getScreensById(params.id, page, query);  // if there are no cached results retrieve from supabase
		screensCacheObject[completeID] = screens;  //store cached results to instance... the to differentiate different screens for the different pages a unique identifier using the 
		// screensid, page number and screens version is used. the structure of the data in upstach would be as follows

		// {
		// 	screensCachedByID : screens[]
		// }

		client.set(
			'screensCachedByID',
			JSON.stringify(screensCacheObject),
			'EX',
			3600
		);
		console.log('read from supabase');
	} else if (completeID in CachedResults) {
		// if cache already exists fetch the screens for that unique identifier built from the screen identity, page number and screen version
		screens = CachedResults[completeID];
		console.log('read from Redis cache');
	} else if (CachedResults && !(completeID in CachedResults)) {
		screens = await getScreensById(params.id, page, query);
		CachedResults[completeID] = screens;
		client.set('screensCachedByID', JSON.stringify(CachedResults), 'EX', 3600);
		console.log('read from supabase');
	}

	return {
		props: {
			screens,
		},
	};
};
export default withPopContext(SinglePage);
