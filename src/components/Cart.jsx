import { useDispatch, useSelector } from 'react-redux';
import { HStack, Container, Stack, Text, Img, Button } from '@chakra-ui/react';
import { removeFromCart } from '../store/cartSlice';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const removeCoin = (index) => {
    dispatch(removeFromCart(index));
  }
  if (!cartItems.length) {
    return (
      <Container h={['30vh', '60vh']}>
        <Stack pt={'20'} alignItems={'center'}>
          <Text fontWeight={'bold'} letterSpacing={'widest'}>Please add items in your cart!!</Text>
        </Stack>
      </Container>
    );
  }
  const sum = cartItems.reduce((acc, item) => {
    acc += (item.current_price * item.quantity) 
    return acc;
  }, 0);
  return <Container maxW={'container.xl'} minH={'60vh'}>
    {cartItems.map((coin, index) => (
      <HStack
        key={coin.name}
        shadow={'lg'}
        p={'10'}
        borderRadius={'lg'}
        transition={'all 0.5s'}
        m={'4'}
        css={{
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%'}}>
        <Img src={coin.image} w={'12'} h={'12'} />
        <Text fontWeight={'bold'} letterSpacing={'widest'}>{coin.name} * {coin.quantity}</Text>
        <Text fontWeight={'bold'} letterSpacing={'widest'}>{coin.currencySymbol}{coin.current_price * coin.quantity}</Text>
        <Button
          bgColor={'blackAlpha.900'}
          color={'white'}
          onClick={() => removeCoin(index)}
        >
          Remove From Cart
        </Button>
        </div>
      </HStack>
    ))}
    <HStack p={'10'} m={'4'}>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%'}}>
      <Text fontWeight={'bold'} letterSpacing={'widest'}>Total</Text>
      <Text fontWeight={'bold'} letterSpacing={'widest'}>{sum}</Text>
      </div>
    </HStack>
  </Container>;
};

export default Cart;
