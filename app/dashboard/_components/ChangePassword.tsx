import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { changePassword } from "@/lib/mongodb"
import { Key } from "lucide-react"
import { useState } from "react"

export const ChangePassword = ({user}: any) => {
    const { toast } = useToast()
    const [oldPassword, setOldPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('')

    const changePasswordInDB = async () => {
        if(newPassword !== newPasswordConfirm) {
            toast({
                title: "Ups...",
                description: "Das neue Passwort stimmt nicht überein",
                variant: "destructive"
            })

            return;
        }

        try {
            await changePassword(user._id, oldPassword, newPassword)
            toast({
                title: "Passwort geändert",
                description: `Das Passwort wurde erfolgreich geändert.`,
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

    return (
        <AlertDialog>
            <AlertDialogTrigger className="bg-pink-600 p-4 text-white font-semibold flex  gap-x-2 rounded-xl mr-4 shadow-lg border-white border-2"><Key /> Passwort ändern</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Passwort ändern</AlertDialogTitle>
                    <AlertDialogDescription>
                        <p className="text-pink-600 font-semibold mb-0.5">Altes Passwort</p>
                        <Input type="password" placeholder="Altes Passwort" onChange={(e) => setOldPassword(e.target.value)}/>
                        <p className="text-pink-600 font-semibold mb-0.5 mt-2">Neues Passwort</p>
                        <Input type="password" placeholder="Neues Passwort" onChange={(e) => setNewPassword(e.target.value)}/>
                        <p className="text-pink-600 font-semibold mb-0.5 mt-2">Neues Passwort bestätigen</p>
                        <Input type="password" placeholder="Neues Passwort bestätigen" onChange={(e) => setNewPasswordConfirm(e.target.value)}/>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction className="bg-pink-600 hover:bg-pink-700" onClick={() => changePasswordInDB()}>Passwort ändern</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}