import { Phone, MessageCircle, Mail } from "lucide-react";

export default function MobileQuickActions() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(201,168,76,0.25)] bg-[rgba(12,12,12,0.96)] backdrop-blur md:hidden">
      <div className="container py-2">
        <div className="grid grid-cols-3 gap-2">
          <a
            href="tel:01480769129"
            className="flex items-center justify-center gap-2 rounded-md border border-[#C9A84C] bg-[#C9A84C] px-3 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#0C0C0C]"
          >
            <Phone size={14} />
            Call
          </a>
          <a
            href="https://wa.me/447767910713"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md border border-[#C9A84C] px-3 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#C9A84C]"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
          <a
            href="#contact"
            className="flex items-center justify-center gap-2 rounded-md border border-[rgba(201,168,76,0.3)] bg-[rgba(255,255,255,0.04)] px-3 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#F0EAD6]"
          >
            <Mail size={14} />
            Enquire
          </a>
        </div>
      </div>
    </div>
  );
}
