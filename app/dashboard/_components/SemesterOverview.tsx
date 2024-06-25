"use client";

import { useToast } from "@/components/ui/use-toast";
import { createSemesterForUser, deleteSemesterForUser, getUserByEmail } from "@/lib/mongodb";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SemesterOverview(user: any) {
    const { data: session } = useSession();
    const [ isDeleteMode, setIsDeleteMode ] = useState(false);
    const [ fetchedUser, setFetchedUser ] = useState();

    const router = useRouter();
    const { toast } = useToast();

    const addSemester = async () => {
        try {
            const user = await getUserByEmail(session?.user?.email || "");
            console.log("This is the addSemester user", user)
            const semesterCount = user.user.semesters.length + 1;
            console.log("Creating semester", semesterCount)
    
            await createSemesterForUser(user.user._id, semesterCount);
            await fetchUser();  

            toast({
                title: "Semester hinzugefügt",
                description: "Das Semester wurde erfolgreich hinzugefügt.",
                variant: "success"
            })
        } catch (error) {
            toast({
                title: "Ups...",
                description: "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
                variant: "destructive"
            })
        }
    }

    const fetchUser = async () => {
        const { user: fetchUser } = await getUserByEmail(session?.user?.email || "");

        setFetchedUser(fetchUser);
    }

    const switchOrDeleteSemester = async (semester: any) => {
        if (isDeleteMode) {
            try {
                console.log("Deleting semester", semester)
    
                // Delete semestert
                await deleteSemesterForUser(fetchedUser!._id, semester.semester_id);
                setIsDeleteMode(false);
                await fetchUser();

                toast({
                    title: "Semester gelöscht",
                    description: "Das Semester wurde erfolgreich gelöscht.",
                    variant: "success"
                })
            } catch (error) {
                toast({
                    title: "Ups...",
                    description: "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
                    variant: "destructive"
                })
            }
        } else {
            router.replace(`/dashboard/semester/${semester.semester_id}`)
        }
    }

    const calculateSemesterAverage = (semester: any) => {

        let subjectGradeAverage: number[] = [];
    
        // Durchlaufe jede Note und summiere die gewichteten Noten und die Gewichtungen
        semester.subjects.forEach((subject: any) => {
            let totalGrades = 0; // Summe der gewichteten Noten
            let totalGradesCount = 0; // Summe aller Noten
            
            subject.grades.forEach((grade: any) => {
                totalGrades += grade.grade_value;
                totalGradesCount++;
            });

            // Überprüfe, ob die Gesamtgewichtung 0 ist, um Division durch 0 zu vermeiden
            if (totalGradesCount === 0) {
                return 0; // Wenn keine Gewichtungen vorhanden sind, ist der Durchschnitt 0
            }

            // Berechne den gewichteten Durchschnitt
            let average = (totalGrades / totalGradesCount).toFixed(2);

            subjectGradeAverage.push(parseFloat(average));
        });

        let totalAverage = 0;

        subjectGradeAverage.forEach((average: any) => {
            totalAverage += parseFloat(average);
        });

        let average = (totalAverage / subjectGradeAverage.length).toFixed(2);

    
        if (average === "NaN") {
            average = "0.00";
        }

        console.log("Semester average: ", average)
    
        return average;
    }

    useEffect(() => {
        setFetchedUser(user);
    }, [user])

    return (
        <div className="flex flex-col p-6 h-full min-h-screen bg-[url('/background-basic.png')] lg:bg-[url('/background-basic-desktop.png')] bg-no-repeat bg-cover lg:px-[30%] lg:pt-[20vh]">
            <div>
                <p className="text-4xl font-semibold text-pink-700">Willkommen <br/><span className="text-pink-600" onClick={() => router.replace("/dashboard/userinfo")}>{user.name}</span></p>
                <h1 className="text-5xl font-bold text-pink-700 mt-2">Übersicht</h1>
            </div>
            {fetchedUser &&
                <div className="flex flex-wrap gap-4 py-4 mt-6">
                    {fetchedUser.semesters.map((semester: string) => (
                        <div onClick={() => switchOrDeleteSemester(semester)} key={semester.semester_id} 
                            className={`flex flex-col justify-center p-4 ${isDeleteMode ? "bg-pink-300" : "bg-pink-600"} ${isDeleteMode && 'animate-pulse'} text-white text-center text-xl font-bold rounded-xl w-[45%] h-32 border-white border-2 shadow-lg`}
                        >
                            {semester.semester_name}
                            <p className="text-xs">{calculateSemesterAverage(semester)} Ø</p>
                        </div>
                    ))}
                    <div onClick={() => addSemester()} className={`flex flex-col justify-center p-4 bg-pink-600 text-white text-center text-xl font-bold rounded-xl w-[45%] h-32 border-white border-2 shadow-lg`}>Semester hinzufügen +</div>
                </div>
            }

            <div className="w-full flex mt-8">
                {isDeleteMode && <button className="bg-pink-600 p-4 text-white font-semibold rounded-xl ml-auto mr-4 shadow-lg border-white border-2" onClick={() => setIsDeleteMode(false)}>Abbrechen</button>}
                {!isDeleteMode && <button className="bg-pink-600 p-4 text-white font-semibold rounded-xl ml-auto mr-4 shadow-lg border-white border-2" onClick={() => setIsDeleteMode(true)}>Semester löschen</button>}
            </div>

            <button className="bg-pink-600 p-4 text-white font-semibold rounded-xl mt-24 shadow-lg border-white border-2" onClick={() => signOut()}>Abmelden</button>
        </div>
    )
}