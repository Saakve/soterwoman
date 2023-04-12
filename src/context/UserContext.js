import { createContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const UserContext = createContext(null)

export function UserContextProvider({children}) {
    const [userData, setUserData] = useState({})

    const getUserData = async () => {
        const { id, email } = (await supabase.auth.getSession()).data.session.user
        const { data: profile, errorProfile } = await supabase.from('profile').select().eq("id", id)

        const userData = {
            id,
            email,
            phone: profile[0].phone,
            name: profile[0].name,
            debt: profile[0].debt,
            rating: profile[0].rating,
            usageTime: profile[0].usageTime,
            idImage: profile[0].idImage
        }
        
        if(errorProfile) console.log(errorProfile)

        setUserData(userData)
    }

    useEffect(() => {
        getUserData()
    },[])

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    )

} 

export default UserContext