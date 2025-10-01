//profile/page.tsx

import Profile from "@/components/Profile"
import RequireAuth from "@/components/RequireAuth"




const profilePage = () => {
  return (
    <RequireAuth>
        <Profile/>
    </RequireAuth>
  )
}
export default profilePage