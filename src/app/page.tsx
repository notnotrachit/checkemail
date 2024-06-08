import Image from "next/image";
import { SignIn } from "@/components/sign-in";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) return redirect("/dashboard");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <SignIn />
      </div>
    </main>
  );
}
