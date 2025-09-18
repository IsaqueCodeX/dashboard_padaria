import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Upload, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Calendar,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { useAppStore } from '@/store';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FileUploadProps {
  accept: string;
  onFileSelect: (file: File) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FileUpload({ accept, onFileSelect, icon, title, description }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          Selecionar Arquivo
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default function Reports() {
  const { products, suppliers, expenses } = useAppStore();
  const [selectedFiles, setSelectedFiles] = useState<{excel?: File, pdf?: File}>({});

  const handleFileSelect = (type: 'excel' | 'pdf') => (file: File) => {
    setSelectedFiles(prev => ({ ...prev, [type]: file }));
    // Here you would typically process the file
    console.log(`Selected ${type} file:`, file.name);
  };

  const handleExportReport = (type: 'sales' | 'products' | 'expenses', format: 'csv' | 'pdf') => {
    // Mock export functionality
    console.log(`Exporting ${type} report as ${format}`);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `relatorio-${type}-${timestamp}.${format}`;
    
    // Create a simple CSV for demonstration
    if (format === 'csv') {
      let csvContent = '';
      
      switch (type) {
        case 'products':
          csvContent = 'Nome,Categoria,Estoque,Preço\n';
          products.forEach(product => {
            csvContent += `${product.name},${product.category},${product.stock},R$ ${product.sellPrice.toFixed(2)}\n`;
          });
          break;
        case 'expenses':
          csvContent = 'Descrição,Valor,Data,Tipo\n';
          expenses.forEach(expense => {
            const formattedDate = new Date(expense.date).toLocaleDateString('pt-BR');
            csvContent += `${expense.description},R$ ${expense.amount.toFixed(2)},${formattedDate},${expense.type}\n`;
          });
          break;
        default:
          csvContent = 'Relatório,Data\nDados de exemplo,' + new Date().toLocaleDateString('pt-BR');
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const totalRevenue = products.reduce((sum, product) => sum + (product.sellPrice * (100 - product.stock)), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-2">Análises detalhadas e exportação de dados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Período
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="sales" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Vendas
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <PieChart className="w-4 h-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-2">
            <Upload className="w-4 h-4" />
            Importar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  Receita Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-success">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <Badge variant="secondary" className="mt-2">Este mês</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-warning" />
                  Despesas Totais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-destructive">
                  R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <Badge variant="secondary" className="mt-2">Este mês</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Lucro Líquido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <Badge variant="secondary" className="mt-2">Este mês</Badge>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Exportar Relatórios</CardTitle>
              <CardDescription>
                Baixe relatórios detalhados em diferentes formatos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-success">Relatório de Vendas</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport('sales', 'csv')}
                      className="gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport('sales', 'pdf')}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-secondary">Relatório de Produtos</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport('products', 'csv')}
                      className="gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport('products', 'pdf')}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-warning">Relatório de Despesas</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport('expenses', 'csv')}
                      className="gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport('expenses', 'pdf')}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-success" />
                  Importar Excel
                </CardTitle>
                <CardDescription>
                  Importe dados de produtos, vendas ou despesas de planilhas Excel (.xlsx, .xls)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept=".xlsx,.xls"
                  onFileSelect={handleFileSelect('excel')}
                  icon={<FileSpreadsheet className="w-8 h-8 text-success" />}
                  title="Selecionar Planilha"
                  description="Formatos suportados: .xlsx, .xls"
                />
                {selectedFiles.excel && (
                  <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-sm font-medium text-success">
                      Arquivo selecionado: {selectedFiles.excel.name}
                    </p>
                    <Button size="sm" className="mt-2">
                      Processar Arquivo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-6 h-6 text-destructive" />
                  Importar PDF
                </CardTitle>
                <CardDescription>
                  Extraia dados de relatórios e documentos em PDF para análise automática
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept=".pdf"
                  onFileSelect={handleFileSelect('pdf')}
                  icon={<FileText className="w-8 h-8 text-destructive" />}
                  title="Selecionar PDF"
                  description="Formatos suportados: .pdf"
                />
                {selectedFiles.pdf && (
                  <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <p className="text-sm font-medium text-destructive">
                      Arquivo selecionado: {selectedFiles.pdf.name}
                    </p>
                    <Button size="sm" className="mt-2" variant="destructive">
                      Extrair Dados
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Instruções de Importação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-success mb-2">Excel - Formato de Produtos</h4>
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    <p>Colunas obrigatórias:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Nome</li>
                      <li>Categoria</li>
                      <li>Preço de Custo</li>
                      <li>Preço de Venda</li>
                      <li>Estoque</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-destructive mb-2">PDF - Tipos Suportados</h4>
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    <p>Documentos aceitos:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Relatórios financeiros</li>
                      <li>Notas fiscais</li>
                      <li>Extratos bancários</li>
                      <li>Planilhas convertidas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Relatório de Vendas</CardTitle>
              <CardDescription>
                Análise detalhada do desempenho de vendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidade em desenvolvimento. Em breve você poderá visualizar gráficos detalhados de vendas por período.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Desempenho de Produtos</CardTitle>
              <CardDescription>
                Análise de produtos mais vendidos e rentabilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidade em desenvolvimento. Em breve você poderá visualizar o desempenho detalhado de cada produto.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}