"use client";

import { sendMailNotification } from "@/app/actions/user-actions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createGradeForSubject, deleteGradeForSubject } from "@/lib/mongodb";
import { Ban, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface User {
    _id: string;
    name: string;
    email: string;
    semesters: any[];
}

export default function SubjectDetails(subject: any) {
    const [gradeName, setGradeName] = useState("");
    const [gradeValue, setGradeValue] = useState(0);
    const [weight, setWeight] = useState(0);
    const [gradeAverage, setGradeAverage] = useState("0.00");
    const [ isDeleteMode, setIsDeleteMode ] = useState(false);
    const currentUser = useSession();

    const { toast} = useToast();

    const createGrade = async (gradeName: string, gradeValue: number, weight: number) => {
        if (!gradeName || !gradeValue || !weight) {
            return;
        }

        try {

            await createGradeForSubject(subject.userId, subject.subjectId, subject.subject._id, gradeName, gradeValue, weight)

            if (!currentUser) {
                return;
            }
            await sendMailNotification(currentUser!.data?.user?.name || '', gradeValue, subject.subject.subject_name, gradeName);
            window.dispatchEvent(new CustomEvent('updateUser'));

            toast({
                title: "Note erstellt",
                description: "Die Note wurde erfolgreich erstellt.",
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

    const calculateGradeAverage = () => {
        let totalWeightedGrades = 0; // Summe der gewichteten Noten
        let totalWeight = 0;         // Summe der Gewichtungen
    
        // Durchlaufe jede Note und summiere die gewichteten Noten und die Gewichtungen
        subject.subject.grades.forEach((grade: any) => {
            totalWeightedGrades += grade.grade_value * grade.weight;
            totalWeight += grade.weight;
        });
    
        // Überprüfe, ob die Gesamtgewichtung 0 ist, um Division durch 0 zu vermeiden
        if (totalWeight === 0) {
            return 0; // Wenn keine Gewichtungen vorhanden sind, ist der Durchschnitt 0
        }
    
        // Berechne den gewichteten Durchschnitt

        let average = (totalWeightedGrades / totalWeight).toFixed(2);

        console.log("Average", average)

        if (average === "NaN") {
            average = "0.00";
        }

        setGradeAverage(average);
    };

    const deleteGrade = async (grade: any) => {
        if (isDeleteMode) {
            try {
                console.log("Deleting grade", grade)
    
                await deleteGradeForSubject(subject.userId, subject.subjectId, subject.subject._id, grade._id);
                window.dispatchEvent(new CustomEvent('updateUser'));
                setIsDeleteMode(false);

                toast({
                    title: "Note gelöscht",
                    description: "Die Note wurde erfolgreich gelöscht.",
                    variant: "success",
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
    }

    useEffect(() => {
        calculateGradeAverage();
    }, [subject.subject.grades])
    
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-4xl font-semibold text-pink-600">
            {subject.subject.subject_name}
          </h1>
          <p className="text-5xl font-bold text-pink-700 -mt-2">Overview</p>
          <p>Notendurchschnitt: {gradeAverage}Ø</p>
        </div>
        <div className="flex flex-col gap-5">
          <Dialog>
            <DialogTrigger className="p-8 bg-pink-600 flex items-center text-white text-xl font-bold rounded-3xl w-[100%] h-16 border-white border-2 shadow-lg">
              <div className="flex justify-between w-full">
                <p>Note hinzufügen</p>
                <p className="text-2xl">+</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Note erstellen</DialogTitle>
                <DialogDescription className="flex flex-col gap-y-2">
                  <p className="mb-2 text-gray-700">
                    Fülle alle Angaben aus, um eine Note hinzuzufügen
                  </p>
                  <p className="text-pink-600 text-left">
                    Notenbezeichnung{" "}
                    <span className="font-light text-xs text-pink-500">
                      (zB. LB 1)
                    </span>
                  </p>
                  <Input
                    type="text"
                    value={gradeName}
                    onChange={(e) => setGradeName(e.target.value)}
                    placeholder="LB 1"
                  />
                  <p className="text-pink-600 text-left">
                    Note{" "}
                    <span className="font-light text-xs text-pink-500">
                      (zB. 5,5)
                    </span>
                  </p>
                  <Input
                    type="number"
                    step={"0.01"}
                    value={gradeValue}
                    onChange={(e) => {
                        let value = parseFloat(e.target.value);
                        if (value < 1) value = 1;
                        if (value > 6) value = 6;
                        setGradeValue(value);
                    }}
                    placeholder="6"
                    min={1}
                    max={6}
                  />
                  <p className="text-pink-600 text-left">
                    Gewichtung in %{" "}
                    <span className="font-light text-xs text-pink-500">
                      (zB. 60%)
                    </span>
                  </p>
                  <div className="flex justify-center items-center">
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => {
                        let value = parseFloat(e.target.value);
                        if (value < 1) value = 1;
                        if (value > 100) value = 100;
                        setWeight(value);
                    }}
                      placeholder="80"
                      min={1}
                      max={100}
                    />
                    <p className="text-pink-600 text-xl ml-4">%</p>
                  </div>
                  <DialogClose asChild>
                    <button
                      onClick={() => createGrade(gradeName, gradeValue, weight)}
                      className="p-2 bg-pink-600 mt-4 text-white rounded-xl"
                    >
                      Note hinzufügen
                    </button>
                  </DialogClose>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <div className="w-full bg-pink-600 h-0.5"></div>

          {subject.subject.grades.map((grade: any) => (
            <div
              onClick={() => deleteGrade(grade)}
              className={`p-8 ${isDeleteMode ? "bg-pink-300" : "bg-pink-600"} ${
                isDeleteMode && "animate-pulse"
              } bg-pink-600 flex items-center text-white text-xl font-bold justify-between rounded-3xl w-[100%] h-16 border-white border-2 shadow-lg`}
              key={grade.name}
            >
              <p>{grade.grade_name}</p>
              <div className="flex flex-col justify-center text-center">
                <p>{grade.grade_value}</p>
                <p className="text-xs font-thin">{grade.weight}%</p>
              </div>
            </div>
          ))}

          <div className="w-full flex mt-8">
            {isDeleteMode && (
              <button
                className="bg-pink-600 p-4 text-white font-semibold rounded-xl ml-auto shadow-lg border-white border-2 flex gap-x-2"
                onClick={() => setIsDeleteMode(false)}
              >
                <Ban />
                Abbrechen
              </button>
            )}
            {!isDeleteMode && (
              <button
                className="bg-pink-600 p-4 text-white font-semibold rounded-xl ml-auto shadow-lg border-white border-2 flex gap-x-2"
                onClick={() => setIsDeleteMode(true)}
              >
                <Trash />
                Note löschen
              </button>
            )}
          </div>
        </div>
      </div>
    );
}