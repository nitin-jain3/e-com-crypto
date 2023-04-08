import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { COIN_GECKO_URL, MOCK_API_DATA } from '../assets/constants';
import {
	Container,
	HStack,
	VStack,
	Img,
	Heading,
	Text,
	Button,
	RadioGroup,
	Radio,
	SliderTrack,
	SliderFilledTrack,
	Tooltip,
	Slider,
	SliderThumb
} from '@chakra-ui/react';
import Loader from './Loader';
import Error from './Error';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const getCurrencySymbol = ({ currency }) => {
	if (currency === 'inr') {
		return '₹';
	}
	if (currency === 'eur') {
		return '€';
	}
	if (currency === 'usd') {
		return '$';
	}
};

const updateCoins = ({ range, data }) => {
	let updateCoins = data.filter(coin => {
		const { current_price = '' } = coin;
		return current_price <= range ? true : false;
	}).sort((a,b) => {
		const { current_price: a_current_price = 0 } = a;
		const { current_price: b_current_price = 0 } = b;
		return b_current_price - a_current_price;
	})
	return updateCoins;
}

const Coins = () => {
	const [coins, setCoins] = useState([]);
	// const [totalCoins, setTotalCoins] = useState([]);
	const [loader, setLoader] = useState(true);
	const [error, setError] = useState(false);
	const [page, setPage] = useState(1);
	const [currency, setCurrency] = useState('inr');
	const [sliderValue, setSliderValue] = useState(500)
	const [showTooltip, setShowTooltip] = useState(false);
	const currencySymbol = getCurrencySymbol({ currency });
	const changePage = (page) => {
		setPage(page);
		setLoader(true);
	};
	useEffect(() => {
		const coinsUrl = `${COIN_GECKO_URL}/coins/marktets?vs_currency=${currency}&page=${page}&per_page=500`;
		const fetchCoins = async () => {
			try {
				// const { data = [] } = await axios.get(coinsUrl);
				let updatedCoins = updateCoins({ range: sliderValue, data: MOCK_API_DATA });
				setCoins(updatedCoins);
				setLoader(false);
			} catch (error) {
				// Sometimes this third party api gets closed for maintenance or other stuff hence dummy data in that case.
				let updatedCoins = updateCoins({ range: sliderValue, data: MOCK_API_DATA });
				setCoins(updatedCoins);
				setLoader(false);
			}
		};
		fetchCoins();
	}, [currency, page, sliderValue]);

	if (error) {
		return <Error message={'Error while fetching coins!!'} />
	}
	return (
		<Container maxW={'container.xl'} minH={'60vh'}>
			{loader ? (
				<Loader />
			) : (
				<>
					<div style={{ display: 'flex' }}>
						<div style={{ width: '20%', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.12)', maxHeight: '300px', padding: '10px', marginTop: '20px' }}>
							<label style={{ margin: '10px 0 20px', display: 'block', fontSize: '18px', fontWeight: 'bold' }}>Currency</label>
							<RadioGroup value={currency} onChange={setCurrency} style={{ alignItems: 'flex-start' }}>
								<VStack spacing={'4'} style={{ alignItems: 'flex-start' }}>
									<Radio value={'inr'}>INR</Radio>
									<Radio value={'eur'}>EUR</Radio>
									<Radio value={'usd'}>USD</Radio>
								</VStack>
							</RadioGroup>

							<label style={{ margin: '20px 0', display: 'block', fontSize: '18px', fontWeight: 'bold' }}>Price Range</label>
							<Slider
								id='slider'
								defaultValue={500}
								min={0}
								max={1000}
								colorScheme='blackAlpha'
								onChange={(v) => setSliderValue(v)}
								onMouseEnter={() => setShowTooltip(true)}
								onMouseLeave={() => setShowTooltip(false)}
							>
								<SliderTrack>
									<SliderFilledTrack />
								</SliderTrack>
								<Tooltip
									hasArrow
									bg='#000000eb'
									color='white'
									placement='top'
									isOpen={showTooltip}
									label={`${sliderValue}`}
								>
									<SliderThumb />
								</Tooltip>
							</Slider>
						</div>
						<div style={{ flex: '1' }}>
							<HStack wrap={'wrap'} justifyContent={'space-evenly'}>
								{coins.map((coin) => (
									<CoinCard
										coin={coin}
										key={coin.name}
										currencySymbol={currencySymbol}
									/>
								))}
							</HStack>

							{/* <HStack w={'full'} overflowX={'auto'} p={'8'}>
								{btns.map((item, index) => (
									<Button
										key={index}
										bgColor={'blackAlpha.900'}
										color={'white'}
										onClick={() => changePage(index + 1)}
									>
										{index + 1}
									</Button>
								))}
							</HStack> */}
						</div>
					</div>
				</>
			)}
		</Container>
	);
};

const CoinCard = (props) => {
	const {
		coin: {
			id: coinId = '',
			name = '',
			image = '',
			symbol = '',
			current_price: price = '',
		} = {},
		currencySymbol = '₹',
	} = props;
	const dispatch = useDispatch();
	const buyCoin = (props) => {
		const { coin } = props;
		dispatch(addToCart({ ...coin, currencySymbol }));
	};
	return (
		<VStack
			w={'52'}
			shadow={'lg'}
			p={'8'}
			borderRadius={'lg'}
			transition={'all 0.5s'}
			m={'4'}
			css={{
				'&:hover': {
					transform: 'scale(1.1)',
				},
			}}
		>
			<Img src={image} w={'10'} h={'10'} objectFit={'contain'} />
			<Heading size={'md'} noOfLines={1}>
				{symbol}
			</Heading>
			<Text noOfLines={1}>{name}</Text>
			<Text noOfLines={1}>{price ? `${currencySymbol}${price}` : 'NA'}</Text>
			<Link to={`/coin/${coinId}`}>
				<Button
					bgColor={'blackAlpha.900'}
					color={'white'}
				>
					More Details
				</Button>
			</Link>
			<Button
				bgColor={'blackAlpha.900'}
				color={'white'}
				onClick={() => buyCoin(props)}
			>
				Add To Cart
			</Button>
		</VStack>
	);
};

export default Coins;
