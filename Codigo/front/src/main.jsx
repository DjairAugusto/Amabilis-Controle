import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes"; 
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// 1. Importamos o nosso Gerente de Autenticação
import { AuthProvider } from "./contexts/AuthContext"; 

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      staleTime: 1000 * 60 * 5, 
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      {/* 2. Colocamos o AuthProvider por fora do RouterProvider */}
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);