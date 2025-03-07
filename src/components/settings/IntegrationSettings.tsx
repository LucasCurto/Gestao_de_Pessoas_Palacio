import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link2, Database, FileText, ExternalLink } from "lucide-react";

const IntegrationSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Integrações</h2>
          <p className="text-gray-500">
            Conecte o sistema a outras plataformas e serviços
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accounting System Integration */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Sistema de Contabilidade
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                Não Conectado
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Integre com seu sistema de contabilidade para sincronizar dados
              financeiros e facilitar o fechamento contábil.
            </p>
            <Button className="w-full">
              <Link2 className="mr-2 h-4 w-4" />
              Conectar Sistema de Contabilidade
            </Button>
          </CardContent>
        </Card>

        {/* ERP Integration */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Sistema ERP
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                Não Conectado
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Conecte ao seu ERP para manter dados de funcionários e
              departamentos sincronizados automaticamente.
            </p>
            <Button className="w-full">
              <Link2 className="mr-2 h-4 w-4" />
              Conectar Sistema ERP
            </Button>
          </CardContent>
        </Card>

        {/* Time Tracking Integration */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Sistema de Ponto
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                Não Conectado
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Importe dados de horas trabalhadas e ausências diretamente do seu
              sistema de ponto.
            </p>
            <Button className="w-full">
              <Link2 className="mr-2 h-4 w-4" />
              Conectar Sistema de Ponto
            </Button>
          </CardContent>
        </Card>

        {/* Banking Integration */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Sistema Bancário
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                Não Conectado
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Conecte ao seu banco para automatizar pagamentos e reconciliações
              bancárias.
            </p>
            <Button className="w-full">
              <Link2 className="mr-2 h-4 w-4" />
              Conectar Sistema Bancário
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div>
        <h3 className="text-lg font-medium mb-4">API e Webhooks</h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Chaves de API</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Gere chaves de API para integrar com sistemas externos
                </p>
              </div>
              <Button>
                <ExternalLink className="mr-2 h-4 w-4" />
                Gerenciar Chaves de API
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Webhooks</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Configure webhooks para notificar sistemas externos sobre
                  eventos
                </p>
              </div>
              <Button>
                <ExternalLink className="mr-2 h-4 w-4" />
                Configurar Webhooks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationSettings;
