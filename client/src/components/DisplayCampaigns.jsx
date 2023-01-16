import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { FundCard } from '../components';
import { loader } from '../assets';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  // pass the state to campaign details
  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign })
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({campaigns.length})</h1>
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {/* Loader */}
        {isLoading && (
          <img 
            src={loader} 
            alt="loader" 
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {/* Check if user has campaigns */}
        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campaigns yet.
          </p>
        )}

        {/* Loop over campaigns and show campaign */}
        {!isLoading && campaigns.length > 0 && campaigns.map((campaign, index) => 
          <FundCard 
            key={index}
            {...campaign}
            handleClick={() => handleNavigate(campaign)}
          />
        )}
      </div>
    </div>
  );
};

export default DisplayCampaigns;