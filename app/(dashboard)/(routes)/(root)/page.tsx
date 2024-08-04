import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CourseList from "@/components/course-list";
import { UserButton, auth } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";
import { CheckCircle, Clock } from "lucide-react";

export default async function Dashborad() {
	const { userId } = auth();

	if (!userId) {
		return redirect("/");
	}

	const { completedCourses, courseInProgress } = await getDashboardCourses(
		userId
	);
	return (
		<div className="p-6 space-y-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<InfoCard
					icon={Clock}
					label="In Progress"
					numberOfItems={courseInProgress.length}
					variant="default"
				/>
				<InfoCard
					icon={CheckCircle}
					label="Completed"
					numberOfItems={completedCourses.length}
					variant="success"
				/>
			</div>
			<CourseList items={[...completedCourses, ...courseInProgress]} />
		</div>
	);
}
