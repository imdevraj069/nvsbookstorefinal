"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  User,
  LogOut,
  Settings,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // ShadCN
import { ModeToggle } from "@/components/ui/theme-toggeler";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/utils/store/useCartStore";
import {
  FaBell,
  FaThLarge,
  FaHome,
  FaStore,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
  FaGavel,
} from "react-icons/fa";
import Marquee from "@/components/marquee"

export default function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [notifOpen, setNotifOpen] = useState(true);
  const [otherOpen, setOtherOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false); // in component

  const cartCount = useCartStore((s) => s.getCartCount());

  const { data: session, status } = useSession();
  const isAuthenticated = !!session;
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const loadCartFromDB = useCartStore((s) => s.loadCartFromDB);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    if (status === "authenticated") {
      loadCartFromDB(true);
    } else if (status === "unauthenticated") {
      clearCart();
    }
  }, [status]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setShowUserMenu(false);
      }
      setLastScrollY(currentScrollY);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-4 md:px-16">
        <div className="flex justify-between items-center h-16">
          <div className="flex gap-1.5 items-center">
            {/* Mobile Sidebar Trigger */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 sm:w-80">
                  <div className="p-4 space-y-6">
                    {/* Home */}
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors"
                    >
                      <FaHome />
                      Home
                    </Link>

                    {/* Notifications Section */}
                    <div className="space-y-1">
                      <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <FaBell />
                          Notifications
                        </span>
                        {notifOpen ? (
                          <FaChevronUp size={14} />
                        ) : (
                          <FaChevronDown size={14} />
                        )}
                      </button>
                      {notifOpen && (
                        <div className="pl-4 space-y-1">
                          <MobileLink
                            href="/notifications/results"
                            title="Results"
                          />
                          <MobileLink href="/notifications/jobs" title="Jobs" />
                          <MobileLink
                            href="/notifications/admit-cards"
                            title="Admit Cards"
                          />
                          <MobileLink
                            href="/notifications/exam-dates"
                            title="Exam Dates"
                          />
                          <MobileLink
                            href="/notifications/answer-keys"
                            title="Answer Keys"
                          />
                        </div>
                      )}
                    </div>

                    {/* Other Section */}
                    <div className="space-y-1">
                      <button
                        onClick={() => setOtherOpen(!otherOpen)}
                        className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <FaThLarge />
                          Other
                        </span>
                        {otherOpen ? (
                          <FaChevronUp size={14} />
                        ) : (
                          <FaChevronDown size={14} />
                        )}
                      </button>
                      {otherOpen && (
                        <div className="pl-4 space-y-1">
                          <MobileLink href="/store?q=laptop" title="Laptops" />
                          <MobileLink href="/store?q=books" title="Books" />
                          <MobileLink href="/store?q=notes" title="Notes" />
                          <MobileLink
                            href="/store?q=pyq"
                            title="Previous Papers"
                          />
                          <MobileLink
                            href="/store?q=syllabus"
                            title="Syllabus"
                          />
                          <MobileLink href="/pvc" title="PVC Cards" />
                          <MobileLink href="/videos" title="Videos" />
                          <MobileLink href="/blogs" title="Blogs" />
                          <MobileLink href="/events" title="Events" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => setLegalOpen(!legalOpen)}
                        className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <FaGavel />
                          Legal
                        </span>
                        {legalOpen ? (
                          <FaChevronUp size={14} />
                        ) : (
                          <FaChevronDown size={14} />
                        )}
                      </button>
                      {legalOpen && (
                        <div className="pl-4 space-y-1">
                          <MobileLink href="/privacy" title="Privacy Policy" />
                          <MobileLink
                            href="/terms"
                            title="Terms & Conditions"
                          />
                          <MobileLink href="/return" title="Return Policy" />
                          <MobileLink
                            href="/shipping"
                            title="Shipping Policy"
                          />
                        </div>
                      )}
                    </div>

                    {/* Direct Links */}
                    <div className="space-y-1">
                      <Link
                        href="/store"
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition"
                      >
                        <FaStore />
                        Store
                      </Link>
                      <Link
                        href="/contact"
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition"
                      >
                        <FaEnvelope />
                        Contact
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/logo.png" alt="Logo" width={50} height={50} />
              </Link>
            </motion.div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:block">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Notifications</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-0 z-30">
                    <ul className="grid w-[200px]">
                      <NavItem href="/notifications/results" title="Result" />
                      <NavItem href="/notifications/jobs" title="Jobs" />
                      <NavItem
                        href="/notifications/admit-cards"
                        title="Admit Card"
                      />
                      <NavItem
                        href="/notifications/exam-dates"
                        title="Exam Dates"
                      />
                      <NavItem
                        href="/notifications/answer-keys"
                        title="Answer Keys"
                      />
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Other</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-0 z-30">
                    <ul className="grid w-[200px]">
                      <NavItem href="/store?q=laptop" title="Laptops" />
                      <NavItem href="/store?q=books" title="Books" />
                      <NavItem href="/store?q=notes" title="Notes" />
                      <NavItem href="/store?q=pyq" title="Previous Papers" />
                      <NavItem href="/store?q=syllabus" title="Syllabus" />
                      <NavItem href="/pvc" title="PVC Cards" />
                      <NavItem href="/videos" title="Videos" />
                      <NavItem href="/blogs" title="Blogs" />
                      <NavItem href="/events" title="Events" />
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/store">Store</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/contact">Contact</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount >= 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Button>
              </Link>
            </motion.div>

            {/* Avatar Menu (fully restored) */}
            <div className="relative user-menu-container">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Avatar
                  className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {isAuthenticated && user?.image ? (
                    <AvatarImage
                      src={user.image || "/placeholder.svg"}
                      alt={user.name || "User"}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {isAuthenticated ? (
                      getInitials(user?.name)
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-md shadow-lg py-1 z-50"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-bold">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                          {user?.role === "admin" && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                              Admin
                            </span>
                          )}
                        </div>

                        <motion.div
                          whileHover={{ backgroundColor: "hsl(var(--accent))" }}
                        >
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="h-4 w-4 mr-3" />
                            Profile
                          </Link>
                        </motion.div>

                        {!isAdmin && (
                          <motion.div
                            whileHover={{
                              backgroundColor: "hsl(var(--accent))",
                            }}
                          >
                            <Link
                              href="/dashboard"
                              className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings className="h-4 w-4 mr-3" />
                              Dashboard
                            </Link>
                          </motion.div>
                        )}

                        <motion.div
                          whileHover={{ backgroundColor: "hsl(var(--accent))" }}
                        >
                          <Link
                            href="/settings"
                            className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="h-4 w-4 mr-3" />
                            Account Settings
                          </Link>
                        </motion.div>

                        {isAdmin && (
                          <motion.div
                            whileHover={{
                              backgroundColor: "hsl(var(--accent))",
                            }}
                          >
                            <Link
                              href="/admin"
                              className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings className="h-4 w-4 mr-3" />
                              Admin Panel
                            </Link>
                          </motion.div>
                        )}

                        <motion.button
                          whileHover={{ backgroundColor: "hsl(var(--accent))" }}
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground text-red-600"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-bold">Welcome to NVS</p>
                          <p className="text-xs text-muted-foreground">
                            Sign in to access your account
                          </p>
                        </div>

                        <motion.div
                          whileHover={{ backgroundColor: "hsl(var(--accent))" }}
                        >
                          <Link
                            href="/auth"
                            className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <LogIn className="h-4 w-4 mr-3" />
                            Sign In
                          </Link>
                        </motion.div>

                        <motion.div
                          whileHover={{ backgroundColor: "hsl(var(--accent))" }}
                        >
                          <Link
                            href="/auth"
                            className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <UserPlus className="h-4 w-4 mr-3" />
                            Create Account
                          </Link>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <Marquee />
    </motion.nav>
  );
}

function NavItem({ href, title }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block bg-background rounded-md px-5 py-2 text-sm hover:bg-red-700 hover:text-white"
        >
          {title}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function MobileLink({ href, title }) {
  return (
    <Link href={href} className="block px-2 py-1 text-sm hover:text-primary">
      {title}
    </Link>
  );
}
