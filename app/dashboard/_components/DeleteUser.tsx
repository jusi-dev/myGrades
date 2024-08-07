import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { deleteUser } from "@/lib/mongodb"
import { UserMinus } from "lucide-react"

export const DeleteUser = (user: any) => {
    const { toast } = useToast()
    const deleteUserFromDB = async () => {
        try {
            await deleteUser(user.user._id)
            window.dispatchEvent(new CustomEvent('refetchUser'));
            toast({
                title: "User gelöscht",
                description: `Der User ${user.user.name} wurde erfolgreich gelöscht.`,
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

    return(
        <AlertDialog>
            <AlertDialogTrigger className="bg-pink-600 text-white p-2 rounded-md ml-auto px-4 text-xs flex items-center gap-2"><UserMinus />User löschen</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bist du dir sicher, dass du den User <span className="text-pink-600 font-bold">{user.user.name}</span> löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction className="bg-pink-600 hover:bg-pink-700" onClick={() => deleteUserFromDB()}>Löschen</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}