
import { Episode, Song } from './types';

// ==========================================
// 1. 全局配置 (GLOBAL CONFIG)
// ==========================================

export const THEME = {
  red: '#9B1B1B', // 主色调：深红
  redLight: '#EF4444', // 高亮红
  bone: '#F5F5F0', // 骨白/米色
  black: '#121212', // 炭黑
  glass: 'rgba(245, 245, 240, 0.15)', // 玻璃质感
};

export const SOCIALS = {
  xiaoyuzhou: "https://www.xiaoyuzhoufm.com/podcast/690c70aae20e223cdc598584",
  xiaohongshu: "https://xhslink.com/m/3gTezvumpSJ",
  jike: "https://okjk.co/9pCGJO",
  email: "mailto:sunsxywork@126.com"
};

// 默认跳转的主页链接
export const PODCAST_MAIN_URL = SOCIALS.xiaoyuzhou;


// ==========================================
// 2. 单集数据 (EPISODE DATA)
// 维护指南：
// - 每一期是一个独立的变量 (如 VOL_05_DATA)。
// - description 字段建议由 AI 提前生成好填入。
// ==========================================

const VOL_05_DATA: Episode = {
  id: 'ep5',
  title: 'Vol.05: 告别 2025，这一切没有想象的那么糟',
  date: '2025.12.30',
  theme: 'Folk / Indie',
  coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop', 
  linkUrl: 'https://www.xiaoyuzhoufm.com/podcast/690c70aae20e223cdc598584', 
  songs: [
    { id: 's5_1', title: '这一切没有想象的那么糟', artist: '万晓利', duration: '', coverUrl: '', description: '生活的粗粝与温柔并存。' },
    { id: 's5_2', title: '库布齐', artist: '万晓利', duration: '', coverUrl: '', description: '沙漠里的风声与回响。' },
    { id: 's5_3', title: '在日落前拥抱', artist: '尕尔东,戈桑玛', duration: '', coverUrl: '', description: '日落金山，拥抱此刻的温暖。' },
    { id: 's5_4', title: '昨夜的枪声', artist: '王忆灵', duration: '', coverUrl: '', description: '迷幻而破碎的梦境记录。' },
    { id: 's5_5', title: '今夜还吹着风', artist: '腰乐队', duration: '', coverUrl: '', description: '来自南方的冷风与诗意。' },
    { id: 's5_6', title: '醉鬼的敬酒曲（酒馆版）', artist: '上海彩虹室内合唱团', duration: '', coverUrl: '', description: '敬遗憾，敬自由，敬不完美的我们。' },
    { id: 's5_7', title: '圆 Yuan', artist: '卧轨的火车', duration: '', coverUrl: '', description: '兜兜转转，终回原点。' },
  ]
};

const VOL_04_DATA: Episode = {
  id: 'ep4',
  title: 'Vol.04: 我和 ChatGPT 录了一期播客',
  date: '2023.12.5',
  theme: 'AI & Humanity',
  coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
  linkUrl: 'https://www.xiaoyuzhoufm.com/podcast/690c70aae20e223cdc598584', 
  songs: [
    { id: 's4_1', title: 'Come Together', artist: 'Primal Scream', duration: '', coverUrl: '', description: '打破隔阂的迷幻摇滚呼唤。' },
    { id: 's4_2', title: 'Amani', artist: 'Beyond', duration: '', coverUrl: '', description: '用歌声呼唤大地的和平与爱。' },
    { id: 's4_3', title: '月亮船', artist: '王英姿', duration: '', coverUrl: '', description: '童年记忆中摇曳的温柔月光。' },
    { id: 's4_4', title: '时间', artist: '声音玩具', duration: '', coverUrl: '', description: '在时间长河中优雅地起舞。' },
    { id: 's4_5', title: 'The Circle Game', artist: 'Joni Mitchell', duration: '', coverUrl: '', description: '关于成长与轮回的民谣诗篇。' },
    { id: 's4_6', title: '大梦 (Live)', artist: '瓦依那,任素汐', duration: '', coverUrl: '', description: '用一生做一场漫长而真实的梦。' },
  ]
};

