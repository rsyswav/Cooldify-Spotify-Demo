import React, { useState } from 'react';
import { Upload, X, Music, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UploadSongDialog = ({ isOpen, onClose, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: ''
  });
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('audio/')) {
        setError('Please select an audio file');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    if (!formData.title || !formData.artist) {
      setError('Title and Artist are required');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('artist', formData.artist);
      if (formData.album) uploadFormData.append('album', formData.album);
      if (formData.genre) uploadFormData.append('genre', formData.genre);

      const response = await axios.post(
        `${BACKEND_URL}/api/songs/upload`,
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        onUploadSuccess(response.data.song);
        handleClose();
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || 'Failed to upload song');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFormData({
      title: '',
      artist: '',
      album: '',
      genre: ''
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Upload className="mr-2 h-5 w-5 text-cyan-400" />
            Upload Song
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Upload your own songs to Cooldify (max 10MB)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* File Upload */}
          <div>
            <Label htmlFor="file" className="text-gray-300">Audio File *</Label>
            <div className="mt-2">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <Music className="h-8 w-8 text-cyan-400 mb-2" />
                    <p className="text-sm text-white font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-300">Click to upload audio file</p>
                    <p className="text-xs text-gray-500">MP3, WAV, OGG (max 10MB)</p>
                  </div>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-gray-300">Song Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter song title"
              className="mt-1 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Artist */}
          <div>
            <Label htmlFor="artist" className="text-gray-300">Artist *</Label>
            <Input
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              placeholder="Enter artist name"
              className="mt-1 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Album */}
          <div>
            <Label htmlFor="album" className="text-gray-300">Album (Optional)</Label>
            <Input
              id="album"
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              placeholder="Enter album name"
              className="mt-1 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Genre */}
          <div>
            <Label htmlFor="genre" className="text-gray-300">Genre (Optional)</Label>
            <Input
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              placeholder="e.g., Electronic, Rock, Pop"
              className="mt-1 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-medium"
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Song
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadSongDialog;
