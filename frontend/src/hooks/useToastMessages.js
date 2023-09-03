import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useToastMessages = () => {
  const [message, setMessage] = useState("");

  let isMounted = true;

  useEffect(() => {
    if (message !== "") {
      toast(message.text, { type: message.type });
    }

    return () => {
      isMounted = false;
    };
  }, [message]);

  const showToast = (text, type) => {
    setMessage({ text, type });
  };

  return showToast;
};

export default useToastMessages;
