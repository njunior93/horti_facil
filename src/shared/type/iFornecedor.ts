export interface iFornecedor{
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  noti_email?: boolean;
  noti_whatsapp?: boolean;
  whatsApp?: string;
}