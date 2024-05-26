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

export const buySeeds = async () => {
  const provider = await getProvider();
  const signer = await getSigner(provider);
  const contract = new ethers.Contract(
    SAVERVILLE_ADDRESS,
    SAVERVILLE_ABI,
    signer
  );
  const tx = await contract.buySeeds({ value: ethers.utils.parseEther('0.01') }); // Adjust value as needed
  await tx.wait();
};

export const plantSeeds = async (plotId: number) => {
  const provider = await getProvider();
  const signer = await getSigner(provider);
  const contract = new ethers.Contract(
    SAVERVILLE_ADDRESS,
    SAVERVILLE_ABI,
    signer
  );
  const tx = await contract.plantSeeds(plotId);
  await tx.wait();
};

export const waterSeeds = async (plotId: number) => {
  const provider = await getProvider();
  const signer = await getSigner(provider);
  const contract = new ethers.Contract(
    SAVERVILLE_ADDRESS,
    SAVERVILLE_ABI,
    signer
  );
  const tx = await contract.waterSeeds(plotId);
  await tx.wait();
};

export const harvestPlant = async (plotId: number) => {
    const provider = await getProvider();
    const signer = await getSigner(provider);
    const contract = new ethers.Contract(
      SAVERVILLE_ADDRESS,
      SAVERVILLE_ABI,
      signer
    );
    const tx = await contract.harvestPlant(plotId);
    await tx.wait();
  };