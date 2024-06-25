import { toggleMailNotifications } from "@/lib/mongodb"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Mail } from "lucide-react"


export const ToggleMail = (user: any) => {
    const toggleMailNotificationsInDB = async () => {
        try {
            await toggleMailNotifications(user.user._id)
            window.dispatchEvent(new CustomEvent('refetchUser'));
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className="bg-pink-600 text-white p-2 rounded-md ml-auto text-xs flex gap-2 items-center">
                <Mail /> {user.user.receivesMailNotifications ? 'Mail Benachrichtigungen deaktivieren' : 'Mail Benachrichtigungen aktivieren'}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bist du dir sicher, dass du für den User <span className="text-pink-600 font-bold">{user.user.name}</span> E-Mail Benachrichtungen {user.user.receivesMailNotifications ? "deaktivieren " : "aktivieren "} möchtest? Diese Aktion kann rückgängig gemacht werden.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction className="bg-pink-600 hover:bg-pink-700" onClick={() => toggleMailNotificationsInDB()}>
                        {user.user.receivesMailNotifications ? 'Mail Benachrichtigungen deaktivieren' : 'Mail Benachrichtigungen aktivieren'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}