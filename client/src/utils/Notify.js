import { toast } from 'react-toastify';
export const notify = (message) => {
  toast.info(message, {
    position: 'bottom-right',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'dark'
  });
};

export const errorToast = (message) => {
  toast.error(message, {
    position: 'bottom-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: 'dark'
  });
};
