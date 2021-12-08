// https://developers.facebook.com/docs/graph-api/overview
// https://github.com/keppelen/react-facebook-login
import React, { useEffect, useState, useCallback } from "react";
import {StatusResponse, ReactFacebookLoginInfo, ReactFacebookFailureResponse} from 'src/types/facebook';

const getParamsFromObject = (params: Record<string, string>): string => {
  return '?' + Object.keys(params)
    .map(param => `${param}=${encodeURIComponent(params[param])}`)
    .join('&');
}

const getIsMobile = () => {
  // @ts-ignore
  return !!((window.navigator && window.navigator.standalone) || navigator.userAgent.match('CriOS') || navigator.userAgent.match(/mobile/i));
}

export type ReactFacebookLoginProps = {
  appId: string;
  callback(userInfo: ReactFacebookLoginInfo | ReactFacebookFailureResponse): void;
  render: (params: Record<string, any>) => void
  xfbml?: boolean
  cookie?: boolean
  autoLoad?: boolean
  isDisabled?: boolean
  version?: string
  language?: string
}

export const ReactFacebookLogin: React.FC<ReactFacebookLoginProps> = ({
  appId,
  callback,
  render,
  xfbml= false,
  cookie = false,
  isDisabled,
  // autoLoad,
  version = '3.1',
  language = 'en_US',
}) => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const setFbAsyncInit = useCallback(() => {
    window.fbAsyncInit = () => {
      window.FB.init({
        version: `v${version}`,
        appId,
        xfbml: Boolean(xfbml),
        cookie: Boolean(cookie)
      })

      setIsSdkLoaded(true)
    }
  }, [appId, cookie, version, xfbml])

  const isMobile: boolean = getIsMobile()

  /**
   * загрузка  и вставка на страницу скрипта facebook
   */
  const loadSdkAsynchronously = useCallback(() => {
    ((d, script, id) => {
      const element = d.getElementsByTagName(script)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(script);
      js.id = id;
      // @ts-ignore
      js.src = `https://connect.facebook.net/${language}/sdk.js`;
      if (fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, 'script', 'facebook-jssdk');
  }, [language])

  useEffect(() => {
    /**
     * Проверяем есть ли на странице скрипт sdk
     */
    const facebookSDK = document.getElementById('facebook-jssdk');
    if (facebookSDK) {
      setIsSdkLoaded(true)
      return
    }

    setFbAsyncInit()
    loadSdkAsynchronously()

    // let fbRoot = document.getElementById('fb-root');
  }, [loadSdkAsynchronously, setFbAsyncInit])

  const responseApi = (authResponse: StatusResponse['authResponse']) => {
    window.FB.api<Record<string, string>, Record<string, string>>('/me', { locale: language, fields: 'name' }, (me) => {
      // @ts-ignore
      callback({...authResponse, ...me})
    })
  }

  const checkLoginState = (checkLoginParams: StatusResponse) => {
    setIsProcessing(false)
    if (checkLoginParams.authResponse) {
      responseApi(checkLoginParams.authResponse)
      return
    }

    callback({ status: checkLoginParams.status });
  }

  const click = (e: React.ChangeEvent<{}>) => {
    if (!isSdkLoaded || isProcessing || Boolean(isDisabled)) {
      return
    }

    setIsProcessing(true)

    e.preventDefault()

    const params = {
      client_id: appId,
      redirect_uri: '/',
    };

    if (isMobile) {
      window.location.href = `https://www.facebook.com/dialog/oauth${getParamsFromObject(params)}`;
      return;
    }

    window.FB.getLoginStatus((statusResponse) => {
      if (statusResponse.status === 'connected') {
        checkLoginState(statusResponse)
        return
      }

      window.FB.login(checkLoginState)
    })
  }

  const propsForRender = {
    onClick: click,
    isDisabled,
    isProcessing,
    isSdkLoaded,
  }

  return <>{render(propsForRender)}</>
}