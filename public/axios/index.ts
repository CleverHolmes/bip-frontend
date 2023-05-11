// axios.js
import axios, { AxiosError, AxiosResponse, AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

import { REST_API_URL } from 'modules/config';
import {
  COOKIE_TOKEN,
  COOKIE_REFRESH_TOKEN,
  COOKIE_COMPANY_REPRESENTED,
  COOKIE_OPERATING_USER,
  COOKIE_PRIMARY_USER,
} from 'hooks/useAuth';
import routes from 'constants/routes';
import { UNPROTECTED_ROUTES } from 'wrapper/AppWrapper';

export type ErrorType = {
  error: string;
  message: string;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: REST_API_URL,
  timeout: 60000,
});

axiosInstance.interceptors.request.use((config) => {
  const cookies = new Cookies();
  const headers = { ...config.headers };
  const token = cookies.get(COOKIE_TOKEN);
  const accessToken = window.sessionStorage.getItem('access_token');

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  headers['Referer-location'] = window.location.href;

  return {
    ...config,
    headers,
  };
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const cookies = new Cookies();
    if (error.response?.status === 401 || error.response?.status === 403) {
      cookies.remove(COOKIE_TOKEN);
      cookies.remove(COOKIE_COMPANY_REPRESENTED);
      cookies.remove(COOKIE_REFRESH_TOKEN);
      cookies.remove(COOKIE_OPERATING_USER);
      cookies.remove(COOKIE_PRIMARY_USER);
      window.sessionStorage.removeItem('company_represented');
      window.sessionStorage.removeItem('primary_user');
      window.sessionStorage.removeItem('operating_user');
      window.sessionStorage.removeItem('access_token');
      if (!UNPROTECTED_ROUTES.includes(window.location.pathname)) {
        window.location.href = routes.home;
      }
    }
    if (error.response?.data && error.response?.status !== 404) {
      toast.error((error.response?.data as ErrorType).message);
    }
    // toast.error((error.response?.data as ErrorType).messages);
    throw error;
  }
);

axiosRetry(axiosInstance, {
  retries: 0,
  shouldResetTimeout: true,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError<unknown, any>) => {
    return (
      error.response?.status !== 403 && (!error.response || error.isAxiosError)
    );
  },
  onRetry: (
    retryCount: number,
    error: AxiosError<unknown, any>,
    requestConfig: any
  ) => {
    console.log(`Retry ${retryCount} for ${requestConfig.url}`);
  },
});

const get = async (
  url: string,
  config: any = {}
): Promise<AxiosResponse<any, any>> => {
  return axiosInstance.get(url, config);
};

const post = async (
  url: string,
  data: any,
  config: any = {}
): Promise<AxiosResponse<any, any>> => {
  return axiosInstance.post(url, data, config);
};

const deleteRequest = async (
  url: string,
  data: any,
  config: any = {}
): Promise<AxiosResponse<any, any>> => {
  return axiosInstance.delete(url, data);
};

const put = async (
  url: string,
  data: any,
  config: any = {}
): Promise<AxiosResponse<any, any>> => {
  return axiosInstance.put(url, data, config);
};

const patch = async (
  url: string,
  data: any,
  config: any = {}
): Promise<AxiosResponse<any, any>> => {
  return axiosInstance.patch(url, data, config);
};

export { get, post, put, patch, deleteRequest };

// export function delete(arg0: string, arg1: { user_uuid: string; uris: string[]; }) {
//   throw new Error('Function not implemented.');
// }
