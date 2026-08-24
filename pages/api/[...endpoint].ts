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
    const upstreamHeaders: Record<string, string> = {
      'x-api-key': process.env.restapiKey || 'secret',
      Cookie: headers.cookie || '',
    };
    if (headers.authorization) {
      upstreamHeaders.Authorization = headers.authorization;
    }

    const upstreamResponse = await axios({
      method,
      url: process.env.restapiEndpoint + URI,
      headers: upstreamHeaders,
      data: body,
    });

    const setCookie = upstreamResponse.headers['set-cookie'];
    if (setCookie) res.setHeader('Set-Cookie', setCookie);

    res.status(200).json(upstreamResponse.data);
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
