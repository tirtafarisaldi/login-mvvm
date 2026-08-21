import * as UserDataSource from '../../sources/UserDataSource';
import { Result } from '../../../domain/vo/Result';
import { useEffect, useState } from 'react';

export const useCurrentUser = () => {
  const result = new Result<any>();
  const [response, setResponse] = useState<any>();

  useEffect(() => {
    const currentUser = async () => {
      try {
        result.setLoading(true);
        const res = await UserDataSource.getCurrentUser();
        setResponse(res);
      } catch {}
    };

    currentUser();
  }, [result]);

  if (response) {
    result.setData(response);
  }

  return {
    result
  };
};