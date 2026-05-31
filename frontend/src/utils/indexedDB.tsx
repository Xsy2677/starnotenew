import { openDB, type IDBPDatabase } from 'idb';

let dbPromise: Promise<IDBPDatabase>;

function initDB() {
  if (!dbPromise) {
    // 版本升级到 3，重建表结构
    dbPromise = openDB('starnook_db', 3, {
      upgrade(db, oldVersion) {
        // 旧表全部重建，清除旧主键规则
        if (db.objectStoreNames.contains('emotion_records')) {
          db.deleteObjectStore('emotion_records');
        }
        if (db.objectStoreNames.contains('drawings')) {
          db.deleteObjectStore('drawings');
        }
        if (db.objectStoreNames.contains('relax_records')) {
          db.deleteObjectStore('relax_records');
        }

        // 聊天记录
        if (!db.objectStoreNames.contains('conversations')) {
          db.createObjectStore('conversations', { keyPath: 'session_id' });
        }

        // 情绪记录：自增id为主键，每条独立，永不覆盖
        const emotionStore = db.createObjectStore('emotion_records', {
          keyPath: 'id',
          autoIncrement: true
        });
        emotionStore.createIndex('byDate', 'date');
        emotionStore.createIndex('byType', 'type');

        // 涂鸦独立表
        db.createObjectStore('drawings', { keyPath: 'id', autoIncrement: true });

        // 呼吸记录
        db.createObjectStore('relax_records', { keyPath: 'id', autoIncrement: true });
      },
    });
  }
  return dbPromise;
}

export const IDB = {
  // 聊天
  saveChat: async (data: { session_id: string; messages: any[] }) => {
    const db = await initDB();
    return db.put('conversations', data);
  },
  getChat: async (session_id: string) => {
    const db = await initDB();
    return db.get('conversations', session_id);
  },

  // 情绪记录：add 新增，不会覆盖任何数据
  saveEmotion: async (data: {
    date: string;
    emotion: string;
    type: string;
    note?: string;
    image?: string;
  }) => {
    const db = await initDB();
    return db.add('emotion_records', data);
  },

  getWeekEmotions: async () => {
    const db = await initDB();
    return db.getAll('emotion_records');
  },

  // 涂鸦表
  saveDrawing: async (data: any) => {
    const db = await initDB();
    return db.add('drawings', data);
  },
};