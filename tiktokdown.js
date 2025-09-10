const fetch = require('node-fetch');

async function autoTiktok(m, fukusima) {
  let budy = m.text || '';
  let ttRegex = /(?:https?:\/\/)?(?:www\.)?(vt\.tiktok\.com|tiktok\.com)\//i;

  if (ttRegex.test(budy)) {
    try {
      await m.reply('⏳ Sedang memproses video TikTok...');

      let res = await fetch(`https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(budy)}`);
      let json = await res.json();

      if (!json.status || !json.data || !json.data.download || !json.data.download.video) {
        return m.reply("Gagal mengambil video TikTok. Coba lagi nanti.");
      }

      let metadata = json.data.metadata;
      let video = json.data.download.video[0]; 
      let audio = json.data.download.audio;

      await fukusima.sendMessage(m.chat, {
        video: { url: video },
        mimetype: 'video/mp4',
        caption: `🎬 TikTok Video\n❤️ ${metadata.stats.likeCount} | 💬 ${metadata.stats.commentCount} | 🔄 ${metadata.stats.shareCount} | 👀 ${metadata.stats.playCount}`
      }, { quoted: m });
      await fukusima.sendMessage(m.chat, {
        audio: { url: audio },
        mimetype: 'audio/mpeg',
        fileName: 'tiktok_audio.mp3'
      }, { quoted: m });

    } catch (err) {
      console.error(err);
      await m.reply('⚠️ Terjadi kesalahan saat memproses TikTok.');
    }
  }
}

module.exports = { autoTiktok };