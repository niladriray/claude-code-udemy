import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NewWorkoutForm } from "./new-workout-form";

export default async function NewWorkoutPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <NewWorkoutForm />
    </main>
  );
}
