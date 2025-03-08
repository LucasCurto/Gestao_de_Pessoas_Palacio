import React from "react";
import PaymentMethodsOverview from "../dashboard/PaymentMethodsOverview";

const PaymentMethodsOverviewDemo = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard de Métodos de Pagamento e Tipos de Atividade
      </h1>
      <PaymentMethodsOverview />
    </div>
  );
};

export default PaymentMethodsOverviewDemo;
