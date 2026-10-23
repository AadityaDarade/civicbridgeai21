'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Send, Paperclip, Mic, MicOff, X, FileText, ImageIcon, AlertCircle,
} from 'lucide-react';
import { useLanguage } from '@/lib/providers';
import { ALLOWED_IMAGE_TYPES, ALLOWED_DOC_TYPES, MAX_FILE_SIZE, MAX_TEXT_LENGTH, type UploadedFile } from '@/lib/types';

interface InputComposerProps {
  onSubmit: (text: string, files: UploadedFile[]) => void;
  isLoading?: boolean;
  initialText?: string;
  size?: 'default' | 'large';
  showPrivacyNote?: boolean;
}

export default function InputComposer({
  onSubmit,
  isLoading = false,
  initialText = '',
  size = 'default',
  showPrivacyNote = false,
}: InputComposerProps) {
  const { t } = useLanguage();
  const [text, setText] = useState(initialText);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Sync initialText prop changes
  const [prevInitialText, setPrevInitialText] = useState(initialText);
  if (initialText !== prevInitialText) {
    setPrevInitialText(initialText);
    setText(initialText);
  }

  // Check speech recognition support (safe for SSR)
  const speechSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const validateFile = useCallback((file: File): string | null => {
    const allAllowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];
    if (!allAllowed.includes(file.type)) {
      return `Unsupported file type: ${file.type || file.name.split('.').pop()}. Allowed: images (JPEG, PNG, WebP) and documents (PDF, TXT, CSV).`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
    }
    return null;
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const newFiles = Array.from(e.target.files || []);
      const uploadedFiles: UploadedFile[] = [];

      for (const file of newFiles) {
        const validationError = validateFile(file);
        const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        if (validationError) {
          uploadedFiles.push({
            id,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            error: validationError,
          });
        } else {
          const preview = ALLOWED_IMAGE_TYPES.includes(file.type)
            ? URL.createObjectURL(file)
            : undefined;
          uploadedFiles.push({
            id,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            preview,
          });
        }
      }

      setFiles((prev) => [...prev, ...uploadedFiles]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [validateFile]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText((prev) => {
        const base = prev.replace(/\s*$/, '');
        return base ? `${base} ${transcript}` : transcript;
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        setError('Microphone access was denied. Please enable it in your browser settings.');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    const validFiles = files.filter((f) => !f.error);

    if (!trimmed && validFiles.length === 0) {
      setError('Please enter a description or upload a file.');
      return;
    }

    if (trimmed.length > MAX_TEXT_LENGTH) {
      setError(`Text is too long. Maximum ${MAX_TEXT_LENGTH} characters.`);
      return;
    }

    setError(null);
    onSubmit(trimmed, validFiles);
  }, [text, files, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const isLarge = size === 'large';

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-light)',
        borderRadius: isLarge ? 'var(--radius-xl)' : 'var(--radius-lg)',
        padding: isLarge ? '20px' : '14px',
        boxShadow: isLarge ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        width: '100%',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-400)';
        e.currentTarget.style.boxShadow = isLarge
          ? '0 10px 25px -5px rgba(20, 184, 166, 0.12), var(--shadow-lg)'
          : '0 0 0 3px rgba(20, 184, 166, 0.1)';
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          e.currentTarget.style.borderColor = 'var(--border-light)';
          e.currentTarget.style.boxShadow = isLarge ? 'var(--shadow-lg)' : 'var(--shadow-sm)';
        }
      }}
    >
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError(null);
        }}
        onKeyDown={handleKeyDown}
        placeholder={t.hero.inputPlaceholder}
        disabled={isLoading}
        aria-label="Describe your situation"
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontSize: isLarge ? 16 : 15,
          lineHeight: 1.6,
          fontFamily: 'inherit',
          color: 'var(--text-primary)',
          background: 'transparent',
          minHeight: isLarge ? 80 : 56,
          maxHeight: 200,
          padding: 0,
        }}
        rows={isLarge ? 3 : 2}
      />

      {/* File Previews */}
      {files.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 10,
            paddingTop: 10,
            borderTop: '1px solid var(--border-light)',
          }}
        >
          {files.map((f) => (
            <div
              key={f.id}
              className="file-chip"
              style={{
                borderColor: f.error ? 'var(--danger-500)' : undefined,
                color: f.error ? 'var(--danger-600)' : undefined,
              }}
            >
              {ALLOWED_IMAGE_TYPES.includes(f.type) ? (
                <ImageIcon size={12} />
              ) : (
                <FileText size={12} />
              )}
              <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {f.name}
              </span>
              <span style={{ color: 'var(--text-tertiary)' }}>
                ({(f.size / 1024).toFixed(0)}KB)
              </span>
              {f.error && (
                <span title={f.error}>
                  <AlertCircle size={12} style={{ color: 'var(--danger-500)' }} />
                </span>
              )}
              <button onClick={() => removeFile(f.id)} aria-label={`Remove ${f.name}`}>
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 8,
            fontSize: 13,
            color: 'var(--danger-600)',
          }}
          role="alert"
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 12,
          paddingTop: 10,
          borderTop: files.length === 0 ? '1px solid var(--border-light)' : 'none',
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {/* Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES].join(',')}
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            aria-label={t.hero.uploadFile}
            title={t.hero.uploadFile}
          >
            <Paperclip size={18} />
          </button>

          {/* Voice */}
          {speechSupported && (
            <button
              className={`btn btn-ghost btn-icon ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              aria-label={isRecording ? t.hero.stopRecording : t.hero.voiceInput}
              title={isRecording ? t.hero.stopRecording : t.hero.voiceInput}
              style={{
                color: isRecording ? 'var(--danger-500)' : undefined,
              }}
            >
              {isRecording ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="recording-pulse" />
                  <MicOff size={18} />
                </span>
              ) : (
                <Mic size={18} />
              )}
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          className={`btn ${isLarge ? 'btn-primary btn-lg' : 'btn-primary'}`}
          onClick={handleSubmit}
          disabled={isLoading || (!text.trim() && files.filter((f) => !f.error).length === 0)}
          aria-label={t.hero.submit}
        >
          {isLoading ? (
            <span className="spinner" />
          ) : (
            <>
              <Send size={isLarge ? 18 : 16} />
              {t.hero.submit}
            </>
          )}
        </button>
      </div>

      {/* Privacy Note */}
      {showPrivacyNote && (
        <p
          style={{
            marginTop: 12,
            fontSize: 12,
            color: 'var(--text-tertiary)',
            lineHeight: 1.5,
            textAlign: 'center',
          }}
        >
          🔒 {t.hero.privacyNote}
        </p>
      )}
    </div>
  );
}

// Web Speech API types
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}
