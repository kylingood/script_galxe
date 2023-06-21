import { readFileSync } from "fs";
import { setTimeout as _sleep } from 'node:timers/promises';

/** 生成固定长度的字符串 */
export const randomString = (len: number) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const maxPos = chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

export const randomLetterString = (len: number) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const maxPos = chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

// 获取txt文件内容，移除空行和制表符并转换为数组
export function getTxtContent(path: string) {
  const str = readFileSync(path, 'utf-8');
  return str.split(/[(\r\n)\r\n]+/).filter(el => el);
}

/** 循环执行直到任务成功 */
export function loop(task) {
  return new Promise(async (resolve) => {
    while (true) {
      try {
        await task();
        resolve(true)
        break;
      } catch (error) {
        console.log(`[loop] ${error?.reason || error?.message}`)
      }
    }
  })
}