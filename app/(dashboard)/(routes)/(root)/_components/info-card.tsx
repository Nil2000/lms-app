import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";
import React from "react";
interface InfoCardProps {
	numberOfItems: number;
	variant?: "default" | "success";
	label: string;
	icon: LucideIcon;
}
export const InfoCard = ({
	variant,
	icon: Icon,
	numberOfItems,
	label,
}: InfoCardProps) => {
	return (
		<div className="border rounded-md flex items-center gap-x-2 p-3">
			<IconBadge icon={Icon} variant={variant} />
			<div>
				<p className="font-medium">{label}</p>
				<p>
					{numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
				</p>
			</div>
		</div>
	);
};
