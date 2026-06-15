# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## Regras Gerais

- **Sempre utilize o Context7 (`use context7`) ao gerar código que envolva bibliotecas ou frameworks externos** (ex: MUI, React, Supabase, Axios, React Router, date-fns, jsPDF, Tailwind CSS, Vite, etc.). Isso garante que a documentação utilizada seja a mais atualizada.

## Comandos

```bash
# Servidor de desenvolvimento
npm run dev

# Build de produção (verificação TypeScript + build Vite)
npm run build

# Lint
npm run lint

# Preview do build de produção
npm run preview
```

Nenhum framework de testes está configurado neste projeto.

## Deploy (Vercel)

O projeto possui um arquivo [`vercel.json`](vercel.json) na raiz com o seguinte conteúdo:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Esse rewrite é necessário para que o React Router funcione corretamente na Vercel: qualquer rota não encontrada como arquivo estático (ex: `/pedidos-compra`, `/gerenciar-estoque`) é redirecionada para o `index.html`, evitando erro 404 ao recarregar (F5) qualquer rota da SPA.

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=<url_do_projeto_supabase>
VITE_SUPABASE_ANON_KEY=<chave_anon_supabase>
VITE_API_URL=http://localhost:3000   # ou https://horti-facil-backend.onrender.com para produção
```

A aplicação requer uma API backend em execução no endereço `VITE_API_URL`. O backend é um serviço separado (não está neste repositório).

## Visão Geral da Arquitetura

**HortiFácil** é uma SPA em React 19 + TypeScript para gestão de estoque de hortifrúti. Utiliza:
- **Vite** como ferramenta de build
- **MUI v7** para componentes de UI
- **Tailwind CSS v4** para estilização utilitária
- **Supabase** para autenticação (Google OAuth) e como cliente do banco de dados
- **Axios** para chamadas REST à API backend
- **jsPDF + jspdf-autotable** para geração de relatórios em PDF
- **React Router DOM v7** para roteamento
- **date-fns / date-fns-tz** para manipulação de datas no fuso horário de São Paulo

### Estrutura de Rotas

Todas as rotas autenticadas são envolvidas pelo `<MainLayout>`, que provê o `<StatusServidorProvider>`:

```
/                  → App (PaginaLogin) — pública, envolvida em StatusServidorProvider
/pagina-inicial    → PaginalInicial (dashboard) — envolvida em EstoqueProvider
/criar-estoque     → CriarEstoque — envolvida em EstoqueProvider
/gerenciar-estoque → GerenciarEstoque — envolvida em EstoqueProvider
/pedidos-compra    → PedidosCompra — envolvida em EstoqueProvider
```

### Hierarquia de Providers/Contextos

Do mais externo para o mais interno em [main.tsx](src/main.tsx):

1. **`AuthProvider`** (`src/shared/context/AuthContext.tsx`) — Envolve toda a aplicação. Expõe `session` (Supabase `Session | null`) e `loading`. Bloqueia a renderização dos filhos até que a verificação de sessão seja concluída. Use `useAuth()` para acessar.

2. **`AppProvider`** (`src/shared/context/context.tsx`) — Store de estado global. Armazena todo o estado compartilhado: listas de produtos, dados do estoque, listas de movimentações, estado do modal, lista de fornecedores, pedidos de compra, flags de conectividade, etc. Use `useContext(AppContext)` para acessar. Também exporta dados estáticos: array `unidadesMedida` e array `movimentacoesEstoque`.

3. **`StatusServidorProvider`** (`src/providers/StatusServidorProvider.tsx`) — Faz polling em `VITE_API_URL/health` a cada 15 s (com backoff exponencial: 1/2/5/10 s em caso de falha). Atualiza `servidorOnline` e `conexaoInternet` no `AppContext`. Renderiza o overlay `<StatusServidor>` (badge fixo no canto inferior direito). Use `useInternet()` para acessar.

4. **`EstoqueProvider`** (`src/features/estoque/provider/EstoqueProvider.tsx`) — Verifica se existe um estoque para o usuário logado chamando `VITE_API_URL/estoque/verificar-estoque`. Expõe `existeEstoque`, `loading` e `verificarEstoque`. Use `useEstoque()` para acessar.

### Módulos de Funcionalidades

**`src/features/estoque/`** — Gestão de estoque
- Página `CriarEstoque`: formulário para criar um novo estoque com produtos e limites mínimo/máximo
- Página `GerenciarEstoque`: visualizar/filtrar produtos, entrada/saída manual via `ModalMov`
- Componentes: `FormularioEstoque`, `ListaProdutosEstoque`, `InformacoesEstoque`, `VisualizarEstoque`, `BotoesFinalizarCancelarEstoque`

**`src/features/pedidos/`** — Pedidos de compra
- Página `PedidosCompra`: CRUD completo de pedidos usando MUI DataGrid com filtros (status, intervalos de datas, fornecedor), efetivação, cancelamento e exclusão de pedidos
- Componente `ListaFornecedor`: lista de fornecedores dentro do modal

### Modal Compartilhado: `ModalMov`

`src/shared/modals/modalMov.tsx` é um modal único e multiuso controlado por dois valores do `AppContext`:
- `handleModal: boolean` — se o modal está aberto
- `tipoModal: string` — qual visão exibir: `'Entrada'`, `'Saída'`, `'MovimentacaoEstoque'`, `'CriarPedidoCompra'`, `'CadastroFornecedor'`

### Padrão de Comunicação com a API

Todas as chamadas à API seguem este padrão:
1. Obter o token de sessão do Supabase: `supabase.auth.getSession()` → `session.access_token`
2. Enviar como header `Authorization: Bearer <token>` via Axios
3. Verificar conectividade (`conexaoInternet`, `servidorOnline`) antes de realizar chamadas
4. Exibir feedback com o helper `alertaMensagem(mensagem, severidade, icone)` de `src/shared/components/alertaMensagem.tsx`

### Principais Endpoints da API Backend (relativos a `VITE_API_URL`)

- `GET /health` — verificação de saúde do servidor
- `GET /estoque/verificar-estoque` — verifica se o usuário possui um estoque
- `GET /estoque/id-estoque` — obtém o ID do estoque do usuário
- `GET /estoque/lista-produtos` — obtém a lista de produtos do estoque
- `PATCH /estoque/atualizar-produto/:id` — entrada/saída manual de estoque
- `GET /fornecedor/listar-fornecedores` — lista fornecedores
- `POST /fornecedor/criar-fornecedor` — cria fornecedor
- `GET /pedido/listar-pedidos` — lista pedidos de compra
- `POST /pedido/criar-pedido` — cria pedido de compra
- `GET /pedido/localizar-pedido/:id` — obtém um pedido específico
- `PATCH /pedido/efetivar-pedido/:id` — marca pedido como entregue
- `PATCH /pedido/cancelar-pedido/:id` — cancela pedido (limite de 24 h após efetivação)
- `DELETE /pedido/excluir-pedido` — exclui pedidos cancelados

### Dados Estáticos de Produtos

O catálogo de produtos (frutas e hortaliças) é fixo no `AppContext` com 16 itens pré-definidos (8 frutas, 8 hortaliças). As opções de tipo de movimentação (`movimentacoesEstoque`) também são definidas lá.

### Relatórios em PDF

`src/utils/` contém três geradores de PDF usando jsPDF + autotable:
- `gerarRelatorioPDF.ts` — relatório de histórico de movimentações do estoque
- `gerarVisualizacaoPedidoPDF.ts` — visualização de um único pedido de compra
- `gerarFiltrosListaPedidosPDF.ts` — relatório da lista de pedidos filtrados

Todas as datas são tratadas no fuso horário `America/Sao_Paulo` usando `date-fns-tz`.

### Convenções de Responsividade (Tailwind CSS)

Todas as páginas devem ser responsivas usando **Tailwind CSS v4**. Padrões adotados:

- **Container principal:** `flex justify-center items-start min-h-screen w-full bg-gray-100 py-4 sm:py-6 px-2 sm:px-4`
- **Card interno:** `w-full max-w-7xl mx-auto bg-white p-3 sm:p-6 rounded-xl shadow`
- **Barra de ações (botões):** `flex flex-col sm:flex-row flex-wrap gap-2 border-b-4 border-[#FDEFD6] p-2 pb-3 mb-2`
  - Grupo principal de ações: `flex flex-wrap gap-2 flex-1`
  - Grupo de utilitários (direita): `flex flex-wrap gap-2`
  - **Não usar `ButtonGroup` do MUI** na toolbar — preferir `<div>` com flex-wrap para que os botões quebrem linha no mobile
- **Seção de filtros:** `p-3 sm:p-6 bg-white rounded-xl shadow-md w-full`
  - Grid de filtros: `grid grid-cols-1 lg:grid-cols-2 gap-6`
  - DatePickers lado a lado: `grid grid-cols-1 sm:grid-cols-2 gap-3`
- **DataGrid (MUI):** envolver em `<div className='overflow-x-auto'>` com `minWidth: 600` no `Box` para scroll horizontal no mobile
- **Modal de detalhes (posição fixa):** usar `width: { xs: '95vw', sm: '600px', md: '650px' }` + `maxHeight: '90vh'` + `overflowY: 'auto'` no `sx` do MUI `Box`
