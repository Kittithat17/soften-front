import EditProfilePage from "@/components/editprofile"
import RequireAuth from "@/components/RequireAuth"


//profile/edit/page.tsx
const editPage = () => {
  return (

    <RequireAuth>
      <EditProfilePage />
    </RequireAuth>  
)
}
export default editPage