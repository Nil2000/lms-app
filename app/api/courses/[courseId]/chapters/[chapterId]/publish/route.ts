import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}
		const ownCourse = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId,
			},
		});
		if (!ownCourse) {
			return new Response("Unauthorized", { status: 401 });
		}
		const chapter = await db.chapter.findUnique({
			where: {
				id: params.chapterId,
				courseId: params.courseId,
			},
		});
		const muxData = await db.muxData.findUnique({
			where: {
				chapterId: params.chapterId,
			},
		});

		if (
			!chapter ||
			!muxData ||
			!chapter.videoUrl ||
			!chapter.title ||
			!chapter.description
		) {
			return new Response("Missing required fields", { status: 400 });
		}

		const publishChapter = await db.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId,
			},
			data: {
				isPublished: true,
			},
		});

		return NextResponse.json(publishChapter);
	} catch (error) {
		console.log("[Chapter_Publish]", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
