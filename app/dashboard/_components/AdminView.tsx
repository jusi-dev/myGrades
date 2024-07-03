import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { getAllUsers, getUserByEmail } from "@/lib/mongodb"
import { AccordionTrigger } from "@radix-ui/react-accordion";
import { ArrowDown, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { StudentOverview } from "./StudentOverview";
import { CreateUser } from "./CreateUser";
import { isNull } from "util";
import { ChangePassword } from "./ChangePassword";

export const AdminView = (user: any) => {

    const [users, setUsers] = useState<object[]>([]);
    const [firstLoad, setFirstLoad] = useState(true);
    console.log("User", user)

    const getAllUsersFromDB = async () => {
        const users = await getAllUsers(user);
        console.log("All users", users)
        let filteredUsers;
        if (user.isSuperadmin === false) {

            console.log("User", users)
            // Filter out all users that are not contained in user.apprentices
            filteredUsers = users.users.filter((apprentice: any) => user.apprentices.includes(apprentice.email));
        } else {
            filteredUsers = users.users;
        }
        setUsers(filteredUsers); // Change the argument type to 'users.users'
    }

    useEffect(() => {
        // Fetch all users
        if (firstLoad) {
            if (user && user.isAdmin === true) {
                getAllUsersFromDB();
            }

            setFirstLoad(false)
        }

        window.addEventListener('refetchUser', getAllUsersFromDB);
    }, [])

    return (
        <div className="lg:px-[25%] pt-20 lg:pt-28 flex flex-col min-h-screen p-8 bg-slate-100">
            <h1 className="text-4xl text-pink-700 font-bold">Willkommen {user.name}</h1>
            <p className="text-gray-700 text-2xl font-medium">
                im {user.isSuperadmin ? "Admin" : "Praxisbildner"}-Dashboard
            </p>
            <div className="m-4 mt-10 shadow-md p-4 rounded-lg bg-slate-100">
                <p className="underline underline-offset-4 text-pink-700 font-bold text-2xl mb-6">User Verwaltung</p>
                {user !== undefined && user.isAdmin
                ?
                    users.length >= 1 ?
                    <Accordion type="single" collapsible className=" p-4">
                        {users && users.map((student: any) => {
                            return (
                                <StudentOverview user={student} key={user._id} currentUser={user} />
                            )
                        })}
                    </Accordion>
                    :
                        <p>Keine User gefunden</p>

                :
                    <p>Loading...</p>
                }
            </div>
            <div className="flex ml-4">
                <button className="bg-pink-600 text-white p-2 px-4 flex rounded-md mr-4 text-md gap-2 font-semibold w-[50%]" onClick={() => signOut()}><LogOut/> Sign Out</button>
                {user.isSuperadmin &&
                    <CreateUser />
                }
            </div>
            <div className="flex justify-end mt-4">
                <ChangePassword user={user} />
            </div>
        </div>
    )
}