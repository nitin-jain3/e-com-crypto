import { Avatar, Box,Stack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
  return (
    <Box bgColor={'blackAlpha.900'} color={'whiteAlpha.700'} minH={'48'} px = {'30'} py={['26', '8']}>
      <Stack direction={['column', 'row']} h={'full'} alignItems={'center'}>
        <VStack w={'full'} alignItems={['center', 'flex-start']}>
          <Text fontWeight={'bold'}>About Us</Text>
          <Text fontSize={'sm'} letterSpacing={'widest'} textAlign={['center', 'left']}>Best In Our Domain :- Crypto Info Gathering Platform</Text>
        </VStack>
      </Stack>
    </Box>
  )
}

export default Footer