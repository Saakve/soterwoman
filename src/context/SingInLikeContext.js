import { createContext, useEffect, useState } from "react";

const SignInLikeContext = createContext(null)

export function SignInLikeContextProvider({children}) {
    const [signInLike, setSignInLike] = useState(null)

    return (
        <SignInLikeContext.Provider value={{signInLike, setSignInLike}}>
            {children}
        </SignInLikeContext.Provider>
    )
} 

export default SignInLikeContext