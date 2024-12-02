import {
  CreateZaiAuthTokenResponse,
  ZaiItemWebhookEvent,
} from 'dependency-layer/zai';

export const handleItemsEvent = async (
  zaiAuthToken: CreateZaiAuthTokenResponse,
  payload: ZaiItemWebhookEvent
) => {
  console.log('Zai ITEM event: ', payload?.items);
};
