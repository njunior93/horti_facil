import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { iProdutoMov } from '../type/iProdutoMov';
import { toZonedTime } from 'date-fns-tz';


export const gerarRelatorioPDF = (listaDeProdutosMov: iProdutoMov[], tipoMovSelecionado: string,movimentacaoSelecionada: string, dataInicio: Date, dataFim: Date) => {

    const doc = new jsPDF();
    const timeZone = 'America/Sao_Paulo';

    doc.text("Relatório de Movimentações de Estoque", 14, 20);
    doc.setFontSize(10);
    doc.text(`Tipo de Movimentação: ${tipoMovSelecionado}`, 14, 25);

    
    const dtInicio = toZonedTime(dataInicio, timeZone)
    const dtFim = toZonedTime(dataFim, timeZone);
    doc.setFontSize(10);
    doc.text(`Período: ${dtInicio.toLocaleDateString()} até  ${dtFim.toLocaleDateString()}`, 14, 30);


    const Colunas = () => {
      if (tipoMovSelecionado === 'Entrada') {
        return ['Produto', 'Estoque', 'Quantidade', 'Entrada', 'Periodo', 'Hora', 'Saldo'];
      } else if (tipoMovSelecionado === 'Saída') {
        return ['Produto', 'Estoque', 'Quantidade', 'Saída', 'Periodo','Hora','Saldo'];
      } else {
        return ['Produto', 'Estoque', 'Quantidade', 'Saída', 'Entrada','Periodo','Hora','Saldo'];
      }
    }  

    const Linhas = () => {
      return listaDeProdutosMov.map(produto => {
        if (tipoMovSelecionado === 'Entrada') {
          return [
            produto.produto.nome,
            produto.saldo_anterior,
            produto.qtdMov.toString(),
            produto.tipoEntrada || '',
            new Date(produto.dataMov).toLocaleDateString(),
            new Date(produto.dataMov).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            produto.saldo_atual
          ];
        } else if (tipoMovSelecionado === 'Saída') {
          return [
            produto.produto.nome,
            produto.saldo_anterior,
            produto.qtdMov.toString(),
            produto.tipoSaida || '',
            new Date(produto.dataMov).toLocaleDateString(),
            new Date(produto.dataMov).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            produto.saldo_atual
          ];
        } else {
          return [
            produto.produto.nome,
            produto.saldo_anterior,
            produto.qtdMov.toString(),
            produto.tipoSaida || '',
            produto.tipoEntrada || '',
            new Date(produto.dataMov).toLocaleDateString(),
             new Date(produto.dataMov).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            produto.saldo_atual
          ];
        }
      });
    }

    let colunas = Colunas();
    const linhas = Linhas();

    (doc as any).autoTable({
    head: [colunas],
    body: linhas,
    startY: 35, 
    styles: {
      fontSize: 10,
      cellPadding: 4,
      halign: 'center',
      valign: 'middle',
      lineColor: 200,         
      lineWidth: 0.3,         
    },
    headStyles: {
      fillColor: [252, 238, 213], 
      textColor: [0, 0, 0], 
      fontStyle: 'bold',
      lineWidth: 0.5,            
      lineColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245], 
    },
      margin: { top: 30 },
    });

    const finalY = (doc as any).lastAutoTable?.finalY ?? 40;

    doc.setFontSize(10);
    if (movimentacaoSelecionada === 'Entrada Manual' ) { 
      doc.text ('Total de Entradas (Manuais): ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'entrada' && produto.tipoEntrada === 'Manual').length, 14, finalY + 10);   
      doc.text ('Quantidade Total de Movimentações: ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'entrada' && produto.tipoEntrada === 'Manual').reduce((total, produto) => total + produto.qtdMov, 0), 132, finalY + 10);
    } else if (movimentacaoSelecionada === 'Entrada Pedido') {
      doc.text ('Total de Entradas (Pedido): ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'entrada' && produto.tipoEntrada === 'Pedido').length, 14, finalY + 10);
      doc.text ('Quantidade Total de Movimentações: ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'entrada' && produto.tipoEntrada === 'Pedido').reduce((total, produto) => total + produto.qtdMov, 0), 132, finalY + 10);
   
    }

    if (movimentacaoSelecionada === 'Saída Manual - AVARIA') {
      doc.text ('Total de Saídas (Avaria): ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'saida' && produto.tipoSaida === 'Avaria').length, 14, finalY + 10);
      doc.text ('Quantidade Total de Movimentações: ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'saida' && produto.tipoSaida === 'Avaria').reduce((total, produto) => total + produto.qtdMov, 0), 132, finalY + 10);

    } else if (movimentacaoSelecionada === 'Saída Manual - VENDA') {
      doc.text ('Total de Saídas (Venda): ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'saida' && produto.tipoSaida === 'Venda').length, 14, finalY + 10);
      doc.text ('Quantidade Total de Movimentações: ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'saida' && produto.tipoSaida === 'Venda').reduce((total, produto) => total + produto.qtdMov, 0), 132, finalY + 10);

    }

    if (movimentacaoSelecionada === 'Todas as movimentações') {
      doc.text ('Total de Movimentações: ' + listaDeProdutosMov.length, 14, finalY + 10);
      doc.text ('Total de Entradas (Manuais): ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'entrada' && produto.tipoEntrada === 'Manual').length, 14, finalY + 15);   
      doc.text ('Total de Entradas (Pedido): ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'entrada' && produto.tipoEntrada === 'Pedido').length, 14, finalY + 20);
      doc.text ('Total de Saídas (Avaria): ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'saida' && produto.tipoSaida === 'Avaria').length, 14, finalY + 25);
      doc.text ('Total de Saídas (Venda): ' + listaDeProdutosMov.filter(produto => produto.tipoMov === 'saida' && produto.tipoSaida === 'Venda').length, 14, finalY + 30);
      doc.text ('Quantidade Total de Movimentações: ' + listaDeProdutosMov.reduce((total, produto) => total + produto.qtdMov, 0), 132, finalY + 35);
    }
    
      
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');


    }
    
    

  


    

