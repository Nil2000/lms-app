import { db } from "@/lib/db"

export const getProgress = async (userId: string, courseId: string): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true
      },
      select: {
        id: true
      }
    });

    const publishedChapterIds = publishedChapters.map(chapter => chapter.id);

    const completedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChapterIds
        },
        isCompleted: true
      }
    });

    const progressPercent = (completedChapters / publishedChapters.length) * 100;
    return progressPercent;
  } catch (error) {
    return 0;
  }

}