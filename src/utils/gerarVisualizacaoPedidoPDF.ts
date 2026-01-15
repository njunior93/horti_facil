import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { iPedido } from '../features/pedidos/type/iPedido';

export const gerarVisualizacaoPedidoPDF = (pedido: iPedido) => {

  const { id: pedidoId, fornecedor, data_criacao, status, data_efetivacao ,data_cancelamento, itens } = pedido;
  const nomeFornecedor = fornecedor ? fornecedor.nome : 'N/A';

  const doc = new jsPDF();
  const timeZone = {timeZone:'America/Sao_Paulo'};
  // const dtPedido = toZonedTime(new Date(dataPedido),timeZone);

  doc.setFontSize(20);
  doc.setFont("helvetica","bold");
  doc.text(`Pedido Nº ${pedidoId}`, 105, 15, { align: 'center' });

  doc.setLineWidth(0.5);
  doc.line(10, 22, 200, 22); 

  doc.setFillColor(240,240,240);
  doc.rect(10, 25, 190, data_cancelamento ? 50 : 45 , 'F');

  doc.setFontSize(12)
  doc.setFont("helvetica","normal");

  const statusFormatado = status === 'pendente' ? 'Pendente' :  status === 'entregue' ? 'Entregue' : status === 'cancelado' ? "Cancelado" : status === 'entregue_parcialmente' ? "Entregue Parcialmente" : "";

  doc.text(`Pedido Nº: ${pedidoId}`, 14, 35);
  doc.text(`Status: ${statusFormatado}`, 14, 42);
  doc.text(`Fornecedor: ${nomeFornecedor}`, 14, 49);
  const dtPedido = new Date(data_criacao + 'Z');
  doc.text(`Data de Criação: ${dtPedido.toLocaleDateString('pt-BR', timeZone)} - ${dtPedido.toLocaleTimeString('pt-BR', timeZone)}`, 14, 56);
  if(data_efetivacao){
    const dtEfetivacao = new Date(data_efetivacao + 'Z');
    doc.text(`Data de Efetivação: ${dtEfetivacao.toLocaleDateString('pt-BR', timeZone)} - ${dtEfetivacao.toLocaleTimeString('pt-BR', timeZone)}`, 14, 63);
  }
  if(data_cancelamento){
    const dtCancelamento = new Date(data_cancelamento + 'Z');
    doc.text(`Data de cancelamento: ${dtCancelamento.toLocaleDateString('pt-BR', timeZone)} - ${dtCancelamento.toLocaleTimeString('pt-BR', timeZone)}`, 14, 70);
  }

  (doc as any).autoTable({
    startY: data_cancelamento ? 80 : 75,
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

