"use client";

import { connectMongoDB, createSubjectForUser, getUserByEmail } from "@/lib/mongodb";
import { get } from "http";
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import UserInfo from "../_components/UserInfo";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { data: session } = useSession();
    const [ user, setUser ] = useState<any>(null);


    const fetchUser = async () => {
        console.log("Miau")
        const { user } = await getUserByEmail(session?.user?.email || "");
        console.log("Mongo User", user)
        setUser(user);
    }

    useEffect(() => {
        fetchUser();
    }, [session])

    const router = useRouter();

    return (
        <main className="flex min-h-screen flex-col bg-white">
            {user === null 
                ? <p>Loading...</p>
                :
                <>
                    <button className="flex items-center justify-center text-white text-xl font-bold bg-pink-600 p-2 m-2 rounded-xl gap-2 transform active:scale-75 transition-transform" onClick={() => router.replace("/dashboard")}><Undo2 /> Back</button>
                    <UserInfo {...user} />
                </>
            }
        </main>
    )
}