import React from 'react';
import { X, Copy, Mail, Check } from 'lucide-react';
import { EmailContent } from '../services/emailService';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailContent: EmailContent;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, emailContent }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, type: 'subject' | 'body' | 'all') => {
    try {
      let textToCopy = '';
      
      if (type === 'subject') {
        textToCopy = emailContent.subject;
      } else if (type === 'body') {
        textToCopy = emailContent.body;
      } else {
        textToCopy = `Subject: ${emailContent.subject}\n\n${emailContent.body}`;
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const openEmailClient = () => {
    const subject = encodeURIComponent(emailContent.subject);
    const body = encodeURIComponent(emailContent.body);
    const mailtoUrl = `mailto:${emailContent.recipient}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Mail className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Send Registration Email</h2>
              <p className="text-sm text-gray-600">Copy the content below and send it via your email</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send To:
            </label>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-900 font-medium">{emailContent.recipient}</span>
              <button
                onClick={() => copyToClipboard(emailContent.recipient, 'subject')}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copy email address"
              >
                <Copy className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject:
            </label>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-900">{emailContent.subject}</span>
              <button
                onClick={() => copyToClipboard(emailContent.subject, 'subject')}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copy subject"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
              </button>
            </div>
          </div>

          {/* Email Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Body:
            </label>
            <div className="relative">
              <textarea
                value={emailContent.body}
                readOnly
                className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none bg-gray-50 text-sm"
              />
              <button
                onClick={() => copyToClipboard(emailContent.body, 'body')}
                className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copy email body"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <p>💡 <strong>Tip:</strong> Copy the content above and paste it in your email client</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => copyToClipboard('', 'all')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy All</span>
            </button>
            <button
              onClick={openEmailClient}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
            >
              <Mail className="h-4 w-4" />
              <span>Open Email Client</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
