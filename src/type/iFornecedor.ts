export interface iFornecedor{
  id: string;
  nome: string;
  telefone?: string;
  whatsApp?: string;
  email?: string;
  noti_email?: boolean;
  noti_whatsapp?: boolean;
}