import { useNavigate } from "@tanstack/react-router";
import { useUserControl } from "src/state/user";

const Account = () => {
  const navigate = useNavigate();
  const deleteToken = useUserControl((state) => state.kill_token);

  const handleDelete = () => {
    deleteToken();
    navigate({
      to: "/credentials",
    });
  };

  return (
    <>
      <button onClick={handleDelete} className="default">
        Remove Account
      </button>
    </>
  );
};

export default Account;
