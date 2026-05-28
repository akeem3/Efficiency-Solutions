"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LuMenu, LuX, LuShoppingCart, LuChevronDown } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { useCart } from "@/hooks/useCart";
import { getWhatsAppLink } from "@/lib/whatsapp";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: "About", href: "/about" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Close mobile menu on route change or window resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const drawerVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          "sticky top-0 z-50 flex h-20 w-full items-center justify-between px-6 py-4 backdrop-blur-md",
          "lg:px-12",
          "bg-card/80 border-b border-border shadow-sm",
        )}
      >
        {/* Left Side: Logo */}
        <div className="flex-1 flex items-center">
          <Link 
            href="/" 
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
          >
            <Icons.Logo className="h-8 w-8 md:h-10 md:w-10 shrink-0" />
            <span className="inline-flex text-base md:text-xl font-bold font-heading whitespace-nowrap">
              <span className="text-brand-primary">Efficiency</span>{" "}
              <span className="text-brand-secondary">Solutions</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden lg:flex lg:flex-1 justify-center items-center gap-2">
          {navItems.map((item) => {
            if (item.name === "Services") {
              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "text-base font-medium text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1",
                      pathname.startsWith("/services") && "text-brand-primary font-semibold"
                    )}
                  >
                    {item.name}
                    <LuChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                  </Link>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white rounded-[10px] shadow-xl ring-1 ring-black/5 p-3 w-72 flex flex-col gap-1">
                      <Link href="/services/logistics" className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-brand-primary/5 transition-colors group/link">
                        <div className="h-10 w-10 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 transition-transform group-hover/link:scale-110">
                          <Icons.Logistics className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold font-heading text-brand-primary text-sm">Luxury Logistics</div>
                          <div className="text-xs text-brand-muted mt-0.5">Elite vehicle rentals</div>
                        </div>
                      </Link>
                      <Link href="/services/branding" className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-brand-primary/5 transition-colors group/link">
                        <div className="h-10 w-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 transition-transform group-hover/link:scale-110">
                          <Icons.Services className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold font-heading text-brand-primary text-sm">Premium Branding & Printing</div>
                          <div className="text-xs text-brand-muted mt-0.5">Custom apparel & gifts</div>
                        </div>
                      </Link>
                      <Link href="/services/digital" className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-brand-primary/5 transition-colors group/link">
                        <div className="h-10 w-10 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0 transition-transform group-hover/link:scale-110">
                          <Icons.Digital className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold font-heading text-brand-primary text-sm">Digital Development</div>
                          <div className="text-xs text-brand-muted mt-0.5">Web, mobile & product design</div>
                        </div>
                      </Link>
                      <Link href="/services/accounting" className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-brand-primary/5 transition-colors group/link">
                        <div className="h-10 w-10 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0 transition-transform group-hover/link:scale-110">
                          <Icons.Accounting className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold font-heading text-brand-primary text-sm">Accounting Services</div>
                          <div className="text-xs text-brand-muted mt-0.5">Financial intelligence</div>
                        </div>
                      </Link>
                      <Link href="/services/tailoring" className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-brand-primary/5 transition-colors group/link">
                        <div className="h-10 w-10 rounded-lg bg-orange-600/10 text-orange-600 flex items-center justify-center shrink-0 transition-transform group-hover/link:scale-110">
                          <Icons.Tailoring className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold font-heading text-brand-primary text-sm">Fashion Design</div>
                          <div className="text-xs text-brand-muted mt-0.5">Bespoke couture & design</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (item.href === "/#services" && pathname === "/") {
                    e.preventDefault();
                    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                  } else if (item.href === "/" && pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else if (pathname.startsWith(item.href) && item.href !== "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "text-base font-medium text-brand-muted hover:text-brand-primary transition-colors",
                  pathname === item.href && "text-brand-primary font-semibold",
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Cart, CTA and Mobile Menu Button */}
        <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
          {/* Cart Trigger */}
          <CartDrawer>
            <button 
              className="group relative flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-primary/5 text-brand-primary transition-all hover:bg-brand-primary hover:text-white"
              aria-label="View Cart"
            >
              <LuShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-secondary text-[10px] font-bold text-white ring-2 ring-white transition-transform group-hover:scale-110">
                  {itemCount}
                </span>
              )}
            </button>
          </CartDrawer>

          <Link
            href={getWhatsAppLink(pathname)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "bg-brand-primary hover:bg-brand-primary/90 text-white hidden lg:inline-flex rounded-[10px] gap-2 px-8 h-12 shadow-lg shadow-brand-primary/10"
            )}
          >
            Contact
            <Image src="/whatsapp.png" alt="WhatsApp Icon" width={20} height={20} className="object-contain" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "lg:hidden h-11 w-11 rounded-[10px] border-brand-primary/20 hover:bg-brand-primary/5",
            )}
            aria-label="Open mobile menu"
            onClick={toggleMobileMenu}
          >
            <LuMenu className="h-6 w-6 text-brand-primary" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={toggleMobileMenu}
            />

            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={drawerVariants}
              transition={{ type: "tween", duration: 0.4 }}
              className={cn(
                "fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col bg-background shadow-2xl lg:hidden",
              )}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={toggleMobileMenu}
                >
                  <Icons.Logo className="h-10 w-10 shrink-0" />
                  <span className="text-lg font-bold font-heading">
                    <span className="text-brand-primary">Efficiency</span>{" "}
                    <span className="text-brand-secondary">Solutions</span>
                  </span>
                </Link>
                <button
                  aria-label="Close mobile menu"
                  onClick={toggleMobileMenu}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                  )}
                >
                  <LuX className="h-6 w-6 text-brand-primary" />
                </button>
              </div>

              {/* Drawer Body: Navigation Links */}
              <div className="grow overflow-y-auto p-6 space-y-4">
                {navItems.map((item) => {
                  if (item.name === "Services") {
                    return (
                      <div key={item.name} className="border-b border-brand-primary/5 py-4">
                        <div className="text-2xl font-bold font-heading text-brand-primary mb-4">
                          {item.name}
                        </div>
                        <div className="flex flex-col gap-2 pl-4 border-l-2 border-brand-primary/10">
                          <Link href="/services/logistics" onClick={toggleMobileMenu} className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-brand-primary/5 transition-colors">
                            <div className="h-8 w-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                              <Icons.Logistics className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-bold font-heading text-brand-primary text-[15px]">Luxury Logistics</div>
                              <div className="text-[11px] text-brand-muted mt-0.5">Elite vehicle rentals</div>
                            </div>
                          </Link>
                          <Link href="/services/branding" onClick={toggleMobileMenu} className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-brand-primary/5 transition-colors">
                            <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                              <Icons.Services className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-bold font-heading text-brand-primary text-[15px]">Premium Branding & Printing</div>
                              <div className="text-[11px] text-brand-muted mt-0.5">Custom apparel & gifts</div>
                            </div>
                          </Link>
                          <Link href="/services/digital" onClick={toggleMobileMenu} className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-brand-primary/5 transition-colors">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
                              <Icons.Digital className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-bold font-heading text-brand-primary text-[15px]">Digital Product Dev</div>
                              <div className="text-[11px] text-brand-muted mt-0.5">Web & Mobile solutions</div>
                            </div>
                          </Link>
                          <Link href="/services/accounting" onClick={toggleMobileMenu} className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-brand-primary/5 transition-colors">
                            <div className="h-8 w-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
                              <Icons.Accounting className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-bold font-heading text-brand-primary text-[15px]">Accounting Services</div>
                              <div className="text-[11px] text-brand-muted mt-0.5">Financial intelligence</div>
                            </div>
                          </Link>
                          <Link href="/services/tailoring" onClick={toggleMobileMenu} className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-brand-primary/5 transition-colors">
                            <div className="h-8 w-8 rounded-lg bg-orange-600/10 text-orange-600 flex items-center justify-center shrink-0">
                              <Icons.Tailoring className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-bold font-heading text-brand-primary text-[15px]">Fashion Design</div>
                              <div className="text-[11px] text-brand-muted mt-0.5">Bespoke couture</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 text-2xl font-bold font-heading py-4 border-b border-brand-primary/5",
                        pathname === item.href ? "text-brand-secondary" : "text-brand-primary"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Footer: CTA */}
              <div className="p-6 border-t border-border">
                <Link
                  href={getWhatsAppLink(pathname)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "w-full bg-brand-primary hover:bg-brand-primary/90 text-white rounded-[10px] flex gap-2 h-14 text-lg",
                  )}
                  onClick={toggleMobileMenu}
                >
                  Contact Us
                  <Image src="/whatsapp.png" alt="WhatsApp Icon" width={24} height={24} className="object-contain" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
