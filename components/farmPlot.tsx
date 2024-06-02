import React, { useEffect, useState } from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';

const FarmPlot = ({ plot, index, onClick }: { plot: any, index: number, onClick: (index: number) => void }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (plot.harvestAt) {
        console.log("Plot Harvest At", plot.harvestAt);
        const harvestTime = new Date(plot.harvestAt * 1000);
        console.log()
        if (!isNaN(harvestTime.getTime())) {
          setTimeLeft(formatDistanceToNow(harvestTime, { includeSeconds: true }));
        } else {
          setTimeLeft('Invalid date');
        }
      } else {
        setTimeLeft('N/A');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [plot.harvestAt]);

  const getImage = () => {
    switch (plot.state) {
      case 'seeded':
        return '/seed.png';
      case 'germination':
        return '/germination.png';
      case 'seedling':
        return '/seedling.png';
      case 'growing':
        return '/growing.png';
      case 'mature':
        return '/harvest.png';
      default:
        return '';
    }
  };

  return (
    <Box
      w="50px"
      h="50px"
      borderWidth="2px"
      borderColor="#5D3A00"
      borderRadius="lg"
      bg="#A0522D"
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={() => onClick(index)}
    >
      {getImage() && <Image src={getImage()} alt={plot.state} boxSize="100%" />}
      {/* {plot.state === 'mature' && (
        
        <Text fontSize="xs" color="white" mt={1}>
          {timeLeft}
        </Text>
      )} */}
    </Box>
  );
};

export default FarmPlot;
