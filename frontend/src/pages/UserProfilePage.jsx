import ProfileLayout from "../layouts/ProfileLayout";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
const UserProfilePage = () => {
  const user = useSelector(selectUser);

  return <ProfileLayout user={user} />;
};

export default UserProfilePage;
