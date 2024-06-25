import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowDown, Crown } from "lucide-react"
import { DeleteUser } from "./DeleteUser";
import { MakeAdmin } from "./MakeAdmin";
import { RemoveAdmin } from "./RemoveAdmin";
import { useSession } from "next-auth/react";
import { ToggleMail } from "./ToggleMail";

export const StudentOverview = (user: any) => {

    const currentSession = useSession();
    console.log("Current session", currentSession.data?.user?.email)

    const calculateGradeAverage = (grades: any) => {
        let totalGrades = 0;
        let totalWeight = 0;

        grades.forEach((grade: any) => {
            if (grade.grade_value === 0) {
                return; // Exit the current iteration and continue with the next iteration
            }
            totalGrades += grade.grade_value * grade.weight;
            totalWeight += grade.weight;
        });

        if (totalWeight === 0) {
            return 0;
        }

        return (totalGrades / totalWeight).toFixed(2);
    }

    const calculateSemesterAverage = (semester: any) => {

        let subjectGradeAverage: number[] = [];
    
        // Durchlaufe jede Note und summiere die gewichteten Noten und die Gewichtungen
        semester.subjects.forEach((subject: any) => {
            let totalGrades = 0; // Summe der gewichteten Noten
            let totalGradesCount = 0; // Summe aller Noten
            
            subject.grades.forEach((grade: any) => {
                if (grade.grade_value === 0) {
                    return; // Exit the current iteration and continue with the next iteration
                }
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

    const calculateSubjectAverage = (subject: any) => {
        let totalGrades = 0;
        let totalWeight = 0;

        subject.grades.forEach((grade: any) => {
            if (grade.grade_value === 0) {
                return; // Exit the current iteration and continue with the next iteration
            }
            totalGrades += grade.grade_value * grade.weight;
            totalWeight += grade.weight;
        });

        if (totalWeight === 0) {
            return 0;
        }

        return (totalGrades / totalWeight).toFixed(2);
    }

    const calculateTotalAverage = (semesters: any) => {
        let totalAverage = 0;
        let totalSemesters = 0;

        semesters.forEach((semester: any) => {
            let semesterAverage = parseFloat(calculateSemesterAverage(semester))
            if (semesterAverage === 0) {
                return;
            }
            totalAverage += semesterAverage;
            totalSemesters++;
        });

        if (totalSemesters === 0) {
            return 0;
        }

        return (totalAverage / totalSemesters).toFixed(2);
    }

    return (
        <AccordionItem value={user.user._id}>
            <AccordionTrigger className="text-pink-600 font-bold text-xl text-left flex w-full justify-between">
                <p className="mr-4">
                    {user.user.name}
                </p>
                <p className="text-lg ml-auto mr-4">
                    {user.user.isAdmin 
                        ?
                            <p className="text-pink-600"><Crown /></p>
                        :
                            <p>{calculateTotalAverage(user.user.semesters)}  Ø</p>
                    }
                </p>
            </AccordionTrigger>
            <AccordionContent>
                <div key={user.user._id}>
                    <p>Name: {user.user.name}</p>
                    <p>Email: {user.user.email}</p>
                </div>
                <Accordion type="single" collapsible>
                    {user.user.semesters.map((semester: any) => {
                        return (
                            <AccordionItem value={semester.semester_id} key={semester.semester_id}>
                                <AccordionTrigger className="text-pink-600 font-semibold flex justify-between w-full">
                                    <div className="text-pink-600 flex w-full justify-between text-lg">
                                        <p>{semester.semester_name}</p>
                                        <p className="mr-4">{calculateSemesterAverage(semester)} Ø</p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent key={semester.semester_id}>
                                    <Accordion type="single" collapsible>
                                        {semester.subjects.map((subject: any) => {
                                            return (
                                                <AccordionItem value={subject.subject_name} key={subject.subject_name}>
                                                    <AccordionTrigger className="text-pink-600 flex justify-between w-full">
                                                        <div className="flex w-full justify-between">
                                                            <p className="text-pink-600">{subject.subject_name}</p>
                                                            <p className="text-pink-600 mr-4">{calculateSubjectAverage(subject)} Ø</p>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="flex flex-col w-full gap-y-2">
                                                        {subject.grades.map((grade: any) => {
                                                            return (
                                                                <div className="flex w-full justify-between items-center shadow-md rounded-xl p-4" key={grade.grade_name}>
                                                                    <p>{grade.grade_name}</p>
                                                                    <div className="flex flex-col justify-center items-center">
                                                                        <p>{grade.grade_value}</p>
                                                                        <p className="font-thin text-gray-900">{grade.weight}%</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )
                                        })}
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>

                { user.user.isAdmin &&
                    <div className="flex justify-end w-full mt-4">
                        <ToggleMail user={user.user} />
                    </div>
                }
                
                { user.user.email !== currentSession.data?.user?.email 
                    ?
                        <div className="flex w-full mt-4">
                            {user.user.isAdmin
                                ? <RemoveAdmin user={user.user} />
                                : <MakeAdmin user={user.user} />
                            }
                            <DeleteUser user={user.user} />
                        </div>
                    :
                        <div className="flex justify-end w-full mt-4">
                            <p className="text-red-600">Du kannst dich selbst nicht bearbeiten</p>
                        </div>
                }

            </AccordionContent>
        </AccordionItem>
    )
}