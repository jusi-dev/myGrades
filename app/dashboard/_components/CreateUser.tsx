import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { User, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
  

export const CreateUser = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false)

    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        console.log(email)
        console.log(password)

        if (!email || !password || !name) {
        setError('Bitte füllen Sie alle Felder aus')
        return
        }

        try {
            const resUserExists = await fetch('/api/userExists', {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const { user } = await resUserExists.json()

            if (user) {
                setError('Benutzer existiert bereits')
                return
            }

            const res = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, name }),
                headers: {
                'Content-Type': 'application/json'
                }
            })

            if (res.ok) {
                const form = e.target;
                form.reset();
                window.dispatchEvent(new CustomEvent('refetchUser'));
                setOpen(false)
            } else {
                console.error('An error occured')
            }
        } catch (error) {
        console.error(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="bg-pink-600 text-white p-2 flex rounded-md ml-auto mr-4 text-md gap-2 font-semibold px-4"><UserPlus /> Neuen User erstellen</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle className="text-pink-600">Neuen User erstellen</DialogTitle>
                <DialogDescription className="text-gray-700">
                    Hiermit kannst du einen neuen User erstellen. <br/>Nach Erstellung des Users, sollte der User zwingend sein Passwort über die <span className="font-bold">"Passwort vergessen"</span> Funktion ändern.
                    <div className="mt-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
                            <p className="text-pink-600">Vollständiger Name</p>
                            <Input onChange={(e) => setName(e.target.value)} type="text" placeholder="Vorname Nachname" className="w-auto py-2 focus:border-pink-600 focus:ring-0"/>
                            <p className="text-pink-600">E-Mail</p>
                            <Input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="vorname.nachname@t-systems.com" className="w-auto py-2 focus:border-pink-600 focus:ring-0"/>
                            <p className="text-pink-600">Passwort</p>
                            <Input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Passwort" className="w-auto py-2 focus:border-pink-600"/>
                            <Input type="submit" value="User erstellen" className="w-auto py-2 bg-pink-600 text-white text-center cursor-pointer mt-4 font-semibold"/>
                            {error && <p className="text-red-600">{error}</p>}
                        </form>
                    </div>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}