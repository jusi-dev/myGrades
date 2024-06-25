import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { getAllUsers } from "@/lib/mongodb"
import { AccordionTrigger } from "@radix-ui/react-accordion";
import { ArrowDown, LogOut } from "lucide-react";
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { StudentOverview } from "./StudentOverview";
import { CreateUser } from "./CreateUser";

export const AdminView = (user: any) => {

    const [users, setUsers] = useState();

    const getAllUsersFromDB = async () => {
        const users = await getAllUsers(user);
        console.log("All users", users)
        setUsers(users);
    }

    useEffect(() => {
        // Fetch all users
        if (user && user.isAdmin === true) {
            getAllUsersFromDB();
        }

        window.addEventListener('refetchUser', getAllUsersFromDB);
    }, [])

    return (
        <div className="lg:px-[25%] pt-20 lg:pt-28 flex flex-col min-h-screen p-8 bg-slate-100">
            <h1 className="text-4xl text-pink-700 font-bold">Willkommen {user.name}</h1>
            <p className="text-gray-700 text-2xl font-medium">im Admin-Dashboard</p>
            <div className="m-4 mt-10 shadow-md p-4 rounded-lg bg-slate-100">
                <p className="underline underline-offset-4 text-pink-700 font-bold text-2xl mb-6">User Verwaltung</p>
                <Accordion type="single" collapsible className=" p-4">
                    {users && users.users.map((user: any) => {
                        return (
                            <StudentOverview user={user} key={user._id}/>
                        )
                    })}
                </Accordion>
            </div>
            <div className="flex ml-4">
                <button className="bg-pink-600 text-white p-2 px-4 flex rounded-md mr-4 text-md gap-2 font-semibold" onClick={() => signOut()}><LogOut/> Sign Out</button>
                <CreateUser />
            </div>
        </div>
    )
}