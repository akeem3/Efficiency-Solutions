"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const services = [
  {
    id: "logistics",
    title: "Luxury Logistics",
    description:
      "Elite vehicle rentals and professional security escort services.",
    icon: Icons.Logistics,
    href: "/services/logistics",
    color: "bg-blue-600",
  },
  {
    id: "branding",
    title: "Premium Branding & Printing",
    description:
      "Elevate your identity with custom apparel, signage, and corporate gifts.",
    icon: Icons.Services,
    href: "/services/branding",
    color: "bg-orange-500",
  },
  {
    id: "digital",
    title: "Digital Product Development",
    description:
      "High-performance mobile apps, web platforms and user-focused product design services.",
    icon: Icons.Digital,
    href: "/services/digital",
    color: "bg-indigo-600",
  },
  {
    id: "accounting",
    title: "Accounting Services",
    description:
      "Precision auditing and financial management for growing enterprises.",
    icon: Icons.Accounting,
    href: "/services/accounting",
    color: "bg-emerald-600",
  },
  {
    id: "tailoring",
    title: "Fashion Design",
    description:
      "Bespoke couture and premium garment construction for individual and corporate clients.",
    icon: Icons.Tailoring,
    href: "/services/tailoring",
    color: "bg-orange-600",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-background">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-brand-primary/5 text-brand-primary font-bold font-heading text-xs uppercase tracking-widest mb-8 border border-brand-primary/10">
            <Icons.Logo className="h-4 w-4" />
            Excellence & Professionalism
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold font-heading text-brand-primary leading-[1.05] tracking-tight mb-8">
            Reliable Vendors. Quality Service. <br />
            <span className="text-brand-secondary">
              Exceptional Experience.
            </span>
          </h1>

          <p className="text-xl text-brand-muted max-w-2xl mx-auto mb-12 leading-relaxed">
            Efficiency Solutions connects companies and individuals with premium
            services through trusted, vetted vendors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#services">
              <Button
                size="lg"
                className="h-12 md:h-14 px-8 rounded-[10px] bg-brand-primary hover:bg-brand-primary/90 text-white font-bold font-heading group"
              >
                Explore Our Services
                <Icons.ArrowDown className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="h-12 md:h-14 px-8 rounded-[10px] border-brand-primary/20 text-brand-primary font-bold font-heading hover:bg-brand-primary/5"
              >
                Read Our Story
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section
        id="services"
        className="py-24 px-6 lg:px-12 bg-white/50 backdrop-blur-sm relative z-10 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-brand-secondary font-bold font-heading text-sm uppercase tracking-[0.2em] mb-4">
                What we do
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold font-heading text-brand-primary leading-tight">
                Empowering Business through <br /> Integrated Excellence
              </h3>
            </div>
            <p className="text-brand-muted max-w-sm mb-2 text-lg">
              Streamlining complex needs into efficient, high-end serviced
              verticals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={service.href} className="group block h-full">
                  <Card className="h-full border-none shadow-xl bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ring-1 ring-black/5">
                    <CardHeader className="pb-4">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-[10px] flex items-center justify-center mb-6 text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                          service.color,
                        )}
                      >
                        <service.icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-2xl font-bold font-heading text-brand-primary">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-brand-muted leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-4 pb-8">
                      <span className="text-brand-secondary font-bold font-heading text-sm group-hover:underline underline-offset-8 transition-all">
                        Discover Service
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote / Stats */}
      <section className="py-24 px-6 bg-brand-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Icons.Logo className="h-96 w-96 translate-x-24 -translate-y-24" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-20 h-1 bg-brand-secondary mx-auto mb-12" />
          <blockquote className="text-3xl md:text-5xl font-bold font-heading leading-tight mb-12 italic">
            &#34;Efficiency Solutions guarantees reliability, quality, and
            accountability — with vetted vendors and fully managed service
            delivery.&#34;
          </blockquote>
          <div className="flex flex-col items-center">
            <span className="text-brand-secondary font-bold font-heading uppercase tracking-widest mb-2">
              The Managing Director
            </span>
            <span className="text-white/60 text-sm">
              Efficiency Solutions Nigeria.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
