'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/helpers';
import { sendContactMessage } from '@/lib/contact';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  Gem,
  Sparkles,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export const ContactSection = () => {
  const [formData, setFormData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverMessage, setServerMessage] = useState('');

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'shop@shoaibjewellers.com',
      subtext: 'We reply within 24 hours',
      href: 'mailto:shop@shoaibjewellers.com',
    },
    {
      icon: Phone,
      title: 'Appointments',
      value: '0306 430 3939',
      subtext: 'Mon-Sat, 10am - 8pm PKT',
      href: 'tel:+923064303939',
    },
    {
      icon: Phone,
      title: 'Stock Pictures',
      value: '0306 279 8888',
      subtext: 'WhatsApp available',
      href: 'tel:+923062798888',
    },
    {
      icon: MapPin,
      title: 'Visit Our Store',
      value: 'Shop No. 2, Al-Fazal Market',
      subtext: 'Madina Road, Township, Lahore',
      href: 'https://maps.google.com/?q=Al-Fazal+Market+Madina+Road+Township+Lahore',
    },
    {
      icon: Clock,
      title: 'Store Hours',
      value: 'Mon - Sat: 10am - 8pm',
      subtext: 'Sunday: Closed',
      href: null,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (status !== 'idle') {
      setStatus('idle');
      setServerMessage('');
    }
  };

  const validateClient = () => {
    const next = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      next.name = 'Please enter your name (min 2 characters).';
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      next.email = 'Please enter a valid email address.';
    }

    if (
      formData.phone &&
      formData.phone.trim().length > 50
    ) {
      next.phone = 'Phone number is too long.';
    }

    if (
      !formData.message.trim() ||
      formData.message.trim().length < 10
    ) {
      next.message = 'Message must be at least 10 characters.';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateClient()) return;

    setStatus('loading');
    setServerMessage('');

    try {
      const res = await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        subject: formData.subject.trim() || null,
        message: formData.message.trim(),
      });

      setStatus('success');
      setServerMessage(
        res?.message || 'Message sent successfully.'
      );
      setFormData(INITIAL);
      setErrors({});
    } catch (err) {
      setStatus('error');
      setServerMessage(
        err?.response?.data?.message ||
          'Something went wrong. Please try again in a moment.'
      );
    }
  };

  const isLoading = status === 'loading';

  return (
    <section className="relative overflow-hidden bg-[#f6f5f2] py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mb-14 max-w-3xl text-center sm:mb-16"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-[#b9b4ad]" />

            <Sparkles
              className="h-3.5 w-3.5 text-[#866b42]"
              strokeWidth={1.25}
            />

            <div className="h-px w-8 bg-[#b9b4ad]" />
          </div>

          <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.32em] text-[#866b42]">
            We&apos;re Here to Help
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-none tracking-[-0.03em] text-[#171717] sm:text-5xl lg:text-6xl">
            Get in touch.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#66615b] sm:text-base">
            Have questions about our collections, custom orders,
            or need assistance? Our jewellery experts are here to
            help you find the perfect piece.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Left Column */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Contact Information */}
            <div className="border border-[#d9d5cf] bg-white">
              <div className="border-b border-[#d9d5cf] px-6 py-5">
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#866b42]">
                  Contact Information
                </p>

                <h3 className="mt-2 font-serif text-2xl tracking-[-0.02em] text-[#171717]">
                  We&apos;d love to hear from you.
                </h3>
              </div>

              <div className="divide-y divide-[#ebe9e5]">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;

                  const content = (
                    <div
                      className={cn(
                        'group flex items-start gap-4 px-6 py-5',
                        'transition-colors duration-300',
                        item.href &&
                          'cursor-pointer hover:bg-[#f6f5f2]'
                      )}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#d9d5cf] bg-[#f6f5f2] transition-colors duration-300 group-hover:border-[#b9b4ad] group-hover:bg-white">
                        <Icon
                          className="h-4 w-4 text-[#866b42]"
                          strokeWidth={1.35}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#866b42]">
                          {item.title}
                        </p>

                        <p className="mt-1.5 truncate text-sm font-medium text-[#171717]">
                          {item.value}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#88827b]">
                          {item.subtext}
                        </p>
                      </div>

                      {item.href && (
                        <ArrowRight
                          className="mt-1 h-4 w-4 shrink-0 text-[#b9b4ad] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                          strokeWidth={1.35}
                        />
                      )}
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={`${item.title}-${index}`}
                      href={item.href}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={`${item.title}-${index}`}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trust Panel */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.15,
                duration: 0.5,
              }}
              className="mt-5 border border-[#d9d5cf] bg-[#181716] px-6 py-7"
            >
              <div className="flex items-center gap-3">
                <Gem
                  className="h-4 w-4 text-[#b89a6a]"
                  strokeWidth={1.25}
                />

                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#b9b4ad]">
                  The Shoaib Difference
                </p>
              </div>

              <h4 className="mt-3 font-serif text-2xl tracking-[-0.02em] text-white">
                Crafted with care.
              </h4>

              <div className="mt-6 space-y-4">
                {[
                  {
                    icon: Shield,
                    text: 'Certified Authentic Jewellery',
                  },
                  {
                    icon: Sparkles,
                    text: 'Handcrafted with Precision',
                  },
                  {
                    icon: Clock,
                    text: 'Lifetime Warranty & Support',
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-[#b89a6a]"
                        strokeWidth={1.25}
                      />

                      <span className="text-xs leading-5 text-[#d0cbc4]">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="mt-7"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2,
                duration: 0.5,
              }}
            >
              <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.25em] text-[#88827b]">
                Follow Our Journey
              </p>

              <div className="flex gap-2.5">
                {[
                  {
                    icon: Instagram,
                    label: 'Instagram',
                  },
                  {
                    icon: Facebook,
                    label: 'Facebook',
                  },
                  {
                    icon: Twitter,
                    label: 'Twitter',
                  },
                ].map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href="#"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center border border-[#d9d5cf] bg-white text-[#77716a] transition-all duration-300 hover:border-[#b9b4ad] hover:bg-[#ebe9e5] hover:text-[#171717]"
                    >
                      <Icon
                        className="h-4 w-4"
                        strokeWidth={1.4}
                      />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="border border-[#d9d5cf] bg-white">
              {/* Form Header */}
              <div className="border-b border-[#d9d5cf] px-6 py-6 sm:px-8">
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#866b42]">
                  Send an Inquiry
                </p>

                <h3 className="mt-2 font-serif text-3xl tracking-[-0.025em] text-[#171717]">
                  Send us a message.
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#66615b]">
                  Fill out the form below and our team will get
                  back to you within 24 hours.
                </p>
              </div>

              <div className="px-6 py-7 sm:px-8 sm:py-8">
                {/* Status */}
                <AnimatePresence mode="wait">
                  {(status === 'success' ||
                    status === 'error') &&
                    serverMessage && (
                      <motion.div
                        key={status}
                        initial={{
                          opacity: 0,
                          y: -8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -8,
                        }}
                        className={cn(
                          'mb-6 flex items-start gap-3 border px-4 py-3.5 text-sm',
                          status === 'success'
                            ? 'border-[#cbd9cd] bg-[#f5f8f5] text-[#4c6952]'
                            : 'border-[#e0c8c4] bg-[#faf5f4] text-[#8d4b45]'
                        )}
                        role="status"
                      >
                        <span className="mt-0.5 text-sm font-medium">
                          {status === 'success' ? '✓' : '⚠'}
                        </span>

                        <span className="leading-5">
                          {serverMessage}
                        </span>
                      </motion.div>
                    )}
                </AnimatePresence>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  noValidate
                >
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Input
                      label="Full Name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      containerClassName="w-full"
                      disabled={isLoading}
                    />

                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      containerClassName="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Input
                      label="Phone (optional)"
                      name="phone"
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      containerClassName="w-full"
                      disabled={isLoading}
                    />

                    <Input
                      label="Subject (optional)"
                      name="subject"
                      type="text"
                      placeholder="Custom order inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      containerClassName="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-[#66615b]"
                    >
                      Message{' '}
                      <span className="text-[#8d4b45]">
                        *
                      </span>
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={7}
                      required
                      placeholder="Tell us about your inquiry, custom order requirements, or any questions..."
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={cn(
                        'w-full resize-none border bg-[#f6f5f2] px-4 py-3.5',
                        'text-sm leading-6 text-[#171717]',
                        'placeholder:text-[#aaa49c]',
                        'outline-none transition-all duration-200',
                        'hover:border-[#b9b4ad]',
                        'focus:border-[#866b42] focus:bg-white',
                        'focus:ring-1 focus:ring-[#866b42]/20',
                        errors.message &&
                          'border-[#b98c85] focus:border-[#8d4b45] focus:ring-[#8d4b45]/10',
                        isLoading &&
                          'cursor-not-allowed opacity-70'
                      )}
                    />

                    {errors.message ? (
                      <p className="mt-2 text-xs font-medium text-[#8d4b45]">
                        {errors.message}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-[#99938b]">
                        We&apos;ll never share your personal
                        information.
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className={cn(
                      'group flex h-12 w-full items-center justify-center gap-3',
                      'border-0 bg-[#181716] px-5',
                      'text-[10px] font-medium uppercase tracking-[0.18em] text-white',
                      'transition-colors duration-300',
                      'hover:bg-[#302d29]',
                      'disabled:cursor-not-allowed disabled:opacity-60'
                    )}
                  >
                    {isLoading ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending Message
                      </>
                    ) : (
                      <>
                        Send Message

                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          strokeWidth={1.4}
                        />
                      </>
                    )}
                  </Button>
                </form>

                {/* Bottom Assurance */}
                <div className="mt-7 border-t border-[#d9d5cf] pt-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-2.5">
                      <Shield
                        className="h-4 w-4 shrink-0 text-[#866b42]"
                        strokeWidth={1.25}
                      />

                      <span className="text-[10px] uppercase tracking-[0.1em] text-[#77716a]">
                        Secure & Confidential
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock
                        className="h-4 w-4 shrink-0 text-[#866b42]"
                        strokeWidth={1.25}
                      />

                      <span className="text-[10px] uppercase tracking-[0.1em] text-[#77716a]">
                        24hr Response
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Gem
                        className="h-4 w-4 shrink-0 text-[#866b42]"
                        strokeWidth={1.25}
                      />

                      <span className="text-[10px] uppercase tracking-[0.1em] text-[#77716a]">
                        Expert Advice
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
