"use client";

import { connectMongoDB, createSubjectForUser, getUserByEmail } from "@/lib/mongodb";
import { get } from "http";
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SemesterOverview from "./_components/SemesterOverview";
import { AdminView } from "./_components/AdminView";

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

    return (
        <main className="flex min-h-screen flex-col bg-white">
            {user === null || user === undefined 
                ? <p>Loading...</p>
                :
                <>
                    {/* <UserInfo {...user} /> */}

                    {user && 
                        user.isAdmin === true ?
                            <AdminView {...user} />
                        :
                            <SemesterOverview {...user} />
                    }
                </>
            }
        </main>
    )
}