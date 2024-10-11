// AuctionContext.js
import React, { createContext, useContext, useState } from 'react';

const AuctionContext = createContext();

export const useAuction = () => {
  return useContext(AuctionContext);
};

export const AuctionProvider = ({ children }) => {
  const [currentPrice, setCurrentPrice] = useState(1000000);
  const [userBid, setUserBid] = useState(null);

  return (
    <AuctionContext.Provider value={{ currentPrice, setCurrentPrice, userBid, setUserBid }}>
      {children}
    </AuctionContext.Provider>
  );
};
