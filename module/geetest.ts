import { randomUUID } from "crypto";
import axios from "axios";
import cfg from '../config';

export const getGeetestV4Captcha = async (params: {
  captcha_id: string;
  lang?: string;
  proxy?: any;
}) => {
  try {
    const challenge = randomUUID();
    const client_type = 'web';
    let callback = 'geetest_' + Date.now();
    let query = new URLSearchParams({
      captcha_id: params.captcha_id,
      challenge,
      client_type,
      lang: params.lang || 'zh-cn',
      callback,
    })
    let url = `https://gcaptcha4.geetest.com/load?${query.toString()}`;
    let res = await axios.get(url, {
      proxy: params.proxy,
    });
    let text = res.data;
    let json = JSON.parse(text.slice(callback.length + 1, -1))['data'];
    query = new URLSearchParams({
      lot_number: json.lot_number,
      payload: json.payload,
      process_token: json.process_token,
      payload_protocol: json.payload_protocol,
      pt: json.pt,
      callback: 'geetest_' + Date.now(),
      w: cfg.w,
      captcha_id: params.captcha_id,
      client_type,
    });
    url = `https://gcaptcha4.geetest.com/verify?${query.toString()}`;
    res = await axios.get(url, {
      proxy: params.proxy,
    });
    text = res.data;
    json = JSON.parse(text.slice(callback.length + 1, -1));
    json = json['data']['seccode']
    return {
      captchaOutput: json.captcha_output,
      genTime: json.gen_time,
      lotNumber: json.lot_number,
      passToken: json.pass_token,
    };
  } catch (error) {
    console.log('getGeetestV4Captcha error', error);
  }
}