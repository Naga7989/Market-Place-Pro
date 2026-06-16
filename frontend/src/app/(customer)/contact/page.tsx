'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactData) => {
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Your message has been sent successfully! We will contact you soon.');
    reset();
  };

  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Hero */}
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-6 mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
            Get in Touch with Our Team
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about orders, selling, or hiring? Drop us a message, and our customer experience team will get back to you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Information (5/12) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="card-premium">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> Support Channels
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Email Address</h4>
                    <a href="mailto:support@marketplacepro.in" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      support@marketplacepro.in
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Phone Support</h4>
                    <a href="tel:1800123456" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      1800-123-456 (Toll Free)
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Headquarters</h4>
                    <span className="text-sm text-muted-foreground leading-relaxed block">
                      MarketPlace Pro Tech Pvt Ltd,<br />
                      HSR Layout, Sector 6, Bengaluru,<br />
                      Karnataka, 560102
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7/12) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-premium"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Your Name</label>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="John Doe"
                      className="input-premium"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">Email Address</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="john@example.com"
                      className="input-premium"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Subject</label>
                  <input
                    {...register('subject')}
                    type="text"
                    placeholder="Inquiry about order delivery..."
                    className="input-premium"
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Message</label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    placeholder="Provide details about your query here..."
                    className="input-premium resize-none"
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20"
                >
                  <Send className="w-4 h-4" /> {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
