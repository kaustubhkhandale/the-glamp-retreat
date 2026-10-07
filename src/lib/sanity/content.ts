export function telephone(phone: string) {
  return `tel:${phone.replace(/[\s()-]/g, "")}`;
}
export function whatsappUrl(phone?: string | null) {
  return phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : null;
}
