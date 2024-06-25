import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { deleteUser, removeUserAdmin } from "@/lib/mongodb"
import { Ban, Hammer } from "lucide-react"

export const RemoveAdmin = (user: any) => {
    const removeUserAdminInDB = async () => {
        try {
            await removeUserAdmin(user.user._id)
            window.dispatchEvent(new CustomEvent('refetchUser'));
        } catch (error) {
            console.error(error)
        }
    }

    return(
        <AlertDialog>
            <AlertDialogTrigger className="bg-pink-600 text-white p-2 rounded-md mr-4 text-xs flex gap-2 items-center"><Ban /> Admin entfernen</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bist du dir sicher, dass du dem User <span className="text-pink-600 font-bold">{user.user.name}</span> den Admin entfernen möchtest? Diese Aktion kann rückgängig gemacht werden.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction className="bg-pink-600 hover:bg-pink-700" onClick={() => removeUserAdminInDB()}>Admin entfernen</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}