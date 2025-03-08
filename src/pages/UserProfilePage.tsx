import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import UserProfile from "../components/user/UserProfile";

const UserProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className={`${isSidebarOpen ? "block" : "hidden"} md:block`} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title="Perfil do Usuário" onMenuToggle={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <UserProfile
              user={{
                name: "Admin Usuário",
                email: "admin@empresa.pt",
                phone: "+351 912 345 678",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
                role: "Administrador",
                department: "Tecnologia",
              }}
              onSave={(userData) => {
                console.log("Saving user data:", userData);
                // Aqui você implementaria a lógica para salvar os dados do usuário
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
