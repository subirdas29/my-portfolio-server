import { ChatLog } from './chatLog.model';

const CLEANUP_OLDER_THAN_DAYS = 30;

export const cleanOldChatLogs = async (): Promise<number> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_OLDER_THAN_DAYS);

  const result = await ChatLog.deleteMany({
    createdAt: { $lt: cutoffDate },
  });

  if (result.deletedCount > 0) {
    console.log(
      `🧹 ChatLog Cleanup: Deleted ${result.deletedCount} logs older than ${CLEANUP_OLDER_THAN_DAYS} days`,
    );
  }

  return result.deletedCount;
};
