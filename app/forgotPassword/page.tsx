"use client";

// PasswordForgot.js
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { forgotPassword } from '../actions/user-actions';
import { useRouter } from 'next/navigation';

export default function PasswordForgot() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            // Sende eine Anfrage zum Zurücksetzen des Passworts
            await forgotPassword(email);
            setEmail('')
            setMessage("E-Mail wurde versendet. Bitte überprüfe dein Spam-Postfach.");
        } catch (error) {
            setMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        }
    };

    return (
        <div className="container flex flex-col min-h-screen items-center justify-center">
            <h2 className='text-pink-600 text-2xl font-bold mb-8'>Passwort vergessen</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">E-Mail-Adresse</label>
                <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className='mt-4 bg-pink-600 text-white p-4 rounded-2xl font-semibold' type="submit">Link zum Zurücksetzen senden</button>
            </form>
            {message && <p>{message}</p>}

            <button onClick={() => router.replace("/")} className="text-pink-600 mt-4 text-xs">Zurück zum Login</button>
        </div>
    );
}
