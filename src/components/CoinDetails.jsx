import React, { useEffect, useState } from 'react';
import { Box, Container, RadioGroup, HStack, Radio, VStack, Text, Image, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Badge, Progress, Button } from '@chakra-ui/react';
import { COIN_GECKO_URL, MOCK_API_DATA } from '../assets/constants';
import Loader from './Loader';
import Error from './Error';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Chart from './Chart';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';

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

const CoinDetails = () => {
  const { coinId = '' } = useParams();
  const [coin, setCoin] = useState([]);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState('inr');
  const [days, setDays] = useState('24h');
  const [chartArray, setChartArray] = useState([]);
  const dispatch = useDispatch();
  const currencySymbol = getCurrencySymbol({ currency });
  const btns = ['24h', '7d', '14d', '30d', '60d', '200d', '365d', 'max'];
  const navigate = useNavigate();

  const switchChartStats = (btn) => {
    setDays(btn);
    setLoader(true);
  }

  const addToCartCoin = ({ coinId }) => {
    const coin = MOCK_API_DATA.find((coin) => coin.id === coinId);
    dispatch(addToCart({ ...coin, currencySymbol }));  
    navigate('/cart')
  }

  useEffect(() => {
    const coinsUrl = `${COIN_GECKO_URL}/coins/${coinId}`;
    const coinsChartUrl = `${COIN_GECKO_URL}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`;
    const fetchCoin = async () => {
      try {
        const { data = [] } = await axios.get(coinsUrl);
        const { data: chartData = [] } = await axios.get(coinsChartUrl);
        setChartArray(chartData.prices);
        setCoin(data);
        setLoader(false);
      } catch (error) {
        setError(true);
        setLoader(false);
      }
    };
    fetchCoin();
  }, [currency, coinId, days]);

  if (error) {
    return <Error message={'Error while fetching coins!!'} />
  }

  return (
    <Container maxW={'container.xl'}>
      {
        loader ? <Loader /> :
          <>
            <div style={{ display:'grid', gridTemplateColumns:'50% 50%', padding: '20px', alignItems: 'center' }}>
            <div style={{ border: '5px solid black', padding: '20px' }} >
              <Chart currency={currency} arr={chartArray} days={days} />
            </div>
            <Image src={coin.image.large} objectFit={'cover'} pl={'30%'} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'  }}>
            <HStack p='4' overflowX={'auto'}>
              {
                btns.map((btn) => (
                  <Button key={btn} onClick={() => switchChartStats(btn)}> {btn}</Button>
                ))
              }
            </HStack>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'  }}>
            <RadioGroup value={currency} onChange={setCurrency} p={'8'}>
              <HStack spacing={'4'}>
                <Radio value={'inr'}>INR</Radio>
                <Radio value={'eur'}>EUR</Radio>
                <Radio value={'usd'}>USD</Radio>
              </HStack>
            </RadioGroup>
            </div>
            <div style={{ justifyContent: 'space-around', display: 'flex', alignItems: 'center' }} >
            <Button
              bgColor={'blackAlpha.900'}
              color={'white'}
              onClick={() => addToCartCoin({ coinId })}
            >
              Add To Cart
            </Button>
            <Button
              bgColor={'blackAlpha.900'}
              color={'white'}
              onClick={() => addToCartCoin({ coinId })}
            >
              Buy Now
            </Button>
            </div>
            <VStack spacing={'4'} p='16' alignItems={'flex-start'}>
              <Text fontSize={'small'} alignSelf={'center'} opacity={0.7}>
                Last Updated On {Date(coin.market_data.last_updated).split('G')[0]}
              </Text>
              <Stat>
                <StatLabel>{coin.name}</StatLabel>
                <StatNumber>{currencySymbol}{coin.market_data.current_price[currency]}</StatNumber>
                <StatHelpText>
                  <StatArrow type={coin.market_data.price_change_percentage_24h > 0 ? 'increase' : 'decrease'} />
                  {coin.market_data.price_change_percentage_24h}
                </StatHelpText>
              </Stat>
              <Badge fontSize={'2xl'} bgColor={'blackAlpha.800'} color={'white'}>
                {`#${coin.market_cap_rank}`}
              </Badge>
              <CustomBar
                high={`${currencySymbol}${coin.market_data.high_24h[currency]}`}
                low={`${currencySymbol}${coin.market_data.low_24h[currency]}`} />
              <Box w='full' p='4'>
                <Item title={'Max Supply'} value={coin.market_data.max_supply} />
                <Item title={'Circulating Supply'} value={coin.market_data.circulating_supply} />
                <Item title={'Market Cap'} value={`${currencySymbol}${coin.market_data.market_cap[currency]}`} />
                <Item title={'All Time Low'} value={`${currencySymbol}${coin.market_data.atl[currency]}`} />
                <Item title={'All Time High'} value={`${currencySymbol}${coin.market_data.ath[currency]}`} />
              </Box>
            </VStack>
          </>
      }
    </Container>
  )
}

const Item = (props) => {
  const { title, value } = props;
  return (
    <HStack justifyContent={'space-between'} w={'full'} my={'4'}>
      <Text fontFamily={'Bebas Neue'} letterSpacing={'widest'}>{title}</Text>
      <Text>{value}</Text>
    </HStack>
  );
}

const CustomBar = (props) => {
  const { high, low } = props;
  return (
    <VStack w={'full'}>
      <Progress value={50} colorScheme={'teal'} w={'full'} />
      <HStack justifyContent={'space-between'} w={'full'}>
        <Badge children={low} colorScheme={'red'} />
        <Text fontSize={'sm'}>24H Range</Text>
        <Badge children={high} colorScheme={'green'} />
      </HStack>
    </VStack>
  );
}

export default CoinDetails