import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type {iPedido} from '../features/pedidos/type/iPedido';
import type { iFiltrosPedido } from '../features/pedidos/type/iFiltrosPedido';

export const gerarFiltrosListaPedidosPDF = (listaPedidos : iPedido[], filtrosUtilizados: iFiltrosPedido) =>{
  const doc = new jsPDF();
  const timeZone = {timeZone:'America/Sao_Paulo'};

  const statusSelecionados = [];

  if(filtrosUtilizados.status.pendente) statusSelecionados.push('Pendente');
  if(filtrosUtilizados.status.entregueParcial) statusSelecionados.push('Entregue Parcialamente');
  if(filtrosUtilizados.status.entregue) statusSelecionados.push('Entregue');
  if(filtrosUtilizados.status.cancelado) statusSelecionados.push('Cancelado');

  
  let y = 20;

  doc.setFontSize(14);
  doc.setFont("helvetica","bold");

  doc.text('Relatório de Pedidos', 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.text('Filtros aplicados:', 14, y);
  y += 6

  doc.setLineWidth(0.5);
  doc.line(10, 22, 200, 22); 

  doc.setFillColor(240,240,240);
  doc.rect(10, 25, 190,  45 , 'F');

  doc.setFontSize(10);
  doc.setFont("helvetica");

  doc.text(`Status: ${statusSelecionados.length ? statusSelecionados.join(',') : 'Nenhum'}`,14, y);
  y += 5;

  doc.text(`Fornecedor: ${filtrosUtilizados.fornecedor && filtrosUtilizados.fornecedor !== 'Todos' ? filtrosUtilizados.fornecedor : 'Todos'}`,14, y)
  y += 5;

  if(filtrosUtilizados.datas.criacao.inicio && filtrosUtilizados.datas.criacao.fim){
    const dtCriacaoInicio = new Date (filtrosUtilizados.datas.criacao.inicio)
    const dtCriacaoFim = new Date (filtrosUtilizados.datas.criacao.fim)
    doc.text(`Data de Criação: ${dtCriacaoInicio.toLocaleDateString('pt-BR')} até ${dtCriacaoFim.toLocaleDateString('pt-BR')}`, 14,y)
  }else{
    doc.text('Data de Criação: Todos', 14,y)
  }

   y += 5;

  if(filtrosUtilizados.datas.efetivacao.inicio && filtrosUtilizados.datas.efetivacao.fim){
    const dtEfetivacaoInicio = new Date (filtrosUtilizados.datas.efetivacao.inicio)
    const dtEfetivacaoFim = new Date (filtrosUtilizados.datas.efetivacao.fim)
    doc.text(`Data de Efetivação ${dtEfetivacaoInicio.toLocaleDateString('pt-BR')} até ${dtEfetivacaoFim.toLocaleDateString('pt-BR')}`, 14,y)
  }else{
    doc.text('Data de Efetivação: Todos', 14,y)
  }

  y += 5;

  if(filtrosUtilizados.datas.cancelamento.inicio && filtrosUtilizados.datas.cancelamento.fim){
    const dtCancelamentoInicio = new Date (filtrosUtilizados.datas.cancelamento.inicio)
    const dtCancelamentoFim = new Date (filtrosUtilizados.datas.cancelamento.fim)
    doc.text(`Data de Cancelamento: ${dtCancelamentoInicio.toLocaleDateString('pt-BR')} até ${dtCancelamentoFim.toLocaleDateString('pt-BR')}`, 14,y)
  }else{
    doc.text('Data de Cancelamento: Todos', 14,y)
  }

    y+= 25


  listaPedidos.forEach((pedido) =>{
    doc.text(`Pedido: ${pedido.id} - Fornecedor: ${pedido.fornecedor?.nome ?? ''} - Status: ${pedido.status}`, 14, y);
    y+=5
    doc.text(`Data de Criação ${new Date(pedido.data_criacao).toLocaleDateString('pt-BR')} - ${new Date(pedido.data_criacao).toLocaleTimeString('pt-BR')}`,14,y)
    y+=5
    if(pedido.data_efetivacao){
      doc.text(`Data de Efetivação: ${new Date(pedido.data_efetivacao).toLocaleDateString('pt-BR')} - ${new Date(pedido.data_efetivacao + 'Z').toLocaleTimeString('pt-BR', timeZone)}`,14,y)
      y+=5
    }
    if(pedido.data_cancelamento){
      doc.text(`Data de Cancelamento: ${new Date(pedido.data_cancelamento).toLocaleDateString('pt-BR')} - ${new Date(pedido.data_cancelamento + 'Z').toLocaleTimeString('pt-BR', timeZone)}`,14,y)
      y+=5
    }

    y += 2;

    (doc as any).autoTable({
      startY: y,
      head: [['Produto', 'Unidade', 'Estoque Minimo','Qtd Solicitada', 'Qtd Recebida']],
      body: (pedido.itens ?? []).map(p =>[
        p.produto.nome,
        p.produto.uniMedida,
        p.produto.estoqueMinimo,
        p.qtd_solicitado,
        p.qtd_recebido
      ])
    })

    y = (doc as any).lastAutoTable.finalY + 10;
  });

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
}