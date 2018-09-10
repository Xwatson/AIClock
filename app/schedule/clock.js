const Subscription = require('egg').Subscription;
const moment = require('moment');
const xfYun = require('../../untils/xfYun');

class AIClock extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '10s', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const date = moment();
    let isTTS = false;
    console.log('嗯嗯', date.format('YYYY-MM-DD HH:mm:ss'));

    try {
      const tts = await xfYun.TTS(`现在时间：${date.format('YYYY年MM月DD日 HH点mm分')}`)
      console.log('啊啊啊', tts)
      if (date.minute() === 19 && !isTTS) {
        isTTS = true;
        await xfYun.TTS(`现在时间：${date.format('YYYY年MM月DD日 HH点mm分')}`)
        isTTS = false;
      }
    } catch (error) {
      console.log('热热热', error)
    }
  }
}

module.exports = AIClock;