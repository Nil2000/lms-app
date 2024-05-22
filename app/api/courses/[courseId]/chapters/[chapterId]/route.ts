import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
const mux = new Mux({
	tokenId: process.env.MUX_TOKEN_ID!,
	tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = auth();
		const { isPublished, ...values } = await req.json();

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

		const chapter = await db.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId,
			},
			data: {
				...values,
			},
		});

		//TODO: Add video upload
		if (values.videoUrl) {
			const existingVideo = await db.muxData.findFirst({
				where: {
					chapterId: chapter.id,
				},
			});

			if (existingVideo) {
				await mux.video.assets.delete(existingVideo.assetId);
				await db.muxData.delete({
					where: {
						id: existingVideo.id,
					},
				});
			}
			const asset = await mux.video.assets.create({
				input: values.videoUrl,
				playback_policy: ["public"],
				test: false,
			});

			await db.muxData.create({
				data: {
					chapterId: chapter.id,
					assetId: asset.id,
					playbackId: asset.playback_ids?.[0]?.id!,
				},
			});
		}

		return Response.json(chapter);
	} catch (error) {
		console.log("[Courses_Chapter_ID]", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

export async function DELETE(
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

		if (!chapter) {
			return new Response("Not Found", { status: 404 });
		}

		if (chapter.videoUrl) {
			const existingMuXData = await db.muxData.findFirst({
				where: {
					chapterId: chapter.id,
				},
			});

			if (existingMuXData) {
				await mux.video.assets.delete(existingMuXData.assetId);
				await db.muxData.delete({
					where: {
						id: existingMuXData.id,
					},
				});
			}
		}
		const deletedChapter = await db.chapter.delete({
			where: {
				id: params.chapterId,
			},
		});

		const publishedChapterInCourse = await db.chapter.findMany({
			where: {
				courseId: params.courseId,
				isPublished: true,
			},
		});

		if (publishedChapterInCourse.length === 0) {
			await db.course.update({
				where: {
					id: params.courseId,
				},
				data: {
					isPublished: false,
				},
			});
		}

		return NextResponse.json(deletedChapter);
	} catch (error) {
		console.log("[Chapter_ID_Delete]", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
