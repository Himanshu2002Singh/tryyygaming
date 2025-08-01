import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToast = () => {
  toast.success("Action completed successfully!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export default showToast;