const VOL_03_DATA: Episode = {
  id: 'ep3',
  title: 'Vol.03: 留学BGM：只要熬过英国的冬令时…',
  date: '2023.11.21',
  theme: 'Study Abroad',
  coverUrl: 'https://images.unsplash.com/photo-1534146789009-76ee5034035d?q=80&w=1000&auto=format&fit=crop',
  linkUrl: 'https://www.xiaoyuzhoufm.com/podcast/690c70aae20e223cdc598584', 
  songs: [
    { id: 's3_1', title: 'The Happening', artist: 'Pixies', duration: '', coverUrl: '', description: '异国街头突然发生的奇遇。' },
    { id: 's3_2', title: '浪子回头', artist: '茄子蛋', duration: '', coverUrl: '', description: '烟酒嗓里藏着的游子乡愁。' },
    { id: 's3_3', title: 'How to Disappear', artist: 'Lana Del Rey', duration: '', coverUrl: '', description: '在喧嚣中学会如何优雅地消失。' },
    { id: 's3_4', title: 'Therefore I Am', artist: 'Billie Eilish', duration: '', coverUrl: '', description: '我思故我在，带着一点叛逆。' },
    { id: 's3_5', title: 'Back to Black', artist: 'Amy Winehouse', duration: '', coverUrl: '', description: '伦敦阴雨天里的心碎爵士。' },
    { id: 's3_6', title: 'Rehab', artist: 'Amy Winehouse', duration: '', coverUrl: '', description: '也就是这句 No, No, No。' },
    { id: 's3_7', title: '复活 (Live)', artist: '野外合作社', duration: '', coverUrl: '', description: '绝望之后的涅槃重生。' },
    { id: 's3_8', title: 'What\'s Up', artist: '4 Non Blondes', duration: '', coverUrl: '', description: '对着天空大喊：这到底是怎么了？' },
  ]
};

const VOL_02_DATA: Episode = {
  id: 'ep2',
  title: 'Vol.02: 6 首和雨有关的歌',
  date: '2023.11.13',
  theme: 'Rainy Mood',
  coverUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1000&auto=format&fit=crop',
  linkUrl: 'https://www.xiaoyuzhoufm.com/podcast/690c70aae20e223cdc598584', 
  songs: [
    { id: 's2_1', title: 'This Feeling', artist: 'Alabama Shakes', duration: '', coverUrl: '', description: '雨后初晴般的灵魂触动。' },
    { id: 's2_2', title: '雨', artist: '企鹅强尼', duration: '', coverUrl: '', description: '简单直白，就是关于雨的歌。' },
    { id: 's2_3', title: '雨のち雨のち雨', artist: 'GO!GO!7188', duration: '', coverUrl: '', description: '雨过之后还是雨，那又怎样？' },
    { id: 's2_4', title: 'Stan', artist: 'Eminem, Dido', duration: '', coverUrl: '', description: '窗外的雨声是孤独最好的伴奏。' },
    { id: 's2_5', title: '我们终结了过去，现在，未来', artist: '王忆灵', duration: '', coverUrl: '', description: '在雨夜里终结所有的情感纠葛。' },
    { id: 's2_6', title: '献身', artist: '王忆灵', duration: '', coverUrl: '', description: '一场关于自我牺牲的凄美大雨。' },
  ]
};

const VOL_01_DATA: Episode = {
  id: 'ep1',
  title: 'Vol.01: 当一个播客制作人决定录一期自己的播客',
  date: '2023.11.06',
  theme: 'Mixtape',
  coverUrl: 'https://images.unsplash.com/photo-1594433549646-7c98e1687f75?q=80&w=1000&auto=format&fit=crop',
  linkUrl: 'https://www.xiaoyuzhoufm.com/podcast/690c70aae20e223cdc598584', 
  songs: [
    { id: 's1_1', title: 'New Boy', artist: '朴树', duration: '', coverUrl: '', description: '千禧年的阳光，一切都是新的。' },
    { id: 's1_2', title: '走过咖啡屋', artist: '千百惠', duration: '', coverUrl: '', description: '复古的甜蜜，像一杯加糖咖啡。' },
    { id: 's1_3', title: 'Waiting for the End', artist: 'Linkin Park', duration: '', coverUrl: '', description: '在废墟中等待重生的光芒。' },
    { id: 's1_4', title: 'Wall Of Sound', artist: 'Naturally 7', duration: '', coverUrl: '', description: '纯人声构建的震撼音墙。' },
    { id: 's1_5', title: 'Nothing Compares 2 U', artist: 'Sinéad O\'Connor', duration: '', coverUrl: '', description: '光头女神的眼泪，无人能及。' },
    { id: 's1_6', title: 'Let the Sunshine', artist: 'Sainkho Namtchylak', duration: '', coverUrl: '', description: '图瓦女伶呼唤阳光的实验之声。' },
  ]
};

// ==========================================
// 3. 归档集合 (ARCHIVE EXPORT)
// 注意：数组的顺序决定了显示顺序
// ==========================================

export const MOCK_EPISODES: Episode[] = [
  VOL_01_DATA,
  VOL_02_DATA,
  VOL_03_DATA,
  VOL_04_DATA,
  VOL_05_DATA
];
