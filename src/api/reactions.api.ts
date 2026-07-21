import { ReactionsResponse } from '../types';
import { requestJson } from './api-client';

export async function getReactions(): Promise<ReactionsResponse> {
  return requestJson<ReactionsResponse>('/api/reactions');
}
