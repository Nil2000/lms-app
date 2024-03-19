"use client";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";
interface DesciptionFormProps {
	initialData: Course;
	courseId: string;
}

const formSchema = z.object({
	description: z.string().min(1, {
		message: "Description is required",
	}),
});

export default function DescriptionForm({ initialData, courseId }: DesciptionFormProps) {
	const [isEditing, setIsEditing] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: initialData?.description || ""
		},
	});
	const router = useRouter()
	const { isSubmitting, isValid } = form.formState;
	const toggleEdit = () => setIsEditing((prev) => !prev);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}`, values);
			toast.success('Course updated')
			toggleEdit()
			router.refresh()
		} catch (error) {
			toast.error("Something went wrong")
		}
	};
	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course description
				<Button variant="ghost" onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit description
						</>
					)}
				</Button>
			</div>
			{!isEditing && <p className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>{initialData.description || "No description"}</p>}
			{isEditing && (
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											disabled={isSubmitting}
											placeholder="'This course is about...'"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button disabled={!isValid || isSubmitting} type="submit">
								Save
							</Button>
						</div>
					</form>
				</FormProvider>
			)}
		</div>
	);
}
