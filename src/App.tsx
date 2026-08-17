import React, { useRef, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ValueProps } from './components/ValueProps';
import { IdealFor } from './components/IdealFor';
import { WhyWait } from './components/WhyWait';
import { BookingForm } from './components/BookingForm';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SubmittedBooking } from './types';
import { getSavedRequests, saveBookingRequest } from './utils/formHelpers';

export default function App() {
  const [submittedRequests, setSubmittedRequests] = useState<SubmittedBooking[]>([]);
  const bookingFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSubmittedRequests(getSavedRequests());
  }, []);

  const handleScrollToForm = () => {
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFormSubmitted = (newBooking: SubmittedBooking) => {
    saveBookingRequest(newBooking);
    setSubmittedRequests((prev) => [newBooking, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Bar */}
      <Header onScrollToForm={handleScrollToForm} />

      {/* Main Landing Page Content */}
      <main>
        {/* 1. Hero Sales Section */}
        <Hero onScrollToForm={handleScrollToForm} />

        {/* 2. WE COVER YOUR STAFFING GAPS */}
        <ValueProps onScrollToForm={handleScrollToForm} />

        {/* 3. Our Locum Services Are Ideal For */}
        <IdealFor onScrollToForm={handleScrollToForm} />

        {/* 4. WHY WAIT UNTIL YOUR LAB IS SHORT-STAFFED? */}
        <WhyWait onScrollToForm={handleScrollToForm} />

        {/* 5. Booking Form */}
        <BookingForm
          ref={bookingFormRef}
          onFormSubmitted={handleFormSubmitted}
        />
      </main>

      {/* Footer */}
      <Footer onScrollToForm={handleScrollToForm} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}
