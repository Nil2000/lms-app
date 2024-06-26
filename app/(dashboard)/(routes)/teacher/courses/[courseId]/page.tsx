import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title_form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachement-form";
import ChaptersForm from "./_components/chapters-form";
import Banner from "@/components/banner";
import CourseActions from "./_components/course-actions";

export default async function CourseIdPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc"
        }
      },
      attachments: {
        orderBy: {
          createdAt: "desc"
        }
      },
    }
  });

  const categories = await db.category.findMany(
    {
      orderBy: {
        name: "asc",
      },
    }
  );
  if (!course) {
    return redirect("/");
  }

  const reqFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished)
  ];

  const totalFields = reqFields.length;
  const complFields = reqFields.filter(Boolean).length;
  const completionText = `(${complFields}/${totalFields})`;

  const isComplete = reqFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          label="This course is yet to be published. Students will not be able to access it"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          {/* {Add actions} */}
          <CourseActions
            disabled={!isComplete}
            courseId={course.id}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm
              initialData={course}
              courseId={course.id}
            />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm initialData={course} courseId={course.id} options={categories.map((category) => ({ label: category.name, value: category.id }))} />
          </div>
          <div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Course chapters</h2>
                </div>
                <div>
                  <ChaptersForm
                    courseId={course.id}
                    initialData={course}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={CircleDollarSign} />
                  <h2 className="text-xl">Sell your course</h2>
                </div>
              </div>
              <PriceForm
                initialData={course}
                courseId={course.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2 mt-3">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & attachments</h2>
              </div>
              <AttachmentForm
                initialData={course}
                courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
