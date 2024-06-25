import { signOut } from "next-auth/react";

export default function UserInfo(user: any) {
    return(
        <div className="p-4 shadow-md">
            User Dashboard
            <p>ID: {user._id}</p>
            <p>User: {user?.name}</p>
            <p>Email: {user?.email}</p>

            <button onClick={() => signOut()}>Sign out</button>

            {/* <button onClick={() => createSubject()}>Add Mathematik</button> */}
        </div>
    )
}