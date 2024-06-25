import { getServerSession } from "next-auth";
import LoginForm from "./_components/LoginForm";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/background-start.png')] lg:bg-[url('/background-start-desktop.png')] bg-no-repeat bg-cover">
        <LoginForm />
    </div>
  );
}
