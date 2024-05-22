import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; attachmentId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		const courseOwner = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId: userId,
			},
		});

		if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

		const courseAttachment = await db.attachment.delete({
			where: {
				id: params.attachmentId,
			},
		});

		return NextResponse.json(courseAttachment);
	} catch (error) {
		console.log("COURSE_ID_ATTACHEMENTS", error);
		return new Response("Internal Error", { status: 500 });
	}
}
