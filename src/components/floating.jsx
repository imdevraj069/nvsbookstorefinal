import { MessageCircle, Phone, Youtube } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function FloatingSupport() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat with Us
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">🚀 Connect with Us Instantly</DialogTitle>
            <DialogDescription className="text-center">
              Get instant support and updates through your preferred platform
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            {/* Call now */}
            <Card className="p-4 border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Call Us</h4>
                  <p className="text-sm text-gray-600">Get instant notifications</p>
                </div>
                <Button asChild size="sm" className="rounded-xl bg-blue-500 hover:bg-blue-600">
                  <Link href="tel:+916203662259">
                    Call Now
                  </Link>
                </Button>
              </div>
            </Card>

            {/* WhatsApp */}
            <Card className="p-4 border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">WhatsApp Support</h4>
                  <p className="text-sm text-gray-600">24/7 instant help</p>
                </div>
                <Button asChild size="sm" className="rounded-xl bg-green-500 hover:bg-green-600">
                  <Link href="https://wa.me/message/SXYG2DK6NQ3ZH1">
                    Chat Now
                  </Link>
                </Button>
              </div>
            </Card>

            {/* YouTube */}
            <Card className="p-4 border-2 border-red-200 hover:border-red-400 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">YouTube Channel</h4>
                  <p className="text-sm text-gray-600">Study tips & updates</p>
                </div>
                <Button asChild size="sm" className="rounded-xl bg-red-500 hover:bg-red-600">
                  <Link href="https://www.youtube.com/@moryatutorial507?sub_confirmation=1" target="_blank">
                   Subscribe
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
