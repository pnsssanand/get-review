import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Share2, Link as LinkIcon, Facebook, Twitter, Linkedin, MessageCircle, Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareProfileProps {
  profileId: string;
  profileName: string;
  profileType?: 'user' | 'business';
  trigger?: React.ReactNode;
}

export default function ShareProfile({ 
  profileId, 
  profileName, 
  profileType = 'user',
  trigger 
}: ShareProfileProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate the profile URL based on type
  const profileUrl = `${window.location.origin}/${profileType === 'business' ? 'business' : 'profile'}/${profileId}`;
  const shareText = `Check out ${profileName} on Get Review!`;

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error('Failed to copy link');
    }
  };

  // Open share URL in new window
  const openShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  // Share on social media platforms
  const shareOnSocial = (platform: 'facebook' | 'whatsapp' | 'twitter' | 'linkedin') => {
    const encoded = encodeURIComponent(profileUrl);
    const text = encodeURIComponent(shareText);

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${encoded}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encoded}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${text}`
    };

    openShare(urls[platform]);
    
    // Track social click (optional - if you want analytics)
    // trackSocialClick(platform, profileId);
  };

  // Use Web Share API if available (mobile devices)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profileName,
          text: shareText,
          url: profileUrl,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        // User cancelled share or error occurred
        console.log('Share cancelled or failed:', err);
      }
    }
  };

  // Download QR code as image
  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${profileName.replace(/\s+/g, '-')}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('QR code downloaded!');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Profile
          </DialogTitle>
          <DialogDescription>
            Share {profileName}'s profile with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Link</label>
            <div className="flex gap-2">
              <Input
                value={profileUrl}
                readOnly
                className="flex-1 text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={copyLink}
                size="sm"
                variant={copied ? "default" : "secondary"}
                className="gap-2 min-w-[100px]"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Copied
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">QR Code</label>
            <div className="flex flex-col items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeCanvas
                  id="qr-code-canvas"
                  value={profileUrl}
                  size={160}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Scan to open this profile
              </p>
              <Button
                onClick={downloadQR}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          </div>

          {/* Social Media Share Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Share via Social Media</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => shareOnSocial('whatsapp')}
                variant="outline"
                className="gap-2 justify-start"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp
              </Button>
              
              <Button
                onClick={() => shareOnSocial('facebook')}
                variant="outline"
                className="gap-2 justify-start"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              
              <Button
                onClick={() => shareOnSocial('twitter')}
                variant="outline"
                className="gap-2 justify-start"
              >
                <Twitter className="h-4 w-4 text-sky-500" />
                X (Twitter)
              </Button>
              
              <Button
                onClick={() => shareOnSocial('linkedin')}
                variant="outline"
                className="gap-2 justify-start"
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Native Share (Mobile) */}
          {navigator.share && (
            <div className="space-y-2">
              <Button
                onClick={handleNativeShare}
                variant="default"
                className="w-full gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share via device...
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
