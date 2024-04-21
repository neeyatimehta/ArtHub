import { jwtDecode } from "jwt-decode";


export const token = localStorage.getItem("token")!==null && localStorage.getItem("token")

export const decoded = token && jwtDecode(token);
