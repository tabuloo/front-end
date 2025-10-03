import React from 'react';
import { X, Mail, Phone, MapPin, Clock } from 'lucide-react';

interface ContactDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Contact Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Email */}
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
              <Mail className="h-6 w-6 text-red-800" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-700 text-sm">support@tabuloo.com</p>
              <p className="text-gray-700 text-sm">business@tabuloo.com</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
              <Phone className="h-6 w-6 text-red-800" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
              <p className="text-gray-700 text-sm">+91 91009 33477</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
              <MapPin className="h-6 w-6 text-red-800" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Office Address</h3>
              <p className="text-gray-700 text-sm">
                Tabuloo Technologies Pvt. Ltd.<br />
                6-237-98-79, Devalam Extation<br />
                Madanapalle, Madanapalle<br />
                Chittoor- 517325<br />
                Andhra Pradesh, India
              </p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
              <Clock className="h-6 w-6 text-red-800" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
              <p className="text-gray-700 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-700 text-sm">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-gray-700 text-sm">Sunday: Closed</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <a
                href="mailto:support@tabuloo.com"
                className="flex-1 bg-red-800 text-white text-center py-2 px-4 rounded-lg hover:bg-red-900 transition-colors text-sm font-medium"
              >
                Send Email
              </a>
              <a
                href="tel:+919100933477"
                className="flex-1 bg-gray-100 text-gray-800 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsModal;
