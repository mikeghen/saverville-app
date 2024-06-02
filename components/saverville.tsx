import React, { useState, useEffect } from 'react';
import { Container, Button, VStack, Text, Box, Image, useToast, SimpleGrid, HStack, Input } from '@chakra-ui/react';
import { useAccount, useConnect, useBalance } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { buySeeds, plantSeeds, waterSeeds, harvestPlant } from '../utils/ethereum';
import FarmPlot from './FarmPlot';

const Saverville = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [seeds, setSeeds] = useState(0);
    const [plants, setPlants] = useState(0);
    const [farmGrid, setFarmGrid] = useState(Array.from({ length: 100 }, () => ({ state: 'empty' })));
    const [mode, setMode] = useState('planting');
    const [seedQuantity, setSeedQuantity] = useState(1); // New state for seed quantity
    const seedPrice = 1; // Example price for each seed
    const toast = useToast();

    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    const { data: balance } = useBalance({
        addressOrName: address,
        watch: true,
    });

    useEffect(() => {
        if (!isConnected) {
            connect();
        }
        setIsMounted(true);
    }, [isConnected, connect]);

    const handleBuySeeds = async () => {
        if (!isConnected) {
            toast({
                title: 'Wallet not connected',
                description: 'Please connect your wallet to buy seeds.',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        try {
            await buySeeds(seedQuantity); // Use the quantity from input
            setSeeds(seeds + seedQuantity);
            toast({
                title: 'Seeds purchased!',
                description: `You have bought ${seedQuantity} seeds for ${seedQuantity * seedPrice} currency units.`,
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Transaction failed',
                description: error.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handlePlantSeeds = async (index) => {
        if (seeds > 0 && farmGrid[index].state === 'empty') {
            try {
                await plantSeeds(index);
                setSeeds(seeds - 1);
                const newGrid = [...farmGrid];
                newGrid[index] = { state: 'seeded', id: Date.now(), image: '/seed.png' };
                setFarmGrid(newGrid);
                toast({
                    title: 'Seeds planted!',
                    description: 'Your seeds have been planted. Remember to water them!',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            } catch (error) {
                toast({
                    title: 'Transaction failed',
                    description: error.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: 'No seeds to plant!',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleWaterSeeds = async (index) => {
        if (farmGrid[index].state === 'seeded') {
            try {
                await waterSeeds(index);
                const newGrid = [...farmGrid];
                newGrid[index] = { ...farmGrid[index], state: 'germination' };
                setFarmGrid(newGrid);
                toast({
                    title: 'Plant watered!',
                    description: 'Your plant has been watered. It\'s germinating!',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });

                setTimeout(() => {
                    setFarmGrid((prevGrid) => {
                        const updatedGrid = [...prevGrid];
                        if (updatedGrid[index].id === newGrid[index].id) {
                            updatedGrid[index] = { ...updatedGrid[index], state: 'seedling' };
                        }
                        return updatedGrid;
                    });
                }, 3000);

                setTimeout(() => {
                    setFarmGrid((prevGrid) => {
                        const updatedGrid = [...prevGrid];
                        if (updatedGrid[index].id === newGrid[index].id) {
                            updatedGrid[index] = { ...updatedGrid[index], state: 'growing' };
                        }
                        return updatedGrid;
                    });
                }, 6000);

                setTimeout(() => {
                    setFarmGrid((prevGrid) => {
                        const updatedGrid = [...prevGrid];
                        if (updatedGrid[index].id === newGrid[index].id) {
                            updatedGrid[index] = { ...updatedGrid[index], state: 'mature' };
                        }
                        return updatedGrid;
                    });
                }, 9000);

            } catch (error) {
                toast({
                    title: 'Transaction failed',
                    description: error.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        }
    };

    const handleHarvest = async (index) => {
        if (farmGrid[index].state === 'mature' || farmGrid[index].state === 'growing') {
            try {
                await harvestPlant(index);
                const newGrid = [...farmGrid];
                newGrid[index] = { state: 'empty' };
                setFarmGrid(newGrid);
                const earnings = seedPrice * 1.05;
                setPlants((prevPlants) => prevPlants + 1);
                toast({
                    title: 'Plant harvested!',
                    description: `Your plant has been harvested. You earned ${earnings.toFixed(2)} currency units. The plot is now empty and ready for new seeds!`,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            } catch (error) {
                toast({
                    title: 'Transaction failed',
                    description: error.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        }
    };

    const handleGridClick = (index) => {
        switch (mode) {
            case 'planting':
                handlePlantSeeds(index);
                break;
            case 'watering':
                handleWaterSeeds(index);
                break;
            case 'harvesting':
                handleHarvest(index);
                break;
            default:
                break;
        }
    };

    if (!isMounted) {
        return null; // Do not render anything on the server side
    }

    return (
        <VStack spacing={4} align="stretch" p={4}>
            <Box p={4} bg="blue.500" color="white" display="flex" justifyContent="space-between">
                <Text fontSize="3xl">Saverville Farm</Text>
                <HStack spacing={4}>
                    {!isConnected ? (
                        <Button colorScheme="green" onClick={() => connect()}>
                            Connect Wallet
                        </Button>
                    ) : (
                        <>
                            <HStack>
                                <Input
                                    type="number"
                                    value={seedQuantity}
                                    onChange={(e) => setSeedQuantity(Number(e.target.value))}
                                    width="60px"
                                />
                                <Button colorScheme="green" onClick={handleBuySeeds}>
                                    Buy Seeds
                                </Button>
                            </HStack>
                            <Text fontSize="xl" textAlign="right">
                                Wallet: {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
                            </Text>
                        </>
                    )}
                </HStack>
            </Box>
            <HStack justifyContent="space-between">
                <HStack spacing={4}>
                    <Button colorScheme="green" onClick={() => setMode('planting')} bg={mode === 'planting' ? 'green.500' : 'green.200'}>
                        Plant
                    </Button>
                    <Button colorScheme="blue" onClick={() => setMode('watering')} bg={mode === 'watering' ? 'blue.500' : 'blue.200'}>
                        Water
                    </Button>
                    <Button colorScheme="orange" onClick={() => setMode('harvesting')} bg={mode === 'harvesting' ? 'orange.500' : 'orange.200'}>
                        Harvest
                    </Button>
                </HStack>
                <HStack spacing={4}>
                    <Box p={2} borderRadius="md" display="flex" alignItems="center">
                        <Image src="/germination.png" alt="Seeds" boxSize="30px" />
                        <Text ml={2}>x {seeds}</Text>
                    </Box>
                    <Box p={2} borderRadius="md" display="flex" alignItems="center">
                        <Image src="/harvest.png" alt="Plants" boxSize="30px" />
                        <Text ml={2}>x {plants}</Text>
                    </Box>
                </HStack>
            </HStack>

            <HStack spacing={4}>
                <Box flex="1">
                    <Image src={mode === 'planting' ? '/planting.png' : mode === 'watering' ? '/watering.png' : '/harvesting.png'} alt={`${mode} mode`} boxSize="100%" />
                </Box>
                <SimpleGrid columns={10} spacing={4} flex="2">
                    {farmGrid.map((cell, index) => (
                        <FarmPlot
                            key={index}
                            plot={cell}
                            index={index}
                            owner={address}
                            onClick={handleGridClick}
                        />
                    ))}
                </SimpleGrid>
            </HStack>
        </VStack>
    );
};

export default Saverville;
