// utils/ethereum.ts
import { ethers } from 'ethers';
import { SAVERVILLE_ABI, SAVERVILLE_ADDRESS } from '../config/constants';

export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
  }
  throw new Error('Ethereum provider not found.');
};

export const getSigner = (provider: ethers.providers.Web3Provider) => {
  return provider.getSigner();
};

export const buySeeds = async (quantity: number) => {
  const provider = getProvider();
  const signer = getSigner(provider);
  const contract = new ethers.Contract(SAVERVILLE_ADDRESS, SAVERVILLE_ABI, signer);
  const seedPrice = await contract.seedPrice();
  const totalCost = seedPrice.mul(quantity);

  const tx = await contract.buySeeds(quantity, { value: totalCost });
  await tx.wait();
};

export const plantSeeds = async (plotId: number) => {
  const provider = getProvider();
  const signer = getSigner(provider);
  const contract = new ethers.Contract(SAVERVILLE_ADDRESS, SAVERVILLE_ABI, signer);

  const tx = await contract.plantSeed(plotId);
  await tx.wait();
};

export const waterSeeds = async (plotId: number) => {
  const provider = getProvider();
  const signer = getSigner(provider);
  const contract = new ethers.Contract(SAVERVILLE_ADDRESS, SAVERVILLE_ABI, signer);

  const tx = await contract.waterPlant(plotId);
  await tx.wait();
};

export const harvestPlant = async (plotId: number) => {
  const provider = getProvider();
  const signer = getSigner(provider);
  const contract = new ethers.Contract(SAVERVILLE_ADDRESS, SAVERVILLE_ABI, signer);

  const tx = await contract.harvestPlant(plotId);
  await tx.wait();
};
