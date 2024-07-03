import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { addApprenticeToUser, getAllUsers } from "@/lib/mongodb"
import { Minus, Plus } from "lucide-react"
import { useEffect, useState } from "react"

export const AddApprentice = ({user} : any) => {
    const [selectedApprentice, setSelectedApprentice] = useState<any>([])
    const [apprentices, setApprentices] = useState<any>()

    const { toast } = useToast()

    const addApprenticeToUserInDB = async () => {
        try {
            selectedApprentice.forEach(async (apprenticeEmail: any) => {
                await addApprenticeToUser(apprenticeEmail, user.email)
            })
            window.dispatchEvent(new CustomEvent('refetchUser'));
            toast({
                title: "Lehrling hinzugefügt",
                description: "Der Lehrling wurde erfolgreich hinzugefügt.",
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

    const addOrRemoveApprenticeToSelectedApprentices = (apprenticeEmail: any) => {
        if(selectedApprentice.includes(apprenticeEmail)) {
            setSelectedApprentice(selectedApprentice.filter((email: any) => email !== apprenticeEmail))
        } else {
            setSelectedApprentice([...selectedApprentice, apprenticeEmail])
        }
    }

    useEffect(() => {
        const fetchApprentices = async () => {
            const fetchedApprentices = await getAllUsers(user)
            const filteredAdmins = fetchedApprentices.users.filter((apprentice: any) => apprentice.isAdmin === false)
            const notAssigedApprentices = filteredAdmins.filter((apprentice: any) => user.apprentices.includes(apprentice.email) === false)
            setApprentices(notAssigedApprentices)
        }

        fetchApprentices()
    }, [])

    return(
        <AlertDialog>
            <AlertDialogTrigger className="bg-pink-600 text-white p-2 rounded-md mr-4 text-xs flex gap-2 items-center"><Plus /> Lehrling zum Praxisbildner hinzufügen</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Welchen Lehrling möchtest du hinzufügen?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Wähle einen Lehrling aus der Liste aus, um ihn zu deinen sichtbaren Lehrlingen hinzuzufügen.
                        <div className="flex flex-col gap-y-2 text-white font-semibold mt-4">
                            {apprentices && apprentices.map((apprentice: any) => {
                                return (
                                    <div onClick={() => addOrRemoveApprenticeToSelectedApprentices(apprentice.email)} key={apprentice.email} className="flex items-center gap-x-1 bg-pink-600 py-3 rounded-lg px-4 cursor-pointer">
                                        {selectedApprentice.includes(apprentice.email) ? <Minus /> : <Plus />}
                                        <p>{apprentice.name}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction className="bg-pink-600 hover:bg-pink-700" onClick={() => addApprenticeToUserInDB()}>Lehrling hinzufügen</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}