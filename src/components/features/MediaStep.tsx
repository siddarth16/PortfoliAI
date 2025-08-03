'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Upload, X, Image, Video } from 'lucide-react';
import { UserFormData, MediaFile } from '@/lib/types';

interface MediaStepProps {
  formData: UserFormData;
  updateFormData: (data: Partial<UserFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function MediaStep({ formData, updateFormData, onNext, onPrevious }: MediaStepProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(formData.media || []);
  const [videoUrl, setVideoUrl] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newMedia: MediaFile = {
            file,
            url: e.target?.result as string,
            type: 'image'
          };
          setMediaFiles(prev => [...prev, newMedia]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const addVideoUrl = () => {
    if (videoUrl.trim()) {
      const newMedia: MediaFile = {
        file: new File([], 'video'),
        url: videoUrl.trim(),
        type: 'video'
      };
      setMediaFiles(prev => [...prev, newMedia]);
      setVideoUrl('');
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    updateFormData({ media: mediaFiles });
    onNext();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <p className="text-muted-foreground">
            Add photos, videos, or other media to make your portfolio more engaging. This step is optional.
          </p>
        </div>

        {/* File Upload Section */}
        <Card className="p-6 bg-muted/30">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Image className="h-5 w-5 mr-2" />
            Upload Images
          </h3>
          
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Drop images here or click to upload</p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, GIF up to 10MB each
              </p>
            </label>
          </div>
        </Card>

        {/* Video URL Section */}
        <Card className="p-6 bg-muted/30">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Video className="h-5 w-5 mr-2" />
            Add Video Links
          </h3>
          
          <div className="flex gap-2">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addVideoUrl}
              disabled={!videoUrl.trim()}
              variant="outline"
            >
              Add Video
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Add YouTube, Vimeo, or other video platform links
          </p>
        </Card>

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Media Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaFiles.map((media, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  {media.type === 'image' ? (
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={media.url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  
                  {media.type === 'video' && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {media.url}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Tips */}
        <Card className="p-4 bg-primary/10 border-primary/20">
          <h4 className="font-medium text-primary mb-2">💡 Tips for great media:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use high-quality photos that represent your work</li>
            <li>• Add screenshots of your projects in action</li>
            <li>• Include demo videos of your applications</li>
            <li>• Professional headshots work great for personal branding</li>
          </ul>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between pt-6"
      >
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onPrevious}
          className="px-8 py-3 text-lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        
        <Button
          type="button"
          size="lg"
          onClick={handleContinue}
          className="px-8 py-3 text-lg glow-sm group"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {mediaFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center pt-4"
        >
          <p className="text-sm text-primary">
            ✓ Added {mediaFiles.length} media file{mediaFiles.length !== 1 ? 's' : ''} to your portfolio.
          </p>
        </motion.div>
      )}
    </div>
  );
}