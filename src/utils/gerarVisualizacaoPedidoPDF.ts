import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toZonedTime } from 'date-fns-tz';
import type { iPedido } from '../type/iPedido';

export const gerarVisualizacaoPedidoPDF = (pedido: iPedido) => {

  const { id: pedidoId, fornecedor, data_criacao: dataPedido, status, data_efetivacao, itens } = pedido;
  const nomeFornecedor = fornecedor ? fornecedor.nome : 'N/A';

  const doc = new jsPDF();
  const timeZone = 'America/Sao_Paulo';
  const dtPedido = toZonedTime(new Date(dataPedido),timeZone);

  doc.setFontSize(20);
  doc.setFont("helvetica","bold");
  doc.text(`Visualização do Pedido Nº ${pedidoId}`, 105, 15, { align: 'center' });

  doc.setLineWidth(0.5);
  doc.line(10, 22, 200, 22); 

  doc.setFillColor(240,240,240);
  doc.rect(10, 25, 190, data_efetivacao ? 45 : 40 , 'F');

  doc.setFontSize(12)
  doc.setFont("helvetica","normal");

  const statusFormatado = status === 'pendente' ? 'Pendente' :  status === 'entregue' ? 'Entregue' : status === 'cancelado' ? "Cancelado" : status === 'entregue_parcialmente' ? "Entregue Parcialmente" : "";

  doc.text(`Pedido Nº: ${pedidoId}`, 14, 35);
  doc.text(`Status: ${statusFormatado}`, 14, 42);
  doc.text(`Fornecedor: ${nomeFornecedor}`, 14, 49);
  doc.text(`Data do Pedido: ${dtPedido.toLocaleDateString()} - ${dtPedido.toLocaleTimeString()}`, 14, 56);
  if(data_efetivacao){
    const dataEfetivacao = toZonedTime(new Date(data_efetivacao), timeZone);
    doc.text(`Data de Efetivação: ${dataEfetivacao.toLocaleDateString()} - ${dataEfetivacao.toLocaleTimeString()}`, 14, 63);
  }

  (doc as any).autoTable({
    startY: data_efetivacao ? 75 : 70,
    head: [['Produto', 'Unidade', 'Estoque Minimo', 'Qtd Solicitada', 'Qtd Recebida' ]],
    body: itens.map(p =>[
      p.produto.nome,
      p.produto.uniMedida,
      p.produto.estoqueMinimo,
      p.qtd_solicitado,
      p.qtd_recebido
    ])
  })

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');

}

