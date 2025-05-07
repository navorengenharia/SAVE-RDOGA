
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { ActivityRecord, Project, Plan } from '@/types';
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportPDFExportProps {
  record: ActivityRecord;
  project: Project;
  plan: Plan | null;
}

const ReportPDFExport: React.FC<ReportPDFExportProps> = ({ record, project, plan }) => {
  const generatePDF = async () => {
    try {
      // Obter o elemento que contém o relatório visual
      const reportElement = document.getElementById('report-content');
      if (!reportElement) {
        toast.error("Elemento do relatório não encontrado");
        return;
      }

      toast.loading("Gerando PDF, por favor aguarde...");
      
      // Convertendo o elemento HTML para canvas
      const canvas = await html2canvas(reportElement, {
        scale: 2, // Melhor qualidade
        useCORS: true, // Permite carregar imagens de outros domínios
        logging: false,
        allowTaint: true,
      });
      
      // Configurando o PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Adicionando a primeira página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Adicionando páginas adicionais se o conteúdo for maior que uma página
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Gerando o nome do arquivo baseado no projeto e data
      const date = new Date(record.date).toLocaleDateString('pt-BR').replace(/\//g, '-');
      const fileName = `relatorio_${project.name.replace(/\s+/g, '_')}_${date}.pdf`;
      
      // Salvando o PDF
      pdf.save(fileName);
      toast.dismiss();
      toast.success("Relatório exportado com sucesso!");
    } catch (error) {
      toast.dismiss();
      toast.error("Erro ao gerar PDF. Tente novamente.");
      console.error("Erro ao gerar PDF:", error);
    }
  };

  return (
    <Button onClick={generatePDF} className="flex items-center gap-2">
      <FileText className="h-4 w-4" />
      Exportar PDF
    </Button>
  );
};

export default ReportPDFExport;
