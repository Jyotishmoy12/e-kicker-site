import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              OurCompany
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Innovative solutions for your business needs. 
              Transforming challenges into opportunities.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-yellow-300 hover:text-yellow-400 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-yellow-300 hover:text-yellow-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-yellow-300 hover:text-yellow-400 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-yellow-300 hover:text-yellow-400 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold text-yellow-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                'Home', 
                'About Us', 
                'Services', 
                'Products', 
                'Contact'
              ].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-blue-200 hover:text-yellow-300 
                               transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold text-yellow-400 mb-4">
              Our Services
            </h4>
            <ul className="space-y-2">
              {[
                'Web Development', 
                'Mobile Apps', 
                'Cloud Solutions', 
                'Cybersecurity', 
                'Data Analytics'
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="#" 
                    className="text-blue-200 hover:text-yellow-300 
                               transition-colors text-sm"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold text-yellow-400 mb-4">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-yellow-300" />
                <span className="text-blue-200 text-sm">
                  support@ourcompany.com
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-yellow-300" />
                <span className="text-blue-200 text-sm">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-yellow-300" />
                <span className="text-blue-200 text-sm">
                  123 Tech Lane, Innovation City
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-blue-700 
                        flex flex-col md:flex-row 
                        justify-between items-center">
          <p className="text-sm text-blue-200 mb-2 md:mb-0">
            © 2024 OurCompany. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-blue-200 hover:text-yellow-300 
                         transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-blue-200 hover:text-yellow-300 
                         transition-colors text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;