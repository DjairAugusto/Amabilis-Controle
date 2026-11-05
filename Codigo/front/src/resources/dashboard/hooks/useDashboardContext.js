import { useContext } from "react";
import { DashboardContext } from "../context/DashboardContext";

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if(!context) throw new Error('useDashboardContext deve estar dentro de DashboardProvider');
    return context;
}