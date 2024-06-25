export const SubjectOverview = (user: any) => {
    return (
        <div>
            <h1>Subject Overview</h1>
            <ul>
                {user.subjects.map((subject: string) => (
                    <li>{subject}</li>
                ))}
            </ul>
        </div>
    )
}