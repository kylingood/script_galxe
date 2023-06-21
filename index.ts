/**
 * Galex - A tool for galex campaign action
 * 
 * Author @3lang3 2023-06-21
 * Github: https://github.com/3lang3
 */

import { ethers } from "ethers";
import { cli } from "./utils/cli";
import { Galex } from "./module";
import cfg from "./config";
import { loop } from "./utils/utils";

// 领取任务积分
const claim = async (wallet: ethers.Wallet) => {
  await loop(async () => {
    const account = new Galex({ privateKey: wallet.privateKey });
    const r = await account.getPrepareParticipate({
      campaignID: cfg.campaignId,
      chain: 'ETHEREUM',
    });
    if (r.prepareParticipate?.disallowReason) {
      console.log(`领取失败: ${r.prepareParticipate?.disallowReason}`);
      return;
    }
    if (r.prepareParticipate?.loyaltyPointsTxResp?.TotalClaimedPoints) {
      console.log(`成功领取 ${r.prepareParticipate?.loyaltyPointsTxResp?.TotalClaimedPoints} 分`);
    }
  })
};

cli(async ({ action, pks, startIdx, endIdx }) => {
  for (let k = startIdx; k <= endIdx; k++) {
    const pk = pks[k];
    const wallet = new ethers.Wallet(pk);
    try {
      console.log(`[${action}] ${wallet.address} 开始执行claim`)
      await claim(wallet);
      console.log(`[${action}] ${wallet.address} claim执行完毕`)
    } catch (error) {
      console.log(error?.reason || error?.message)
    }
  }
});
