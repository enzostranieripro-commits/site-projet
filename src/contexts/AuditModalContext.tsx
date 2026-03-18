import { createContext, useContext, useState, ReactNode } from "react";

interface AuditModalContextType {
  isOpen: boolean;
  productType: string | null;
  open: (product?: string | null) => void;
  close: () => void;
}

const AuditModalContext = createContext<AuditModalContextType | undefined>(undefined);

export const AuditModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [productType, setProductType] = useState<string | null>(null);

  const open = (product?: string | null) => {
    setProductType(product ?? null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setProductType(null);
  };

  return (
    <AuditModalContext.Provider value={{ isOpen, productType, open, close }}>
      {children}
    </AuditModalContext.Provider>
  );
};

export const useAuditModal = () => {
  const ctx = useContext(AuditModalContext);
  if (!ctx) throw new Error("useAuditModal must be used within AuditModalProvider");
  return ctx;
};
