"use client";

import { resetPassword } from '@/app/actions/user-actions';
import { Input } from '@/components/ui/input';
// PasswordReset.js
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PasswordReset() {
    const searchParam = useParams().resetToken;
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            // Sende eine Anfrage zum Zurücksetzen des Passworts
            
            await resetPassword(searchParam[0], newPassword);
            setNewPassword('')
            setMessage("Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt einloggen.");
        } catch (error) {
            setMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        }
    };

    return (
        <div className="container flex flex-col min-h-screen items-center justify-center">
            <h2 className='text-pink-600 text-2xl font-bold mb-8'>Passwort zurücksetzen</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newPassword">Neues Passwort</label>
                <Input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button className='mt-4 bg-pink-600 text-white p-4 rounded-2xl font-semibold' type="submit">Passwort zurücksetzen</button>
            </form>
            {message && <p>{message}</p>}

            {message && <button onClick={() => router.replace("/")} className="text-pink-600 mt-4 text-xs">Zurück zum Login</button>}
        </div>
    );
}
