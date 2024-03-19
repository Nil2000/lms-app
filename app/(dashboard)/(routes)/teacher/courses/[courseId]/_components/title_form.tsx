"use client";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import { Form, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";
interface TitleFormProps {
	initialData: { title: string };
	courseId: string;
}

const formSchema = z.object({
	title: z.string().min(1, {
		message: "Title is required",
	}),
});

export default function TitleForm({ initialData, courseId }: TitleFormProps) {
	const [isEditing, setIsEditing] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
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
				Course title
				<Button variant="ghost" onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit title
						</>
					)}
				</Button>
			</div>
			{!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
			{isEditing && (
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. Advanced web development"
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
