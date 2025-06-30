import Link from "next/link";
import {
  FaFacebookF,
  FaTelegramPlane,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Nvs Book Store</h3>
            <p className="text-muted-foreground mb-4">
              Your one-stop platform for government notifications, job updates,
              and educational resources.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/profile.php?id=100011305176996"
                className="text-muted-foreground hover:text-primary"
              >
                <FaFacebookF size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://t.me/nvsonlinecenter"
                className="text-muted-foreground hover:text-primary"
              >
                <FaTelegramPlane size={20} />
                <span className="sr-only">Telegram</span>
              </Link>
              <Link
                href="https://www.instagram.com/abhi_kumar_nvs"
                className="text-muted-foreground hover:text-primary"
              >
                <FaInstagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.youtube.com/@moryatutorial507"
                className="text-muted-foreground hover:text-primary"
              >
                <FaYoutube size={20} />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link
                href="https://whatsapp.com/channel/0029VaAMqSs545uqemVLkC0a"
                className="text-muted-foreground hover:text-primary"
              >
                <FaWhatsapp size={20} />
                <span className="sr-only">WhatsApp</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/notifications/jobs"
                  className="text-muted-foreground hover:text-primary"
                >
                  Latest Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/notifications/results"
                  className="text-muted-foreground hover:text-primary"
                >
                  Exam Results
                </Link>
              </li>
              <li>
                <Link
                  href="/notifications/admit-cards"
                  className="text-muted-foreground hover:text-primary"
                >
                  Admit Cards
                </Link>
              </li>
              <li>
                <Link
                  href="/store"
                  className="text-muted-foreground hover:text-primary"
                >
                  Educational Store
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/jobs?category=central"
                  className="text-muted-foreground hover:text-primary"
                >
                  Central Government Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?category=state"
                  className="text-muted-foreground hover:text-primary"
                >
                  State Government Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?category=banking"
                  className="text-muted-foreground hover:text-primary"
                >
                  Banking Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/store?category=books"
                  className="text-muted-foreground hover:text-primary"
                >
                  Study Books
                </Link>
              </li>
              <li>
                <Link
                  href="/store?category=test-series"
                  className="text-muted-foreground hover:text-primary"
                >
                  Test Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-muted-foreground">
              <p>Safakhana Road, Dumraon</p>
              <p>Dumraon, Buxar, Bihar</p>
              <p className="mt-2">Email: info.nvsbookstore@gmail.com</p>
              <p>Phone: +916203662259</p>
            </address>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Nvs Book Store. All rights
            reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms of Service
            </Link>
            <Link
              href="/sitemap"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Sitemap
            </Link>
            <Link
              href="/return"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Return & Refund Policy
            </Link>
            <Link
              href="/shipping"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Shiping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
