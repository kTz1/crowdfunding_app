import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x13EE12aDE6E5d849A04d9452cc4723428026a3D1'); // address of the smart contract
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

  return (
    <StateContext.Provider 
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

// Render the children
export const useStateContext = () => useContext(StateContext);