import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = auth();
		const { isCompleted } = await req.json();

		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		const userProgress = await db.userProgress.upsert({
			where: {
				userId_chapterId: {
					chapterId: params.chapterId,
					userId,
				},
			},
			update: {
				isCompleted,
			},
			create: {
				isCompleted,
				chapterId: params.chapterId,
				userId,
			},
		});

		return NextResponse.json(userProgress);
	} catch (error) {
		console.log(`[CHAPTER_ID_PROGRESS]:${error}`);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
