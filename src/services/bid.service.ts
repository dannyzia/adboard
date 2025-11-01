import { api } from './api';

export const bidService = {
  async placeBid(auctionId: string, bidAmount: number) {
    const response = await api.post(`/bids/${auctionId}/place`, { bidAmount });
    return response.data;
  },

  async getAuctionBids(auctionId: string) {
    const response = await api.get(`/bids/${auctionId}`);
    return response.data.bids;
  },

  async getMyBids() {
    const response = await api.get(`/bids/my-bids`);
    return response.data.bids;
  },

  async confirmPayment(auctionId: string) {
    const response = await api.post(`/bids/${auctionId}/confirm-payment`);
    return response.data;
  }
};
