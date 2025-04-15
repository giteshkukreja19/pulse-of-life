
import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center bg-white rounded-full w-10 h-10">
                <Heart className="text-blood h-5 w-5" />
              </div>
              <div className="font-bold text-xl">
                <span className="text-blood-light">Plus</span>
                <span className="text-white"> of Life</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Connecting blood donors and recipients to save lives through
              a streamlined, efficient donation management system.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-blood-light transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-blood-light transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-blood-light transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blood-light transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-gray-300 hover:text-blood-light transition-colors">
                  Request Blood
                </Link>
              </li>
              <li>
                <Link to="/donors" className="text-gray-300 hover:text-blood-light transition-colors">
                  Find Donors
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blood-light transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-blood-light transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-blood-light transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-300 hover:text-blood-light transition-colors">
                  Donation Process
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-blood-light transition-colors">
                  Blood Groups
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-blood-light transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-blood-light transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-blood-light transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-blood-light transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blood-light flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  123 Main Street, Medical Campus
                  Building B, New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blood-light flex-shrink-0" />
                <span className="text-gray-300">+1 (234) 567-8901</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blood-light flex-shrink-0" />
                <span className="text-gray-300">contact@plusoflife.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center text-gray-400">
          <p>© 2025 Plus of Life. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
