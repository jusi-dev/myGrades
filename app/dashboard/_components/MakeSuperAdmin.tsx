import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { deleteUser, makeUserAdmin, makeUserSuperadmin } from "@/lib/mongodb"
import { Plus, ShieldCheck } from "lucide-react"

export const MakeSuperAdmin = (user: any) => {
    const { toast } = useToast()

    const makeUserSuperAdminInDB = async () => {
        try {
            await makeUserSuperadmin(user.user._id)
            window.dispatchEvent(new CustomEvent('refetchUser'));
            toast({
                title: "Superadmin gemacht",
                description: `Der User ${user.user.name} wurde erfolgreich zum Superadmin gemacht.`,
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
            <AlertDialogTrigger className="bg-pink-600 text-white p-2 rounded-md mr-4 text-xs flex gap-2 items-center"><ShieldCheck /> User zum Superadmin machen</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bist du dir sicher, dass du den User <span className="text-pink-600 font-bold">{user.user.name}</span> zum Superadmin machen möchtest? Diese Aktion kann rückgängig gemacht werden.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction className="bg-pink-600 hover:bg-pink-700" onClick={() => makeUserSuperAdminInDB()}>Zum Superadmin machen</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}