import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

// Vite exposes env vars on import.meta.env, not process.env.
const API_ROOT =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const api = axios.create({ baseURL: API_ROOT, withCredentials: true });

export const imageUrl = (id) => `${API_ROOT}/images/${id}/file`;

function UploadImage({ selectedImage, onSelect }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const previewRef = useRef(null);

  const fetchImages = useCallback(async (signal) => {
    try {
      const { data } = await api.get('/images', { signal });
      setImages(data.images ?? []);
      setError('');
    } catch (err) {
      if (axios.isCancel(err)) return;
      setError('Failed to load images.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchImages(controller.signal);
    return () => controller.abort();
  }, [fetchImages]);

  // Release the last preview URL when the popup closes.
  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  const replacePreview = (nextFile) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = nextFile ? URL.createObjectURL(nextFile) : null;
    setPreviewUrl(previewRef.current);
  };

  const clearFile = () => {
    setFile(null);
    replacePreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0] ?? null;
    setMessage('');

    if (picked && picked.size > MAX_IMAGE_BYTES) {
      setError('Image must be 2 MB or smaller.');
      clearFile();
      return;
    }

    setError('');
    setFile(picked);
    replacePreview(picked);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setError('');
    setMessage('');

    try {
      // No manual Content-Type: the browser adds the multipart boundary.
      const { data } = await api.post('/images/upload', formData);
      setMessage(data.message);
      setImages((prev) => [data.image, ...prev]);
      onSelect(imageUrl(data.image._id));
      clearFile();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed, please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='popup-container'>
      <div className='top-container'>
        <div className='selectedImage'>
          {selectedImage && (
            <img
              src={selectedImage}
              alt='Selected avatar'
              className='enlarged'
            />
          )}
        </div>

        <div className='upload-card'>
          <h1>Image Upload & Preview</h1>

          <input
            ref={inputRef}
            type='file'
            accept='image/png,image/jpeg,image/gif,image/webp'
            onChange={handleFileChange}
          />

          {previewUrl && (
            <div className='preview-container'>
              <img src={previewUrl} alt='Preview' className='preview-img' />
            </div>
          )}

          {error && (
            <p role='alert' className='error-msg'>
              {error}
            </p>
          )}
          {message && <p className='success-msg'>{message}</p>}

          <button
            type='button'
            className='upload-btn'
            onClick={handleUpload}
            disabled={uploading || !file}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      <div className='gallery'>
        {loading ? (
          <p>Loading images...</p>
        ) : images.length > 0 ? (
          images.map((img) => {
            const url = imageUrl(img._id);
            const isSelected = url === selectedImage;

            return (
              <button
                type='button'
                key={img._id}
                onClick={() => onSelect(url)}
                aria-pressed={isSelected}
                className={`gallery-item${isSelected ? ' selected' : ''}`}
              >
                <img
                  src={url}
                  alt={img.name}
                  loading='lazy'
                  className='gallery-img'
                />
                <p>{img.name}</p>
              </button>
            );
          })
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default UploadImage;
