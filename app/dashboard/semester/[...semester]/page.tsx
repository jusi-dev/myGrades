"use client";

import { createSubjectForUser, deleteSubjectForSemester, getUserByEmail } from "@/lib/mongodb";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SubjectDetails from "./_components/SubjectDetails";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Ban, Trash, Undo2 } from "lucide-react";
import { set } from "mongoose";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "@/components/ui/loader";

interface User {
    _id: string;
    name: string;
    email: string;
    semesters: any[];
}

export default function SemesterDetails() {
    const searchParam = useParams().semester;
    const { data: session } = useSession();
    const [ user, setUser ] = useState<any>(null);
    const [ semester, setSemester ] = useState<any>(null);
    const [ subject, setSubject ] = useState<any>(null);
    const [ currentSubjectId, setCurrentSubjectId ] = useState("")

    const [ isDeleteMode, setIsDeleteMode ] = useState(false);

    const [ subjectName, setSubjectName ] = useState("");

    const router = useRouter();
    const { toast } = useToast();


    const fetchUser = async () => {
        const { user } = await getUserByEmail(session?.user?.email || "");
        await fetchSemester(user)
        setUser(user);
    }

    const fetchSemester = async (user: User) => {

        const semester = user.semesters.find(semester => semester.semester_id === searchParam[0]);
        setSemester(semester);

        await refetchSubject(semester)
    }

    const createSubject = async (subjectName: string) => {
        if (!subjectName) {
            return;
        }

        try {
            await createSubjectForUser(user!._id, subjectName, searchParam[0])
            await fetchUser();
            setSubjectName("");
            toast({
                title: "Fach erstellt",
                description: "Das Fach wurde erfolgreich erstellt.",
                variant: "success"
            })
        } catch (error) {
            console.error(error)
            toast({
                title: "Ups...",
                description: "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
                variant: "destructive"
            })
        }
    }

    const clearSubject = () => {
        setSubject(null);
        window.sessionStorage.removeItem('currentSubjectId')
    }

    const setNewSubject = (subject: any) => {
        console.log("Setting new subject: ", subject)
        setSubject(subject);
        setCurrentSubjectId(subject._id)
        window.sessionStorage.setItem('currentSubjectId', subject._id)
        console.log("Current subject ID", currentSubjectId)
    }

    const setOrDeleteSubject = async (subject: any) => {
        if (isDeleteMode) {
            try {
                console.log("Deleting subject", subject)
                console.log("User ID", user._id)

                // Delete subject
                await deleteSubjectForSemester(user._id, searchParam[0], subject._id);
                window.dispatchEvent(new CustomEvent('updateUser'));
                setIsDeleteMode(false);

                toast({
                    title: "Fach erfolgreich gelöscht",
                    description: "Das Fach wurde erfolgreich gelöscht.",
                    variant: "success"
                })
            } catch (error) {
                console.error(error)
                toast({
                    title: "Ups...",
                    description: "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
                    variant: "destructive",
                })
            }
        } else {
            setNewSubject(subject);
        }
    }

    const refetchSubject = async (semester: any) => {
        // await fetchUser()

        const sessionSubjectId = window.sessionStorage.getItem('currentSubjectId')

        if (!sessionSubjectId) {
            return;
        }

        console.log("Current subject ID", sessionSubjectId)

        // Get subject from semester
        const newSubject = semester.subjects.find((newSubject: any) => newSubject._id == sessionSubjectId);

        console.log("New subject", newSubject)

        setSubject(newSubject);
    }

    useEffect(() => {
        if (session) {
            fetchUser();
        }

        // Set up the event listener for file upload events
        window.addEventListener('updateUser', fetchUser);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('updateUser', fetchUser);
        };
    }, [session])

    const calculateGradeAverage = (subject: any) => {
        let totalWeightedGrades = 0; // Summe der gewichteten Noten
        let totalWeight = 0;         // Summe der Gewichtungen
    
        // Durchlaufe jede Note und summiere die gewichteten Noten und die Gewichtungen
        subject.grades.forEach((grade: any) => {
            totalWeightedGrades += grade.grade_value * grade.weight;
            totalWeight += grade.weight;
        });
    
        // Überprüfe, ob die Gesamtgewichtung 0 ist, um Division durch 0 zu vermeiden
        if (totalWeight === 0) {
            return "0.00"; // Wenn keine Gewichtungen vorhanden sind, ist der Durchschnitt 0
        }
    
        // Berechne den gewichteten Durchschnitt

        let average = (totalWeightedGrades / totalWeight).toFixed(2);

        console.log("Average", average)

        if (parseInt(average) === 0) {
            average = "0.00";
        }

        return average;
    }

    return (
        <>
        {
            subject 
            ?
                <div className="p-2 min-h-screen bg-[url('/background-basic.png')] lg:bg-[url('/background-basic-desktop.png')] bg-no-repeat bg-cover lg:px-[30%] lg:pt-[20vh]">
                    <button className="flex items-center justify-center text-white text-xl font-bold bg-pink-600 p-2 m-2 rounded-xl gap-2 transform active:scale-75 transition-transform" onClick={() => clearSubject()}><Undo2 /> Back</button>
                    <SubjectDetails subject={subject} userId={user!._id} subjectId={searchParam[0]} />
                </div>
            :
                <div className="p-2 min-h-screen bg-[url('/background-basic.png')] lg:bg-[url('/background-basic-desktop.png')] bg-no-repeat bg-cover lg:px-[30%] lg:pt-[20vh]">
                    <button className="flex items-center justify-center text-white text-xl font-bold bg-pink-600 p-2 rounded-xl gap-2 transform active:scale-75 transition-transform" onClick={() => router.replace("/dashboard")}><Undo2 /> Back</button>

                    <div className="p-6">
                        <div className="mb-6">
                            {/* <h1 className="text-4xl font-semibold text-pink-600">{searchParam[0]}</h1> */}
                            <h1 className="text-4xl font-semibold text-pink-600">Fächer</h1>
                            <p className="text-5xl font-bold text-pink-700 -mt-2">Overview</p>
                        </div>

                        {/* List all subjects for semester {searchParam[0]} */}
                        <div className="flex flex-wrap gap-4">
                                { semester ?
                                <>
                                    {
                                        semester.subjects.map((subject: any) => (
                                            <div key={subject._id} onClick={() => setOrDeleteSubject(subject)} className={`flex flex-col justify-center cursor-pointer p-4 ${isDeleteMode ? "bg-pink-300" : "bg-pink-600"} ${isDeleteMode && 'animate-pulse'} text-white text-center text-xl font-bold rounded-xl w-[45%] h-32 border-white border-2 shadow-lg`}>
                                                {subject.subject_name}
                                                <p className="text-sm">{calculateGradeAverage(subject)} Ø</p>
                                            </div>
                                        ))
                                    }
                                

                                    <Dialog>
                                        <DialogTrigger className="flex flex-col justify-center p-4 bg-pink-600 text-white text-center text-xl font-bold rounded-xl w-[45%] h-32 border-white border-2 shadow-lg">+ Fach hinzufügen</DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                            <DialogTitle>Neues Fach hinzufügen</DialogTitle>
                                            <DialogDescription>
                                                <p className="mb-2 text-gray-700">Gib den Namen deines neuen Faches an:</p>
                                                <Input type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="Math" />
                                                <DialogClose asChild>
                                                    <button onClick={() => createSubject(subjectName)} className="py-3 px-4 bg-pink-600 mt-4 text-white rounded-xl shadow-lg">Fach erstellen</button>
                                                </DialogClose>
                                            </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </>
                                    :
                                <Loader />
                                }
                        </div>

                        <div className="w-full flex mt-8">
                            {isDeleteMode && <button className="bg-pink-600 p-4 text-white font-semibold rounded-xl ml-auto mr-4 shadow-lg border-white border-2 flex gap-x-2" onClick={() => setIsDeleteMode(false)}><Ban /> Abbrechen</button>}
                            {!isDeleteMode && <button className="bg-pink-600 p-4 text-white font-semibold rounded-xl ml-auto mr-4 shadow-lg border-white border-2 flex gap-x-2" onClick={() => setIsDeleteMode(true)}><Trash />Fach löschen</button>}
                        </div>
                    </div>
                </div>
        }
        </>
    )
}