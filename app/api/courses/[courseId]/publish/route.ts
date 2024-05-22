import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		const course = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId,
			},
			include: {
				chapters: {
					include: {
						muxData: true,
					},
				},
			},
		});

		if (!course) {
			return new Response("Not found", { status: 404 });
		}

		const hasPublishedChapters = course.chapters.some(
			(chapter) => chapter.isPublished
		);

		if (
			!hasPublishedChapters ||
			!course.title ||
			!course.description ||
			!course.imageUrl ||
			!course.categoryId
		) {
			return new Response("Missing required fields", { status: 400 });
		}

		const publishedCourse = await db.course.update({
			where: {
				id: params.courseId,
				userId,
			},
			data: {
				isPublished: true,
			},
		});

		return NextResponse.json(publishedCourse);
	} catch (error) {
		console.log("[Course_Publish]", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
