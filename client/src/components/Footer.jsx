import React from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, MapPin, Mail, Phone, Share2, Camera, Twitter } from 'lucide-react'

/**
 * Footer — dark fitness-themed footer with logo, links, contact info, and social icons.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/facilities', label: 'Facilities' },
    { to: '/trainers', label: 'Trainers' },
    { to: '/plans', label: 'Plans' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-extrabold mb-3">
              <Dumbbell className="text-orange-500" size={24} />
              <span className="text-white">FIT</span>
              <span className="text-orange-500">ZONE</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transform Your Body, Transform Your Life. Premium fitness facilities and expert
              coaching for every level.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-5">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-500 hover:text-orange-400 transition-colors"
              >
                <Share2 size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-500 hover:text-orange-400 transition-colors"
              >
                <Camera size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-500 hover:text-orange-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin size={16} className="text-orange-500 mt-0.5 shrink-0" />
                123 Fitness Avenue, Gym District, Mumbai 400001
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={16} className="text-orange-500 shrink-0" />
                hello@fitzone.com
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={16} className="text-orange-500 shrink-0" />
                +91 98765 43210
              </li>
            </ul>
            <div className="mt-4 text-gray-500 text-sm">
              <p>Mon – Fri: 5:00 AM – 11:00 PM</p>
              <p>Sat – Sun: 6:00 AM – 9:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-4">
        <p className="text-center text-gray-600 text-sm">
          © {year} FitZone. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
