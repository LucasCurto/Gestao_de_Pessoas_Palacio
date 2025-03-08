import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileImportTool from "./FileImportTool";

const IntegrationsList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Importação de Dados</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importar Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <FileImportTool />
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsList;
