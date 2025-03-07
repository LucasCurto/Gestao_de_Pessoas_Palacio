import React from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import FinancialOverview from "./dashboard/FinancialOverview";
import PaymentAlerts from "./dashboard/PaymentAlerts";
import HRMetrics from "./dashboard/HRMetrics";
import QuickActions from "./dashboard/QuickActions";

const Home = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className="hidden md:block" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title="Dashboard" />

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Financial Overview */}
            <FinancialOverview />

            {/* Alerts and Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PaymentAlerts />
              <HRMetrics />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
