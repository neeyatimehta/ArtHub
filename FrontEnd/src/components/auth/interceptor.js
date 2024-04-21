import axios from "axios";
import { redirect } from "react-router-dom";
import Logout from "../../pages/Logout";

axios.interceptors.request.use(
    (config) => {
      // Do something before request is sent
      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );
 axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log("@error", error)
            // Use router.push() to navigate to the login screen
            // return <Logout />
            // redirect('/login')
            // router.push('/login'); // Adjust the route as needed
            // Throw an exception to stop further execution
            return Promise.reject('Unauthorized');
        }
        // Handle other errors here
        return Promise.reject(error);
    }
);