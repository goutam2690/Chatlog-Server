import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else {
          const errorMessage = error?.data?.message || "Something went wrong";
          console.log("Error message:", errorMessage);
          if (typeof errorMessage === "string") {
            toast.error(errorMessage);
          } else {
            toast.error("Error message is not a string:", errorMessage);
          }
        }
      }
    });
  }, [errors]);
};

const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutate] = mutationHook();

  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "updating data....");

    try {
      const res = await mutate(...args);
      if (res?.data) {
        toast.success(res?.data?.message || "Updated Data successfully", {
          id: toastId,
        });
        setData(res?.data);
      } else {
        console.log(res.error);
        toast.error(res?.error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};

const useSocketHandler = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () =>
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
  }, [socket, handlers]);
};

export { useAsyncMutation, useErrors, useSocketHandler };

