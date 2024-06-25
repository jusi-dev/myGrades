import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { deleteUser, makeUserAdmin } from "@/lib/mongodb"
import { Plus, ShieldCheck } from "lucide-react"

export const MakeAdmin = (user: any) => {
    const makeUserAdminInDB = async () => {
        try {
            await makeUserAdmin(user.user._id)
            window.dispatchEvent(new CustomEvent('refetchUser'));
        } catch (error) {
            console.error(error)
        }
    }

    return(
        <AlertDialog>
            <AlertDialogTrigger className="bg-pink-600 text-white p-2 rounded-md mr-4 text-xs flex gap-2 items-center"><ShieldCheck /> User zum Admin machen</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bist du dir sicher, dass du den User <span className="text-pink-600 font-bold">{user.user.name}</span> zum Admin machen möchtest? Diese Aktion kann rückgängig gemacht werden.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction className="bg-pink-600 hover:bg-pink-700" onClick={() => makeUserAdminInDB()}>Zum Admin machen</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}