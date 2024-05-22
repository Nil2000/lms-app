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
		});

		if (!course) {
			return new Response("Not found", { status: 404 });
		}

		const unpublishedCourse = await db.course.update({
			where: {
				id: params.courseId,
				userId,
			},
			data: {
				isPublished: false,
			},
		});

		return NextResponse.json(unpublishedCourse);
	} catch (error) {
		console.log("[Course_UnPublish]", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
