import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-fade-in">
      <div className={`bg-white rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100`}>
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 font-syne leading-tight">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200/60 rounded-full transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
