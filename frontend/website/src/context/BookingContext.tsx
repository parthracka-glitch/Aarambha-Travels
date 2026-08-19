import React, { createContext, useState } from 'react';

interface BookingContextType {
  activeStep: number;
  setActiveStep: (step: number) => void;
  bookingData: any;
  setBookingData: (data: any) => void;
}

export const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [activeStep, setActiveStep] = useState(1);
  const [bookingData, setBookingData] = useState({});

  return (
    <BookingContext.Provider value={{ activeStep, setActiveStep, bookingData, setBookingData }}>
      {children}
    </BookingContext.Provider>
  );
}
