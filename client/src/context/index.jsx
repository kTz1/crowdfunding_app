import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x89fe40EE9B81a0EF87ee197f97827fF91405E7c2'); // address of the smart contract
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  // Send data from form
  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.target, // goal
        new Date(form.deadline).getTime(), // deadline
        form.image // image
      ]);

      console.log('contract call success', data);
    } catch (error) {
      console.log('contract call failure', error);
    }
  };

  // Get data from campaigns
  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns'); // call contract

    // transform data in readable numbers
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaigns;
  };

  // get user campaigns
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  };

  // creating and getting donations
  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount) }); // call contract
    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    };

    return parsedDonations;
  };

  return (
    <StateContext.Provider 
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Render the children
export const useStateContext = () => useContext(StateContext);