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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-fade-in pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
      <div className={`bg-white rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[88vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-gray-100`}>
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 min-w-[36px] min-h-[36px] text-gray-400 hover:text-gray-900 hover:bg-gray-200/60 rounded-full transition-colors shrink-0 flex items-center justify-center cursor-pointer tap-highlight-transparent touch-manipulation active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1">{children}</div>
      </div>
    </div>
  );
}
