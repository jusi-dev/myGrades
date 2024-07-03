import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { removeApprenticeFromUser } from "@/lib/mongodb"
import { Trash, UserRoundMinus } from "lucide-react"

export const ListAddedApprentice = ({apprentice, selectedUser} : any) => {
    const { toast } = useToast()

    const removeApprenticeFromAdminInDB = async () => {
        try {
            await removeApprenticeFromUser(apprentice, selectedUser.email)
            toast({
                title: "Lehrling entfernt",
                description: `Der Lehrling ${apprentice} wurde erfolgreich von ${selectedUser.name} entfernt.`,
                variant: "success",
            })
            window.dispatchEvent(new CustomEvent('refetchUser'));
        } catch (error) {
            console.error(error)
            toast({
                title: "Ups...",
                description: "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
                variant: "destructive"
            
            })
        }
    }
    console.log("apprentice: ",apprentice)
    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between">
                <p className="text-md text-gray-700">{apprentice}</p>
                <AlertDialog>
                    <AlertDialogTrigger className="text-pink-600 cursor-pointer hover:scale-110"><UserRoundMinus size={24} /></AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Bist du dir sicher, dass du den Lehrling <span className="text-pink-600 font-bold">{apprentice}</span> von <span className="text-pink-600 font-bold">{selectedUser.name}</span> entfernen möchtest? Diese Aktion kann rückgängig gemacht werden.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction className="bg-pink-600 hover:bg-pink-700" onClick={() => removeApprenticeFromAdminInDB()}>Lehrling entfernen</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}