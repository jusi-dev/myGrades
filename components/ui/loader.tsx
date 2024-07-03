export const Loader = () => {
    return (
        <div className="flex items-center justify-center">
            <svg
                className="animate-spin h-20 w-20 text-pink-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8 8 0 0019.708 21.708L21 20.416A10 10 0 014 12h4v5.291z"
                ></path>
            </svg>
            <p className="text-white ml-2">Loading...</p>
        </div>
    )
}