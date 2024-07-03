import { toggleMailNotifications } from "@/lib/mongodb"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"


export const ToggleMail = ({ user, callingUser }: any) => {
    const { toast } = useToast()
    const toggleMailNotificationsInDB = async () => {
        try {
            await toggleMailNotifications(user._id)
            window.dispatchEvent(new CustomEvent('refetchUser'));
            toast({
                title: "Mail Benachrichtigungen aktualisiert",
                description: `Mail Benachrichtigungen für ${user.name} wurden erfolgreich aktualisiert.`,
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

    const isSubscribed = callingUser.receivesMailNotifications.includes(user._id.toString())

    return (
        <AlertDialog>
            <AlertDialogTrigger className="bg-pink-600 text-white p-2 rounded-md ml-auto text-xs flex gap-2 items-center">
                <Mail /> {isSubscribed ? 'Mail Benachrichtigungen deaktivieren' : 'Mail Benachrichtigungen aktivieren'}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bist du dir sicher, dass du für den User <span className="text-pink-600 font-bold">{user.name}</span> E-Mail Benachrichtungen {isSubscribed ? "deaktivieren " : "aktivieren "} möchtest? Diese Aktion kann rückgängig gemacht werden.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction className="bg-pink-600 hover:bg-pink-700" onClick={() => toggleMailNotificationsInDB()}>
                        {isSubscribed ? 'Mail Benachrichtigungen deaktivieren' : 'Mail Benachrichtigungen aktivieren'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}