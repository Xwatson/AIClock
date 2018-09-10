const Xunfei = require('xunfeisdk');
const { IATAueType, IATEngineType, ISEAueType, ISECategoryType, ISELanguageType, ISEResultLevelType,
TTSAueType, TTSAufType, TTSEngineType, TTSVoiceName} = require('xunfeisdk');

const config = require('../config/xfConfig.json');
const fs = require('fs');
const path = require('path');

const stream = require('stream');
const Speaker = require('speaker');
const lame = require('lame');

class XFYun {
    constructor() {
        this.AppId = config.AppId;
        this.TTSAppKey = config.TTSAppKey;
    }
    async TTS(speechText) {
        if (speechText) {
            const client = new Xunfei.Client(this.AppId);
            // 语音合成 (即根据文字来生成音频)
            client.TTSAppKey = this.TTSAppKey;
            const result = await client.TTS(speechText, TTSAufType.L16_8K, TTSAueType.LAME, TTSVoiceName.XiaoYan, 50,
                99, 48, TTSEngineType.INTP65CN, 'text');
            if (result.audio) {
                // const mp3 = path.join('./mp3/', result.sid + '.mp3');
                // fs.writeFileSync(mp3, result.audio, "binary");
                // console.log('文件写入成功！');
                await this.playAudioFromBuffer(result.audio);
                return result;
            } else {
                throw new Error('未获取到音频信息')
            }
        }
    }
    async playAudioFromBuffer(arrayBuffer) {
        return new Promise(function(resolve, reject) {
            // 设置音质
            const audioOptions = {channels: 2, bitDepth: 128, sampleRate: 44100}; // 22050, 44100
            const decoder = lame.Decoder(audioOptions);
    
            const speaker = new Speaker();
    
            try {
                const bufferStream = new stream.PassThrough();
                bufferStream.end(arrayBuffer);
                bufferStream.pipe(decoder).pipe(speaker);
            } catch (error) {
                console.log('err', error);
                reject(null);
            }
            // 播放完成
            speaker.on('flush', function(){
                console.log('播放完成')
                resolve('flush');
            });
        });
    }
}

module.exports = new XFYun();
