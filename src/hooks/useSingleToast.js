import { useCallback } from 'react';
import toast from 'react-hot-toast';

const useSingleToast = () => {
  const dismissAll = useCallback(() => {
    toast.dismiss();//remove all existing toast
  },[])

  const successToast = useCallback((message,options) => {
    dismissAll();
    toast.success(message,{id:"single-toast",...options})
  },[dismissAll])

  const errorToast = useCallback((message,options) => {
    dismissAll();
    toast.error(message,{id:'single-toast',...options});
  },[dismissAll])

  const loadingToast = useCallback((message="Loading ...",options) => {
    dismissAll();
    toast.loading(message,{id:'single-toast',...options})
  },[dismissAll])

  return {successToast,errorToast,loadingToast,dismissAll};
}

export default useSingleToast