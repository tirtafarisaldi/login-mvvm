import { Auth } from 'aws-amplify';

export const getCurrentUser = async () => {
  try {
    const response = await Auth.currentAuthenticatedUser();
    return response;
  } catch (e) {
    throw e as Error;
  }
};
