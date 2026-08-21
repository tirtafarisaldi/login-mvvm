// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, url, body, headers } = req;
  const URI = url?.replace(/\/api*/, '') || '';

  try {
    const { data } = await axios({
      method,
      url: process.env.restapiEndpoint + URI,
      headers: {
        'x-api-key': process.env.restapiKey || 'secret',
        Authorization: `${headers.authorization}`,
      },
      data: body,
    });

    res.status(200).json(data);
  } catch (error) {
    if (error instanceof AxiosError) {
      res.status(Number(error?.response?.status)).json(
        error?.response?.data || {
          status: error.code,
          message: error.message,
        }
      );
      return;
    }

    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
}
